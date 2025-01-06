<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250106111112 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE rsvp_response DROP FOREIGN KEY FK_90649B54443707B0');
        $this->addSql('ALTER TABLE rsvp_response CHANGE field_id field_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE rsvp_response ADD CONSTRAINT FK_90649B54443707B0 FOREIGN KEY (field_id) REFERENCES wedding_form_field (id) ON DELETE SET NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE rsvp_response DROP FOREIGN KEY FK_90649B54443707B0');
        $this->addSql('ALTER TABLE rsvp_response CHANGE field_id field_id INT NOT NULL');
        $this->addSql('ALTER TABLE rsvp_response ADD CONSTRAINT FK_90649B54443707B0 FOREIGN KEY (field_id) REFERENCES wedding_form_field (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
    }
}
