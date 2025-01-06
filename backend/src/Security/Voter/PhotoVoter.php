<?php

namespace App\Security\Voter;

use App\Entity\Photo;
use App\Entity\User;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\User\UserInterface;

class PhotoVoter extends Voter
{
    protected function supports(string $attribute, mixed $subject): bool
    {
        return in_array($attribute, ['approve', 'delete'])
            && $subject instanceof Photo;
    }

    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool
    {
        $user = $token->getUser();
        if (!$user instanceof UserInterface) {
            return false;
        }

        /** @var Photo $photo */
        $photo = $subject;

        return match($attribute) {
            'approve' => $this->canApprove($photo, $user),
            'delete' => $this->canDelete($photo, $user),
            default => false,
        };
    }

    private function canApprove(Photo $photo, UserInterface $user): bool
    {
        // Only wedding admin can approve photos
        return $photo->getWedding()->getAdmin() === $user;
    }

    private function canDelete(Photo $photo, UserInterface $user): bool
    {
        // Allow if user is wedding admin or photo uploader
        return $photo->getWedding()->getAdmin() === $user || $photo->getUploadedBy() === $user;
    }
} 