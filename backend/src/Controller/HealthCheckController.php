<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class HealthCheckController extends AbstractController
{
    #[Route('/healthz', name: 'health_check')]
    public function check(): JsonResponse
    {
        return new JsonResponse(['status' => 'ok']);
    }
} 