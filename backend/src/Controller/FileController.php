<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api')]
class FileController extends AbstractController
{
    public function __construct(private string $uploadDir) {}

    #[Route('/uploads/{type}/{filename}', name: 'app_serve_file', methods: ['GET'])]
    public function serveFile(string $type, string $filename): Response
    {
        $filePath = $this->uploadDir . '/' . $type . '/' . $filename;

        if (!file_exists($filePath)) {
            throw $this->createNotFoundException('File not found');
        }

        return new BinaryFileResponse($filePath);
    }
} 