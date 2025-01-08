<?php

namespace App\Repository;

use App\Entity\Vendor;
use App\Entity\Wedding;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Vendor>
 *
 * @method Vendor|null find($id, $lockMode = null, $lockVersion = null)
 * @method Vendor|null findOneBy(array $criteria, array $orderBy = null)
 * @method Vendor[]    findAll()
 * @method Vendor[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class VendorRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Vendor::class);
    }

    /**
     * Find all vendors for a specific wedding
     */
    public function findByWedding(Wedding $wedding): array
    {
        return $this->createQueryBuilder('v')
            ->andWhere('v.wedding = :wedding')
            ->setParameter('wedding', $wedding)
            ->orderBy('v.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Find vendors by type for a specific wedding
     */
    public function findByWeddingAndType(Wedding $wedding, string $type): array
    {
        return $this->createQueryBuilder('v')
            ->andWhere('v.wedding = :wedding')
            ->andWhere('v.type = :type')
            ->setParameter('wedding', $wedding)
            ->setParameter('type', $type)
            ->orderBy('v.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Find vendors by status for a specific wedding
     */
    public function findByWeddingAndStatus(Wedding $wedding, string $status): array
    {
        return $this->createQueryBuilder('v')
            ->andWhere('v.wedding = :wedding')
            ->andWhere('v.status = :status')
            ->setParameter('wedding', $wedding)
            ->setParameter('status', $status)
            ->orderBy('v.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }
} 