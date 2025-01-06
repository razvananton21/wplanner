<?php

namespace App\Controller;

use App\Entity\Wedding;
use App\Entity\Notification;
use App\Repository\NotificationRepository;
use App\Service\NotificationService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api')]
class NotificationController extends AbstractController
{
    public function __construct(
        private NotificationRepository $notificationRepository,
        private NotificationService $notificationService
    ) {}

    #[Route('/weddings/{id}/notifications', name: 'app_notifications_list', methods: ['GET'])]
    #[IsGranted('view', 'wedding')]
    public function list(Wedding $wedding): JsonResponse
    {
        $notifications = $this->notificationRepository->findByWedding($wedding);
        
        return $this->json([
            'data' => array_map(function(Notification $notification) {
                return [
                    'id' => $notification->getId(),
                    'type' => $notification->getType(),
                    'message' => $notification->getMessage(),
                    'isRead' => $notification->isRead(),
                    'createdAt' => $notification->getCreatedAt()->format('c'),
                    'readAt' => $notification->getReadAt()?->format('c'),
                    'guest' => [
                        'id' => $notification->getGuest()->getId(),
                        'firstName' => $notification->getGuest()->getFirstName(),
                        'lastName' => $notification->getGuest()->getLastName()
                    ]
                ];
            }, $notifications)
        ]);
    }

    #[Route('/notifications/{id}/read', name: 'app_notification_mark_read', methods: ['POST'])]
    #[IsGranted('view', 'notification.wedding')]
    public function markAsRead(Notification $notification): JsonResponse
    {
        $this->notificationService->markAsRead($notification);
        
        return $this->json(['message' => 'Notification marked as read']);
    }

    #[Route('/weddings/{id}/notifications/read-all', name: 'app_notifications_mark_all_read', methods: ['POST'])]
    #[IsGranted('view', 'wedding')]
    public function markAllAsRead(Wedding $wedding): JsonResponse
    {
        $this->notificationService->markAllAsRead($wedding);
        
        return $this->json(['message' => 'All notifications marked as read']);
    }
} 