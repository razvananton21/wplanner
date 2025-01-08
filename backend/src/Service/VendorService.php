<?php

namespace App\Service;

use App\Entity\Vendor;
use App\Entity\Wedding;
use App\Repository\VendorRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class VendorService
{
    public function __construct(
        private readonly VendorRepository $vendorRepository,
        private readonly FileService $fileService,
        private readonly BudgetService $budgetService,
        private readonly EntityManagerInterface $entityManager
    ) {
    }

    public function createVendor(Wedding $wedding, array $data): Vendor
    {
        $vendor = new Vendor();
        $vendor->setWedding($wedding);
        $this->updateVendorData($vendor, $data);

        $this->entityManager->persist($vendor);
        $this->entityManager->flush();

        // Create expense entries if there's a budget
        if ($wedding->getBudget() && ($vendor->getPrice() || $vendor->getDepositAmount())) {
            $this->budgetService->createExpenseFromVendor($vendor);
        }

        return $vendor;
    }

    public function updateVendor(Vendor $vendor, array $data): Vendor
    {
        $this->updateVendorData($vendor, $data);
        $this->entityManager->flush();

        // Update expense entries if there's a budget
        if ($vendor->getWedding()->getBudget() && ($vendor->getPrice() || $vendor->getDepositAmount())) {
            $this->budgetService->createExpenseFromVendor($vendor);
        }

        return $vendor;
    }

    private function updateVendorData(Vendor $vendor, array $data): void
    {
        if (isset($data['name'])) {
            $vendor->setName($data['name']);
        }
        if (array_key_exists('company', $data)) {
            $vendor->setCompany($data['company']);
        }
        if (isset($data['type'])) {
            $vendor->setType($data['type']);
        }
        if (isset($data['status'])) {
            $vendor->setStatus($data['status']);
        }
        if (array_key_exists('phone', $data)) {
            $vendor->setPhone($data['phone']);
        }
        if (array_key_exists('email', $data)) {
            $vendor->setEmail($data['email']);
        }
        if (array_key_exists('website', $data)) {
            $vendor->setWebsite($data['website']);
        }
        if (array_key_exists('address', $data)) {
            $vendor->setAddress($data['address']);
        }
        if (array_key_exists('notes', $data)) {
            $vendor->setNotes($data['notes']);
        }
        if (array_key_exists('price', $data)) {
            $vendor->setPrice($data['price']);
        }
        if (array_key_exists('depositAmount', $data)) {
            $vendor->setDepositAmount($data['depositAmount']);
        }
        if (array_key_exists('depositPaid', $data)) {
            $vendor->setDepositPaid($data['depositPaid']);
        }
        if (array_key_exists('contractSigned', $data)) {
            $vendor->setContractSigned($data['contractSigned']);
        }

        $vendor->setUpdatedAt(new \DateTimeImmutable());
    }

    public function uploadFile(Vendor $vendor, UploadedFile $file, string $type): string
    {
        return $this->fileService->uploadVendorFile($vendor, $file, $type);
    }

    public function deleteFile(Vendor $vendor, string $filename): void
    {
        $this->fileService->deleteVendorFile($vendor, $filename);
    }
} 