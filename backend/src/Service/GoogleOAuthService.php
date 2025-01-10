<?php

namespace App\Service;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Google\Client as GoogleClient;
use Symfony\Component\Security\Core\Exception\AuthenticationException;

class GoogleOAuthService
{
    private GoogleClient $googleClient;
    private EntityManagerInterface $entityManager;
    private UserRepository $userRepository;
    private TokenRefreshService $tokenRefreshService;

    public function __construct(
        EntityManagerInterface $entityManager,
        UserRepository $userRepository,
        TokenRefreshService $tokenRefreshService,
        string $googleClientId,
        string $googleClientSecret,
        string $googleCallbackUrl
    ) {
        $this->entityManager = $entityManager;
        $this->userRepository = $userRepository;
        $this->tokenRefreshService = $tokenRefreshService;
        
        error_log("Google OAuth Config - Client ID: " . $googleClientId);
        error_log("Google OAuth Config - Callback URL: " . $googleCallbackUrl);
        
        if (empty($googleCallbackUrl)) {
            throw new \InvalidArgumentException('Google callback URL cannot be empty');
        }

        if (!filter_var($googleCallbackUrl, FILTER_VALIDATE_URL)) {
            throw new \InvalidArgumentException('Google callback URL must be a valid absolute URL');
        }
        
        $this->googleClient = new GoogleClient();
        $this->googleClient->setClientId($googleClientId);
        $this->googleClient->setClientSecret($googleClientSecret);
        $this->googleClient->setRedirectUri($googleCallbackUrl);
        $this->googleClient->addScope('email');
        $this->googleClient->addScope('profile');
        $this->googleClient->setPrompt('select_account consent');
    }

    public function getAuthUrl(): string
    {
        $authUrl = $this->googleClient->createAuthUrl();
        error_log("Generated Auth URL: " . $authUrl);
        return $authUrl;
    }

    public function authenticateUser(string $code): array
    {
        $token = $this->googleClient->fetchAccessTokenWithAuthCode($code);
        
        if (!isset($token['access_token'])) {
            throw new AuthenticationException('Failed to get access token');
        }

        $this->googleClient->setAccessToken($token);
        $googleOAuth = $this->googleClient->verifyIdToken();

        if (!$googleOAuth) {
            throw new AuthenticationException('Invalid ID token');
        }

        $googleId = $googleOAuth['sub'];
        $email = $googleOAuth['email'];
        $firstName = $googleOAuth['given_name'] ?? '';
        $lastName = $googleOAuth['family_name'] ?? '';
        $picture = $googleOAuth['picture'] ?? null;

        $user = $this->userRepository->findOneBy(['googleId' => $googleId]);
        
        if (!$user) {
            $user = $this->userRepository->findOneBy(['email' => $email]);
            
            if (!$user) {
                $user = new User();
                $user->setEmail($email);
                $user->setRoles(['ROLE_USER']);
            }
            
            $user->setGoogleId($googleId);
        }

        $user->setFirstName($firstName);
        $user->setLastName($lastName);
        $user->setAvatar($picture);
        $user->setRefreshToken($token['refresh_token'] ?? null);
        
        if (isset($token['expires_in'])) {
            $expiresAt = new \DateTimeImmutable('now + ' . $token['expires_in'] . ' seconds');
            $user->setTokenExpiresAt($expiresAt);
        }

        $this->entityManager->persist($user);
        $this->entityManager->flush();

        return $this->tokenRefreshService->generateInitialTokens($user);
    }
} 