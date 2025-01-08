<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250108111845 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE budget (id INT AUTO_INCREMENT NOT NULL, wedding_id INT NOT NULL, total_amount DOUBLE PRECISION NOT NULL, category_allocations JSON NOT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', updated_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', UNIQUE INDEX UNIQ_73F2F77BFCBBB0ED (wedding_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE expense (id INT AUTO_INCREMENT NOT NULL, budget_id INT NOT NULL, vendor_id INT DEFAULT NULL, category VARCHAR(255) NOT NULL, description VARCHAR(255) NOT NULL, amount DOUBLE PRECISION NOT NULL, type VARCHAR(20) NOT NULL, status VARCHAR(20) NOT NULL, paid_amount DOUBLE PRECISION DEFAULT NULL, due_date DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', paid_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', is_vendor_expense TINYINT(1) NOT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', updated_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_2D3A8DA636ABA6B8 (budget_id), INDEX IDX_2D3A8DA6F603EE73 (vendor_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE budget ADD CONSTRAINT FK_73F2F77BFCBBB0ED FOREIGN KEY (wedding_id) REFERENCES wedding (id)');
        $this->addSql('ALTER TABLE expense ADD CONSTRAINT FK_2D3A8DA636ABA6B8 FOREIGN KEY (budget_id) REFERENCES budget (id)');
        $this->addSql('ALTER TABLE expense ADD CONSTRAINT FK_2D3A8DA6F603EE73 FOREIGN KEY (vendor_id) REFERENCES vendor (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE budget DROP FOREIGN KEY FK_73F2F77BFCBBB0ED');
        $this->addSql('ALTER TABLE expense DROP FOREIGN KEY FK_2D3A8DA636ABA6B8');
        $this->addSql('ALTER TABLE expense DROP FOREIGN KEY FK_2D3A8DA6F603EE73');
        $this->addSql('DROP TABLE budget');
        $this->addSql('DROP TABLE expense');
    }
}
