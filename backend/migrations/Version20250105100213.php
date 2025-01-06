<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250105100213 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE guest_response (id INT AUTO_INCREMENT NOT NULL, guest_id INT NOT NULL, field_id INT NOT NULL, value LONGTEXT NOT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_4151C3849A4AA658 (guest_id), INDEX IDX_4151C384443707B0 (field_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE wedding_form_field (id INT AUTO_INCREMENT NOT NULL, wedding_id INT NOT NULL, label VARCHAR(255) NOT NULL, type VARCHAR(50) NOT NULL, options JSON DEFAULT NULL, required TINYINT(1) NOT NULL, `order` INT NOT NULL, placeholder VARCHAR(255) DEFAULT NULL, help_text VARCHAR(255) DEFAULT NULL, section VARCHAR(50) NOT NULL, INDEX IDX_B70E886CFCBBB0ED (wedding_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE guest_response ADD CONSTRAINT FK_4151C3849A4AA658 FOREIGN KEY (guest_id) REFERENCES guest (id)');
        $this->addSql('ALTER TABLE guest_response ADD CONSTRAINT FK_4151C384443707B0 FOREIGN KEY (field_id) REFERENCES wedding_form_field (id)');
        $this->addSql('ALTER TABLE wedding_form_field ADD CONSTRAINT FK_B70E886CFCBBB0ED FOREIGN KEY (wedding_id) REFERENCES wedding (id)');
        $this->addSql('ALTER TABLE wedding ADD deleted_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\'');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE guest_response DROP FOREIGN KEY FK_4151C3849A4AA658');
        $this->addSql('ALTER TABLE guest_response DROP FOREIGN KEY FK_4151C384443707B0');
        $this->addSql('ALTER TABLE wedding_form_field DROP FOREIGN KEY FK_B70E886CFCBBB0ED');
        $this->addSql('DROP TABLE guest_response');
        $this->addSql('DROP TABLE wedding_form_field');
        $this->addSql('ALTER TABLE wedding DROP deleted_at');
    }
}
