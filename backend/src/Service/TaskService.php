<?php

namespace App\Service;

use App\Entity\Task;
use App\Repository\TaskRepository;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class TaskService
{
    public function __construct(
        private TaskRepository $taskRepository,
        private ValidatorInterface $validator
    ) {}

    public function getTask(int $id): ?Task
    {
        return $this->taskRepository->find($id);
    }

    public function update(Task $task, array $data): Task
    {
        if (isset($data['title'])) {
            $task->setTitle($data['title']);
        }
        if (array_key_exists('description', $data)) {
            $task->setDescription($data['description']);
        }
        if (isset($data['category'])) {
            $task->setCategory($data['category']);
        }
        if (isset($data['status'])) {
            $task->setStatus($data['status']);
        }
        if (isset($data['priority'])) {
            $task->setPriority($data['priority']);
        }
        if (isset($data['isCompleted'])) {
            $task->setIsCompleted($data['isCompleted']);
        }
        if (array_key_exists('notes', $data)) {
            $task->setNotes($data['notes']);
        }
        if (isset($data['dueDate'])) {
            $task->setDueDate(new \DateTimeImmutable($data['dueDate']));
        }
        if (isset($data['displayOrder'])) {
            $task->setDisplayOrder($data['displayOrder']);
        }

        $errors = $this->validator->validate($task);
        if (count($errors) > 0) {
            throw new \InvalidArgumentException((string) $errors);
        }

        $this->taskRepository->save($task, true);

        return $task;
    }

    public function delete(Task $task): void
    {
        $this->taskRepository->remove($task, true);
    }
} 