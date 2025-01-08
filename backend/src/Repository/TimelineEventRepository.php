<?php

namespace App\Repository;

use App\Entity\TimelineEvent;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<TimelineEvent>
 *
 * @method TimelineEvent|null find($id, $lockMode = null, $lockVersion = null)
 * @method TimelineEvent|null findOneBy(array $criteria, array $orderBy = null)
 * @method TimelineEvent[]    findAll()
 * @method TimelineEvent[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class TimelineEventRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, TimelineEvent::class);
    }

    /**
     * Find all timeline events for a specific wedding ordered by start time
     */
    public function findByWeddingOrderedByStartTime(int $weddingId): array
    {
        return $this->createQueryBuilder('t')
            ->andWhere('t.wedding = :weddingId')
            ->setParameter('weddingId', $weddingId)
            ->orderBy('t.startTime', 'ASC')
            ->getQuery()
            ->getResult();
    }
} 