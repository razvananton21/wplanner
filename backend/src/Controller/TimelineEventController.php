<?php

namespace App\Controller;

use App\Entity\TimelineEvent;
use App\Entity\Wedding;
use App\Repository\TimelineEventRepository;
use App\Repository\WeddingRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/weddings/{weddingId}/timeline')]
class TimelineEventController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private WeddingRepository $weddingRepository,
        private TimelineEventRepository $timelineEventRepository
    ) {}

    private function getWedding(int $weddingId): Wedding
    {
        $wedding = $this->weddingRepository->find($weddingId);
        if (!$wedding) {
            throw $this->createNotFoundException('Wedding not found');
        }
        return $wedding;
    }

    #[Route('', methods: ['GET'])]
    public function getTimelineEvents(int $weddingId): JsonResponse
    {
        $wedding = $this->getWedding($weddingId);
        $this->denyAccessUnlessGranted('view', $wedding);

        $events = $this->timelineEventRepository->findByWeddingOrderedByStartTime($wedding->getId());
        
        return $this->json([
            'events' => $events
        ], Response::HTTP_OK, [], ['groups' => ['timeline:read']]);
    }

    #[Route('', methods: ['POST'])]
    public function createTimelineEvent(Request $request, int $weddingId): JsonResponse
    {
        $wedding = $this->getWedding($weddingId);
        $this->denyAccessUnlessGranted('edit', $wedding);

        $data = json_decode($request->getContent(), true);

        $event = new TimelineEvent();
        $event->setWedding($wedding)
            ->setTitle($data['title'])
            ->setDescription($data['description'] ?? null)
            ->setStartTime(new \DateTimeImmutable($data['startTime']))
            ->setType($data['type']);

        if (isset($data['endTime'])) {
            $event->setEndTime(new \DateTimeImmutable($data['endTime']));
        }

        $this->entityManager->persist($event);
        $this->entityManager->flush();

        return $this->json([
            'event' => $event
        ], Response::HTTP_CREATED, [], ['groups' => ['timeline:read']]);
    }

    #[Route('/{id}', methods: ['PUT'])]
    public function updateTimelineEvent(Request $request, int $weddingId, int $id): JsonResponse
    {
        $wedding = $this->getWedding($weddingId);
        $this->denyAccessUnlessGranted('edit', $wedding);

        $event = $this->timelineEventRepository->findOneBy([
            'id' => $id,
            'wedding' => $wedding
        ]);

        if (!$event) {
            return $this->json(['error' => 'Timeline event not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['title'])) {
            $event->setTitle($data['title']);
        }
        if (isset($data['description'])) {
            $event->setDescription($data['description']);
        }
        if (isset($data['startTime'])) {
            $event->setStartTime(new \DateTimeImmutable($data['startTime']));
        }
        if (isset($data['endTime'])) {
            $event->setEndTime(new \DateTimeImmutable($data['endTime']));
        }
        if (isset($data['type'])) {
            $event->setType($data['type']);
        }

        $event->setUpdatedAt(new \DateTimeImmutable());
        $this->entityManager->flush();

        return $this->json([
            'event' => $event
        ], Response::HTTP_OK, [], ['groups' => ['timeline:read']]);
    }

    #[Route('/{id}', methods: ['DELETE'])]
    public function deleteTimelineEvent(int $weddingId, int $id): JsonResponse
    {
        $wedding = $this->getWedding($weddingId);
        $this->denyAccessUnlessGranted('edit', $wedding);

        $event = $this->timelineEventRepository->findOneBy([
            'id' => $id,
            'wedding' => $wedding
        ]);

        if (!$event) {
            return $this->json(['error' => 'Timeline event not found'], Response::HTTP_NOT_FOUND);
        }

        $this->entityManager->remove($event);
        $this->entityManager->flush();

        return $this->json(null, Response::HTTP_NO_CONTENT);
    }
} 