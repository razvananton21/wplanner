<?php

namespace App\Repository;

use App\Entity\Guest;
use App\Entity\Wedding;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Guest>
 *
 * @method Guest|null find($id, $lockMode = null, $lockVersion = null)
 * @method Guest|null findOneBy(array $criteria, array $orderBy = null)
 * @method Guest[]    findAll()
 * @method Guest[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class GuestRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Guest::class);
    }

    public function findByWedding(Wedding $wedding)
    {
        return $this->createQueryBuilder('g')
            ->andWhere('g.wedding = :wedding')
            ->andWhere('g.deletedAt IS NULL')
            ->setParameter('wedding', $wedding)
            ->orderBy('g.lastName', 'ASC')
            ->addOrderBy('g.firstName', 'ASC')
            ->getQuery()
            ->getResult();
    }

    public function findByRsvpToken(string $token): ?Guest
    {
        return $this->createQueryBuilder('g')
            ->andWhere('g.rsvpToken = :token')
            ->andWhere('g.deletedAt IS NULL')
            ->setParameter('token', $token)
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function findByWeddingAndStatus(Wedding $wedding, string $status)
    {
        return $this->createQueryBuilder('g')
            ->andWhere('g.wedding = :wedding')
            ->andWhere('g.status = :status')
            ->andWhere('g.deletedAt IS NULL')
            ->setParameter('wedding', $wedding)
            ->setParameter('status', $status)
            ->getQuery()
            ->getResult();
    }

    public function findByWeddingAndTable(Wedding $wedding, ?int $tableId)
    {
        $qb = $this->createQueryBuilder('g')
            ->andWhere('g.wedding = :wedding')
            ->andWhere('g.deletedAt IS NULL')
            ->setParameter('wedding', $wedding);

        if ($tableId === null) {
            $qb->andWhere('g.table IS NULL');
        } else {
            $qb->andWhere('g.table = :tableId')
                ->setParameter('tableId', $tableId);
        }

        return $qb->getQuery()->getResult();
    }
} 