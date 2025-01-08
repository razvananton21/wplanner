<?php

namespace App\Entity;

use App\Repository\ExpenseRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: ExpenseRepository::class)]
class Expense
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['expense:read'])]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'expenses')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Budget $budget = null;

    #[ORM\ManyToOne]
    private ?Vendor $vendor = null;

    #[ORM\Column(length: 255)]
    #[Groups(['expense:read'])]
    private ?string $category = null;

    #[ORM\Column(length: 255)]
    #[Groups(['expense:read'])]
    private ?string $description = null;

    #[ORM\Column]
    #[Groups(['expense:read'])]
    private float $amount = 0.0;

    #[ORM\Column(length: 20)]
    #[Groups(['expense:read'])]
    private string $type = 'other'; // vendor_total, vendor_deposit, other

    #[ORM\Column(length: 20)]
    #[Groups(['expense:read'])]
    private string $status = 'pending'; // paid, pending, partial

    #[ORM\Column(nullable: true)]
    #[Groups(['expense:read'])]
    private ?float $paidAmount = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['expense:read'])]
    private ?\DateTimeImmutable $dueDate = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['expense:read'])]
    private ?\DateTimeImmutable $paidAt = null;

    #[ORM\Column]
    #[Groups(['expense:read'])]
    private bool $isVendorExpense = false;

    #[ORM\Column]
    #[Groups(['expense:read'])]
    private ?\DateTimeImmutable $createdAt;

    #[ORM\Column]
    #[Groups(['expense:read'])]
    private ?\DateTimeImmutable $updatedAt;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getBudget(): ?Budget
    {
        return $this->budget;
    }

    public function setBudget(?Budget $budget): self
    {
        $this->budget = $budget;
        return $this;
    }

    public function getVendor(): ?Vendor
    {
        return $this->vendor;
    }

    public function setVendor(?Vendor $vendor): self
    {
        $this->vendor = $vendor;
        $this->isVendorExpense = $vendor !== null;
        return $this;
    }

    public function getCategory(): ?string
    {
        return $this->category;
    }

    public function setCategory(string $category): self
    {
        $this->category = $category;
        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): self
    {
        $this->description = $description;
        return $this;
    }

    public function getAmount(): float
    {
        return $this->amount;
    }

    public function setAmount(float $amount): self
    {
        $this->amount = $amount;
        return $this;
    }

    public function getType(): string
    {
        return $this->type;
    }

    public function setType(string $type): self
    {
        $this->type = $type;
        return $this;
    }

    public function getStatus(): string
    {
        return $this->status;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;
        return $this;
    }

    public function getPaidAmount(): ?float
    {
        return $this->paidAmount;
    }

    public function setPaidAmount(?float $paidAmount): self
    {
        $this->paidAmount = $paidAmount;
        return $this;
    }

    public function getDueDate(): ?\DateTimeImmutable
    {
        return $this->dueDate;
    }

    public function setDueDate(?\DateTimeImmutable $dueDate): self
    {
        $this->dueDate = $dueDate;
        return $this;
    }

    public function getPaidAt(): ?\DateTimeImmutable
    {
        return $this->paidAt;
    }

    public function setPaidAt(?\DateTimeImmutable $paidAt): self
    {
        $this->paidAt = $paidAt;
        return $this;
    }

    public function isVendorExpense(): bool
    {
        return $this->isVendorExpense;
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