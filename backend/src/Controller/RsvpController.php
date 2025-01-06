<?php

namespace App\Controller;

use App\Entity\Guest;
use App\Entity\RsvpResponse;
use App\Entity\WeddingFormField;
use App\Repository\GuestRepository;
use App\Repository\RsvpResponseRepository;
use App\Repository\WeddingFormFieldRepository;
use App\Service\NotificationService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Psr\Log\LoggerInterface;

#[Route('/api')]
class RsvpController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private GuestRepository $guestRepository,
        private WeddingFormFieldRepository $formFieldRepository,
        private RsvpResponseRepository $rsvpResponseRepository,
        private NotificationService $notificationService,
        private LoggerInterface $logger
    ) {}

    #[Route('/rsvp/{token}/guest', name: 'app_rsvp_get_guest', methods: ['GET'])]
    public function getGuest(string $token): JsonResponse
    {
        $guest = $this->guestRepository->findOneBy(['rsvpToken' => $token]);
        if (!$guest) {
            throw $this->createNotFoundException('Invalid RSVP token');
        }

        // Get existing responses
        $responses = $this->rsvpResponseRepository->findBy(['guest' => $guest]);
        
        // Check if responses need to be updated
        $needsUpdate = false;
        $message = null;
        
        // Get plus one details if exists and not deleted
        $plusOneDetails = null;
        $hasPlusOne = false;
        if (!$guest->getPlusOnes()->isEmpty()) {
            $plusOneGuest = $guest->getPlusOnes()->first();
            // Only include plus one if they're not deleted
            if ($plusOneGuest->getDeletedAt() === null) {
                $hasPlusOne = true;
                $plusOneDetails = [
                    'firstName' => $plusOneGuest->getFirstName(),
                    'lastName' => $plusOneGuest->getLastName(),
                    'email' => $plusOneGuest->getEmail(),
                    'attending' => $plusOneGuest->getStatus() === 'confirmed',
                    'responses' => array_map(function(RsvpResponse $response) {
                        return [
                            'fieldId' => $response->getField() ? $response->getField()->getId() : null,
                            'value' => $response->getValue(),
                            'isObsolete' => $response->getField() === null
                        ];
                    }, $this->rsvpResponseRepository->findBy(['guest' => $plusOneGuest]))
                ];
            }
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
                    'title' => $guest->getWedding()->getTitle()
                ],
                'responses' => array_map(function(RsvpResponse $response) {
                    $field = $response->getField();
                    return [
                        'fieldId' => $field ? $field->getId() : null,
                        'value' => $response->getValue(),
                        'isObsolete' => $field === null
                    ];
                }, $responses),
                'attending' => $guest->getStatus() === 'confirmed',
                'needsUpdate' => $needsUpdate,
                'message' => $message,
                'canBringPlusOne' => $guest->isPlusOne(),
                'hasPlusOne' => $hasPlusOne,
                'plusOneDetails' => $plusOneDetails
            ]
        ]);
    }

    #[Route('/rsvp/{token}/fields', name: 'app_rsvp_get_fields', methods: ['GET'])]
    public function getFields(string $token): JsonResponse
    {
        $guest = $this->guestRepository->findOneBy(['rsvpToken' => $token]);
        if (!$guest) {
            throw $this->createNotFoundException('Invalid RSVP token');
        }

        $fields = $this->formFieldRepository->findByWedding($guest->getWedding());

        return $this->json([
            'data' => array_map(function(WeddingFormField $field) {
                return [
                    'id' => $field->getId(),
                    'label' => $field->getLabel(),
                    'type' => $field->getType(),
                    'required' => $field->isRequired(),
                    'placeholder' => $field->getPlaceholder(),
                    'helpText' => $field->getHelpText(),
                    'options' => $field->getOptions(),
                    'section' => $field->getSection()
                ];
            }, $fields)
        ]);
    }

    #[Route('/rsvp/{token}', name: 'app_rsvp_submit', methods: ['POST'], priority: 2)]
    public function submit(string $token, Request $request): JsonResponse
    {
        $this->logger->debug('Starting RSVP submission', ['token' => $token]);
        
        $guest = $this->guestRepository->findOneBy(['rsvpToken' => $token]);
        if (!$guest) {
            $this->logger->error('Invalid RSVP token', ['token' => $token]);
            throw $this->createNotFoundException('Invalid RSVP token');
        }
        
        $data = json_decode($request->getContent(), true);
        $this->logger->debug('Received RSVP data', ['data' => $data]);
        
        // Check if this is an update
        $isUpdate = count($this->rsvpResponseRepository->findBy(['guest' => $guest])) > 0;
        
        // Update guest attendance status
        $guest->setStatus($data['attending'] ? 'confirmed' : 'declined');
        $this->logger->debug('Updated guest status', ['status' => $guest->getStatus()]);
        
        // Handle plus one guest if present
        if ($data['attending'] && isset($data['plusOne']) && $data['plusOne']['attending']) {
            $plusOneGuest = null;
            
            // Check if guest already has a plus one
            $existingPlusOnes = $guest->getPlusOnes();
            if (!$existingPlusOnes->isEmpty()) {
                $plusOneGuest = $existingPlusOnes->first();
            } else {
                // Create new plus one guest
                $plusOneGuest = new Guest();
                $plusOneGuest->setWedding($guest->getWedding());
                $plusOneGuest->setPlusOneOf($guest);
                $guest->addPlusOne($plusOneGuest);
            }
            
            // Update plus one guest details
            $plusOneGuest
                ->setFirstName($data['plusOne']['firstName'])
                ->setLastName($data['plusOne']['lastName'])
                ->setEmail($data['plusOne']['email'] ?? '')
                ->setStatus('confirmed')
                ->setDeletedAt(null); // Ensure the guest is not marked as deleted
            
            $this->entityManager->persist($plusOneGuest);
            
            // Save plus one responses
            if (isset($data['plusOne']['responses'])) {
                // Remove existing responses
                $existingResponses = $this->rsvpResponseRepository->findBy(['guest' => $plusOneGuest]);
                foreach ($existingResponses as $response) {
                    $this->entityManager->remove($response);
                }
                
                foreach ($data['plusOne']['responses'] as $responseData) {
                    $field = $this->formFieldRepository->find($responseData['fieldId']);
                    if (!$field || $field->getWedding() !== $guest->getWedding()) {
                        continue;
                    }
                    
                    $rsvpResponse = new RsvpResponse();
                    $rsvpResponse->setGuest($plusOneGuest)
                        ->setField($field)
                        ->setValue($responseData['value']);
                    
                    $this->entityManager->persist($rsvpResponse);
                    $plusOneGuest->addRsvpResponse($rsvpResponse);
                }
            }
        } else {
            // If no plus one or not attending, soft delete any existing plus one guests
            foreach ($guest->getPlusOnes() as $plusOne) {
                $plusOne->setStatus('declined');
                $plusOne->setDeletedAt(new \DateTimeImmutable()); // Soft delete the plus-one guest
            }
        }
        
        // Delete existing responses for main guest
        $existingResponses = $this->rsvpResponseRepository->findBy(['guest' => $guest]);
        foreach ($existingResponses as $response) {
            $this->entityManager->remove($response);
        }
        $this->logger->debug('Deleted existing responses', ['count' => count($existingResponses)]);
        
        // Save new responses for main guest
        if ($data['attending'] && isset($data['responses'])) {
            foreach ($data['responses'] as $responseData) {
                $field = $this->formFieldRepository->find($responseData['fieldId']);
                if (!$field || $field->getWedding() !== $guest->getWedding()) {
                    $this->logger->warning('Invalid field ID or field does not belong to wedding', [
                        'fieldId' => $responseData['fieldId'],
                        'guestWeddingId' => $guest->getWedding()->getId()
                    ]);
                    continue;
                }

                $rsvpResponse = new RsvpResponse();
                $rsvpResponse->setGuest($guest)
                    ->setField($field)
                    ->setValue($responseData['value']);
                
                $this->entityManager->persist($rsvpResponse);
                $guest->addRsvpResponse($rsvpResponse);
                
                $this->logger->debug('Created new response', [
                    'fieldId' => $field->getId(),
                    'value' => $responseData['value']
                ]);
            }
        }
        
        try {
            $this->entityManager->flush();
            $this->logger->debug('Successfully saved all changes to database');
            
            // Create notification after successful save
            $this->notificationService->createRsvpNotification($guest, $isUpdate);
            $this->logger->debug('Created notification', ['isUpdate' => $isUpdate]);
        } catch (\Exception $e) {
            $this->logger->error('Failed to save changes to database', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }

        return $this->json([
            'message' => 'RSVP submitted successfully',
            'data' => [
                'guest' => $guest->toArray(),
                'responses' => array_map(function(RsvpResponse $response) {
                    return [
                        'id' => $response->getId(),
                        'fieldId' => $response->getField()->getId(),
                        'value' => $response->getValue()
                    ];
                }, $this->rsvpResponseRepository->findBy(['guest' => $guest])),
                'plusOne' => $guest->getPlusOnes()->isEmpty() ? null : $guest->getPlusOnes()->first()->toArray()
            ]
        ]);
    }

    #[Route('/weddings/{weddingId}/guests/{guestId}/rsvp', name: 'app_rsvp_get', methods: ['GET'])]
    public function getRsvpResponses(int $weddingId, int $guestId): JsonResponse
    {
        $guest = $this->guestRepository->find($guestId);
        if (!$guest || $guest->getWedding()->getId() !== $weddingId) {
            throw $this->createNotFoundException('Guest not found');
        }

        $responses = $this->rsvpResponseRepository->findBy(['guest' => $guest]);
        
        return $this->json([
            'data' => array_map(function(RsvpResponse $response) {
                return [
                    'id' => $response->getId(),
                    'field' => [
                        'id' => $response->getField()->getId(),
                        'label' => $response->getField()->getLabel(),
                        'type' => $response->getField()->getType()
                    ],
                    'value' => $response->getValue()
                ];
            }, $responses)
        ]);
    }
} 