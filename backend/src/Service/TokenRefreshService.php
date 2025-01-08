<?php

namespace App\Service;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use DateTimeImmutable;

class TokenRefreshService
{
    private $jwtManager;
    private $entityManager;
    private $userRepository;
    private $tokenTTL;

    public function __construct(
        JWTTokenManagerInterface $jwtManager,
        EntityManagerInterface $entityManager,
        UserRepository $userRepository,
        int $tokenTTL = 3600 // 1 hour by default
    ) {
        $this->jwtManager = $jwtManager;
        $this->entityManager = $entityManager;
        $this->userRepository = $userRepository;
        $this->tokenTTL = $tokenTTL;
    }

    public function refreshToken(string $refreshToken): array
    {
        $user = $this->userRepository->findOneBy(['refreshToken' => $refreshToken]);

        if (!$user) {
            throw new AuthenticationException('Invalid refresh token');
        }

        if ($this->isTokenExpired($user)) {
            throw new AuthenticationException('Refresh token has expired');
        }

        // Generate new tokens
        $token = $this->jwtManager->create($user);
        $newRefreshToken = bin2hex(random_bytes(32));

        // Update user with new refresh token and expiration
        $user->setRefreshToken($newRefreshToken);
        $user->setTokenExpiresAt(new DateTimeImmutable('+' . $this->tokenTTL . ' seconds'));
        $user->setUpdatedAt(new DateTimeImmutable());

        $this->entityManager->persist($user);
        $this->entityManager->flush();

        return [
            'token' => $token,
            'refresh_token' => $newRefreshToken,
            'expires_in' => $this->tokenTTL
        ];
    }

    public function generateInitialTokens(User $user): array
    {
        $token = $this->jwtManager->create($user);
        $refreshToken = bin2hex(random_bytes(32));

        $user->setRefreshToken($refreshToken);
        $user->setTokenExpiresAt(new DateTimeImmutable('+' . $this->tokenTTL . ' seconds'));
        $user->setUpdatedAt(new DateTimeImmutable());

        $this->entityManager->persist($user);
        $this->entityManager->flush();

        return [
            'token' => $token,
            'refresh_token' => $refreshToken,
            'expires_in' => $this->tokenTTL
        ];
    }

    private function isTokenExpired(User $user): bool
    {
        $expiresAt = $user->getTokenExpiresAt();
        if (!$expiresAt) {
            return true;
        }

        return $expiresAt < new DateTimeImmutable();
    }
} 