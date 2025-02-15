<?php

namespace App\Controller;

use App\Entity\Vendor;
use App\Entity\VendorFile;
use App\Entity\Wedding;
use App\Repository\VendorRepository;
use App\Repository\WeddingRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\String\Slugger\SluggerInterface;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use App\Service\VendorService;

#[Route('/api/weddings/{weddingId}/vendors')]
class VendorController extends AbstractController
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly WeddingRepository $weddingRepository,
        private readonly VendorRepository $vendorRepository,
        private readonly VendorService $vendorService,
        private readonly string $uploadDir,
        private readonly SluggerInterface $slugger
    ) {}

    private function getWedding(int $weddingId): Wedding
    {
        $wedding = $this->weddingRepository->find($weddingId);
        if (!$wedding) {
            throw $this->createNotFoundException('Wedding not found');
        }
        return $wedding;
    }

    #[Route('', methods: ['GET'])]
    public function getVendors(int $weddingId): JsonResponse
    {
        $wedding = $this->getWedding($weddingId);
        $this->denyAccessUnlessGranted('view', $wedding);

        $vendors = $this->vendorRepository->findByWedding($wedding);
        
        return $this->json([
            'vendors' => $vendors
        ], Response::HTTP_OK, [], ['groups' => ['vendor:read']]);
    }

    #[Route('', methods: ['POST'])]
    public function createVendor(Request $request, int $weddingId): JsonResponse
    {
        $wedding = $this->getWedding($weddingId);
        $this->denyAccessUnlessGranted('edit', $wedding);

        $data = json_decode($request->getContent(), true);
        $vendor = $this->vendorService->createVendor($wedding, $data);

        return $this->json([
            'vendor' => $vendor
        ], Response::HTTP_CREATED, [], ['groups' => ['vendor:read']]);
    }

    #[Route('/{id}', methods: ['GET'])]
    public function getVendor(int $weddingId, int $id): JsonResponse
    {
        $wedding = $this->getWedding($weddingId);
        $this->denyAccessUnlessGranted('view', $wedding);

        $vendor = $this->vendorRepository->findOneBy([
            'id' => $id,
            'wedding' => $wedding
        ]);

        if (!$vendor) {
            return $this->json(['error' => 'Vendor not found'], Response::HTTP_NOT_FOUND);
        }

        return $this->json([
            'vendor' => $vendor
        ], Response::HTTP_OK, [], ['groups' => ['vendor:read']]);
    }

    #[Route('/{id}', methods: ['PUT'])]
    public function updateVendor(Request $request, int $weddingId, int $id): JsonResponse
    {
        $wedding = $this->getWedding($weddingId);
        $this->denyAccessUnlessGranted('edit', $wedding);

        $vendor = $this->vendorRepository->findOneBy([
            'id' => $id,
            'wedding' => $wedding
        ]);

        if (!$vendor) {
            return $this->json(['error' => 'Vendor not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);
        $vendor = $this->vendorService->updateVendor($vendor, $data);

        return $this->json([
            'vendor' => $vendor
        ], Response::HTTP_OK, [], ['groups' => ['vendor:read']]);
    }

    #[Route('/{id}', methods: ['DELETE'])]
    public function deleteVendor(int $weddingId, int $id): JsonResponse
    {
        $wedding = $this->getWedding($weddingId);
        $this->denyAccessUnlessGranted('edit', $wedding);

        $vendor = $this->vendorRepository->findOneBy([
            'id' => $id,
            'wedding' => $wedding
        ]);

        if (!$vendor) {
            return $this->json(['error' => 'Vendor not found'], Response::HTTP_NOT_FOUND);
        }

        $this->entityManager->remove($vendor);
        $this->entityManager->flush();

        return $this->json(null, Response::HTTP_NO_CONTENT);
    }

    #[Route('/{id}/files', methods: ['POST'])]
    public function uploadFile(Request $request, int $weddingId, int $id): JsonResponse
    {
        $wedding = $this->getWedding($weddingId);
        $this->denyAccessUnlessGranted('edit', $wedding);

        $vendor = $this->vendorRepository->findOneBy([
            'id' => $id,
            'wedding' => $wedding
        ]);

        if (!$vendor) {
            return $this->json(['error' => 'Vendor not found'], Response::HTTP_NOT_FOUND);
        }

        $uploadedFile = $request->files->get('file');
        if (!$uploadedFile) {
            return $this->json(['error' => 'No file uploaded'], Response::HTTP_BAD_REQUEST);
        }

        $originalFilename = pathinfo($uploadedFile->getClientOriginalName(), PATHINFO_FILENAME);
        $safeFilename = $this->slugger->slug($originalFilename);
        $newFilename = $safeFilename.'-'.uniqid().'.'.$uploadedFile->guessExtension();

        try {
            $uploadedFile->move(
                $this->uploadDir,
                $newFilename
            );

            $vendorFile = new VendorFile();
            $vendorFile->setVendor($vendor)
                ->setFilename($newFilename)
                ->setOriginalFilename($uploadedFile->getClientOriginalName())
                ->setMimeType($uploadedFile->getMimeType())
                ->setSize($uploadedFile->getSize())
                ->setType($request->request->get('type', 'document'));

            $this->entityManager->persist($vendorFile);
            $this->entityManager->flush();

            return $this->json([
                'file' => $vendorFile
            ], Response::HTTP_CREATED, [], ['groups' => ['vendor:read']]);

        } catch (FileException $e) {
            return $this->json(['error' => 'Failed to upload file'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/{id}/files/{fileId}', methods: ['DELETE'])]
    public function deleteFile(int $weddingId, int $id, int $fileId): JsonResponse
    {
        $wedding = $this->getWedding($weddingId);
        $this->denyAccessUnlessGranted('edit', $wedding);

        $vendor = $this->vendorRepository->findOneBy([
            'id' => $id,
            'wedding' => $wedding
        ]);

        if (!$vendor) {
            return $this->json(['error' => 'Vendor not found'], Response::HTTP_NOT_FOUND);
        }

        $file = $this->entityManager->getRepository(VendorFile::class)->findOneBy([
            'id' => $fileId,
            'vendor' => $vendor
        ]);

        if (!$file) {
            return $this->json(['error' => 'File not found'], Response::HTTP_NOT_FOUND);
        }

        // Delete physical file
        $filePath = $this->uploadDir.'/'.$file->getFilename();
        if (file_exists($filePath)) {
            unlink($filePath);
        }

        $this->entityManager->remove($file);
        $this->entityManager->flush();

        return $this->json(null, Response::HTTP_NO_CONTENT);
    }
} 