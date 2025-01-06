<?php

namespace App\Controller;

use App\Entity\Invitation;
use App\Repository\InvitationRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/invitations')]
class InvitationController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private InvitationRepository $invitationRepository,
        private SerializerInterface $serializer,
        private ValidatorInterface $validator
    ) {
    }

    #[Route('', name: 'app_invitation_index', methods: ['GET'])]
    public function index(Request $request): JsonResponse
    {
        $weddingId = $request->query->get('wedding');
        $guestId = $request->query->get('guest');
        
        $criteria = array_filter([
            'wedding' => $weddingId,
            'guest' => $guestId,
        ]);
        
        $invitations = !empty($criteria) ? 
            $this->invitationRepository->findBy($criteria) : 
            $this->invitationRepository->findAll();
            
        return $this->json($invitations, Response::HTTP_OK, [], ['groups' => ['invitation:read']]);
    }

    #[Route('', name: 'app_invitation_create', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $invitation = new Invitation();
        $invitation->setWedding($data['wedding']);
        $invitation->setGuest($data['guest']);
        $invitation->setPdfUrl($data['pdfUrl'] ?? null);
        $invitation->setIsRsvpSubmitted(false);
        $invitation->setRsvpData([]);

        $errors = $this->validator->validate($invitation);
        if (count($errors) > 0) {
            return $this->json(['errors' => (string) $errors], Response::HTTP_BAD_REQUEST);
        }

        $this->entityManager->persist($invitation);
        $this->entityManager->flush();

        return $this->json($invitation, Response::HTTP_CREATED, [], ['groups' => ['invitation:read']]);
    }

    #[Route('/{id}', name: 'app_invitation_show', methods: ['GET'])]
    #[IsGranted('view', 'invitation')]
    public function show(Invitation $invitation): JsonResponse
    {
        return $this->json($invitation, Response::HTTP_OK, [], ['groups' => ['invitation:read']]);
    }

    #[Route('/{id}', name: 'app_invitation_update', methods: ['PUT'])]
    #[IsGranted('edit', 'invitation')]
    public function update(Request $request, Invitation $invitation): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (isset($data['pdfUrl'])) {
            $invitation->setPdfUrl($data['pdfUrl']);
        }

        $errors = $this->validator->validate($invitation);
        if (count($errors) > 0) {
            return $this->json(['errors' => (string) $errors], Response::HTTP_BAD_REQUEST);
        }

        $this->entityManager->flush();

        return $this->json($invitation, Response::HTTP_OK, [], ['groups' => ['invitation:read']]);
    }

    #[Route('/{id}/rsvp', name: 'app_invitation_rsvp', methods: ['POST'])]
    #[IsGranted('submit_rsvp', 'invitation')]
    public function submitRsvp(Request $request, Invitation $invitation): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $rsvpData = $data['rsvpData'] ?? [];

        $invitation->setIsRsvpSubmitted(true);
        $invitation->setRsvpData($rsvpData);

        $errors = $this->validator->validate($invitation);
        if (count($errors) > 0) {
            return $this->json(['errors' => (string) $errors], Response::HTTP_BAD_REQUEST);
        }

        $this->entityManager->flush();

        return $this->json($invitation, Response::HTTP_OK, [], ['groups' => ['invitation:read']]);
    }

    #[Route('/{id}', name: 'app_invitation_delete', methods: ['DELETE'])]
    #[IsGranted('delete', 'invitation')]
    public function delete(Invitation $invitation): JsonResponse
    {
        $this->entityManager->remove($invitation);
        $this->entityManager->flush();

        return $this->json(null, Response::HTTP_NO_CONTENT);
    }
} 