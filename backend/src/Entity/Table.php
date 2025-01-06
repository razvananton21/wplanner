<?php

namespace App\Entity;

use App\Repository\TableRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: TableRepository::class)]
#[ORM\Table(name: '`table`')]
#[ORM\HasLifecycleCallbacks]
class Table
{
    public const SHAPE_ROUND = 'round';
    public const SHAPE_RECTANGULAR = 'rectangular';
    public const SHAPE_SQUARE = 'square';

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    private ?string $name = null;

    #[ORM\ManyToOne(inversedBy: 'tables')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Wedding $wedding = null;

    #[ORM\OneToMany(mappedBy: 'table', targetEntity: Guest::class)]
    private Collection $guests;

    #[ORM\Column]
    #[Assert\NotNull]
    #[Assert\GreaterThanOrEqual(1)]
    private int $capacity = 8;

    #[ORM\Column]
    #[Assert\NotNull]
    #[Assert\GreaterThanOrEqual(1)]
    private int $minCapacity = 1;

    #[ORM\Column(length: 20)]
    #[Assert\Choice(choices: [self::SHAPE_ROUND, self::SHAPE_RECTANGULAR, self::SHAPE_SQUARE])]
    private string $shape = self::SHAPE_ROUND;

    #[ORM\Column(type: 'json')]
    private array $dimensions = [];

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $location = null;

    #[ORM\Column]
    private bool $isVIP = false;

    #[ORM\Column(type: 'json')]
    private array $metadata = [];

    #[ORM\Column]
    private \DateTimeImmutable $createdAt;

    #[ORM\Column]
    private \DateTimeImmutable $updatedAt;

    public function __construct()
    {
        $this->guests = new ArrayCollection();
        $this->createdAt = new \DateTimeImmutable();
        $this->updatedAt = new \DateTimeImmutable();
    }

    #[ORM\PreUpdate]
    public function setUpdatedAtValue(): void
    {
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;
        return $this;
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

    /**
     * @return Collection<int, Guest>
     */
    public function getGuests(): Collection
    {
        return $this->guests;
    }

    public function addGuest(Guest $guest): self
    {
        if (!$this->guests->contains($guest)) {
            $this->guests->add($guest);
            $guest->setTable($this);
        }
        return $this;
    }

    public function removeGuest(Guest $guest): self
    {
        if ($this->guests->removeElement($guest)) {
            if ($guest->getTable() === $this) {
                $guest->setTable(null);
            }
        }
        return $this;
    }

    public function getCapacity(): int
    {
        return $this->capacity;
    }

    public function setCapacity(int $capacity): self
    {
        $this->capacity = $capacity;
        return $this;
    }

    public function getMinCapacity(): int
    {
        return $this->minCapacity;
    }

    public function setMinCapacity(int $minCapacity): self
    {
        $this->minCapacity = $minCapacity;
        return $this;
    }

    public function getShape(): string
    {
        return $this->shape;
    }

    public function setShape(string $shape): self
    {
        $this->shape = $shape;
        return $this;
    }

    public function getDimensions(): array
    {
        return $this->dimensions;
    }

    public function setDimensions(array $dimensions): self
    {
        $this->dimensions = $dimensions;
        return $this;
    }

    public function getLocation(): ?string
    {
        return $this->location;
    }

    public function setLocation(?string $location): self
    {
        $this->location = $location;
        return $this;
    }

    public function isVIP(): bool
    {
        return $this->isVIP;
    }

    public function setIsVIP(bool $isVIP): self
    {
        $this->isVIP = $isVIP;
        return $this;
    }

    public function getMetadata(): array
    {
        return $this->metadata;
    }

    public function setMetadata(array $metadata): self
    {
        $this->metadata = $metadata;
        return $this;
    }

    public function getCreatedAt(): \DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function getUpdatedAt(): \DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function getCurrentGuestCount(): int
    {
        return $this->guests->count();
    }

    public function hasAvailableSeats(): bool
    {
        return $this->getCurrentGuestCount() < $this->capacity;
    }

    public function getAvailableSeats(): int
    {
        return max(0, $this->capacity - $this->getCurrentGuestCount());
    }
} 