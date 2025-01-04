<?php

namespace App\Controller;

use App\Entity\Attendee;
use App\Entity\Admin;
use App\Entity\TableConfiguration;
use App\Entity\Invitation;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;

#[Route('/api', name: 'api_')]
class RsvpController extends AbstractController
{
    private $mailer;
    private const ADMIN_EMAIL = 'razvananton21@gmail.com';
    private const WHATSAPP_NUMBER = '40785130400'; // Your number in international format

    public function __construct(MailerInterface $mailer)
    {
        $this->mailer = $mailer;
    }

    #[Route('/test', name: 'test', methods: ['GET'])]
    public function test(): JsonResponse
    {
        return $this->json(['message' => 'API is working']);
    }

    #[Route('/rsvp', name: 'rsvp_submit', methods: ['POST'])]
    public function submit(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);
            
            // Check if this is a response to an invitation
            if (!empty($data['invitationId'])) {
                // Try to find existing attendee for this invitation
                $existingAttendee = $entityManager->getRepository(Attendee::class)
                    ->findByInvitationUuid($data['invitationId']);
                
                if ($existingAttendee) {
                    // Update existing attendee
                    $existingAttendee->setFirstName($data['firstName'] ?? null);
                    $existingAttendee->setLastName($data['lastName'] ?? null);
                    $existingAttendee->setNumberOfGuests(count($data['additionalGuests']) + 1);
                    $existingAttendee->setIsVegetarian($data['isVegetarian'] ?? false);
                    $existingAttendee->setPreferences($data['preferences'] ?? null);
                    $existingAttendee->setAdditionalGuests($data['additionalGuests']);
                    
                    $entityManager->flush();
                    
                    return $this->json(['message' => 'RSVP updated successfully']);
                }
            }

            // Create new attendee if no existing one found
            $attendee = new Attendee();
            $attendee->setFirstName($data['firstName'] ?? null);
            $attendee->setLastName($data['lastName'] ?? null);
            $attendee->setNumberOfGuests(count($data['additionalGuests']) + 1);
            $attendee->setIsVegetarian($data['isVegetarian'] ?? false);
            $attendee->setPreferences($data['preferences'] ?? null);
            
            // Save additional guests details
            $additionalGuests = array_map(function($guest) {
                return [
                    'firstName' => $guest['firstName'],
                    'lastName' => $guest['lastName'],
                    'isVegetarian' => $guest['isVegetarian'],
                    'isChild' => $guest['isChild'] ?? false
                ];
            }, $data['additionalGuests']);
            
            $attendee->setAdditionalGuests($additionalGuests);

            if (!empty($data['invitationId'])) {
                $attendee->setInvitationUuid($data['invitationId']);
            }
            
            $entityManager->persist($attendee);
            $entityManager->flush();

            return $this->json(['message' => 'RSVP submitted successfully']);
        } catch (\Exception $e) {
            return new JsonResponse([
                'error' => 'Failed to submit RSVP',
                'message' => $e->getMessage(),
                'details' => [
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                    'trace' => $e->getTraceAsString()
                ]
            ], 400);
        }
    }

    #[Route('/rsvp/{uuid}', name: 'get_rsvp', methods: ['GET'])]
    public function getRsvp(string $uuid, EntityManagerInterface $entityManager): JsonResponse
    {
        $attendee = $entityManager->getRepository(Attendee::class)
            ->findByInvitationUuid($uuid);
        
        if (!$attendee) {
            return $this->json(['message' => 'No RSVP found'], 404);
        }

        return $this->json([
            'firstName' => $attendee->getFirstName(),
            'lastName' => $attendee->getLastName(),
            'isVegetarian' => $attendee->getIsVegetarian(),
            'preferences' => $attendee->getPreferences(),
            'additionalGuests' => $attendee->getAdditionalGuests()
        ]);
    }

    #[Route('/attendees', name: 'attendees_list', methods: ['GET', 'OPTIONS'])]
    public function list(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        if ($request->getMethod() === 'OPTIONS') {
            return new JsonResponse([], 200, [
                'Access-Control-Allow-Origin' => 'http://localhost:5173',
                'Access-Control-Allow-Methods' => 'GET, OPTIONS',
                'Access-Control-Allow-Headers' => 'Content-Type, Authorization, Accept',
                'Access-Control-Allow-Credentials' => 'true'
            ]);
        }

        try {
            $attendees = $entityManager->getRepository(Attendee::class)->findAll();
            
            // Transform attendees to array format
            $attendeesArray = array_map(function($attendee) {
                return [
                    'id' => $attendee->getId(),
                    'firstName' => $attendee->getFirstName(),
                    'lastName' => $attendee->getLastName(),
                    'numberOfGuests' => $attendee->getNumberOfGuests(),
                    'isVegetarian' => (bool) $attendee->getIsVegetarian(),
                    'preferences' => $attendee->getPreferences() ?? '',
                    'additionalGuests' => $attendee->getAdditionalGuests() ?? []
                ];
            }, $attendees);

            $response = new JsonResponse([
                'attendees' => $attendeesArray
            ]);
            
            // Set CORS headers
            $response->headers->set('Access-Control-Allow-Origin', 'http://localhost:5173');
            $response->headers->set('Access-Control-Allow-Methods', 'GET, OPTIONS');
            $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
            $response->headers->set('Access-Control-Allow-Credentials', 'true');
            
            return $response;
        } catch (\Exception $e) {
            return new JsonResponse([
                'error' => 'Failed to fetch attendees',
                'message' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/test-auth', name: 'test_auth', methods: ['GET'])]
    public function testAuth(): JsonResponse
    {
        return $this->json([
            'message' => 'You are authenticated!',
            'user' => $this->getUser()?->getUserIdentifier()
        ]);
    }

    #[Route('/debug-headers', name: 'debug_headers', methods: ['GET'])]
    public function debugHeaders(Request $request): JsonResponse
    {
        $allHeaders = [];
        foreach ($request->headers->all() as $key => $value) {
            $allHeaders[$key] = $value;
        }

        return $this->json([
            'headers' => $allHeaders,
            'authorization' => $request->headers->get('Authorization'),
            'server' => $_SERVER,
            'user' => $this->getUser()?->getUserIdentifier(),
        ]);
    }

    #[Route('/verify-token', name: 'verify_token', methods: ['GET'])]
    public function verifyToken(Request $request): JsonResponse
    {
        $token = $request->headers->get('Authorization');
        $user = $this->getUser();

        return $this->json([
            'token_received' => $token,
            'token_parsed' => str_replace('Bearer ', '', $token),
            'user' => $user ? [
                'email' => $user->getUserIdentifier(),
                'roles' => $user->getRoles()
            ] : null,
            'headers' => $request->headers->all(),
            'server' => array_intersect_key($_SERVER, array_flip([
                'HTTP_AUTHORIZATION',
                'REQUEST_METHOD',
                'QUERY_STRING',
                'REQUEST_URI'
            ]))
        ]);
    }

    #[Route('/debug-login', name: 'debug_login', methods: ['POST'])]
    public function debugLogin(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        try {
            $content = json_decode($request->getContent(), true);
            $email = $content['username'] ?? null;
            
            if (!$email) {
                return $this->json([
                    'error' => 'No username provided',
                    'received_content' => $content
                ]);
            }
            
            $admin = $entityManager->getRepository(Admin::class)->findOneBy(['email' => $email]);
            
            return $this->json([
                'request_content' => $content,
                'user_found' => $admin !== null,
                'user_details' => $admin ? [
                    'email' => $admin->getEmail(),
                    'roles' => $admin->getRoles(),
                    'id' => $admin->getId()
                ] : null,
                'database_connection' => [
                    'connected' => $entityManager->getConnection()->isConnected(),
                    'database' => $entityManager->getConnection()->getDatabase()
                ]
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'error' => 'Debug error',
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
        }
    }

    #[Route('/table-configuration', name: 'save_table_config', methods: ['POST'])]
    public function saveTableConfiguration(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        $config = new TableConfiguration();
        $config->setConfiguration($data);
        
        $entityManager->persist($config);
        $entityManager->flush();
        
        return $this->json(['message' => 'Configuration saved successfully']);
    }

    #[Route('/table-configuration', name: 'get_table_config', methods: ['GET'])]
    public function getTableConfiguration(EntityManagerInterface $entityManager): JsonResponse
    {
        $config = $entityManager->getRepository(TableConfiguration::class)
            ->findOneBy([], ['createdAt' => 'DESC']);
        
        return $this->json([
            'configuration' => $config ? $config->getConfiguration() : null
        ]);
    }

    private function sendNotifications(array $data): array
    {
        // Send email notification
        $this->sendEmailNotification($data);
        
        // Generate WhatsApp link
        $whatsappLink = $this->generateWhatsAppLink($data);
        
        return ['emailSent' => true, 'whatsappLink' => $whatsappLink];
    }

    private function sendEmailNotification(array $data): void
    {
        try {
            $email = (new Email())
                ->from('razvananton21@gmail.com')
                ->to(self::ADMIN_EMAIL)
                ->subject('New RSVP Received!')
                ->html($this->renderView('emails/rsvp_notification.html.twig', [
                    'data' => $data
                ]));

            $this->mailer->send($email);
        } catch (\Exception $e) {
            throw new \Exception('Failed to send email: ' . $e->getMessage());
        }
    }

    private function generateWhatsAppLink(array $data): string
    {
        $message = $this->formatWhatsAppMessage($data);
        return "https://wa.me/" . self::WHATSAPP_NUMBER . "?text=" . urlencode($message);
    }

    private function formatWhatsAppMessage(array $data): string
    {
        $attending = $data['attending'] === 'yes' ? 'Da' : 'Nu';
        
        $message = "🎉 Nou RSVP primit!\n\n";
        $message .= "Nume: {$data['firstName']} {$data['lastName']}\n";
        $message .= "Participă: {$attending}\n";
        
        if ($data['attending'] === 'yes') {
            $message .= "Meniu: {$data['diet']}\n";
            
            if (!empty($data['additionalGuests'])) {
                $message .= "\nÎnsoțitori:\n";
                foreach ($data['additionalGuests'] as $guest) {
                    $message .= "- {$guest['firstName']} {$guest['lastName']}\n";
                    $message .= "  " . ($guest['isChild'] ? "👶 Copil" : "👤 Adult") . "\n";
                    $message .= "  " . ($guest['isVegetarian'] ? "🥗 Vegetarian" : "🍖 Normal") . "\n";
                }
            }
        }
        
        if (!empty($data['preferences'])) {
            $message .= "\nMențiuni: {$data['preferences']}\n";
        }
        
        return $message;
    }
} 