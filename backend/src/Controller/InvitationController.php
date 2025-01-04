<?php

namespace App\Controller;

use App\Entity\Invitation;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;

#[Route('/api')]
class InvitationController extends AbstractController
{
    #[Route('/admin/invitations', name: 'create_invitation', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        $invitation = new Invitation();
        $invitation->setName($data['name']);
        $invitation->setEmail($data['email'] ?? null);
        $invitation->setPhoneNumber($data['phoneNumber'] ?? null);
        
        $em->persist($invitation);
        $em->flush();
        
        return $this->json(['message' => 'Invitation created', 'id' => $invitation->getId()]);
    }

    #[Route('/admin/invitations/{id}/send', name: 'send_invitation', methods: ['POST'])]
    public function send(
        Invitation $invitation,
        Request $request,
        EntityManagerInterface $em,
        MailerInterface $mailer
    ): JsonResponse {
        try {
            $data = json_decode($request->getContent(), true);
            $method = $data['method'] ?? 'email';

            if ($method === 'email' && $invitation->getEmail()) {
                try {
                    $emailContent = $this->renderView('emails/invitation.html.twig', [
                        'name' => $invitation->getName(),
                        'link' => "http://localhost:5173/invitation/" . $invitation->getUuid()
                    ]);

                    $email = (new Email())
                        ->from('razvananton21@gmail.com')
                        ->to($invitation->getEmail())
                        ->subject('Invitație la nuntă - Răzvan & Adriana')
                        ->html($emailContent);

                    $mailer->send($email);
                    
                    $invitation->setSentAt(new \DateTimeImmutable());
                    $invitation->setStatus('sent');
                    $em->flush();

                    return $this->json([
                        'message' => 'Invitation sent successfully',
                        'debug' => [
                            'to' => $invitation->getEmail(),
                            'from' => 'razvananton21@gmail.com',
                            'content' => $emailContent
                        ]
                    ]);
                } catch (\Exception $emailError) {
                    return $this->json([
                        'error' => 'Failed to send email',
                        'message' => $emailError->getMessage(),
                        'trace' => $emailError->getTraceAsString()
                    ], 500);
                }
            } elseif ($method === 'whatsapp' && $invitation->getPhoneNumber()) {
                $message = $this->formatWhatsAppInvitation($invitation);
                $whatsappLink = "https://wa.me/" . $invitation->getPhoneNumber() . "?text=" . urlencode($message);
                
                $invitation->setSentAt(new \DateTimeImmutable());
                $invitation->setStatus('sent');
                $em->flush();
                
                // return $this->json(['whatsappLink' => $whatsappLink]);
                return $this->json([]);
            }

            throw new \Exception('No valid sending method available');
        } catch (\Exception $e) {
            return $this->json([
                'error' => 'Failed to send invitation',
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }

    #[Route('/admin/invitations', name: 'list_invitations', methods: ['GET'])]
    public function list(EntityManagerInterface $em): JsonResponse
    {
        $invitations = $em->getRepository(Invitation::class)->findBy([], ['createdAt' => 'DESC']);
        
        $data = array_map(function($invitation) {
            return [
                'id' => $invitation->getId(),
                'name' => $invitation->getName(),
                'email' => $invitation->getEmail(),
                'phoneNumber' => $invitation->getPhoneNumber(),
                'status' => $invitation->getStatus(),
                'createdAt' => $invitation->getCreatedAt()->format('Y-m-d H:i:s'),
                'sentAt' => $invitation->getSentAt() ? $invitation->getSentAt()->format('Y-m-d H:i:s') : null,
                'uuid' => $invitation->getUuid()
            ];
        }, $invitations);
        
        return $this->json(['invitations' => $data]);
    }

    #[Route('/invitations/{uuid}', name: 'get_invitation', methods: ['GET'])]
    public function getInvitation(string $uuid, EntityManagerInterface $em): JsonResponse
    {
        $invitation = $em->getRepository(Invitation::class)->findOneBy(['uuid' => $uuid]);
        
        if (!$invitation) {
            return $this->json(['error' => 'Invitation not found'], 404);
        }

        // Update status to opened if not already responded
        if ($invitation->getStatus() === 'sent') {
            $invitation->setStatus('opened');
            $em->flush();
        }

        return $this->json([
            'id' => $invitation->getId(),
            'name' => $invitation->getName(),
            'email' => $invitation->getEmail(),
            'phoneNumber' => $invitation->getPhoneNumber(),
            'status' => $invitation->getStatus(),
            'uuid' => $invitation->getUuid()
        ]);
    }

    private function formatWhatsAppInvitation(Invitation $invitation): string
    {
        return "Dragă {$invitation->getName()},\n\n" .
               "Te invităm cu drag să ne fii alături în ziua nunții noastre! 🎉\n\n" .
               "Pentru a confirma prezența ta, accesează link-ul:\n" .
               "http://localhost:5173/invitation/" . $invitation->getUuid();
    }
} 