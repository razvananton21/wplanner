<?php

namespace App\Command;

use App\Repository\UserRepository;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:check-user',
    description: 'Check if a user exists in the database',
)]
class CheckUserCommand extends Command
{
    public function __construct(
        private UserRepository $userRepository,
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this
            ->addArgument('email', InputArgument::REQUIRED, 'Email to check');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $email = $input->getArgument('email');

        $user = $this->userRepository->findOneBy(['email' => $email]);

        if (!$user) {
            $io->error(sprintf('User with email "%s" not found', $email));
            return Command::FAILURE;
        }

        $io->success(sprintf('User found: %s %s (ID: %d)', $user->getFirstName(), $user->getLastName(), $user->getId()));
        $io->table(
            ['Property', 'Value'],
            [
                ['ID', $user->getId()],
                ['Email', $user->getEmail()],
                ['First Name', $user->getFirstName()],
                ['Last Name', $user->getLastName()],
                ['Roles', implode(', ', $user->getRoles())],
            ]
        );

        return Command::SUCCESS;
    }
} 