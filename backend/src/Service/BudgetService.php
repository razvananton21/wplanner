<?php

namespace App\Service;

use App\Entity\Budget;
use App\Entity\Expense;
use App\Entity\Vendor;
use App\Entity\Wedding;
use App\Repository\BudgetRepository;
use App\Repository\ExpenseRepository;
use Doctrine\ORM\EntityManagerInterface;

class BudgetService
{
    public function __construct(
        private readonly BudgetRepository $budgetRepository,
        private readonly ExpenseRepository $expenseRepository,
        private readonly EntityManagerInterface $entityManager
    ) {
    }

    public function createBudget(Wedding $wedding, float $totalAmount, array $categoryAllocations): Budget
    {
        $budget = new Budget();
        $budget->setWedding($wedding);
        $budget->setTotalAmount($totalAmount);
        $budget->setCategoryAllocations($categoryAllocations);

        $this->entityManager->persist($budget);
        $this->entityManager->flush();

        return $budget;
    }

    public function updateBudget(Budget $budget, float $totalAmount, array $categoryAllocations): Budget
    {
        $budget->setTotalAmount($totalAmount);
        $budget->setCategoryAllocations($categoryAllocations);
        $budget->setUpdatedAt(new \DateTimeImmutable());

        $this->entityManager->flush();

        return $budget;
    }

    public function createExpenseFromVendor(Vendor $vendor): Expense
    {
        $wedding = $vendor->getWedding();
        $budget = $wedding->getBudget();

        if (!$budget) {
            throw new \RuntimeException('Wedding does not have a budget');
        }

        // First, remove any existing vendor expenses for this vendor
        $existingExpenses = $this->expenseRepository->findBy(['vendor' => $vendor]);
        foreach ($existingExpenses as $existingExpense) {
            $this->entityManager->remove($existingExpense);
        }
        $this->entityManager->flush();

        $totalAmount = $vendor->getPrice() ?? 0;
        $depositAmount = $vendor->getDepositAmount() ?? 0;
        
        // If there's a deposit, create the deposit expense first
        if ($depositAmount > 0) {
            $depositExpense = new Expense();
            $depositExpense->setBudget($budget);
            $depositExpense->setVendor($vendor);
            $depositExpense->setCategory($vendor->getType());
            $depositExpense->setDescription(sprintf('%s - Deposit', $vendor->getName()));
            $depositExpense->setAmount($depositAmount);
            $depositExpense->setType('vendor_deposit');
            $depositExpense->setStatus($vendor->isDepositPaid() ? 'paid' : 'pending');
            if ($vendor->isDepositPaid()) {
                $depositExpense->setPaidAmount($depositAmount);
                $depositExpense->setPaidAt(new \DateTimeImmutable());
            }

            $this->entityManager->persist($depositExpense);
            $this->entityManager->flush();
        }

        // Create remaining balance expense
        $remainingAmount = $totalAmount - ($vendor->isDepositPaid() ? $depositAmount : 0);
        if ($remainingAmount > 0) {
            $expense = new Expense();
            $expense->setBudget($budget);
            $expense->setVendor($vendor);
            $expense->setCategory($vendor->getType());
            $expense->setDescription(sprintf('%s - Remaining Balance', $vendor->getName()));
            $expense->setAmount($remainingAmount);
            $expense->setType('vendor_total');
            $expense->setStatus('pending');
            
            $this->entityManager->persist($expense);
            $this->entityManager->flush();

            return $expense;
        }

        return $depositExpense;
    }

    public function createExpense(
        Budget $budget,
        string $category,
        string $description,
        float $amount,
        ?string $status = 'pending',
        ?float $paidAmount = null,
        ?Vendor $vendor = null,
        ?\DateTimeImmutable $dueDate = null
    ): Expense {
        $expense = new Expense();
        $expense->setBudget($budget);
        $expense->setCategory($category);
        $expense->setDescription($description);
        $expense->setAmount($amount);
        $expense->setVendor($vendor);
        $expense->setDueDate($dueDate);
        
        // Handle paid amount first
        if ($paidAmount !== null) {
            $expense->setPaidAmount($paidAmount);
            if ($paidAmount >= $amount) {
                $expense->setStatus('paid');
                $expense->setPaidAt(new \DateTimeImmutable());
            } elseif ($paidAmount > 0) {
                $expense->setStatus('partial');
            } else {
                $expense->setStatus('pending');
            }
        }

        // Status can override the paid amount
        if ($status !== null) {
            $expense->setStatus($status);
            if ($status === 'paid') {
                $expense->setPaidAmount($amount);
                $expense->setPaidAt(new \DateTimeImmutable());
            } elseif ($status === 'pending') {
                $expense->setPaidAmount(0);
                $expense->setPaidAt(null);
            }
        }

        if ($dueDate !== null) {
            $expense->setDueDate($dueDate);
        }

        $expense->setUpdatedAt(new \DateTimeImmutable());
        
        $this->entityManager->persist($expense);
        $this->entityManager->flush();

        return $expense;
    }

    public function updateExpense(
        Expense $expense,
        string $category,
        string $description,
        float $amount,
        ?string $status = null,
        ?float $paidAmount = null,
        ?\DateTimeImmutable $dueDate = null
    ): Expense {
        $expense->setCategory($category);
        $expense->setDescription($description);
        $expense->setAmount($amount);
        
        // Handle paid amount first
        if ($paidAmount !== null) {
            $expense->setPaidAmount($paidAmount);
            // Status will be determined by the paid amount unless explicitly set
            if ($paidAmount >= $amount) {
                $expense->setStatus('paid');
                $expense->setPaidAt(new \DateTimeImmutable());
            } elseif ($paidAmount > 0) {
                $expense->setStatus('partial');
            } else {
                $expense->setStatus('pending');
            }
        }

        // Status can override the paid amount
        if ($status !== null) {
            $expense->setStatus($status);
            if ($status === 'paid') {
                $expense->setPaidAmount($amount);
                $expense->setPaidAt(new \DateTimeImmutable());
            } elseif ($status === 'pending') {
                $expense->setPaidAmount(0);
                $expense->setPaidAt(null);
            }
        }

        if ($dueDate !== null) {
            $expense->setDueDate($dueDate);
        }

        $expense->setUpdatedAt(new \DateTimeImmutable());
        
        $this->entityManager->persist($expense);
        $this->entityManager->flush();

        return $expense;
    }

    public function getBudgetSummary(Budget $budget): array
    {
        $expenses = $this->expenseRepository->findBy(['budget' => $budget]);
        
        $totalSpent = 0;
        $totalPaid = 0;
        $totalPending = 0;
        $spentByCategory = [];
        $pendingByCategory = [];

        foreach ($expenses as $expense) {
            $category = $expense->getCategory();
            $amount = $expense->getAmount();
            
            // Calculate paid amount based on status and explicit paidAmount
            $paidAmount = match($expense->getStatus()) {
                'paid' => $amount,
                'partial' => $expense->getPaidAmount() ?? 0,
                default => 0
            };

            // Track total amounts
            $totalSpent += $amount;
            $totalPaid += $paidAmount;
            $totalPending += ($amount - $paidAmount);

            // Track category amounts
            if (!isset($spentByCategory[$category])) {
                $spentByCategory[$category] = 0;
                $pendingByCategory[$category] = 0;
            }
            $spentByCategory[$category] += $amount;
            $pendingByCategory[$category] += ($amount - $paidAmount);
        }

        return [
            'totalBudget' => $budget->getTotalAmount(),
            'totalSpent' => $totalSpent,
            'totalPaid' => $totalPaid,
            'totalPending' => $totalPending,
            'remainingBudget' => $budget->getTotalAmount() - $totalSpent,
            'categoryAllocations' => $budget->getCategoryAllocations(),
            'spentByCategory' => $spentByCategory,
            'pendingByCategory' => $pendingByCategory
        ];
    }

    public function deleteExpense(Expense $expense): void
    {
        $this->entityManager->remove($expense);
        $this->entityManager->flush();
    }
} 