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
        
        error_log("Google Client Configuration:");
        error_log("Redirect URI set to: " . $this->googleClient->getRedirectUri());
        error_log("Client ID set to: " . $this->googleClient->getClientId());
    }

    public function getAuthUrl(): string
    {
        $authUrl = $this->googleClient->createAuthUrl();
        error_log("Generated Auth URL: " . $authUrl);
        return $authUrl;
    }

    public function authenticateUser(string $code): array
    {
        error_log("Attempting to authenticate with code: " . substr($code, 0, 10) . "...");
        
        try {
            $token = $this->googleClient->fetchAccessTokenWithAuthCode($code);
            error_log("Token fetch response: " . json_encode($token));
            
            if (!isset($token['access_token'])) {
                error_log("Failed to get access token. Response: " . json_encode($token));
                throw new AuthenticationException('Failed to get access token');
            }

            $this->googleClient->setAccessToken($token);
            $googleOAuth = $this->googleClient->verifyIdToken();

            if (!$googleOAuth) {
                error_log("Invalid ID token received");
                throw new AuthenticationException('Invalid ID token');
            }

            error_log("Successfully verified ID token for user: " . ($googleOAuth['email'] ?? 'unknown'));
            
            $googleId = $googleOAuth['sub'];
            $email = $googleOAuth['email'];
            $firstName = $googleOAuth['given_name'] ?? '';
            $lastName = $googleOAuth['family_name'] ?? '';
            $picture = $googleOAuth['picture'] ?? null;

            $user = $this->userRepository->findOneBy(['googleId' => $googleId]);
            
            if (!$user) {
                $user = $this->userRepository->findOneBy(['email' => $email]);
                
                if (!$user) {
                    error_log("Creating new user for email: " . $email);
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

            error_log("User successfully authenticated and saved: " . $email);
            
            return $this->tokenRefreshService->generateInitialTokens($user);
            
        } catch (\Exception $e) {
            error_log("Error during authentication: " . $e->getMessage());
            error_log("Stack trace: " . $e->getTraceAsString());
            throw $e;
        }
    }
} 