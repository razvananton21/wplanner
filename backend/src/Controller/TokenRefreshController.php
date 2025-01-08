<?php

namespace App\Controller;

use App\Service\TokenRefreshService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Exception\AuthenticationException;

class TokenRefreshController extends AbstractController
{
    private $tokenRefreshService;

    public function __construct(TokenRefreshService $tokenRefreshService)
    {
        $this->tokenRefreshService = $tokenRefreshService;
    }

    #[Route('/api/auth/refresh', name: 'api_token_refresh', methods: ['POST'])]
    public function refresh(Request $request): JsonResponse
    {
        try {
            $content = json_decode($request->getContent(), true);
            $refreshToken = $content['refresh_token'] ?? null;

            if (!$refreshToken) {
                throw new AuthenticationException('Refresh token is required');
            }

            $tokens = $this->tokenRefreshService->refreshToken($refreshToken);

            return $this->json($tokens);
        } catch (AuthenticationException $e) {
            return $this->json(['error' => $e->getMessage()], 401);
        } catch (\Exception $e) {
            return $this->json(['error' => 'An error occurred while refreshing the token'], 500);
        }
    }
} 