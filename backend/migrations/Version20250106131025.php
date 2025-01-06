<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250106131025 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE guest ADD plus_one_of_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE guest ADD CONSTRAINT FK_ACB79A35C269C709 FOREIGN KEY (plus_one_of_id) REFERENCES guest (id)');
        $this->addSql('CREATE INDEX IDX_ACB79A35C269C709 ON guest (plus_one_of_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE guest DROP FOREIGN KEY FK_ACB79A35C269C709');
        $this->addSql('DROP INDEX IDX_ACB79A35C269C709 ON guest');
        $this->addSql('ALTER TABLE guest DROP plus_one_of_id');
    }
}
