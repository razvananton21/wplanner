<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250105162452 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE rsvp_response (id INT AUTO_INCREMENT NOT NULL, guest_id INT NOT NULL, field_id INT NOT NULL, value LONGTEXT NOT NULL, INDEX IDX_90649B549A4AA658 (guest_id), INDEX IDX_90649B54443707B0 (field_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE rsvp_response ADD CONSTRAINT FK_90649B549A4AA658 FOREIGN KEY (guest_id) REFERENCES guest (id)');
        $this->addSql('ALTER TABLE rsvp_response ADD CONSTRAINT FK_90649B54443707B0 FOREIGN KEY (field_id) REFERENCES wedding_form_field (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE rsvp_response DROP FOREIGN KEY FK_90649B549A4AA658');
        $this->addSql('ALTER TABLE rsvp_response DROP FOREIGN KEY FK_90649B54443707B0');
        $this->addSql('DROP TABLE rsvp_response');
    }
}
