<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20240129000000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create initial database structure';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE attendees (
            id INT AUTO_INCREMENT NOT NULL,
            first_name VARCHAR(255) NOT NULL,
            last_name VARCHAR(255) NOT NULL,
            number_of_guests INT NOT NULL,
            is_vegetarian TINYINT(1) NOT NULL,
            preferences LONGTEXT DEFAULT NULL,
            unique_link VARCHAR(255) DEFAULT NULL,
            created_at DATETIME NOT NULL,
            additional_guests JSON DEFAULT NULL,
            UNIQUE INDEX UNIQ_C0F0F2C6AFBA6FD8 (unique_link),
            PRIMARY KEY(id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');

        $this->addSql('CREATE TABLE admins (
            id INT AUTO_INCREMENT NOT NULL,
            email VARCHAR(180) NOT NULL,
            roles JSON NOT NULL,
            password VARCHAR(255) NOT NULL,
            UNIQUE INDEX UNIQ_880E0D76E7927C74 (email),
            PRIMARY KEY(id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');

        $this->addSql('CREATE TABLE table_configuration (
            id INT AUTO_INCREMENT NOT NULL,
            configuration JSON NOT NULL COMMENT "(DC2Type:json_array)",
            created_at DATETIME NOT NULL,
            PRIMARY KEY(id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE attendees');
        $this->addSql('DROP TABLE admins');
        $this->addSql('DROP TABLE table_configuration');
    }
} 