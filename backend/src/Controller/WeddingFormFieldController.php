<?php

namespace App\Controller;

use App\Entity\Wedding;
use App\Entity\WeddingFormField;
use App\Repository\WeddingFormFieldRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api')]
class WeddingFormFieldController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private WeddingFormFieldRepository $formFieldRepository,
        private ValidatorInterface $validator
    ) {}

    #[Route('/weddings/{id}/rsvp-form', name: 'app_wedding_form_fields_list', methods: ['GET'])]
    #[IsGranted('view', 'wedding')]
    public function list(Wedding $wedding): JsonResponse
    {
        $fields = $this->formFieldRepository->findByWedding($wedding);
        return $this->json([
            'data' => array_map(fn($field) => $field->toArray(), $fields)
        ]);
    }

    #[Route('/weddings/{id}/rsvp-form', name: 'app_wedding_form_fields_create', methods: ['POST'])]
    #[IsGranted('edit', 'wedding')]
    public function create(Wedding $wedding, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        $field = new WeddingFormField();
        $field->setWedding($wedding)
            ->setLabel($data['label'])
            ->setType($data['type'])
            ->setRequired($data['required'] ?? false)
            ->setDisplayOrder($data['displayOrder'] ?? 0)
            ->setPlaceholder($data['placeholder'] ?? null)
            ->setHelpText($data['helpText'] ?? null)
            ->setSection($data['section'] ?? 'general');

        if (isset($data['options'])) {
            $field->setOptions($data['options']);
        }

        $errors = $this->validator->validate($field);
        if (count($errors) > 0) {
            return $this->json(['errors' => (string) $errors], Response::HTTP_BAD_REQUEST);
        }

        $this->entityManager->persist($field);
        $this->entityManager->flush();

        return $this->json([
            'data' => $field->toArray()
        ], Response::HTTP_CREATED);
    }

    #[Route('/weddings/{id}/rsvp-form/{fieldId}', name: 'app_wedding_form_fields_update', methods: ['PUT'])]
    #[IsGranted('edit', 'wedding')]
    public function update(Wedding $wedding, int $fieldId, Request $request): JsonResponse
    {
        $field = $this->formFieldRepository->find($fieldId);
        if (!$field || $field->getWedding() !== $wedding) {
            throw $this->createNotFoundException('Form field not found in this wedding');
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['label'])) {
            $field->setLabel($data['label']);
        }
        if (isset($data['type'])) {
            $field->setType($data['type']);
        }
        if (isset($data['required'])) {
            $field->setRequired($data['required']);
        }
        if (isset($data['displayOrder'])) {
            $field->setDisplayOrder($data['displayOrder']);
        }
        if (isset($data['placeholder'])) {
            $field->setPlaceholder($data['placeholder']);
        }
        if (isset($data['helpText'])) {
            $field->setHelpText($data['helpText']);
        }
        if (isset($data['options'])) {
            $field->setOptions($data['options']);
        }
        if (isset($data['section'])) {
            $field->setSection($data['section']);
        }

        $errors = $this->validator->validate($field);
        if (count($errors) > 0) {
            return $this->json(['errors' => (string) $errors], Response::HTTP_BAD_REQUEST);
        }

        $this->entityManager->flush();

        return $this->json([
            'data' => $field->toArray()
        ]);
    }

    #[Route('/weddings/{id}/rsvp-form/{fieldId}', name: 'app_wedding_form_fields_delete', methods: ['DELETE'])]
    #[IsGranted('edit', 'wedding')]
    public function delete(Wedding $wedding, int $fieldId): JsonResponse
    {
        $field = $this->formFieldRepository->find($fieldId);
        if (!$field || $field->getWedding() !== $wedding) {
            throw $this->createNotFoundException('Form field not found in this wedding');
        }

        $this->entityManager->remove($field);
        $this->entityManager->flush();

        return $this->json(null, Response::HTTP_NO_CONTENT);
    }

    #[Route('/weddings/{id}/rsvp-form/reorder', name: 'app_wedding_form_fields_reorder', methods: ['PUT'])]
    #[IsGranted('edit', 'wedding')]
    public function reorder(Wedding $wedding, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $orders = $data['orders'] ?? [];

        foreach ($orders as $fieldId => $order) {
            $field = $this->formFieldRepository->find($fieldId);
            if ($field && $field->getWedding() === $wedding) {
                $field->setDisplayOrder($order);
            }
        }

        $this->entityManager->flush();

        return $this->json([
            'message' => 'Fields reordered successfully'
        ]);
    }
} 