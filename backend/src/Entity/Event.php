<?php

namespace App\Entity;

use App\Repository\EventRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: EventRepository::class)]
#[ORM\HasLifecycleCallbacks]
class Event
{
    public const TYPE_WEDDING = 'wedding';
    public const TYPE_CORPORATE = 'corporate';
    public const TYPE_BIRTHDAY = 'birthday';
    public const TYPE_OTHER = 'other';

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    private ?string $title = null;

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $description = null;

    #[ORM\Column]
    #[Assert\NotNull]
    private ?\DateTimeImmutable $date = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    private ?string $venue = null;

    #[ORM\Column(length: 10)]
    #[Assert\NotBlank]
    private ?string $language = null;

    #[ORM\ManyToOne(inversedBy: 'managedEvents')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $admin = null;

    #[ORM\OneToMany(mappedBy: 'event', targetEntity: Table::class, orphanRemoval: true)]
    private Collection $tables;

    #[ORM\OneToMany(mappedBy: 'event', targetEntity: Guest::class, orphanRemoval: true)]
    private Collection $guests;

    #[ORM\Column(length: 20)]
    #[Assert\Choice(choices: [
        self::TYPE_WEDDING,
        self::TYPE_CORPORATE,
        self::TYPE_BIRTHDAY,
        self::TYPE_OTHER
    ])]
    private string $type = self::TYPE_WEDDING;

    #[ORM\Column(type: 'json', nullable: true)]
    private ?array $metadata = [];

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $updatedAt = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $deletedAt = null;

    public function __construct()
    {
        $this->tables = new ArrayCollection();
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

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;
        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): self
    {
        $this->description = $description;
        return $this;
    }

    public function getDate(): ?\DateTimeImmutable
    {
        return $this->date;
    }

    public function setDate(\DateTimeImmutable $date): self
    {
        $this->date = $date;
        return $this;
    }

    public function getVenue(): ?string
    {
        return $this->venue;
    }

    public function setVenue(string $venue): self
    {
        $this->venue = $venue;
        return $this;
    }

    public function getLanguage(): ?string
    {
        return $this->language;
    }

    public function setLanguage(string $language): self
    {
        $this->language = $language;
        return $this;
    }

    public function getAdmin(): ?User
    {
        return $this->admin;
    }

    public function setAdmin(?User $admin): self
    {
        $this->admin = $admin;
        return $this;
    }

    public function getTables(): Collection
    {
        return $this->tables;
    }

    public function addTable(Table $table): self
    {
        if (!$this->tables->contains($table)) {
            $this->tables->add($table);
            $table->setEvent($this);
        }
        return $this;
    }

    public function removeTable(Table $table): self
    {
        if ($this->tables->removeElement($table)) {
            if ($table->getEvent() === $this) {
                $table->setEvent(null);
            }
        }
        return $this;
    }

    public function getGuests(): Collection
    {
        return $this->guests;
    }

    public function addGuest(Guest $guest): self
    {
        if (!$this->guests->contains($guest)) {
            $this->guests->add($guest);
            $guest->setEvent($this);
        }
        return $this;
    }

    public function removeGuest(Guest $guest): self
    {
        if ($this->guests->removeElement($guest)) {
            if ($guest->getEvent() === $this) {
                $guest->setEvent(null);
            }
        }
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

    public function getMetadata(): ?array
    {
        return $this->metadata;
    }

    public function setMetadata(?array $metadata): self
    {
        $this->metadata = $metadata;
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

    public function getDeletedAt(): ?\DateTimeImmutable
    {
        return $this->deletedAt;
    }

    public function setDeletedAt(?\DateTimeImmutable $deletedAt): self
    {
        $this->deletedAt = $deletedAt;
        return $this;
    }
} 