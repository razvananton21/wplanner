<?php

namespace App\Security\Voter;

use App\Entity\Wedding;
use App\Entity\User;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\User\UserInterface;

class WeddingVoter extends Voter
{
    protected function supports(string $attribute, mixed $subject): bool
    {
        return in_array($attribute, ['view', 'edit', 'delete', 'WEDDING_OWNER'])
            && $subject instanceof Wedding;
    }

    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool
    {
        $user = $token->getUser();
        if (!$user instanceof UserInterface) {
            return false;
        }

        /** @var Wedding $wedding */
        $wedding = $subject;

        return match($attribute) {
            'view' => $this->canView($wedding, $user),
            'edit', 'delete', 'WEDDING_OWNER' => $this->canManage($wedding, $user),
            default => false,
        };
    }

    private function canView(Wedding $wedding, UserInterface $user): bool
    {
        // Allow if user is the admin of the wedding
        return $wedding->getAdmin() === $user;
    }

    private function canManage(Wedding $wedding, UserInterface $user): bool
    {
        // Allow if user is the admin of the wedding
        return $wedding->getAdmin() === $user;
    }
} 