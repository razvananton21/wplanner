<?php

namespace App\Repository;

use App\Entity\Photo;
use App\Entity\Wedding;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Photo>
 *
 * @method Photo|null find($id, $lockMode = null, $lockVersion = null)
 * @method Photo|null findOneBy(array $criteria, array $orderBy = null)
 * @method Photo[]    findAll()
 * @method Photo[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class PhotoRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Photo::class);
    }

    /**
     * Find all photos for a wedding
     */
    public function findByWedding(Wedding $wedding): array
    {
        return $this->findBy(['wedding' => $wedding], ['createdAt' => 'DESC']);
    }

    /**
     * Find all approved photos for a wedding
     */
    public function findApprovedByWedding(Wedding $wedding): array
    {
        return $this->findBy([
            'wedding' => $wedding,
            'isApproved' => true
        ], ['createdAt' => 'DESC']);
    }

    /**
     * Find all pending photos for a wedding
     */
    public function findPendingByWedding(Wedding $wedding): array
    {
        return $this->findBy([
            'wedding' => $wedding,
            'isApproved' => false
        ], ['createdAt' => 'DESC']);
    }

    /**
     * Find all photos uploaded by a user
     */
    public function findByUploader(User $user): array
    {
        return $this->findBy(['uploadedBy' => $user], ['createdAt' => 'DESC']);
    }

    /**
     * Count total photos for a wedding
     */
    public function countByWedding(Wedding $wedding): int
    {
        return $this->count(['wedding' => $wedding]);
    }

    /**
     * Count approved photos for a wedding
     */
    public function countApprovedByWedding(Wedding $wedding): int
    {
        return $this->count([
            'wedding' => $wedding,
            'isApproved' => true
        ]);
    }

    /**
     * Count pending photos for a wedding
     */
    public function countPendingByWedding(Wedding $wedding): int
    {
        return $this->count([
            'wedding' => $wedding,
            'isApproved' => false
        ]);
    }

    /**
     * Find photos by metadata criteria
     */
    public function findByMetadata(Wedding $wedding, array $criteria): array
    {
        $qb = $this->createQueryBuilder('p');
        
        $qb->where('p.wedding = :wedding')
           ->setParameter('wedding', $wedding);

        foreach ($criteria as $key => $value) {
            $qb->andWhere("JSON_EXTRACT(p.metadata, :path_{$key}) = :value_{$key}")
               ->setParameter("path_{$key}", "$.$key")
               ->setParameter("value_{$key}", $value);
        }

        return $qb->orderBy('p.createdAt', 'DESC')
                 ->getQuery()
                 ->getResult();
    }
} 