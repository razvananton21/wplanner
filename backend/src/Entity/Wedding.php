<?php

namespace App\Entity;

use App\Repository\WeddingRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: WeddingRepository::class)]
class Wedding
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['budget:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $title = null;

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $description = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $date = null;

    #[ORM\Column(length: 255)]
    private ?string $venue = null;

    #[ORM\Column(length: 10)]
    private ?string $language = null;

    #[ORM\ManyToOne(inversedBy: 'managedWeddings')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $admin = null;

    #[ORM\OneToMany(mappedBy: 'wedding', targetEntity: Table::class, orphanRemoval: true)]
    private Collection $tables;

    #[ORM\OneToMany(mappedBy: 'wedding', targetEntity: Photo::class, orphanRemoval: true)]
    private Collection $photos;

    #[ORM\OneToMany(mappedBy: 'wedding', targetEntity: Invitation::class, orphanRemoval: true)]
    private Collection $invitations;

    #[ORM\OneToMany(mappedBy: 'wedding', targetEntity: WeddingFormField::class, orphanRemoval: true)]
    private Collection $formFields;

    #[ORM\OneToMany(mappedBy: 'wedding', targetEntity: Guest::class, orphanRemoval: true)]
    private Collection $guests;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $deletedAt = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $invitationPdfUrl = null;

    #[ORM\OneToMany(mappedBy: 'wedding', targetEntity: TimelineEvent::class, orphanRemoval: true)]
    #[Groups(['wedding:read'])]
    private Collection $timelineEvents;

    #[ORM\OneToMany(mappedBy: 'wedding', targetEntity: Vendor::class, orphanRemoval: true)]
    private Collection $vendors;

    #[ORM\OneToMany(mappedBy: 'wedding', targetEntity: Task::class, orphanRemoval: true)]
    private Collection $tasks;

    #[ORM\OneToOne(mappedBy: 'wedding', targetEntity: Budget::class, cascade: ['persist', 'remove'])]
    private ?Budget $budget = null;

    public function __construct()
    {
        $this->tables = new ArrayCollection();
        $this->photos = new ArrayCollection();
        $this->invitations = new ArrayCollection();
        $this->formFields = new ArrayCollection();
        $this->guests = new ArrayCollection();
        $this->timelineEvents = new ArrayCollection();
        $this->vendors = new ArrayCollection();
        $this->tasks = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;
        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;
        return $this;
    }

    public function getDate(): ?\DateTimeImmutable
    {
        return $this->date;
    }

    public function setDate(\DateTimeImmutable $date): static
    {
        $this->date = $date;
        return $this;
    }

    public function getVenue(): ?string
    {
        return $this->venue;
    }

    public function setVenue(string $venue): static
    {
        $this->venue = $venue;
        return $this;
    }

    public function getLanguage(): ?string
    {
        return $this->language;
    }

    public function setLanguage(string $language): static
    {
        $this->language = $language;
        return $this;
    }

    public function getAdmin(): ?User
    {
        return $this->admin;
    }

    public function setAdmin(?User $admin): static
    {
        $this->admin = $admin;
        return $this;
    }

    /**
     * @return Collection<int, Table>
     */
    public function getTables(): Collection
    {
        return $this->tables;
    }

    public function addTable(Table $table): static
    {
        if (!$this->tables->contains($table)) {
            $this->tables->add($table);
            $table->setWedding($this);
        }

        return $this;
    }

    public function removeTable(Table $table): static
    {
        if ($this->tables->removeElement($table)) {
            // set the owning side to null (unless already changed)
            if ($table->getWedding() === $this) {
                $table->setWedding(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Photo>
     */
    public function getPhotos(): Collection
    {
        return $this->photos;
    }

    public function addPhoto(Photo $photo): static
    {
        if (!$this->photos->contains($photo)) {
            $this->photos->add($photo);
            $photo->setWedding($this);
        }

        return $this;
    }

    public function removePhoto(Photo $photo): static
    {
        if ($this->photos->removeElement($photo)) {
            // set the owning side to null (unless already changed)
            if ($photo->getWedding() === $this) {
                $photo->setWedding(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Invitation>
     */
    public function getInvitations(): Collection
    {
        return $this->invitations;
    }

    public function addInvitation(Invitation $invitation): static
    {
        if (!$this->invitations->contains($invitation)) {
            $this->invitations->add($invitation);
            $invitation->setWedding($this);
        }

        return $this;
    }

    public function removeInvitation(Invitation $invitation): static
    {
        if ($this->invitations->removeElement($invitation)) {
            // set the owning side to null (unless already changed)
            if ($invitation->getWedding() === $this) {
                $invitation->setWedding(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, WeddingFormField>
     */
    public function getFormFields(): Collection
    {
        return $this->formFields;
    }

    public function addFormField(WeddingFormField $formField): static
    {
        if (!$this->formFields->contains($formField)) {
            $this->formFields->add($formField);
            $formField->setWedding($this);
        }

        return $this;
    }

    public function removeFormField(WeddingFormField $formField): static
    {
        if ($this->formFields->removeElement($formField)) {
            // set the owning side to null (unless already changed)
            if ($formField->getWedding() === $this) {
                $formField->setWedding(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Guest>
     */
    public function getGuests(): Collection
    {
        return $this->guests;
    }

    public function addGuest(Guest $guest): static
    {
        if (!$this->guests->contains($guest)) {
            $this->guests->add($guest);
            $guest->setWedding($this);
        }

        return $this;
    }

    public function removeGuest(Guest $guest): static
    {
        if ($this->guests->removeElement($guest)) {
            // set the owning side to null (unless already changed)
            if ($guest->getWedding() === $this) {
                $guest->setWedding(null);
            }
        }

        return $this;
    }

    public function getDeletedAt(): ?\DateTimeImmutable
    {
        return $this->deletedAt;
    }

    public function setDeletedAt(?\DateTimeImmutable $deletedAt): static
    {
        $this->deletedAt = $deletedAt;
        return $this;
    }

    public function getInvitationPdfUrl(): ?string
    {
        return $this->invitationPdfUrl;
    }

    public function setInvitationPdfUrl(?string $invitationPdfUrl): static
    {
        $this->invitationPdfUrl = $invitationPdfUrl;
        return $this;
    }

    /**
     * @return Collection<int, TimelineEvent>
     */
    public function getTimelineEvents(): Collection
    {
        return $this->timelineEvents;
    }

    public function addTimelineEvent(TimelineEvent $timelineEvent): static
    {
        if (!$this->timelineEvents->contains($timelineEvent)) {
            $this->timelineEvents->add($timelineEvent);
            $timelineEvent->setWedding($this);
        }

        return $this;
    }

    public function removeTimelineEvent(TimelineEvent $timelineEvent): static
    {
        if ($this->timelineEvents->removeElement($timelineEvent)) {
            // set the owning side to null (unless already changed)
            if ($timelineEvent->getWedding() === $this) {
                $timelineEvent->setWedding(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Vendor>
     */
    public function getVendors(): Collection
    {
        return $this->vendors;
    }

    public function addVendor(Vendor $vendor): static
    {
        if (!$this->vendors->contains($vendor)) {
            $this->vendors->add($vendor);
            $vendor->setWedding($this);
        }

        return $this;
    }

    public function removeVendor(Vendor $vendor): static
    {
        if ($this->vendors->removeElement($vendor)) {
            // set the owning side to null (unless already changed)
            if ($vendor->getWedding() === $this) {
                $vendor->setWedding(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Task>
     */
    public function getTasks(): Collection
    {
        return $this->tasks;
    }

    public function addTask(Task $task): static
    {
        if (!$this->tasks->contains($task)) {
            $this->tasks->add($task);
            $task->setWedding($this);
        }

        return $this;
    }

    public function removeTask(Task $task): static
    {
        if ($this->tasks->removeElement($task)) {
            // set the owning side to null (unless already changed)
            if ($task->getWedding() === $this) {
                $task->setWedding(null);
            }
        }

        return $this;
    }

    public function getBudget(): ?Budget
    {
        return $this->budget;
    }

    public function setBudget(?Budget $budget): self
    {
        // unset the owning side of the relation if necessary
        if ($budget === null && $this->budget !== null) {
            $this->budget->setWedding(null);
        }

        // set the owning side of the relation if necessary
        if ($budget !== null && $budget->getWedding() !== $this) {
            $budget->setWedding($this);
        }

        $this->budget = $budget;

        return $this;
    }
} 