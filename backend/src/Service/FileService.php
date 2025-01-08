<?php

namespace App\Service;

use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\String\Slugger\SluggerInterface;

class FileService
{
    public function __construct(
        private readonly string $uploadDir,
        private readonly SluggerInterface $slugger
    ) {}

    public function upload(UploadedFile $file, string $directory = ''): string
    {
        $originalFilename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $safeFilename = $this->slugger->slug($originalFilename);
        $fileName = $safeFilename . '-' . uniqid() . '.' . $file->guessExtension();

        $targetDir = rtrim($this->uploadDir, '/') . '/' . trim($directory, '/');
        if (!empty($directory) && !is_dir($targetDir)) {
            mkdir($targetDir, 0777, true);
        }

        $file->move($targetDir, $fileName);

        return $fileName;
    }

    public function delete(string $filename, string $directory = ''): bool
    {
        $filePath = rtrim($this->uploadDir, '/') . '/' . trim($directory, '/') . '/' . $filename;
        if (file_exists($filePath)) {
            return unlink($filePath);
        }
        return false;
    }
} 