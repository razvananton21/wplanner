<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20240000000000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create invitation table';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE invitation (
            id INT AUTO_INCREMENT NOT NULL,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) DEFAULT NULL,
            phone_number VARCHAR(255) DEFAULT NULL,
            uuid VARCHAR(36) NOT NULL,
            created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\',
            sent_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\',
            status VARCHAR(255) NOT NULL,
            UNIQUE INDEX UNIQ_F11D61A2D17F50A6 (uuid),
            PRIMARY KEY(id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE invitation');
    }
} 