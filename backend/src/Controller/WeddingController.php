<?php

namespace App\Controller;

use App\Entity\Wedding;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/weddings')]
class WeddingController extends AbstractController
{
    #[Route('', name: 'app_wedding_list', methods: ['GET'])]
    public function list(EntityManagerInterface $entityManager): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        
        $managedWeddings = $entityManager->getRepository(Wedding::class)
            ->findBy(['admin' => $user]);
            
        // TODO: Add attending weddings when guest functionality is implemented
        $attendingWeddings = [];

        return $this->json([
            'managed' => array_map(fn(Wedding $wedding) => [
                'id' => $wedding->getId(),
                'title' => $wedding->getTitle(),
                'description' => $wedding->getDescription(),
                'date' => $wedding->getDate()->format('c'),
                'venue' => $wedding->getVenue(),
                'language' => $wedding->getLanguage(),
                'invitationPdfUrl' => $wedding->getInvitationPdfUrl(),
            ], $managedWeddings),
            'attending' => $attendingWeddings,
        ]);
    }

    #[Route('/{id}', name: 'app_wedding_show', methods: ['GET'])]
    #[IsGranted('view', 'wedding')]
    public function show(Wedding $wedding): JsonResponse
    {
        return $this->json([
            'wedding' => [
                'id' => $wedding->getId(),
                'title' => $wedding->getTitle(),
                'description' => $wedding->getDescription(),
                'date' => $wedding->getDate()->format('c'),
                'venue' => $wedding->getVenue(),
                'language' => $wedding->getLanguage(),
                'invitationPdfUrl' => $wedding->getInvitationPdfUrl(),
                'tables' => array_map(fn($table) => [
                    'id' => $table->getId(),
                    'name' => $table->getName(),
                    'capacity' => $table->getCapacity(),
                ], $wedding->getTables()->toArray()),
                'invitations' => array_map(fn($invitation) => [
                    'id' => $invitation->getId(),
                    'name' => $invitation->getName(),
                    'email' => $invitation->getEmail(),
                    'status' => $invitation->getStatus(),
                ], $wedding->getInvitations()->toArray()),
            ],
        ]);
    }

    #[Route('', name: 'app_wedding_create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['title']) || !isset($data['date']) || !isset($data['venue']) || !isset($data['language'])) {
            return $this->json(['message' => 'Missing required fields'], Response::HTTP_BAD_REQUEST);
        }

        $wedding = new Wedding();
        $wedding->setTitle($data['title']);
        $wedding->setDescription($data['description'] ?? null);
        $wedding->setDate(new \DateTimeImmutable($data['date']));
        $wedding->setVenue($data['venue']);
        $wedding->setLanguage($data['language']);
        $wedding->setAdmin($this->getUser());

        $entityManager->persist($wedding);
        $entityManager->flush();

        return $this->json([
            'message' => 'Wedding created successfully',
            'wedding' => [
                'id' => $wedding->getId(),
                'title' => $wedding->getTitle(),
                'description' => $wedding->getDescription(),
                'date' => $wedding->getDate()->format('c'),
                'venue' => $wedding->getVenue(),
                'language' => $wedding->getLanguage(),
            ],
        ], Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'app_wedding_update', methods: ['PUT'])]
    #[IsGranted('edit', subject: 'wedding')]
    public function update(Wedding $wedding, Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (isset($data['title'])) {
            $wedding->setTitle($data['title']);
        }
        if (isset($data['description'])) {
            $wedding->setDescription($data['description']);
        }
        if (isset($data['date'])) {
            $wedding->setDate(new \DateTimeImmutable($data['date']));
        }
        if (isset($data['venue'])) {
            $wedding->setVenue($data['venue']);
        }
        if (isset($data['language'])) {
            $wedding->setLanguage($data['language']);
        }

        $entityManager->flush();

        return $this->json([
            'message' => 'Wedding updated successfully',
            'wedding' => [
                'id' => $wedding->getId(),
                'title' => $wedding->getTitle(),
                'description' => $wedding->getDescription(),
                'date' => $wedding->getDate()->format('c'),
                'venue' => $wedding->getVenue(),
                'language' => $wedding->getLanguage(),
                'tables' => array_map(fn($table) => [
                    'id' => $table->getId(),
                    'name' => $table->getName(),
                    'capacity' => $table->getCapacity(),
                ], $wedding->getTables()->toArray()),
                'invitations' => array_map(fn($invitation) => [
                    'id' => $invitation->getId(),
                    'name' => $invitation->getName(),
                    'email' => $invitation->getEmail(),
                    'status' => $invitation->getStatus(),
                ], $wedding->getInvitations()->toArray()),
            ],
        ]);
    }

    #[Route('/{id}', name: 'app_wedding_delete', methods: ['DELETE'])]
    public function delete(Wedding $wedding, EntityManagerInterface $entityManager): JsonResponse
    {
        // Check if user is the admin of this wedding
        if ($wedding->getAdmin() !== $this->getUser()) {
            return $this->json(['message' => 'Access denied'], Response::HTTP_FORBIDDEN);
        }

        $entityManager->remove($wedding);
        $entityManager->flush();

        return $this->json(['message' => 'Wedding deleted successfully']);
    }

    #[Route('/{id}/invitation', name: 'app_wedding_upload_invitation', methods: ['POST'])]
    public function uploadInvitation(
        Wedding $wedding,
        Request $request,
        EntityManagerInterface $entityManager,
        string $uploadDir
    ): JsonResponse {
        // Check if user is the admin of this wedding
        if ($wedding->getAdmin() !== $this->getUser()) {
            return $this->json(['message' => 'Access denied'], Response::HTTP_FORBIDDEN);
        }

        $file = $request->files->get('invitation');
        if (!$file) {
            return $this->json(['message' => 'No file uploaded'], Response::HTTP_BAD_REQUEST);
        }

        if ($file->getMimeType() !== 'application/pdf') {
            return $this->json(['message' => 'Only PDF files are allowed'], Response::HTTP_BAD_REQUEST);
        }

        try {
            // Create uploads directory if it doesn't exist
            $uploadPath = $uploadDir . '/invitations';
            if (!file_exists($uploadPath)) {
                mkdir($uploadPath, 0777, true);
            }

            // Generate unique filename
            $filename = sprintf('%s-%s.pdf', $wedding->getId(), uniqid());
            
            // Move file to uploads directory
            $file->move($uploadPath, $filename);
            
            // Delete old file if exists
            if ($wedding->getInvitationPdfUrl()) {
                $oldFile = $uploadDir . $wedding->getInvitationPdfUrl();
                if (file_exists($oldFile)) {
                    unlink($oldFile);
                }
            }
            
            // Update wedding with new invitation URL
            $wedding->setInvitationPdfUrl('/uploads/invitations/' . $filename);
            $entityManager->flush();

            return $this->json([
                'message' => 'Invitation uploaded successfully',
                'invitationUrl' => $wedding->getInvitationPdfUrl()
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'message' => 'Failed to upload invitation: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
} 