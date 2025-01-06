<?php

namespace App\Controller;

use App\Entity\Photo;
use App\Repository\PhotoRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/photos')]
class PhotoController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private PhotoRepository $photoRepository,
        private SerializerInterface $serializer,
        private ValidatorInterface $validator
    ) {
    }

    #[Route('', name: 'app_photo_index', methods: ['GET'])]
    public function index(Request $request): JsonResponse
    {
        $weddingId = $request->query->get('wedding');
        $photos = $weddingId ? 
            $this->photoRepository->findBy(['wedding' => $weddingId]) : 
            $this->photoRepository->findAll();
            
        return $this->json($photos, Response::HTTP_OK, [], ['groups' => ['photo:read']]);
    }

    #[Route('', name: 'app_photo_create', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $photo = new Photo();
        $photo->setUrl($data['url']);
        $photo->setCaption($data['caption'] ?? null);
        $photo->setMetadata($data['metadata'] ?? null);
        $photo->setIsApproved(false);
        $photo->setUploadedBy($this->getUser());
        $now = new \DateTimeImmutable();
        $photo->setCreatedAt($now);
        $photo->setUpdatedAt($now);

        $errors = $this->validator->validate($photo);
        if (count($errors) > 0) {
            return $this->json(['errors' => (string) $errors], Response::HTTP_BAD_REQUEST);
        }

        $this->entityManager->persist($photo);
        $this->entityManager->flush();

        return $this->json($photo, Response::HTTP_CREATED, [], ['groups' => ['photo:read']]);
    }

    #[Route('/{id}', name: 'app_photo_show', methods: ['GET'])]
    public function show(Photo $photo): JsonResponse
    {
        return $this->json($photo, Response::HTTP_OK, [], ['groups' => ['photo:read']]);
    }

    #[Route('/{id}/approve', name: 'app_photo_approve', methods: ['POST'])]
    #[IsGranted('approve', 'photo')]
    public function approve(Photo $photo): JsonResponse
    {
        $photo->setIsApproved(true);
        $photo->setUpdatedAt(new \DateTimeImmutable());
        
        $this->entityManager->flush();

        return $this->json($photo, Response::HTTP_OK, [], ['groups' => ['photo:read']]);
    }

    #[Route('/{id}', name: 'app_photo_delete', methods: ['DELETE'])]
    #[IsGranted('delete', 'photo')]
    public function delete(Photo $photo): JsonResponse
    {
        $this->entityManager->remove($photo);
        $this->entityManager->flush();

        return $this->json(null, Response::HTTP_NO_CONTENT);
    }
} 