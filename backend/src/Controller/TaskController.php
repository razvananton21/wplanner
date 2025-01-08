<?php

namespace App\Controller;

use App\Entity\Task;
use App\Entity\Wedding;
use App\Repository\TaskRepository;
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
use App\Service\TaskService;

#[Route('/api')]
class TaskController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private SerializerInterface $serializer,
        private ValidatorInterface $validator,
        private TaskRepository $taskRepository,
        private WeddingRepository $weddingRepository,
    ) {
    }

    #[Route('/weddings/{id}/tasks', name: 'app_tasks_list', methods: ['GET'])]
    #[IsGranted('view', 'wedding')]
    public function list(Wedding $wedding): JsonResponse
    {
        $tasks = $this->taskRepository->findByWedding($wedding);

        return $this->json([
            'tasks' => $tasks,
        ], context: ['groups' => ['task:read']]);
    }

    #[Route('/weddings/{id}/tasks/incomplete', name: 'app_tasks_incomplete', methods: ['GET'])]
    #[IsGranted('view', 'wedding')]
    public function listIncomplete(Wedding $wedding): JsonResponse
    {
        $tasks = $this->taskRepository->findIncompleteByWedding($wedding);

        return $this->json([
            'tasks' => $tasks,
        ], context: ['groups' => ['task:read']]);
    }

    #[Route('/weddings/{id}/tasks/category/{category}', name: 'app_tasks_by_category', methods: ['GET'])]
    #[IsGranted('view', 'wedding')]
    public function listByCategory(Wedding $wedding, string $category): JsonResponse
    {
        $tasks = $this->taskRepository->findByWeddingAndCategory($wedding, $category);

        return $this->json([
            'tasks' => $tasks,
        ], context: ['groups' => ['task:read']]);
    }

    #[Route('/weddings/{id}/tasks/overdue', name: 'app_tasks_overdue', methods: ['GET'])]
    #[IsGranted('view', 'wedding')]
    public function listOverdue(Wedding $wedding): JsonResponse
    {
        $tasks = $this->taskRepository->findOverdueTasks($wedding);

        return $this->json([
            'tasks' => $tasks,
        ], context: ['groups' => ['task:read']]);
    }

    #[Route('/weddings/{id}/tasks/upcoming', name: 'app_tasks_upcoming', methods: ['GET'])]
    #[IsGranted('view', 'wedding')]
    public function listUpcoming(Wedding $wedding, Request $request): JsonResponse
    {
        $days = $request->query->getInt('days', 7);
        $tasks = $this->taskRepository->findUpcomingTasks($wedding, $days);

        return $this->json([
            'tasks' => $tasks,
        ], context: ['groups' => ['task:read']]);
    }

    #[Route('/weddings/{id}/tasks', name: 'app_tasks_create', methods: ['POST'])]
    #[IsGranted('edit', 'wedding')]
    public function create(Wedding $wedding, Request $request): JsonResponse
    {
        $task = new Task();
        $task->setWedding($wedding);

        $data = json_decode($request->getContent(), true);
        
        $task->setTitle($data['title']);
        $task->setDescription($data['description'] ?? null);
        $task->setCategory($data['category'] ?? 'pre-wedding');
        $task->setStatus($data['status'] ?? 'pending');
        $task->setPriority($data['priority'] ?? 2);
        $task->setDisplayOrder($data['displayOrder'] ?? 0);
        
        if (isset($data['dueDate'])) {
            $task->setDueDate(new \DateTimeImmutable($data['dueDate']));
        }
        
        if (isset($data['notes'])) {
            $task->setNotes($data['notes']);
        }

        $errors = $this->validator->validate($task);
        if (count($errors) > 0) {
            return $this->json(['errors' => (string) $errors], Response::HTTP_BAD_REQUEST);
        }

        $this->taskRepository->save($task, true);

        return $this->json([
            'task' => $task,
        ], Response::HTTP_CREATED, context: ['groups' => ['task:read']]);
    }

    #[Route('/weddings/{weddingId}/tasks/{id}', name: 'app_tasks_show', methods: ['GET'])]
    #[IsGranted('view', 'wedding')]
    public function show(int $weddingId, int $id): JsonResponse
    {
        $task = $this->taskRepository->find($id);
        if (!$task || $task->getWedding()->getId() !== (int) $weddingId) {
            throw $this->createNotFoundException('Task not found');
        }

        return $this->json([
            'task' => $task,
        ], context: ['groups' => ['task:read']]);
    }

    #[Route('/weddings/{weddingId}/tasks/{id}', name: 'update_task', methods: ['PUT'])]
    #[IsGranted('edit', 'wedding')]
    public function updateTask(
        Wedding $wedding,
        int $id,
        Request $request,
        TaskService $taskService
    ): JsonResponse {
        $task = $taskService->getTask($id);
        
        if (!$task || $task->getWedding() !== $wedding) {
            throw $this->createNotFoundException('Task not found');
        }

        $data = json_decode($request->getContent(), true);
        $updatedTask = $taskService->update($task, $data);

        return $this->json([
            'task' => $updatedTask
        ], context: ['groups' => ['task:read']]);
    }

    #[Route('/weddings/{id}/tasks/{taskId}', name: 'app_tasks_delete', methods: ['DELETE'])]
    #[IsGranted('edit', 'wedding')]
    public function delete(
        Wedding $wedding,
        int $taskId,
        TaskService $taskService
    ): JsonResponse {
        $task = $taskService->getTask($taskId);
        if (!$task || $task->getWedding() !== $wedding) {
            throw $this->createNotFoundException('Task not found');
        }

        $taskService->delete($task);

        return $this->json(null, Response::HTTP_NO_CONTENT);
    }

    #[Route('/weddings/{id}/tasks/reorder', name: 'app_tasks_reorder', methods: ['PUT'])]
    #[IsGranted('edit', 'wedding')]
    public function reorder(Wedding $wedding, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $taskOrders = $data['taskOrders'] ?? [];

        foreach ($taskOrders as $taskOrder) {
            $task = $this->taskRepository->find($taskOrder['id']);
            if ($task && $task->getWedding() === $wedding) {
                $task->setDisplayOrder($taskOrder['order']);
                $this->taskRepository->save($task);
            }
        }

        $this->entityManager->flush();

        return $this->json([
            'message' => 'Tasks reordered successfully',
        ]);
    }
} 