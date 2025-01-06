<?php

namespace App\Repository;

use App\Entity\Notification;
use App\Entity\Wedding;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Notification>
 *
 * @method Notification|null find($id, $lockMode = null, $lockVersion = null)
 * @method Notification|null findOneBy(array $criteria, array $orderBy = null)
 * @method Notification[]    findAll()
 * @method Notification[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class NotificationRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Notification::class);
    }

    /**
     * @return Notification[] Returns an array of unread Notification objects for a wedding
     */
    public function findUnreadByWedding(Wedding $wedding): array
    {
        return $this->createQueryBuilder('n')
            ->andWhere('n.wedding = :wedding')
            ->andWhere('n.isRead = :isRead')
            ->setParameter('wedding', $wedding)
            ->setParameter('isRead', false)
            ->orderBy('n.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * @return Notification[] Returns an array of all Notification objects for a wedding
     */
    public function findByWedding(Wedding $wedding): array
    {
        return $this->createQueryBuilder('n')
            ->andWhere('n.wedding = :wedding')
            ->setParameter('wedding', $wedding)
            ->orderBy('n.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }
} 