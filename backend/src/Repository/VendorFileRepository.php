<?php

namespace App\Repository;

use App\Entity\VendorFile;
use App\Entity\Vendor;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<VendorFile>
 *
 * @method VendorFile|null find($id, $lockMode = null, $lockVersion = null)
 * @method VendorFile|null findOneBy(array $criteria, array $orderBy = null)
 * @method VendorFile[]    findAll()
 * @method VendorFile[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class VendorFileRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, VendorFile::class);
    }

    /**
     * Find all files for a specific vendor
     */
    public function findByVendor(Vendor $vendor): array
    {
        return $this->createQueryBuilder('f')
            ->andWhere('f.vendor = :vendor')
            ->setParameter('vendor', $vendor)
            ->orderBy('f.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Find files by type for a specific vendor
     */
    public function findByVendorAndType(Vendor $vendor, string $type): array
    {
        return $this->createQueryBuilder('f')
            ->andWhere('f.vendor = :vendor')
            ->andWhere('f.type = :type')
            ->setParameter('vendor', $vendor)
            ->setParameter('type', $type)
            ->orderBy('f.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }
} 