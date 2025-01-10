<?php

namespace App\Service;

use App\Entity\Guest;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

class GuestService
{
    public function __construct(
        private MailerInterface $mailer,
        private UrlGeneratorInterface $urlGenerator,
        private string $appUrl,
        private string $appEnv = 'prod'
    ) {}

    public function generateRsvpToken(): string
    {
        return bin2hex(random_bytes(32));
    }

    public function sendRsvpEmail(Guest $guest): void
    {
        try {
            $rsvpUrl = $this->appUrl . '/rsvp/' . $guest->getRsvpToken();
            $weddingTitle = $guest->getWedding()->getTitle();
            $weddingDate = $guest->getWedding()->getDate()->format('F j, Y');

            $email = (new Email())
                ->from('noreply@wplanner.com')
                ->to($guest->getEmail())
                ->subject("Wedding Invitation - {$weddingTitle}")
                ->html($this->getEmailTemplate($guest, $rsvpUrl, $weddingTitle, $weddingDate));

            $this->mailer->send($email);
        } catch (\Exception $e) {
            // Log error but don't throw it to prevent breaking the flow
            error_log("Failed to send RSVP email: " . $e->getMessage());
        }
    }

    private function getEmailTemplate(Guest $guest, string $rsvpUrl, string $weddingTitle, string $weddingDate): string
    {
        return <<<HTML
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #333; text-align: center;">Wedding Invitation</h1>
                <p>Dear {$guest->getFirstName()} {$guest->getLastName()},</p>
                <p>You are cordially invited to {$weddingTitle} on {$weddingDate}.</p>
                <p>Please let us know if you can attend by clicking the button below:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="{$rsvpUrl}" style="background-color: #4CAF50; color: white; padding: 14px 25px; text-decoration: none; border-radius: 4px;">
                        RSVP Now
                    </a>
                </div>
                <p style="color: #666; font-size: 14px;">
                    If you're having trouble with the button above, you can also copy and paste this link into your browser:<br>
                    {$rsvpUrl}
                </p>
            </div>
        HTML;
    }
} 