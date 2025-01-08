<?php

namespace App\Entity;

use App\Repository\BudgetRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: BudgetRepository::class)]
class Budget
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['budget:read'])]
    private ?int $id = null;

    #[ORM\OneToOne(inversedBy: 'budget')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Wedding $wedding = null;

    #[ORM\Column]
    #[Groups(['budget:read'])]
    private float $totalAmount = 0.0;

    #[ORM\Column(type: 'json')]
    #[Groups(['budget:read'])]
    private array $categoryAllocations = [];

    #[ORM\OneToMany(mappedBy: 'budget', targetEntity: Expense::class, orphanRemoval: true)]
    private Collection $expenses;

    #[ORM\Column]
    #[Groups(['budget:read'])]
    private ?\DateTimeImmutable $createdAt;

    #[ORM\Column]
    #[Groups(['budget:read'])]
    private ?\DateTimeImmutable $updatedAt;

    public function __construct()
    {
        $this->expenses = new ArrayCollection();
        $this->createdAt = new \DateTimeImmutable();
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getWedding(): ?Wedding
    {
        return $this->wedding;
    }

    public function setWedding(?Wedding $wedding): self
    {
        $this->wedding = $wedding;
        return $this;
    }

    public function getTotalAmount(): float
    {
        return $this->totalAmount;
    }

    public function setTotalAmount(float $totalAmount): self
    {
        $this->totalAmount = $totalAmount;
        return $this;
    }

    public function getCategoryAllocations(): array
    {
        return $this->categoryAllocations;
    }

    public function setCategoryAllocations(array $categoryAllocations): self
    {
        $this->categoryAllocations = $categoryAllocations;
        return $this;
    }

    public function getExpenses(): Collection
    {
        return $this->expenses;
    }

    public function addExpense(Expense $expense): self
    {
        if (!$this->expenses->contains($expense)) {
            $this->expenses->add($expense);
            $expense->setBudget($this);
        }
        return $this;
    }

    public function removeExpense(Expense $expense): self
    {
        if ($this->expenses->removeElement($expense)) {
            if ($expense->getBudget() === $this) {
                $expense->setBudget(null);
            }
        }
        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(\DateTimeImmutable $updatedAt): self
    {
        $this->updatedAt = $updatedAt;
        return $this;
    }
} 