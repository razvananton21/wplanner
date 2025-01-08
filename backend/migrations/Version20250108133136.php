<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250108133136 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // Add new columns first
        $this->addSql('ALTER TABLE user ADD google_id VARCHAR(255) DEFAULT NULL, ADD avatar VARCHAR(255) DEFAULT NULL, ADD refresh_token VARCHAR(255) DEFAULT NULL, ADD token_expires_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', ADD created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', ADD updated_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT \'(DC2Type:datetime_immutable)\'');
        
        // Update vendor table
        $this->addSql('ALTER TABLE vendor CHANGE deposit_paid deposit_paid TINYINT(1) NOT NULL');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE user DROP google_id, DROP avatar, DROP refresh_token, DROP token_expires_at, DROP created_at, DROP updated_at');
        $this->addSql('ALTER TABLE vendor CHANGE deposit_paid deposit_paid TINYINT(1) DEFAULT 0 NOT NULL');
    }
}
