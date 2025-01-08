<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use App\Service\TokenRefreshService;
use App\Service\GoogleOAuthService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;

#[Route('/api/auth')]
class AuthController extends AbstractController
{
    private GoogleOAuthService $googleOAuthService;
    private TokenRefreshService $tokenRefreshService;

    public function __construct(
        TokenRefreshService $tokenRefreshService,
        GoogleOAuthService $googleOAuthService
    ) {
        $this->tokenRefreshService = $tokenRefreshService;
        $this->googleOAuthService = $googleOAuthService;
    }

    #[Route('/register', name: 'app_auth_register', methods: ['POST'])]
    public function register(
        Request $request,
        UserPasswordHasherInterface $passwordHasher,
        EntityManagerInterface $entityManager,
        ValidatorInterface $validator
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['email']) || !isset($data['password']) || !isset($data['firstName']) || !isset($data['lastName'])) {
            return $this->json([
                'message' => 'Missing required fields',
            ], Response::HTTP_BAD_REQUEST);
        }

        // Create a new user
        $user = new User();
        $user->setEmail($data['email']);
        $user->setFirstName($data['firstName']);
        $user->setLastName($data['lastName']);

        // Hash the password
        $hashedPassword = $passwordHasher->hashPassword($user, $data['password']);
        $user->setPassword($hashedPassword);

        // Validate the user entity
        $errors = $validator->validate($user);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[] = $error->getMessage();
            }
            return $this->json([
                'message' => 'Validation failed',
                'errors' => $errorMessages,
            ], Response::HTTP_BAD_REQUEST);
        }

        // Check if user already exists
        $existingUser = $entityManager->getRepository(User::class)->findOneBy(['email' => $data['email']]);
        if ($existingUser) {
            return $this->json([
                'message' => 'User already exists',
            ], Response::HTTP_CONFLICT);
        }

        // Set default role
        $user->setRoles(['ROLE_USER']);

        // Save the user
        $entityManager->persist($user);
        $entityManager->flush();

        return $this->json([
            'message' => 'User registered successfully',
            'user' => [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'firstName' => $user->getFirstName(),
                'lastName' => $user->getLastName(),
                'roles' => $user->getRoles(),
            ],
        ], Response::HTTP_CREATED);
    }

    #[Route('/google/url', name: 'app_auth_google_url', methods: ['GET'])]
    public function getGoogleAuthUrl(): JsonResponse
    {
        return new JsonResponse([
            'url' => $this->googleOAuthService->getAuthUrl()
        ]);
    }

    #[Route('/google/callback', name: 'app_auth_google_callback', methods: ['POST'])]
    public function handleGoogleCallback(Request $request): JsonResponse
    {
        try {
            $payload = json_decode($request->getContent(), true);
            $code = $payload['code'] ?? null;

            if (!$code) {
                throw new AuthenticationException('No authorization code provided');
            }

            $tokens = $this->googleOAuthService->authenticateUser($code);
            return new JsonResponse($tokens);

        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], Response::HTTP_UNAUTHORIZED);
        }
    }
} 