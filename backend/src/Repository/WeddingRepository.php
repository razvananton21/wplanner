<?php

namespace App\Repository;

use App\Entity\Wedding;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Wedding>
 *
 * @method Wedding|null find($id, $lockMode = null, $lockVersion = null)
 * @method Wedding|null findOneBy(array $criteria, array $orderBy = null)
 * @method Wedding[]    findAll()
 * @method Wedding[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class WeddingRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Wedding::class);
    }

    /**
     * Find weddings where the user is either an admin or a guest
     */
    public function findWeddingsForUser(User $user): array
    {
        $qb = $this->createQueryBuilder('w');
        
        return $qb
            ->leftJoin('w.invitations', 'i')
            ->where('w.admin = :user')
            ->orWhere('i.guest = :user')
            ->setParameter('user', $user)
            ->orderBy('w.date', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Find upcoming weddings where the user is either an admin or a guest
     */
    public function findUpcomingWeddingsForUser(User $user): array
    {
        $qb = $this->createQueryBuilder('w');
        
        return $qb
            ->leftJoin('w.invitations', 'i')
            ->where('w.admin = :user')
            ->orWhere('i.guest = :user')
            ->andWhere('w.date > :now')
            ->setParameter('user', $user)
            ->setParameter('now', new \DateTime())
            ->orderBy('w.date', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Find past weddings where the user is either an admin or a guest
     */
    public function findPastWeddingsForUser(User $user): array
    {
        $qb = $this->createQueryBuilder('w');
        
        return $qb
            ->leftJoin('w.invitations', 'i')
            ->where('w.admin = :user')
            ->orWhere('i.guest = :user')
            ->andWhere('w.date <= :now')
            ->setParameter('user', $user)
            ->setParameter('now', new \DateTime())
            ->orderBy('w.date', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Find weddings by language
     */
    public function findByLanguage(string $language): array
    {
        return $this->findBy(['language' => $language], ['date' => 'DESC']);
    }

    /**
     * Find weddings by venue
     */
    public function findByVenue(string $venue): array
    {
        return $this->findBy(['venue' => $venue], ['date' => 'DESC']);
    }
} 