<?php

namespace App\Repository;

use App\Entity\Task;
use App\Entity\Wedding;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Task>
 *
 * @method Task|null find($id, $lockMode = null, $lockVersion = null)
 * @method Task|null findOneBy(array $criteria, array $orderBy = null)
 * @method Task[]    findAll()
 * @method Task[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class TaskRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Task::class);
    }

    /**
     * @return Task[] Returns an array of Task objects for a specific wedding
     */
    public function findByWedding(Wedding $wedding): array
    {
        return $this->createQueryBuilder('t')
            ->andWhere('t.wedding = :wedding')
            ->setParameter('wedding', $wedding)
            ->orderBy('t.displayOrder', 'ASC')
            ->addOrderBy('t.dueDate', 'ASC')
            ->addOrderBy('t.priority', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * @return Task[] Returns an array of incomplete tasks for a wedding
     */
    public function findIncompleteByWedding(Wedding $wedding): array
    {
        return $this->createQueryBuilder('t')
            ->andWhere('t.wedding = :wedding')
            ->andWhere('t.isCompleted = :isCompleted')
            ->setParameter('wedding', $wedding)
            ->setParameter('isCompleted', false)
            ->orderBy('t.dueDate', 'ASC')
            ->addOrderBy('t.priority', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * @return Task[] Returns an array of tasks by category
     */
    public function findByWeddingAndCategory(Wedding $wedding, string $category): array
    {
        return $this->createQueryBuilder('t')
            ->andWhere('t.wedding = :wedding')
            ->andWhere('t.category = :category')
            ->setParameter('wedding', $wedding)
            ->setParameter('category', $category)
            ->orderBy('t.displayOrder', 'ASC')
            ->addOrderBy('t.dueDate', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * @return Task[] Returns an array of overdue tasks
     */
    public function findOverdueTasks(Wedding $wedding): array
    {
        return $this->createQueryBuilder('t')
            ->andWhere('t.wedding = :wedding')
            ->andWhere('t.isCompleted = :isCompleted')
            ->andWhere('t.dueDate < :now')
            ->setParameter('wedding', $wedding)
            ->setParameter('isCompleted', false)
            ->setParameter('now', new \DateTimeImmutable())
            ->orderBy('t.dueDate', 'ASC')
            ->addOrderBy('t.priority', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * @return Task[] Returns an array of upcoming tasks
     */
    public function findUpcomingTasks(Wedding $wedding, int $days = 7): array
    {
        $now = new \DateTimeImmutable();
        $future = $now->modify("+{$days} days");

        return $this->createQueryBuilder('t')
            ->andWhere('t.wedding = :wedding')
            ->andWhere('t.isCompleted = :isCompleted')
            ->andWhere('t.dueDate >= :now')
            ->andWhere('t.dueDate <= :future')
            ->setParameter('wedding', $wedding)
            ->setParameter('isCompleted', false)
            ->setParameter('now', $now)
            ->setParameter('future', $future)
            ->orderBy('t.dueDate', 'ASC')
            ->addOrderBy('t.priority', 'ASC')
            ->getQuery()
            ->getResult();
    }

    public function save(Task $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Task $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }
} 