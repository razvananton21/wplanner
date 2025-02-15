<?php

namespace App\Security\Voter;

use App\Entity\Table;
use App\Entity\User;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\User\UserInterface;

class TableVoter extends Voter
{
    protected function supports(string $attribute, mixed $subject): bool
    {
        return in_array($attribute, ['view', 'edit', 'delete', 'assign_guests'])
            && $subject instanceof Table;
    }

    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool
    {
        $user = $token->getUser();
        if (!$user instanceof UserInterface) {
            return false;
        }

        /** @var Table $table */
        $table = $subject;

        return match($attribute) {
            'view' => $this->canView($table, $user),
            'edit', 'delete', 'assign_guests' => $this->canManage($table, $user),
            default => false,
        };
    }

    private function canView(Table $table, UserInterface $user): bool
    {
        // Allow if user is the admin of the wedding
        return $table->getWedding()->getAdmin() === $user;
    }

    private function canManage(Table $table, UserInterface $user): bool
    {
        // Only wedding admin can manage tables
        return $table->getWedding()->getAdmin() === $user;
    }
} 