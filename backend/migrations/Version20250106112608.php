<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250106112608 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE notification DROP FOREIGN KEY FK_BF5476CAA76ED395');
        $this->addSql('DROP INDEX IDX_BF5476CAA76ED395 ON notification');
        $this->addSql('ALTER TABLE notification ADD message VARCHAR(255) NOT NULL, ADD read_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', DROP user_id');
        $this->addSql('ALTER TABLE rsvp_response DROP FOREIGN KEY FK_90649B54443707B0');
        $this->addSql('ALTER TABLE rsvp_response CHANGE field_id field_id INT NOT NULL');
        $this->addSql('ALTER TABLE rsvp_response ADD CONSTRAINT FK_90649B54443707B0 FOREIGN KEY (field_id) REFERENCES wedding_form_field (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE notification ADD user_id INT NOT NULL, DROP message, DROP read_at');
        $this->addSql('ALTER TABLE notification ADD CONSTRAINT FK_BF5476CAA76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('CREATE INDEX IDX_BF5476CAA76ED395 ON notification (user_id)');
        $this->addSql('ALTER TABLE rsvp_response DROP FOREIGN KEY FK_90649B54443707B0');
        $this->addSql('ALTER TABLE rsvp_response CHANGE field_id field_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE rsvp_response ADD CONSTRAINT FK_90649B54443707B0 FOREIGN KEY (field_id) REFERENCES wedding_form_field (id) ON UPDATE NO ACTION ON DELETE SET NULL');
    }
}
