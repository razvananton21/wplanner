<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class HealthCheckController extends AbstractController
{
    #[Route('/healthz', name: 'health_check', methods: ['GET'])]
    public function check(): JsonResponse
    {
        error_log('Debug: Health check endpoint called');
        return new JsonResponse(['status' => 'ok']);
    }

    #[Route('/', name: 'index', methods: ['GET'])]
    public function index(): JsonResponse
    {
        error_log('Debug: Index endpoint called');
        return new JsonResponse(['message' => 'Wedding Planner API']);
    }

    #[Route('/debug', name: 'debug', methods: ['GET'])]
    public function debug(): JsonResponse
    {
        error_log('Debug: Debug endpoint called');
        return new JsonResponse([
            'env' => $_ENV,
            'server' => $_SERVER,
            'routes' => $this->container->get('router')->getRouteCollection()->all()
        ]);
    }
} 