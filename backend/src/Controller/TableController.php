<?php

namespace App\Controller;

use App\Entity\Table;
use App\Entity\Wedding;
use App\Repository\TableRepository;
use App\Repository\WeddingRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api')]
class TableController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private SerializerInterface $serializer,
        private ValidatorInterface $validator,
        private TableRepository $tableRepository,
        private WeddingRepository $weddingRepository
    ) {
    }

    #[Route('/weddings/{id}/tables', name: 'app_tables_list', methods: ['GET'])]
    #[IsGranted('view', 'wedding')]
    public function list(Wedding $wedding): JsonResponse
    {
        $tables = $this->tableRepository->findBy(['wedding' => $wedding]);
        
        $data = array_map(function (Table $table) {
            return [
                'id' => $table->getId(),
                'name' => $table->getName(),
                'capacity' => $table->getCapacity(),
                'minCapacity' => $table->getMinCapacity(),
                'shape' => $table->getShape(),
                'dimensions' => $table->getDimensions(),
                'location' => $table->getLocation(),
                'isVIP' => $table->isVIP(),
                'metadata' => $table->getMetadata(),
                'guestCount' => $table->getCurrentGuestCount(),
                'availableSeats' => $table->getAvailableSeats(),
                'createdAt' => $table->getCreatedAt()->format('c'),
                'updatedAt' => $table->getUpdatedAt()->format('c'),
            ];
        }, $tables);

        return $this->json($data);
    }

    #[Route('/weddings/{id}/tables', name: 'app_tables_create', methods: ['POST'])]
    #[IsGranted('edit', 'wedding')]
    public function create(Request $request, Wedding $wedding): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $table = new Table();
        $table->setWedding($wedding);
        $table->setName($data['name']);
        $table->setCapacity($data['capacity'] ?? 8);
        $table->setMinCapacity($data['minCapacity'] ?? 1);
        $table->setShape($data['shape'] ?? Table::SHAPE_ROUND);
        $table->setDimensions($data['dimensions'] ?? []);
        $table->setLocation($data['location'] ?? null);
        $table->setIsVIP($data['isVIP'] ?? false);
        $table->setMetadata($data['metadata'] ?? []);

        $errors = $this->validator->validate($table);
        if (count($errors) > 0) {
            return $this->json(['errors' => (string) $errors], Response::HTTP_BAD_REQUEST);
        }

        $this->entityManager->persist($table);
        $this->entityManager->flush();

        return $this->json([
            'id' => $table->getId(),
            'name' => $table->getName(),
            'capacity' => $table->getCapacity(),
            'minCapacity' => $table->getMinCapacity(),
            'shape' => $table->getShape(),
            'dimensions' => $table->getDimensions(),
            'location' => $table->getLocation(),
            'isVIP' => $table->isVIP(),
            'metadata' => $table->getMetadata(),
            'guestCount' => $table->getCurrentGuestCount(),
            'availableSeats' => $table->getAvailableSeats(),
            'createdAt' => $table->getCreatedAt()->format('c'),
            'updatedAt' => $table->getUpdatedAt()->format('c'),
        ], Response::HTTP_CREATED);
    }

    #[Route('/tables/{id}', name: 'app_tables_show', methods: ['GET'])]
    #[IsGranted('view', 'table')]
    public function show(Table $table): JsonResponse
    {
        return $this->json([
            'id' => $table->getId(),
            'name' => $table->getName(),
            'capacity' => $table->getCapacity(),
            'minCapacity' => $table->getMinCapacity(),
            'shape' => $table->getShape(),
            'dimensions' => $table->getDimensions(),
            'location' => $table->getLocation(),
            'isVIP' => $table->isVIP(),
            'metadata' => $table->getMetadata(),
            'guestCount' => $table->getCurrentGuestCount(),
            'availableSeats' => $table->getAvailableSeats(),
            'createdAt' => $table->getCreatedAt()->format('c'),
            'updatedAt' => $table->getUpdatedAt()->format('c'),
            'guests' => array_map(function ($guest) {
                return [
                    'id' => $guest->getId(),
                    'firstName' => $guest->getFirstName(),
                    'lastName' => $guest->getLastName(),
                    'email' => $guest->getEmail(),
                    'status' => $guest->getStatus(),
                ];
            }, $table->getGuests()->toArray()),
        ]);
    }

    #[Route('/tables/{id}', name: 'app_tables_update', methods: ['PUT'])]
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
        if (isset($data['minCapacity'])) {
            $table->setMinCapacity($data['minCapacity']);
        }
        if (isset($data['shape'])) {
            $table->setShape($data['shape']);
        }
        if (isset($data['dimensions'])) {
            $table->setDimensions($data['dimensions']);
        }
        if (array_key_exists('location', $data)) {
            $table->setLocation($data['location']);
        }
        if (isset($data['isVIP'])) {
            $table->setIsVIP($data['isVIP']);
        }
        if (isset($data['metadata'])) {
            $table->setMetadata($data['metadata']);
        }

        $errors = $this->validator->validate($table);
        if (count($errors) > 0) {
            return $this->json(['errors' => (string) $errors], Response::HTTP_BAD_REQUEST);
        }

        $this->entityManager->flush();

        return $this->json([
            'id' => $table->getId(),
            'name' => $table->getName(),
            'capacity' => $table->getCapacity(),
            'minCapacity' => $table->getMinCapacity(),
            'shape' => $table->getShape(),
            'dimensions' => $table->getDimensions(),
            'location' => $table->getLocation(),
            'isVIP' => $table->isVIP(),
            'metadata' => $table->getMetadata(),
            'guestCount' => $table->getCurrentGuestCount(),
            'availableSeats' => $table->getAvailableSeats(),
            'createdAt' => $table->getCreatedAt()->format('c'),
            'updatedAt' => $table->getUpdatedAt()->format('c'),
        ]);
    }

    #[Route('/tables/{id}', name: 'app_tables_delete', methods: ['DELETE'])]
    #[IsGranted('delete', 'table')]
    public function delete(Table $table): JsonResponse
    {
        // Remove all guest assignments first
        foreach ($table->getGuests() as $guest) {
            $guest->setTable(null);
        }

        $this->entityManager->remove($table);
        $this->entityManager->flush();

        return $this->json(null, Response::HTTP_NO_CONTENT);
    }

    #[Route('/tables/{id}/guests', name: 'app_tables_assign_guests', methods: ['PUT'])]
    #[IsGranted('assign_guests', 'table')]
    public function assignGuests(Request $request, Table $table): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $guestIds = $data['guestIds'] ?? [];

        // Remove all current guests
        foreach ($table->getGuests() as $guest) {
            $guest->setTable(null);
        }

        // Assign new guests
        $errors = [];
        foreach ($guestIds as $guestId) {
            $guest = $this->entityManager->getRepository(\App\Entity\Guest::class)->find($guestId);
            if (!$guest) {
                $errors[] = "Guest with ID $guestId not found";
                continue;
            }
            if ($guest->getWedding() !== $table->getWedding()) {
                $errors[] = "Guest with ID $guestId does not belong to this wedding";
                continue;
            }
            if ($guest->getTable() !== null) {
                $errors[] = "Guest with ID $guestId is already assigned to table " . $guest->getTable()->getName();
                continue;
            }
            $table->addGuest($guest);
        }

        if (!empty($errors)) {
            return $this->json(['errors' => $errors], Response::HTTP_BAD_REQUEST);
        }

        if ($table->getCurrentGuestCount() > $table->getCapacity()) {
            return $this->json([
                'error' => 'Cannot assign more guests than table capacity',
                'capacity' => $table->getCapacity(),
                'guestCount' => $table->getCurrentGuestCount(),
            ], Response::HTTP_BAD_REQUEST);
        }

        $this->entityManager->flush();

        return $this->json([
            'success' => true,
            'guestCount' => $table->getCurrentGuestCount(),
            'availableSeats' => $table->getAvailableSeats(),
        ]);
    }

    #[Route('/tables/{tableId}/guests/{guestId}', name: 'app_tables_remove_guest', methods: ['DELETE'])]
    #[IsGranted('assign_guests', subject: 'table')]
    public function removeGuest(int $tableId, int $guestId): JsonResponse
    {
        $table = $this->tableRepository->find($tableId);
        if (!$table) {
            return $this->json(['error' => 'Table not found'], Response::HTTP_NOT_FOUND);
        }

        $guest = $this->entityManager->getRepository(\App\Entity\Guest::class)->find($guestId);
        if (!$guest) {
            return $this->json(['error' => 'Guest not found'], Response::HTTP_NOT_FOUND);
        }

        if ($guest->getTable() !== $table) {
            return $this->json(['error' => 'Guest is not assigned to this table'], Response::HTTP_BAD_REQUEST);
        }

        $table->removeGuest($guest);
        $this->entityManager->flush();

        return $this->json([
            'success' => true,
            'guestCount' => $table->getCurrentGuestCount(),
            'availableSeats' => $table->getAvailableSeats(),
        ]);
    }

    #[Route('/tables/validate-assignment', name: 'app_tables_validate_assignment', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function validateAssignment(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $tableId = $data['tableId'] ?? null;
        $guestIds = $data['guestIds'] ?? [];

        if (!$tableId) {
            return $this->json(['error' => 'Table ID is required'], Response::HTTP_BAD_REQUEST);
        }

        $table = $this->tableRepository->find($tableId);
        if (!$table) {
            return $this->json(['error' => 'Table not found'], Response::HTTP_NOT_FOUND);
        }

        $errors = [];
        $proposedGuestCount = count($guestIds);

        // Check capacity
        if ($proposedGuestCount > $table->getCapacity()) {
            $errors[] = [
                'type' => 'capacity',
                'message' => 'Assignment would exceed table capacity',
                'details' => [
                    'capacity' => $table->getCapacity(),
                    'proposedCount' => $proposedGuestCount,
                ]
            ];
        }

        // Check if guests exist and belong to the same wedding
        foreach ($guestIds as $guestId) {
            $guest = $this->entityManager->getRepository(\App\Entity\Guest::class)->find($guestId);
            if (!$guest) {
                $errors[] = [
                    'type' => 'guest_not_found',
                    'message' => "Guest with ID $guestId not found"
                ];
                continue;
            }
            if ($guest->getWedding() !== $table->getWedding()) {
                $errors[] = [
                    'type' => 'wrong_wedding',
                    'message' => "Guest with ID $guestId does not belong to this wedding"
                ];
                continue;
            }
        }

        return $this->json([
            'isValid' => empty($errors),
            'errors' => $errors,
            'table' => [
                'id' => $table->getId(),
                'capacity' => $table->getCapacity(),
                'currentGuestCount' => $table->getCurrentGuestCount(),
                'availableSeats' => $table->getAvailableSeats(),
            ]
        ]);
    }
} 