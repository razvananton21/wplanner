<?php

namespace App\Security\Voter;

use App\Entity\Invitation;
use App\Entity\User;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\User\UserInterface;

class InvitationVoter extends Voter
{
    protected function supports(string $attribute, mixed $subject): bool
    {
        return in_array($attribute, ['view', 'edit', 'delete', 'submit_rsvp'])
            && $subject instanceof Invitation;
    }

    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool
    {
        $user = $token->getUser();
        if (!$user instanceof UserInterface) {
            return false;
        }

        /** @var Invitation $invitation */
        $invitation = $subject;

        return match($attribute) {
            'view' => $this->canView($invitation, $user),
            'edit', 'delete' => $this->canManage($invitation, $user),
            'submit_rsvp' => $this->canSubmitRsvp($invitation, $user),
            default => false,
        };
    }

    private function canView(Invitation $invitation, UserInterface $user): bool
    {
        // Wedding admin can view all invitations
        if ($invitation->getWedding()->getAdmin() === $user) {
            return true;
        }

        // Guest can view their own invitation
        return $invitation->getGuest() === $user;
    }

    private function canManage(Invitation $invitation, UserInterface $user): bool
    {
        // Only wedding admin can manage invitations
        return $invitation->getWedding()->getAdmin() === $user;
    }

    private function canSubmitRsvp(Invitation $invitation, UserInterface $user): bool
    {
        // Only the invited guest can submit RSVP
        return $invitation->getGuest() === $user && !$invitation->isRsvpSubmitted();
    }
} 