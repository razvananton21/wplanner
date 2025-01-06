<?php

namespace App\Repository;

use App\Entity\GuestResponse;
use App\Entity\Guest;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<GuestResponse>
 *
 * @method GuestResponse|null find($id, $lockMode = null, $lockVersion = null)
 * @method GuestResponse|null findOneBy(array $criteria, array $orderBy = null)
 * @method GuestResponse[]    findAll()
 * @method GuestResponse[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class GuestResponseRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, GuestResponse::class);
    }

    /**
     * @return GuestResponse[] Returns an array of GuestResponse objects
     */
    public function findByGuest(Guest $guest): array
    {
        return $this->createQueryBuilder('r')
            ->andWhere('r.guest = :guest')
            ->setParameter('guest', $guest)
            ->orderBy('r.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }
} 