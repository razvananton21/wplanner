<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250106102604 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE `table` DROP capacity');
        $this->addSql('ALTER TABLE user DROP FOREIGN KEY FK_8D93D649A44C42F5');
        $this->addSql('DROP INDEX IDX_8D93D649A44C42F5 ON user');
        $this->addSql('ALTER TABLE user DROP table_assignment_id, DROP name, DROP phone, DROP preferences, DROP created_at, DROP updated_at');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE `table` ADD capacity INT NOT NULL');
        $this->addSql('ALTER TABLE user ADD table_assignment_id INT DEFAULT NULL, ADD name VARCHAR(255) NOT NULL, ADD phone VARCHAR(20) DEFAULT NULL, ADD preferences JSON DEFAULT NULL, ADD created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', ADD updated_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\'');
        $this->addSql('ALTER TABLE user ADD CONSTRAINT FK_8D93D649A44C42F5 FOREIGN KEY (table_assignment_id) REFERENCES `table` (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('CREATE INDEX IDX_8D93D649A44C42F5 ON user (table_assignment_id)');
    }
}
