<?php

namespace App\Service;

use App\Entity\Guest;
use App\Entity\Notification;
use App\Entity\Wedding;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;

class NotificationService
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private MailerInterface $mailer
    ) {}

    public function createRsvpNotification(Guest $guest, bool $isUpdate = false): void
    {
        $notification = new Notification();
        $notification->setWedding($guest->getWedding())
            ->setGuest($guest)
            ->setType($isUpdate ? 'rsvp_update' : 'rsvp_submit')
            ->setMessage(
                $isUpdate 
                    ? sprintf('%s %s has updated their RSVP response.', $guest->getFirstName(), $guest->getLastName())
                    : sprintf('%s %s has submitted their RSVP response.', $guest->getFirstName(), $guest->getLastName())
            );

        $this->entityManager->persist($notification);
        $this->entityManager->flush();

        // Send email notification to wedding admin
        $this->sendRsvpNotificationEmail($notification);
    }

    private function sendRsvpNotificationEmail(Notification $notification): void
    {
        $wedding = $notification->getWedding();
        $admin = $wedding->getAdmin();
        $guest = $notification->getGuest();

        $subject = $notification->getType() === 'rsvp_update' 
            ? 'RSVP Updated - ' . $wedding->getTitle()
            : 'New RSVP Submission - ' . $wedding->getTitle();

        $email = (new Email())
            ->from('noreply@wplanner.com')
            ->to($admin->getEmail())
            ->subject($subject)
            ->html($this->getRsvpNotificationEmailTemplate($notification));

        $this->mailer->send($email);
    }

    private function getRsvpNotificationEmailTemplate(Notification $notification): string
    {
        $guest = $notification->getGuest();
        $wedding = $notification->getWedding();
        
        return "
            <h2>" . ($notification->getType() === 'rsvp_update' ? 'RSVP Updated' : 'New RSVP Submission') . "</h2>
            <p>Wedding: {$wedding->getTitle()}</p>
            <p>Guest: {$guest->getFirstName()} {$guest->getLastName()}</p>
            <p>Status: " . ($guest->getStatus() === 'confirmed' ? 'Attending' : 'Not Attending') . "</p>
            <p>Time: {$notification->getCreatedAt()->format('F j, Y, g:i a')}</p>
        ";
    }

    public function markAsRead(Notification $notification): void
    {
        $notification->setIsRead(true);
        $this->entityManager->flush();
    }

    public function markAllAsRead(Wedding $wedding): void
    {
        $notifications = $this->entityManager->getRepository(Notification::class)
            ->findUnreadByWedding($wedding);

        foreach ($notifications as $notification) {
            $notification->setIsRead(true);
        }

        $this->entityManager->flush();
    }
} 