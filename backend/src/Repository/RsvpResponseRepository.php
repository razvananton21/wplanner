<?php

namespace App\Repository;

use App\Entity\RsvpResponse;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<RsvpResponse>
 *
 * @method RsvpResponse|null find($id, $lockMode = null, $lockVersion = null)
 * @method RsvpResponse|null findOneBy(array $criteria, array $orderBy = null)
 * @method RsvpResponse[]    findAll()
 * @method RsvpResponse[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class RsvpResponseRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, RsvpResponse::class);
    }
} 