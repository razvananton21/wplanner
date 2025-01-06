<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250105093431 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE admins (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, UNIQUE INDEX UNIQ_A2E0150FE7927C74 (email), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE attendees (id INT AUTO_INCREMENT NOT NULL, first_name VARCHAR(255) NOT NULL, last_name VARCHAR(255) NOT NULL, number_of_guests INT NOT NULL, is_vegetarian TINYINT(1) NOT NULL, preferences LONGTEXT DEFAULT NULL, unique_link VARCHAR(255) DEFAULT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', additional_guests JSON DEFAULT NULL, invitation_uuid VARCHAR(36) DEFAULT NULL, UNIQUE INDEX UNIQ_C8C96B25F024A2FD (unique_link), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE guest (id INT AUTO_INCREMENT NOT NULL, wedding_id INT NOT NULL, table_id INT DEFAULT NULL, first_name VARCHAR(255) NOT NULL, last_name VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, status VARCHAR(20) NOT NULL, dietary_restrictions LONGTEXT DEFAULT NULL, plus_one TINYINT(1) NOT NULL, rsvp_token VARCHAR(255) DEFAULT NULL, category VARCHAR(255) NOT NULL, INDEX IDX_ACB79A35FCBBB0ED (wedding_id), INDEX IDX_ACB79A35ECFF285C (table_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE table_configuration (id INT AUTO_INCREMENT NOT NULL, configuration JSON NOT NULL, created_at DATETIME NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE guest ADD CONSTRAINT FK_ACB79A35FCBBB0ED FOREIGN KEY (wedding_id) REFERENCES wedding (id)');
        $this->addSql('ALTER TABLE guest ADD CONSTRAINT FK_ACB79A35ECFF285C FOREIGN KEY (table_id) REFERENCES `table` (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE guest DROP FOREIGN KEY FK_ACB79A35FCBBB0ED');
        $this->addSql('ALTER TABLE guest DROP FOREIGN KEY FK_ACB79A35ECFF285C');
        $this->addSql('DROP TABLE admins');
        $this->addSql('DROP TABLE attendees');
        $this->addSql('DROP TABLE guest');
        $this->addSql('DROP TABLE table_configuration');
    }
}
