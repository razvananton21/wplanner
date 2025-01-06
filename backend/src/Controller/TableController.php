<?php

namespace App\Controller;

use App\Entity\Table;
use App\Entity\User;
use App\Repository\TableRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/tables')]
class TableController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private TableRepository $tableRepository,
        private SerializerInterface $serializer,
        private ValidatorInterface $validator
    ) {
    }

    #[Route('', name: 'app_table_index', methods: ['GET'])]
    public function index(Request $request): JsonResponse
    {
        $weddingId = $request->query->get('wedding');
        $tables = $weddingId ? 
            $this->tableRepository->findBy(['wedding' => $weddingId]) : 
            $this->tableRepository->findAll();
            
        return $this->json($tables, Response::HTTP_OK, [], ['groups' => ['table:read']]);
    }

    #[Route('', name: 'app_table_create', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $table = new Table();
        $table->setName($data['name']);
        $table->setCapacity($data['capacity']);
        $table->setWedding($data['wedding']);

        $errors = $this->validator->validate($table);
        if (count($errors) > 0) {
            return $this->json(['errors' => (string) $errors], Response::HTTP_BAD_REQUEST);
        }

        $this->entityManager->persist($table);
        $this->entityManager->flush();

        return $this->json($table, Response::HTTP_CREATED, [], ['groups' => ['table:read']]);
    }

    #[Route('/{id}', name: 'app_table_show', methods: ['GET'])]
    public function show(Table $table): JsonResponse
    {
        return $this->json($table, Response::HTTP_OK, [], ['groups' => ['table:read']]);
    }

    #[Route('/{id}', name: 'app_table_update', methods: ['PUT'])]
    #[IsGranted('edit', 'table')]
    public function update(Request $request, Table $table): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (isset($data['name'])) {
            $table->setName($data['name']);
        }
        if (isset($data['capacity'])) {
            $table->setCapacity($data['capacity']);
        }

        $errors = $this->validator->validate($table);
        if (count($errors) > 0) {
            return $this->json(['errors' => (string) $errors], Response::HTTP_BAD_REQUEST);
        }

        $this->entityManager->flush();

        return $this->json($table, Response::HTTP_OK, [], ['groups' => ['table:read']]);
    }

    #[Route('/{id}/assign-guests', name: 'app_table_assign_guests', methods: ['POST'])]
    #[IsGranted('assign_guests', 'table')]
    public function assignGuests(Request $request, Table $table): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $guestIds = $data['guests'] ?? [];

        // Clear current guests
        $table->getGuests()->clear();

        // Add new guests
        foreach ($guestIds as $guestId) {
            $guest = $this->entityManager->getReference(User::class, $guestId);
            $table->addGuest($guest);
        }

        $errors = $this->validator->validate($table);
        if (count($errors) > 0) {
            return $this->json(['errors' => (string) $errors], Response::HTTP_BAD_REQUEST);
        }

        $this->entityManager->flush();

        return $this->json($table, Response::HTTP_OK, [], ['groups' => ['table:read']]);
    }

    #[Route('/{id}', name: 'app_table_delete', methods: ['DELETE'])]
    #[IsGranted('delete', 'table')]
    public function delete(Table $table): JsonResponse
    {
        $this->entityManager->remove($table);
        $this->entityManager->flush();

        return $this->json(null, Response::HTTP_NO_CONTENT);
    }
} 