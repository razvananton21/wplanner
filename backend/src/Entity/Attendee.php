<?php

namespace App\Entity;

use App\Repository\AttendeeRepository;
use Doctrine\ORM\Mapping as ORM;
use JsonSerializable;

#[ORM\Entity(repositoryClass: AttendeeRepository::class)]
#[ORM\Table(name: 'attendees')]
class Attendee implements JsonSerializable
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $firstName = null;

    #[ORM\Column(length: 255)]
    private ?string $lastName = null;

    #[ORM\Column]
    private ?int $numberOfGuests = null;

    #[ORM\Column]
    private ?bool $isVegetarian = null;

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $preferences = null;

    #[ORM\Column(length: 255, unique: true, nullable: true)]
    private ?string $uniqueLink = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(type: 'json', nullable: true)]
    private $additionalGuests = [];

    #[ORM\Column(type: 'string', length: 36, nullable: true)]
    private ?string $invitationUuid = null;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
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

    public function getNumberOfGuests(): ?int
    {
        return $this->numberOfGuests;
    }

    public function setNumberOfGuests(int $numberOfGuests): self
    {
        $this->numberOfGuests = $numberOfGuests;
        return $this;
    }

    public function getIsVegetarian(): ?bool
    {
        return $this->isVegetarian;
    }

    public function setIsVegetarian(bool $isVegetarian): self
    {
        $this->isVegetarian = $isVegetarian;
        return $this;
    }

    public function getPreferences(): ?string
    {
        return $this->preferences;
    }

    public function setPreferences(?string $preferences): self
    {
        $this->preferences = $preferences;
        return $this;
    }

    public function getUniqueLink(): ?string
    {
        return $this->uniqueLink;
    }

    public function setUniqueLink(?string $uniqueLink): self
    {
        $this->uniqueLink = $uniqueLink;
        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function getAdditionalGuests(): ?array
    {
        return $this->additionalGuests;
    }

    public function setAdditionalGuests(?array $additionalGuests): self
    {
        $this->additionalGuests = $additionalGuests;
        return $this;
    }

    public function getInvitationUuid(): ?string
    {
        return $this->invitationUuid;
    }

    public function setInvitationUuid(?string $invitationUuid): self
    {
        $this->invitationUuid = $invitationUuid;
        return $this;
    }

    public function jsonSerialize(): array
    {
        return [
            'id' => $this->id,
            'firstName' => $this->firstName,
            'lastName' => $this->lastName,
            'numberOfGuests' => $this->numberOfGuests,
            'isVegetarian' => $this->isVegetarian,
            'preferences' => $this->preferences,
            'uniqueLink' => $this->uniqueLink,
            'createdAt' => $this->createdAt?->format('Y-m-d H:i:s'),
            'additionalGuests' => $this->additionalGuests,
        ];
    }
} 