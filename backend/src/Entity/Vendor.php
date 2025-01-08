<?php

namespace App\Entity;

use App\Repository\VendorRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: VendorRepository::class)]
class Vendor
{
    public const STATUS_CONTACTED = 'contacted';
    public const STATUS_IN_TALKS = 'in_talks';
    public const STATUS_PROPOSAL_RECEIVED = 'proposal_received';
    public const STATUS_BOOKED = 'booked';
    public const STATUS_CONFIRMED = 'confirmed';
    public const STATUS_CANCELLED = 'cancelled';

    public const TYPE_PHOTOGRAPHER = 'photographer';
    public const TYPE_VIDEOGRAPHER = 'videographer';
    public const TYPE_CATERER = 'caterer';
    public const TYPE_FLORIST = 'florist';
    public const TYPE_MUSIC = 'music';
    public const TYPE_VENUE = 'venue';
    public const TYPE_DECOR = 'decor';
    public const TYPE_CAKE = 'cake';
    public const TYPE_ATTIRE = 'attire';
    public const TYPE_TRANSPORT = 'transport';
    public const TYPE_OTHER = 'other';

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['vendor:read'])]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'vendors')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Wedding $wedding = null;

    #[ORM\Column(length: 255)]
    #[Groups(['vendor:read'])]
    private ?string $name = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['vendor:read'])]
    private ?string $company = null;

    #[ORM\Column(length: 50)]
    #[Groups(['vendor:read'])]
    private ?string $type = null;

    #[ORM\Column(length: 50)]
    #[Groups(['vendor:read'])]
    private string $status = self::STATUS_CONTACTED;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['vendor:read'])]
    private ?string $phone = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['vendor:read'])]
    private ?string $email = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['vendor:read'])]
    private ?string $website = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['vendor:read'])]
    private ?string $address = null;

    #[ORM\Column(type: 'text', nullable: true)]
    #[Groups(['vendor:read'])]
    private ?string $notes = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['vendor:read'])]
    private ?float $price = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['vendor:read'])]
    private ?float $depositAmount = null;

    #[ORM\Column]
    #[Groups(['vendor:read'])]
    private bool $depositPaid = false;

    #[ORM\Column(nullable: true)]
    #[Groups(['vendor:read'])]
    private ?bool $contractSigned = null;

    #[ORM\OneToMany(mappedBy: 'vendor', targetEntity: VendorFile::class, orphanRemoval: true)]
    #[Groups(['vendor:read'])]
    private Collection $files;

    #[ORM\Column]
    #[Groups(['vendor:read'])]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['vendor:read'])]
    private ?\DateTimeImmutable $updatedAt = null;

    public function __construct()
    {
        $this->files = new ArrayCollection();
        $this->createdAt = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getWedding(): ?Wedding
    {
        return $this->wedding;
    }

    public function setWedding(?Wedding $wedding): static
    {
        $this->wedding = $wedding;
        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;
        return $this;
    }

    public function getCompany(): ?string
    {
        return $this->company;
    }

    public function setCompany(?string $company): static
    {
        $this->company = $company;
        return $this;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): static
    {
        $this->type = $type;
        return $this;
    }

    public function getStatus(): string
    {
        return $this->status;
    }

    public function setStatus(string $status): static
    {
        $this->status = $status;
        return $this;
    }

    public function getPhone(): ?string
    {
        return $this->phone;
    }

    public function setPhone(?string $phone): static
    {
        $this->phone = $phone;
        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(?string $email): static
    {
        $this->email = $email;
        return $this;
    }

    public function getWebsite(): ?string
    {
        return $this->website;
    }

    public function setWebsite(?string $website): static
    {
        $this->website = $website;
        return $this;
    }

    public function getAddress(): ?string
    {
        return $this->address;
    }

    public function setAddress(?string $address): static
    {
        $this->address = $address;
        return $this;
    }

    public function getNotes(): ?string
    {
        return $this->notes;
    }

    public function setNotes(?string $notes): static
    {
        $this->notes = $notes;
        return $this;
    }

    public function getPrice(): ?float
    {
        return $this->price;
    }

    public function setPrice(?float $price): self
    {
        $this->price = $price;
        return $this;
    }

    public function getDepositAmount(): ?float
    {
        return $this->depositAmount;
    }

    public function setDepositAmount(?float $depositAmount): self
    {
        $this->depositAmount = $depositAmount;
        return $this;
    }

    public function isDepositPaid(): bool
    {
        return $this->depositPaid;
    }

    public function setDepositPaid(bool $depositPaid): self
    {
        $this->depositPaid = $depositPaid;
        return $this;
    }

    public function isContractSigned(): ?bool
    {
        return $this->contractSigned;
    }

    public function setContractSigned(?bool $contractSigned): static
    {
        $this->contractSigned = $contractSigned;
        return $this;
    }

    /**
     * @return Collection<int, VendorFile>
     */
    public function getFiles(): Collection
    {
        return $this->files;
    }

    public function addFile(VendorFile $file): static
    {
        if (!$this->files->contains($file)) {
            $this->files->add($file);
            $file->setVendor($this);
        }

        return $this;
    }

    public function removeFile(VendorFile $file): static
    {
        if ($this->files->removeElement($file)) {
            // set the owning side to null (unless already changed)
            if ($file->getVendor() === $this) {
                $file->setVendor(null);
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

    public function setUpdatedAt(?\DateTimeImmutable $updatedAt): static
    {
        $this->updatedAt = $updatedAt;
        return $this;
    }
} 