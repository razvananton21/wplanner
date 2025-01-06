<?php

namespace App\Repository;

use App\Entity\Wedding;
use App\Entity\WeddingFormField;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<WeddingFormField>
 *
 * @method WeddingFormField|null find($id, $lockMode = null, $lockVersion = null)
 * @method WeddingFormField|null findOneBy(array $criteria, array $orderBy = null)
 * @method WeddingFormField[]    findAll()
 * @method WeddingFormField[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class WeddingFormFieldRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, WeddingFormField::class);
    }

    /**
     * @return WeddingFormField[] Returns an array of WeddingFormField objects
     */
    public function findByWedding(Wedding $wedding): array
    {
        return $this->createQueryBuilder('f')
            ->andWhere('f.wedding = :wedding')
            ->andWhere('f.deletedAt IS NULL')
            ->setParameter('wedding', $wedding)
            ->orderBy('f.displayOrder', 'ASC')
            ->getQuery()
            ->getResult();
    }

    public function findByWeddingAndDisplayOrder(Wedding $wedding, int $displayOrder): ?WeddingFormField
    {
        return $this->createQueryBuilder('f')
            ->andWhere('f.wedding = :wedding')
            ->andWhere('f.displayOrder = :displayOrder')
            ->andWhere('f.deletedAt IS NULL')
            ->setParameter('wedding', $wedding)
            ->setParameter('displayOrder', $displayOrder)
            ->getQuery()
            ->getOneOrNullResult();
    }
} 