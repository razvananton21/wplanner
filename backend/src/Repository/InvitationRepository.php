<?php

namespace App\Repository;

use App\Entity\Invitation;
use App\Entity\Wedding;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Invitation>
 *
 * @method Invitation|null find($id, $lockMode = null, $lockVersion = null)
 * @method Invitation|null findOneBy(array $criteria, array $orderBy = null)
 * @method Invitation[]    findAll()
 * @method Invitation[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class InvitationRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Invitation::class);
    }

    /**
     * Find all invitations for a wedding
     */
    public function findByWedding(Wedding $wedding): array
    {
        return $this->findBy(['wedding' => $wedding], ['createdAt' => 'DESC']);
    }

    /**
     * Find all invitations for a guest
     */
    public function findByGuest(User $guest): array
    {
        return $this->findBy(['guest' => $guest], ['createdAt' => 'DESC']);
    }

    /**
     * Find all invitations with RSVP submitted
     */
    public function findWithRsvp(Wedding $wedding): array
    {
        return $this->findBy([
            'wedding' => $wedding,
            'isRsvpSubmitted' => true
        ], ['updatedAt' => 'DESC']);
    }

    /**
     * Find all invitations without RSVP submitted
     */
    public function findWithoutRsvp(Wedding $wedding): array
    {
        return $this->findBy([
            'wedding' => $wedding,
            'isRsvpSubmitted' => false
        ], ['createdAt' => 'DESC']);
    }

    /**
     * Find invitation by wedding and guest
     */
    public function findOneByWeddingAndGuest(Wedding $wedding, User $guest): ?Invitation
    {
        return $this->findOneBy([
            'wedding' => $wedding,
            'guest' => $guest
        ]);
    }

    /**
     * Count total invitations for a wedding
     */
    public function countByWedding(Wedding $wedding): int
    {
        return $this->count(['wedding' => $wedding]);
    }

    /**
     * Count RSVP responses for a wedding
     */
    public function countRsvpResponses(Wedding $wedding): int
    {
        return $this->count([
            'wedding' => $wedding,
            'isRsvpSubmitted' => true
        ]);
    }
} 