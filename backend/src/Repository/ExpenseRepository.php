<?php

namespace App\Repository;

use App\Entity\Expense;
use App\Entity\Wedding;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Expense>
 *
 * @method Expense|null find($id, $lockMode = null, $lockVersion = null)
 * @method Expense|null findOneBy(array $criteria, array $orderBy = null)
 * @method Expense[]    findAll()
 * @method Expense[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ExpenseRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Expense::class);
    }

    public function save(Expense $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Expense $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    /**
     * Find all expenses for a wedding through its budget
     */
    public function findByWedding(Wedding $wedding): array
    {
        return $this->createQueryBuilder('e')
            ->join('e.budget', 'b')
            ->where('b.wedding = :wedding')
            ->setParameter('wedding', $wedding)
            ->orderBy('e.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Find all vendor expenses for a wedding
     */
    public function findVendorExpensesByWedding(Wedding $wedding): array
    {
        return $this->createQueryBuilder('e')
            ->join('e.budget', 'b')
            ->where('b.wedding = :wedding')
            ->andWhere('e.isVendorExpense = true')
            ->setParameter('wedding', $wedding)
            ->orderBy('e.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Find expenses by category for a wedding
     */
    public function findByWeddingAndCategory(Wedding $wedding, string $category): array
    {
        return $this->createQueryBuilder('e')
            ->join('e.budget', 'b')
            ->where('b.wedding = :wedding')
            ->andWhere('e.category = :category')
            ->setParameter('wedding', $wedding)
            ->setParameter('category', $category)
            ->orderBy('e.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }
} 