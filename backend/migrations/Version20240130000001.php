<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20240130000001 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add invitationUuid to attendees table';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE attendees ADD invitation_uuid VARCHAR(36) DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE attendees DROP invitation_uuid');
    }
} 