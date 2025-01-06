<?php

namespace App\Repository;

use App\Entity\Table;
use App\Entity\Wedding;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Table>
 *
 * @method Table|null find($id, $lockMode = null, $lockVersion = null)
 * @method Table|null findOneBy(array $criteria, array $orderBy = null)
 * @method Table[]    findAll()
 * @method Table[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class TableRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Table::class);
    }

    /**
     * Find all tables for a wedding
     */
    public function findByWedding(Wedding $wedding): array
    {
        return $this->findBy(['wedding' => $wedding], ['name' => 'ASC']);
    }

    /**
     * Find tables with available seats
     */
    public function findTablesWithAvailableSeats(Wedding $wedding): array
    {
        $qb = $this->createQueryBuilder('t');
        
        return $qb
            ->leftJoin('t.guests', 'g')
            ->select('t', 'COUNT(g.id) as guestCount')
            ->where('t.wedding = :wedding')
            ->groupBy('t.id')
            ->having('guestCount < t.capacity')
            ->setParameter('wedding', $wedding)
            ->orderBy('t.name', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Find tables with specific capacity
     */
    public function findByCapacity(Wedding $wedding, int $capacity): array
    {
        return $this->findBy([
            'wedding' => $wedding,
            'capacity' => $capacity
        ], ['name' => 'ASC']);
    }

    /**
     * Count total tables for a wedding
     */
    public function countByWedding(Wedding $wedding): int
    {
        return $this->count(['wedding' => $wedding]);
    }

    /**
     * Count total available seats across all tables
     */
    public function countAvailableSeats(Wedding $wedding): int
    {
        $qb = $this->createQueryBuilder('t');
        
        $result = $qb
            ->select('SUM(t.capacity) as totalCapacity', 'COUNT(DISTINCT g.id) as totalGuests')
            ->leftJoin('t.guests', 'g')
            ->where('t.wedding = :wedding')
            ->setParameter('wedding', $wedding)
            ->getQuery()
            ->getOneOrNullResult();

        if (!$result) {
            return 0;
        }

        return $result['totalCapacity'] - $result['totalGuests'];
    }
} 