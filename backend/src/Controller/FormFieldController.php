<?php

namespace App\Controller;

use App\Entity\Wedding;
use App\Entity\WeddingFormField;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

class FormFieldController extends AbstractController
{
    #[Route('/api/weddings/{wedding}/rsvp-form/{field}', name: 'delete_form_field', methods: ['DELETE'])]
    #[IsGranted('ROLE_USER')]
    #[IsGranted('WEDDING_OWNER', subject: 'wedding')]
    public function delete(Wedding $wedding, WeddingFormField $field, EntityManagerInterface $entityManager): JsonResponse
    {
        if ($field->getWedding() !== $wedding) {
            throw new AccessDeniedHttpException('Field does not belong to this wedding');
        }

        $field->setDeletedAt(new \DateTimeImmutable());
        $entityManager->persist($field);
        $entityManager->flush();

        return new JsonResponse(null, Response::HTTP_NO_CONTENT);
    }
} 