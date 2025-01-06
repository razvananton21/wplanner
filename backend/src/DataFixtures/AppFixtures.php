<?php

namespace App\DataFixtures;

use App\Entity\User;
use App\Entity\Wedding;
use App\Entity\Invitation;
use App\Entity\Table;
use App\Entity\Photo;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture
{
    private UserPasswordHasherInterface $passwordHasher;

    public function __construct(UserPasswordHasherInterface $passwordHasher)
    {
        $this->passwordHasher = $passwordHasher;
    }

    public function load(ObjectManager $manager): void
    {
        // Create admin user
        $admin = new User();
        $admin->setEmail('admin@example.com');
        $admin->setFirstName('Admin');
        $admin->setLastName('User');
        $admin->setRoles(['ROLE_ADMIN']);
        $admin->setPassword($this->passwordHasher->hashPassword($admin, 'test123'));
        $manager->persist($admin);

        // Create some regular users
        $users = [];
        for ($i = 1; $i <= 5; $i++) {
            $user = new User();
            $user->setEmail("user{$i}@example.com");
            $user->setFirstName("User");
            $user->setLastName("Test {$i}");
            $user->setRoles(['ROLE_USER']);
            $user->setPassword($this->passwordHasher->hashPassword($user, 'test123'));
            $manager->persist($user);
            $users[] = $user;
        }

        // Create a wedding
        $wedding = new Wedding();
        $wedding->setTitle('Test Wedding');
        $wedding->setDescription('A beautiful test wedding');
        $wedding->setDate(new \DateTime('+3 months'));
        $wedding->setVenue('Test Venue');
        $wedding->setLanguage('en');
        $wedding->setAdmin($admin);
        $manager->persist($wedding);

        // Create invitations
        foreach ($users as $user) {
            $invitation = new Invitation();
            $invitation->setWedding($wedding);
            $invitation->setGuest($user);
            $invitation->setPdfUrl('https://example.com/invitation.pdf');
            $invitation->setIsRsvpSubmitted(false);
            $manager->persist($invitation);
        }

        // Create tables
        for ($i = 1; $i <= 3; $i++) {
            $table = new Table();
            $table->setName("Table {$i}");
            $table->setCapacity(10);
            $table->setWedding($wedding);
            $manager->persist($table);

            // Assign some guests to tables
            if ($i <= count($users)) {
                $table->addGuest($users[$i - 1]);
            }
        }

        // Create some photos
        for ($i = 1; $i <= 5; $i++) {
            $photo = new Photo();
            $photo->setWedding($wedding);
            $photo->setUploadedBy($users[array_rand($users)]);
            $photo->setUrl("https://example.com/photo{$i}.jpg");
            $photo->setCaption("Test Photo {$i}");
            $photo->setIsApproved(true);
            $photo->setMetadata([
                'location' => 'Test Location',
                'tags' => ['wedding', 'celebration']
            ]);
            $manager->persist($photo);
        }

        $manager->flush();
    }
} 