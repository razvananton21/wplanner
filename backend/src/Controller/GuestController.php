<?php

namespace App\Controller;

use App\Entity\Guest;
use App\Entity\Wedding;
use App\Repository\GuestRepository;
use App\Service\GuestService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api')]
class GuestController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private GuestRepository $guestRepository,
        private ValidatorInterface $validator,
        private GuestService $guestService
    ) {}

    #[Route('/weddings/{id}/guests', name: 'app_guests_list', methods: ['GET'])]
    #[IsGranted('view', 'wedding')]
    public function list(Wedding $wedding): JsonResponse
    {
        $guests = $this->guestRepository->findByWedding($wedding);
        
        return $this->json([
            'data' => array_map(function($guest) {
                $guestData = $guest->toArray();
                
                // Add RSVP responses
                $responses = array_map(function($response) {
                    if (!$response || !$response->getField()) {
                        return null;
                    }
                    return [
                        'id' => $response->getId(),
                        'field' => [
                            'id' => $response->getField()->getId(),
                            'label' => $response->getField()->getLabel(),
                            'type' => $response->getField()->getType()
                        ],
                        'value' => $response->getValue()
                    ];
                }, $guest->getRsvpResponses()->toArray());

                // Filter out any null responses
                $guestData['responses'] = array_filter($responses);
                
                // If this guest is a plus one, include their responses in the parent guest's data
                if ($guest->getPlusOneOf()) {
                    $guestData['responses'] = array_filter($responses);
                }
                
                return $guestData;
            }, $guests)
        ]);
    }

    #[Route('/weddings/{id}/guests', name: 'app_guests_create', methods: ['POST'])]
    #[IsGranted('edit', 'wedding')]
    public function create(Wedding $wedding, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        $guest = new Guest();
        $guest->setWedding($wedding)
            ->setFirstName($data['firstName'])
            ->setLastName($data['lastName'])
            ->setEmail($data['email'])
            ->setCategory($data['category'] ?? 'guest')
            ->setPlusOne($data['plusOne'] ?? false)
            ->setDietaryRestrictions($data['dietaryRestrictions'] ?? null);

        $errors = $this->validator->validate($guest);
        if (count($errors) > 0) {
            return $this->json(['errors' => (string) $errors], Response::HTTP_BAD_REQUEST);
        }

        // Generate RSVP token
        $guest->setRsvpToken($this->guestService->generateRsvpToken());

        $this->entityManager->persist($guest);
        $this->entityManager->flush();

        // Send RSVP email
        $this->guestService->sendRsvpEmail($guest);

        return $this->json([
            'data' => $guest->toArray()
        ], Response::HTTP_CREATED);
    }

    #[Route('/weddings/{wedding}/guests/{id}', name: 'app_guests_update', methods: ['PUT'])]
    #[IsGranted('edit', subject: 'wedding')]
    public function update(Wedding $wedding, Guest $guest, Request $request): JsonResponse
    {
        if ($guest->getWedding() !== $wedding) {
            throw $this->createNotFoundException('Guest not found in this wedding');
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['firstName'])) {
            $guest->setFirstName($data['firstName']);
        }
        if (isset($data['lastName'])) {
            $guest->setLastName($data['lastName']);
        }
        if (isset($data['email'])) {
            $guest->setEmail($data['email']);
        }
        if (isset($data['category'])) {
            $guest->setCategory($data['category']);
        }
        if (isset($data['plusOne'])) {
            $guest->setPlusOne($data['plusOne']);
        }
        if (isset($data['dietaryRestrictions'])) {
            $guest->setDietaryRestrictions($data['dietaryRestrictions']);
        }
        if (isset($data['status'])) {
            $guest->setStatus($data['status']);
        }

        $errors = $this->validator->validate($guest);
        if (count($errors) > 0) {
            return $this->json(['errors' => (string) $errors], Response::HTTP_BAD_REQUEST);
        }

        $this->entityManager->flush();

        return $this->json([
            'data' => $guest->toArray()
        ]);
    }

    #[Route('/weddings/{wedding}/guests/{id}', name: 'app_guests_delete', methods: ['DELETE'])]
    #[IsGranted('edit', subject: 'wedding')]
    public function delete(Wedding $wedding, Guest $guest): JsonResponse
    {
        if ($guest->getWedding() !== $wedding) {
            throw $this->createNotFoundException('Guest not found in this wedding');
        }

        $now = new \DateTimeImmutable();
        
        // If this is a main guest, soft delete all their plus-ones
        if (!$guest->getPlusOneOf()) {
            foreach ($guest->getPlusOnes() as $plusOne) {
                $plusOne->setDeletedAt($now);
            }
        }

        $guest->setDeletedAt($now);
        $this->entityManager->flush();

        return $this->json(null, Response::HTTP_NO_CONTENT);
    }

    #[Route('/weddings/{id}/guests/bulk', name: 'app_guests_bulk_create', methods: ['POST'])]
    #[IsGranted('edit', 'wedding')]
    public function bulkCreate(Wedding $wedding, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $guests = [];
        $errors = [];

        foreach ($data as $index => $guestData) {
            $guest = new Guest();
            $guest->setWedding($wedding)
                ->setFirstName($guestData['firstName'])
                ->setLastName($guestData['lastName'])
                ->setEmail($guestData['email'])
                ->setCategory($guestData['category'] ?? 'guest')
                ->setPlusOne($guestData['plusOne'] ?? false)
                ->setDietaryRestrictions($guestData['dietaryRestrictions'] ?? null)
                ->setRsvpToken($this->guestService->generateRsvpToken());

            $validationErrors = $this->validator->validate($guest);
            if (count($validationErrors) > 0) {
                $errors[$index] = (string) $validationErrors;
                continue;
            }

            $this->entityManager->persist($guest);
            $guests[] = $guest;
        }

        if (!empty($errors)) {
            return $this->json(['errors' => $errors], Response::HTTP_BAD_REQUEST);
        }

        $this->entityManager->flush();

        // Send RSVP emails
        foreach ($guests as $guest) {
            $this->guestService->sendRsvpEmail($guest);
        }

        return $this->json([
            'data' => array_map(fn($guest) => $guest->toArray(), $guests)
        ], Response::HTTP_CREATED);
    }

    #[Route('/rsvp/{token}/guest', name: 'app_guest_by_token', methods: ['GET'])]
    public function getByToken(string $token): JsonResponse
    {
        $guest = $this->guestRepository->findByRsvpToken($token);
        if (!$guest) {
            throw $this->createNotFoundException('Invalid RSVP token');
        }

        $responses = array_map(function($response) {
            if (!$response || !$response->getField()) {
                return null;
            }
            return [
                'id' => $response->getId(),
                'field' => [
                    'id' => $response->getField()->getId(),
                    'label' => $response->getField()->getLabel(),
                    'type' => $response->getField()->getType()
                ],
                'value' => $response->getValue()
            ];
        }, $guest->getRsvpResponses()->toArray());

        // Filter out any null responses
        $responses = array_filter($responses);

        $plusOneDetails = null;
        if (!$guest->getPlusOnes()->isEmpty()) {
            $plusOne = $guest->getPlusOnes()->first();
            $plusOneResponses = array_map(function($response) {
                if (!$response || !$response->getField()) {
                    return null;
                }
                return [
                    'id' => $response->getId(),
                    'field' => [
                        'id' => $response->getField()->getId(),
                        'label' => $response->getField()->getLabel(),
                        'type' => $response->getField()->getType()
                    ],
                    'value' => $response->getValue()
                ];
            }, $plusOne->getRsvpResponses()->toArray());

            $plusOneDetails = array_merge(
                $plusOne->toArray(),
                ['responses' => array_filter($plusOneResponses)]
            );
        }

        return $this->json([
            'data' => [
                'id' => $guest->getId(),
                'firstName' => $guest->getFirstName(),
                'lastName' => $guest->getLastName(),
                'email' => $guest->getEmail(),
                'status' => $guest->getStatus(),
                'wedding' => [
                    'id' => $guest->getWedding()->getId(),
                    'title' => $guest->getWedding()->getTitle(),
                    'invitationPdfUrl' => $guest->getWedding()->getInvitationPdfUrl(),
                    'date' => $guest->getWedding()->getDate()->format('c'),
                    'venue' => $guest->getWedding()->getVenue()
                ],
                'responses' => $responses,
                'attending' => $guest->getStatus() === 'confirmed',
                'needsUpdate' => false,
                'message' => null,
                'canBringPlusOne' => $guest->canBringPlusOne(),
                'hasPlusOne' => !$guest->getPlusOnes()->isEmpty(),
                'plusOneDetails' => $plusOneDetails
            ]
        ]);
    }
} 