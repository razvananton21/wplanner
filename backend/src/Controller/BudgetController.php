<?php

namespace App\Controller;

use App\Entity\Budget;
use App\Entity\Wedding;
use App\Repository\BudgetRepository;
use App\Repository\ExpenseRepository;
use App\Repository\WeddingRepository;
use App\Service\BudgetService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api')]
class BudgetController extends AbstractController
{
    public function __construct(
        private readonly BudgetService $budgetService,
        private readonly BudgetRepository $budgetRepository,
        private readonly ExpenseRepository $expenseRepository,
        private readonly WeddingRepository $weddingRepository
    ) {
    }

    #[Route('/weddings/{id}/budget', name: 'get_wedding_budget', methods: ['GET'])]
    #[IsGranted('view', 'wedding')]
    public function getBudget(Wedding $wedding): JsonResponse
    {
        $budget = $wedding->getBudget();
        if (!$budget) {
            return $this->json([
                'budget' => null,
                'summary' => null
            ], Response::HTTP_OK);
        }

        return $this->json([
            'budget' => $budget,
            'summary' => $this->budgetService->getBudgetSummary($budget)
        ], Response::HTTP_OK, [], ['groups' => ['budget:read', 'expense:read']]);
    }

    #[Route('/weddings/{id}/budget', name: 'create_wedding_budget', methods: ['POST'])]
    #[IsGranted('edit', 'wedding')]
    public function createBudget(Request $request, Wedding $wedding): JsonResponse
    {
        if ($wedding->getBudget()) {
            return $this->json([
                'message' => 'Wedding already has a budget'
            ], Response::HTTP_BAD_REQUEST);
        }

        $data = json_decode($request->getContent(), true);
        
        $totalAmount = $data['totalAmount'] ?? 0;
        $categoryAllocations = $data['categoryAllocations'] ?? [];

        $budget = $this->budgetService->createBudget($wedding, $totalAmount, $categoryAllocations);

        return $this->json([
            'budget' => $budget,
            'summary' => $this->budgetService->getBudgetSummary($budget)
        ], Response::HTTP_CREATED, [], ['groups' => ['budget:read', 'expense:read']]);
    }

    #[Route('/weddings/{id}/budget', name: 'update_wedding_budget', methods: ['PUT'])]
    #[IsGranted('edit', 'wedding')]
    public function updateBudget(Request $request, Wedding $wedding): JsonResponse
    {
        $budget = $wedding->getBudget();
        if (!$budget) {
            return $this->json([
                'message' => 'Wedding does not have a budget'
            ], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);
        
        $totalAmount = $data['totalAmount'] ?? $budget->getTotalAmount();
        $categoryAllocations = $data['categoryAllocations'] ?? $budget->getCategoryAllocations();

        $budget = $this->budgetService->updateBudget($budget, $totalAmount, $categoryAllocations);

        return $this->json([
            'budget' => $budget,
            'summary' => $this->budgetService->getBudgetSummary($budget)
        ], Response::HTTP_OK, [], ['groups' => ['budget:read', 'expense:read']]);
    }

    #[Route('/weddings/{id}/expenses', name: 'get_wedding_expenses', methods: ['GET'])]
    #[IsGranted('view', 'wedding')]
    public function getExpenses(Wedding $wedding): JsonResponse
    {
        $budget = $wedding->getBudget();
        if (!$budget) {
            return $this->json([
                'expenses' => []
            ], Response::HTTP_OK);
        }

        $expenses = $this->expenseRepository->findBy(['budget' => $budget]);

        return $this->json([
            'expenses' => $expenses,
            'budget' => $budget,
            'summary' => $this->budgetService->getBudgetSummary($budget)
        ], Response::HTTP_OK, [], ['groups' => ['expense:read', 'budget:read']]);
    }

    #[Route('/weddings/{id}/expenses', name: 'create_wedding_expense', methods: ['POST'])]
    #[IsGranted('edit', 'wedding')]
    public function createExpense(Request $request, Wedding $wedding): JsonResponse
    {
        $budget = $wedding->getBudget();
        if (!$budget) {
            return $this->json([
                'message' => 'Wedding does not have a budget'
            ], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        $expense = $this->budgetService->createExpense(
            $budget,
            $data['category'],
            $data['description'],
            $data['amount'],
            $data['status'] ?? 'pending',
            $data['paidAmount'] ?? null,
            null, // vendor
            isset($data['dueDate']) ? new \DateTimeImmutable($data['dueDate']) : null
        );

        // Get fresh budget data after expense creation
        $budget = $this->budgetRepository->find($budget->getId());

        return $this->json([
            'expense' => $expense,
            'budget' => $budget,
            'summary' => $this->budgetService->getBudgetSummary($budget)
        ], Response::HTTP_CREATED, [], ['groups' => ['expense:read', 'budget:read']]);
    }

    #[Route('/weddings/{wedding}/expenses/{id}', name: 'update_wedding_expense', methods: ['PUT'])]
    #[IsGranted('edit', 'wedding')]
    public function updateExpense(Request $request, Wedding $wedding, int $id): JsonResponse
    {
        $expense = $this->expenseRepository->find($id);
        if (!$expense || $expense->getBudget()->getWedding() !== $wedding) {
            return $this->json([
                'message' => 'Expense not found'
            ], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        $expense = $this->budgetService->updateExpense(
            $expense,
            $data['category'] ?? $expense->getCategory(),
            $data['description'] ?? $expense->getDescription(),
            $data['amount'] ?? $expense->getAmount(),
            $data['status'] ?? null,
            $data['paidAmount'] ?? null,
            isset($data['dueDate']) ? new \DateTimeImmutable($data['dueDate']) : null
        );

        // Get fresh budget data after expense update
        $budget = $this->budgetRepository->find($expense->getBudget()->getId());

        return $this->json([
            'expense' => $expense,
            'budget' => $budget,
            'summary' => $this->budgetService->getBudgetSummary($budget)
        ], Response::HTTP_OK, [], ['groups' => ['expense:read', 'budget:read']]);
    }

    #[Route('/weddings/{wedding}/expenses/{id}', name: 'delete_wedding_expense', methods: ['DELETE'])]
    #[IsGranted('edit', 'wedding')]
    public function deleteExpense(Wedding $wedding, int $id): JsonResponse
    {
        $expense = $this->expenseRepository->find($id);
        if (!$expense || $expense->getBudget()->getWedding() !== $wedding) {
            return $this->json([
                'message' => 'Expense not found'
            ], Response::HTTP_NOT_FOUND);
        }

        $budget = $expense->getBudget();
        $budgetId = $budget->getId(); // Store ID before deletion
        $this->budgetService->deleteExpense($expense);

        // Get fresh budget data after expense deletion
        $budget = $this->budgetRepository->find($budgetId);

        return $this->json([
            'id' => $id,
            'budget' => $budget,
            'summary' => $this->budgetService->getBudgetSummary($budget)
        ], Response::HTTP_OK, [], ['groups' => ['budget:read', 'expense:read']]);
    }

    #[Route('/weddings/{id}/budget/summary', name: 'get_wedding_budget_summary', methods: ['GET'])]
    #[IsGranted('view', 'wedding')]
    public function getBudgetSummary(Wedding $wedding): JsonResponse
    {
        $budget = $wedding->getBudget();
        if (!$budget) {
            return $this->json([
                'summary' => null
            ], Response::HTTP_OK);
        }

        return $this->json([
            'budget' => $budget,
            'summary' => $this->budgetService->getBudgetSummary($budget)
        ], Response::HTTP_OK, [], ['groups' => ['budget:read', 'expense:read']]);
    }
} 