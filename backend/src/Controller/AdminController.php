<?php

namespace App\Controller;

use App\Entity\Admin;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/admin', name: 'api_admin_')]
class AdminController extends AbstractController
{
    #[Route('/register', name: 'register', methods: ['POST'])]
    public function register(
        Request $request, 
        UserPasswordHasherInterface $passwordHasher,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        $admin = new Admin();
        $admin->setEmail($data['email']);
        $admin->setRoles(['ROLE_ADMIN']);

        $hashedPassword = $passwordHasher->hashPassword($admin, $data['password']);
        $admin->setPassword($hashedPassword);

        $entityManager->persist($admin);
        $entityManager->flush();

        return $this->json(['message' => 'Admin registered successfully']);
    }

    #[Route('/dashboard', name: 'dashboard', methods: ['GET'])]
    public function dashboard(): JsonResponse
    {
        return $this->json([
            'user' => $this->getUser(),
            'message' => 'Welcome to admin dashboard'
        ]);
    }
} 