<?php

namespace App\Entity;

use App\Repository\GuestRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: GuestRepository::class)]
class Guest
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    private ?string $firstName = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    private ?string $lastName = null;

    #[ORM\Column(length: 255)]
    #[Assert\Email]
    #[Assert\NotBlank]
    private ?string $email = null;

    #[ORM\Column(length: 20)]
    private string $status = 'pending';

    #[ORM\ManyToOne(targetEntity: Wedding::class, inversedBy: 'guests')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Wedding $wedding = null;

    #[ORM\ManyToOne(targetEntity: Table::class, inversedBy: 'guests')]
    private ?Table $table = null;

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $dietaryRestrictions = null;

    #[ORM\Column]
    private bool $plusOne = false;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $rsvpToken = null;

    #[ORM\Column(length: 255)]
    private string $category = 'guest';

    #[ORM\ManyToOne(targetEntity: self::class, inversedBy: 'plusOnes')]
    #[ORM\JoinColumn(nullable: true)]
    private ?self $plusOneOf = null;

    #[ORM\OneToMany(mappedBy: 'plusOneOf', targetEntity: self::class)]
    private Collection $plusOnes;

    #[ORM\OneToMany(mappedBy: 'guest', targetEntity: RsvpResponse::class, orphanRemoval: true)]
    private Collection $rsvpResponses;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $deletedAt = null;

    public function __construct()
    {
        $this->rsvpResponses = new ArrayCollection();
        $this->plusOnes = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFirstName(): ?string
    {
        return $this->firstName;
    }

    public function setFirstName(string $firstName): self
    {
        $this->firstName = $firstName;
        return $this;
    }

    public function getLastName(): ?string
    {
        return $this->lastName;
    }

    public function setLastName(string $lastName): self
    {
        $this->lastName = $lastName;
        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;
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

    public function getWedding(): ?Wedding
    {
        return $this->wedding;
    }

    public function setWedding(?Wedding $wedding): self
    {
        $this->wedding = $wedding;
        return $this;
    }

    public function getTable(): ?Table
    {
        return $this->table;
    }

    public function setTable(?Table $table): self
    {
        $this->table = $table;
        return $this;
    }

    public function getDietaryRestrictions(): ?string
    {
        return $this->dietaryRestrictions;
    }

    public function setDietaryRestrictions(?string $dietaryRestrictions): self
    {
        $this->dietaryRestrictions = $dietaryRestrictions;
        return $this;
    }

    public function isPlusOne(): bool
    {
        return $this->plusOne;
    }

    public function setPlusOne(bool $plusOne): self
    {
        $this->plusOne = $plusOne;
        return $this;
    }

    public function getRsvpToken(): ?string
    {
        return $this->rsvpToken;
    }

    public function setRsvpToken(?string $rsvpToken): self
    {
        $this->rsvpToken = $rsvpToken;
        return $this;
    }

    public function getCategory(): string
    {
        return $this->category;
    }

    public function setCategory(string $category): self
    {
        $this->category = $category;
        return $this;
    }

    public function getPlusOneOf(): ?self
    {
        return $this->plusOneOf;
    }

    public function setPlusOneOf(?self $guest): self
    {
        $this->plusOneOf = $guest;
        return $this;
    }

    /**
     * @return Collection<int, self>
     */
    public function getPlusOnes(): Collection
    {
        return $this->plusOnes;
    }

    public function addPlusOne(self $guest): self
    {
        if (!$this->plusOnes->contains($guest)) {
            $this->plusOnes->add($guest);
            $guest->setPlusOneOf($this);
        }
        return $this;
    }

    public function removePlusOne(self $guest): self
    {
        if ($this->plusOnes->removeElement($guest)) {
            if ($guest->getPlusOneOf() === $this) {
                $guest->setPlusOneOf(null);
            }
        }
        return $this;
    }

    /**
     * @return Collection<int, RsvpResponse>
     */
    public function getRsvpResponses(): Collection
    {
        return $this->rsvpResponses;
    }

    public function addRsvpResponse(RsvpResponse $rsvpResponse): self
    {
        if (!$this->rsvpResponses->contains($rsvpResponse)) {
            $this->rsvpResponses->add($rsvpResponse);
            $rsvpResponse->setGuest($this);
        }
        return $this;
    }

    public function removeRsvpResponse(RsvpResponse $rsvpResponse): self
    {
        if ($this->rsvpResponses->removeElement($rsvpResponse)) {
            if ($rsvpResponse->getGuest() === $this) {
                $rsvpResponse->setGuest(null);
            }
        }
        return $this;
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

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'firstName' => $this->firstName,
            'lastName' => $this->lastName,
            'email' => $this->email,
            'status' => $this->status,
            'dietaryRestrictions' => $this->dietaryRestrictions,
            'plusOne' => $this->plusOne,
            'category' => $this->category,
            'rsvpToken' => $this->rsvpToken,
            'table' => $this->table ? [
                'id' => $this->table->getId(),
                'name' => $this->table->getName()
            ] : null,
            'plusOneOf' => $this->plusOneOf ? [
                'id' => $this->plusOneOf->getId(),
                'firstName' => $this->plusOneOf->getFirstName(),
                'lastName' => $this->plusOneOf->getLastName()
            ] : null,
            'plusOnes' => array_map(function(self $guest) {
                return [
                    'id' => $guest->getId(),
                    'firstName' => $guest->getFirstName(),
                    'lastName' => $guest->getLastName()
                ];
            }, $this->plusOnes->toArray()),
            'deletedAt' => $this->deletedAt?->format('c')
        ];
    }
} 