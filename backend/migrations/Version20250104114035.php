<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250104114035 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create initial schema';
    }

    public function up(Schema $schema): void
    {
        // Create user table
        $this->addSql('CREATE TABLE user (
            id INT AUTO_INCREMENT NOT NULL,
            table_assignment_id INT DEFAULT NULL,
            email VARCHAR(180) NOT NULL,
            name VARCHAR(255) NOT NULL,
            first_name VARCHAR(255) NOT NULL,
            last_name VARCHAR(255) NOT NULL,
            roles JSON NOT NULL,
            password VARCHAR(255) NOT NULL,
            phone VARCHAR(20) DEFAULT NULL,
            preferences JSON DEFAULT NULL,
            created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\',
            updated_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\',
            UNIQUE INDEX UNIQ_8D93D649E7927C74 (email),
            INDEX IDX_8D93D649A44C42F5 (table_assignment_id),
            PRIMARY KEY(id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');

        // Create wedding table
        $this->addSql('CREATE TABLE wedding (
            id INT AUTO_INCREMENT NOT NULL,
            admin_id INT NOT NULL,
            title VARCHAR(255) NOT NULL,
            description LONGTEXT DEFAULT NULL,
            date DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\',
            venue VARCHAR(255) NOT NULL,
            language VARCHAR(10) NOT NULL,
            INDEX IDX_5BC25C96642B8210 (admin_id),
            PRIMARY KEY(id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');

        // Create table table
        $this->addSql('CREATE TABLE `table` (
            id INT AUTO_INCREMENT NOT NULL,
            wedding_id INT NOT NULL,
            name VARCHAR(255) NOT NULL,
            capacity INT NOT NULL,
            INDEX IDX_F6298F46FCBBB0ED (wedding_id),
            PRIMARY KEY(id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');

        // Create photo table
        $this->addSql('CREATE TABLE photo (
            id INT AUTO_INCREMENT NOT NULL,
            wedding_id INT NOT NULL,
            uploaded_by_id INT NOT NULL,
            url VARCHAR(255) NOT NULL,
            caption VARCHAR(255) DEFAULT NULL,
            is_approved TINYINT(1) NOT NULL,
            metadata JSON DEFAULT NULL,
            created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\',
            updated_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\',
            INDEX IDX_14B78418FCBBB0ED (wedding_id),
            INDEX IDX_14B78418A2B28FE8 (uploaded_by_id),
            PRIMARY KEY(id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');

        // Create invitation table
        $this->addSql('CREATE TABLE invitation (
            id INT AUTO_INCREMENT NOT NULL,
            wedding_id INT NOT NULL,
            guest_id INT NOT NULL,
            pdf_url VARCHAR(255) DEFAULT NULL,
            is_rsvp_submitted TINYINT(1) NOT NULL,
            rsvp_data JSON NOT NULL,
            INDEX IDX_F11D61A2FCBBB0ED (wedding_id),
            INDEX IDX_F11D61A29A4AA658 (guest_id),
            PRIMARY KEY(id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');

        // Add foreign key constraints
        $this->addSql('ALTER TABLE user ADD CONSTRAINT FK_8D93D649A44C42F5 FOREIGN KEY (table_assignment_id) REFERENCES `table` (id)');
        $this->addSql('ALTER TABLE wedding ADD CONSTRAINT FK_5BC25C96642B8210 FOREIGN KEY (admin_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE `table` ADD CONSTRAINT FK_F6298F46FCBBB0ED FOREIGN KEY (wedding_id) REFERENCES wedding (id)');
        $this->addSql('ALTER TABLE photo ADD CONSTRAINT FK_14B78418FCBBB0ED FOREIGN KEY (wedding_id) REFERENCES wedding (id)');
        $this->addSql('ALTER TABLE photo ADD CONSTRAINT FK_14B78418A2B28FE8 FOREIGN KEY (uploaded_by_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE invitation ADD CONSTRAINT FK_F11D61A2FCBBB0ED FOREIGN KEY (wedding_id) REFERENCES wedding (id)');
        $this->addSql('ALTER TABLE invitation ADD CONSTRAINT FK_F11D61A29A4AA658 FOREIGN KEY (guest_id) REFERENCES user (id)');
    }

    public function down(Schema $schema): void
    {
        // Drop foreign key constraints first
        $this->addSql('ALTER TABLE invitation DROP FOREIGN KEY FK_F11D61A29A4AA658');
        $this->addSql('ALTER TABLE invitation DROP FOREIGN KEY FK_F11D61A2FCBBB0ED');
        $this->addSql('ALTER TABLE photo DROP FOREIGN KEY FK_14B78418FCBBB0ED');
        $this->addSql('ALTER TABLE photo DROP FOREIGN KEY FK_14B78418A2B28FE8');
        $this->addSql('ALTER TABLE `table` DROP FOREIGN KEY FK_F6298F46FCBBB0ED');
        $this->addSql('ALTER TABLE user DROP FOREIGN KEY FK_8D93D649A44C42F5');
        $this->addSql('ALTER TABLE wedding DROP FOREIGN KEY FK_5BC25C96642B8210');

        // Drop tables
        $this->addSql('DROP TABLE invitation');
        $this->addSql('DROP TABLE photo');
        $this->addSql('DROP TABLE `table`');
        $this->addSql('DROP TABLE user');
        $this->addSql('DROP TABLE wedding');
    }
}
