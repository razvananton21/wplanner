<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250109132706 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE budget (id INT AUTO_INCREMENT NOT NULL, wedding_id INT NOT NULL, total_amount DOUBLE PRECISION NOT NULL, category_allocations JSON NOT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', updated_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', UNIQUE INDEX UNIQ_73F2F77BFCBBB0ED (wedding_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE event (id INT AUTO_INCREMENT NOT NULL, admin_id INT NOT NULL, title VARCHAR(255) NOT NULL, description LONGTEXT DEFAULT NULL, date DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', venue VARCHAR(255) NOT NULL, language VARCHAR(10) NOT NULL, type VARCHAR(20) NOT NULL, metadata JSON DEFAULT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', updated_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', deleted_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_3BAE0AA7642B8210 (admin_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE expense (id INT AUTO_INCREMENT NOT NULL, budget_id INT NOT NULL, vendor_id INT DEFAULT NULL, category VARCHAR(255) NOT NULL, description VARCHAR(255) NOT NULL, amount DOUBLE PRECISION NOT NULL, type VARCHAR(20) NOT NULL, status VARCHAR(20) NOT NULL, paid_amount DOUBLE PRECISION DEFAULT NULL, due_date DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', paid_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', is_vendor_expense TINYINT(1) NOT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', updated_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_2D3A8DA636ABA6B8 (budget_id), INDEX IDX_2D3A8DA6F603EE73 (vendor_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE guest (id INT AUTO_INCREMENT NOT NULL, wedding_id INT NOT NULL, table_id INT DEFAULT NULL, plus_one_of_id INT DEFAULT NULL, first_name VARCHAR(255) NOT NULL, last_name VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, status VARCHAR(20) NOT NULL, dietary_restrictions LONGTEXT DEFAULT NULL, plus_one TINYINT(1) NOT NULL, rsvp_token VARCHAR(255) DEFAULT NULL, category VARCHAR(255) NOT NULL, deleted_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_ACB79A35FCBBB0ED (wedding_id), INDEX IDX_ACB79A35ECFF285C (table_id), INDEX IDX_ACB79A35C269C709 (plus_one_of_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE invitation (id INT AUTO_INCREMENT NOT NULL, wedding_id INT NOT NULL, guest_id INT NOT NULL, token VARCHAR(255) NOT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', updated_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_F11D61A2FCBBB0ED (wedding_id), INDEX IDX_F11D61A29A4AA658 (guest_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE notification (id INT AUTO_INCREMENT NOT NULL, wedding_id INT NOT NULL, guest_id INT NOT NULL, type VARCHAR(255) NOT NULL, message VARCHAR(255) NOT NULL, is_read TINYINT(1) NOT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', read_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_BF5476CAFCBBB0ED (wedding_id), INDEX IDX_BF5476CA9A4AA658 (guest_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE photo (id INT AUTO_INCREMENT NOT NULL, wedding_id INT NOT NULL, uploaded_by_id INT NOT NULL, url VARCHAR(255) NOT NULL, caption VARCHAR(255) DEFAULT NULL, is_approved TINYINT(1) NOT NULL, metadata JSON DEFAULT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', updated_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_14B78418FCBBB0ED (wedding_id), INDEX IDX_14B78418A2B28FE8 (uploaded_by_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE rsvp_response (id INT AUTO_INCREMENT NOT NULL, guest_id INT NOT NULL, field_id INT NOT NULL, value LONGTEXT NOT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_90649B549A4AA658 (guest_id), INDEX IDX_90649B54443707B0 (field_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE `table` (id INT AUTO_INCREMENT NOT NULL, wedding_id INT NOT NULL, name VARCHAR(255) NOT NULL, capacity INT NOT NULL, min_capacity INT NOT NULL, shape VARCHAR(20) NOT NULL, dimensions JSON NOT NULL, location VARCHAR(255) DEFAULT NULL, is_vip TINYINT(1) NOT NULL, metadata JSON NOT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', updated_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_F6298F46FCBBB0ED (wedding_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE task (id INT AUTO_INCREMENT NOT NULL, wedding_id INT NOT NULL, title VARCHAR(255) NOT NULL, description LONGTEXT DEFAULT NULL, category VARCHAR(50) NOT NULL, status VARCHAR(20) NOT NULL, due_date DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', priority INT NOT NULL, is_completed TINYINT(1) NOT NULL, notes LONGTEXT DEFAULT NULL, completed_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', updated_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', display_order INT NOT NULL, INDEX IDX_527EDB25FCBBB0ED (wedding_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE timeline_event (id INT AUTO_INCREMENT NOT NULL, wedding_id INT NOT NULL, title VARCHAR(255) NOT NULL, description LONGTEXT DEFAULT NULL, start_time DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', end_time DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', type VARCHAR(50) NOT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', updated_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_1BC087E1FCBBB0ED (wedding_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, first_name VARCHAR(255) NOT NULL, last_name VARCHAR(255) NOT NULL, google_id VARCHAR(255) DEFAULT NULL, avatar VARCHAR(255) DEFAULT NULL, refresh_token VARCHAR(255) DEFAULT NULL, token_expires_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', updated_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', UNIQUE INDEX UNIQ_8D93D649E7927C74 (email), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE vendor (id INT AUTO_INCREMENT NOT NULL, wedding_id INT NOT NULL, name VARCHAR(255) NOT NULL, company VARCHAR(255) DEFAULT NULL, type VARCHAR(50) NOT NULL, status VARCHAR(50) NOT NULL, phone VARCHAR(255) DEFAULT NULL, email VARCHAR(255) DEFAULT NULL, website VARCHAR(255) DEFAULT NULL, address VARCHAR(255) DEFAULT NULL, notes LONGTEXT DEFAULT NULL, price DOUBLE PRECISION DEFAULT NULL, deposit_amount DOUBLE PRECISION DEFAULT NULL, deposit_paid TINYINT(1) NOT NULL, contract_signed TINYINT(1) DEFAULT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', updated_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_F52233F6FCBBB0ED (wedding_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE vendor_file (id INT AUTO_INCREMENT NOT NULL, vendor_id INT NOT NULL, filename VARCHAR(255) NOT NULL, original_filename VARCHAR(255) NOT NULL, mime_type VARCHAR(100) NOT NULL, size INT NOT NULL, type VARCHAR(50) NOT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_A65233CFF603EE73 (vendor_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE wedding (id INT AUTO_INCREMENT NOT NULL, admin_id INT NOT NULL, title VARCHAR(255) NOT NULL, description LONGTEXT DEFAULT NULL, date DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', venue VARCHAR(255) NOT NULL, language VARCHAR(10) NOT NULL, deleted_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', invitation_pdf_url VARCHAR(255) DEFAULT NULL, INDEX IDX_5BC25C96642B8210 (admin_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE wedding_form_field (id INT AUTO_INCREMENT NOT NULL, wedding_id INT NOT NULL, label VARCHAR(255) NOT NULL, type VARCHAR(50) NOT NULL, options JSON DEFAULT NULL, required TINYINT(1) NOT NULL, display_order INT NOT NULL, placeholder VARCHAR(255) DEFAULT NULL, help_text VARCHAR(255) DEFAULT NULL, section VARCHAR(50) NOT NULL, deleted_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_B70E886CFCBBB0ED (wedding_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE budget ADD CONSTRAINT FK_73F2F77BFCBBB0ED FOREIGN KEY (wedding_id) REFERENCES wedding (id)');
        $this->addSql('ALTER TABLE event ADD CONSTRAINT FK_3BAE0AA7642B8210 FOREIGN KEY (admin_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE expense ADD CONSTRAINT FK_2D3A8DA636ABA6B8 FOREIGN KEY (budget_id) REFERENCES budget (id)');
        $this->addSql('ALTER TABLE expense ADD CONSTRAINT FK_2D3A8DA6F603EE73 FOREIGN KEY (vendor_id) REFERENCES vendor (id)');
        $this->addSql('ALTER TABLE guest ADD CONSTRAINT FK_ACB79A35FCBBB0ED FOREIGN KEY (wedding_id) REFERENCES wedding (id)');
        $this->addSql('ALTER TABLE guest ADD CONSTRAINT FK_ACB79A35ECFF285C FOREIGN KEY (table_id) REFERENCES `table` (id)');
        $this->addSql('ALTER TABLE guest ADD CONSTRAINT FK_ACB79A35C269C709 FOREIGN KEY (plus_one_of_id) REFERENCES guest (id)');
        $this->addSql('ALTER TABLE invitation ADD CONSTRAINT FK_F11D61A2FCBBB0ED FOREIGN KEY (wedding_id) REFERENCES wedding (id)');
        $this->addSql('ALTER TABLE invitation ADD CONSTRAINT FK_F11D61A29A4AA658 FOREIGN KEY (guest_id) REFERENCES guest (id)');
        $this->addSql('ALTER TABLE notification ADD CONSTRAINT FK_BF5476CAFCBBB0ED FOREIGN KEY (wedding_id) REFERENCES wedding (id)');
        $this->addSql('ALTER TABLE notification ADD CONSTRAINT FK_BF5476CA9A4AA658 FOREIGN KEY (guest_id) REFERENCES guest (id)');
        $this->addSql('ALTER TABLE photo ADD CONSTRAINT FK_14B78418FCBBB0ED FOREIGN KEY (wedding_id) REFERENCES wedding (id)');
        $this->addSql('ALTER TABLE photo ADD CONSTRAINT FK_14B78418A2B28FE8 FOREIGN KEY (uploaded_by_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE rsvp_response ADD CONSTRAINT FK_90649B549A4AA658 FOREIGN KEY (guest_id) REFERENCES guest (id)');
        $this->addSql('ALTER TABLE rsvp_response ADD CONSTRAINT FK_90649B54443707B0 FOREIGN KEY (field_id) REFERENCES wedding_form_field (id)');
        $this->addSql('ALTER TABLE `table` ADD CONSTRAINT FK_F6298F46FCBBB0ED FOREIGN KEY (wedding_id) REFERENCES wedding (id)');
        $this->addSql('ALTER TABLE task ADD CONSTRAINT FK_527EDB25FCBBB0ED FOREIGN KEY (wedding_id) REFERENCES wedding (id)');
        $this->addSql('ALTER TABLE timeline_event ADD CONSTRAINT FK_1BC087E1FCBBB0ED FOREIGN KEY (wedding_id) REFERENCES wedding (id)');
        $this->addSql('ALTER TABLE vendor ADD CONSTRAINT FK_F52233F6FCBBB0ED FOREIGN KEY (wedding_id) REFERENCES wedding (id)');
        $this->addSql('ALTER TABLE vendor_file ADD CONSTRAINT FK_A65233CFF603EE73 FOREIGN KEY (vendor_id) REFERENCES vendor (id)');
        $this->addSql('ALTER TABLE wedding ADD CONSTRAINT FK_5BC25C96642B8210 FOREIGN KEY (admin_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE wedding_form_field ADD CONSTRAINT FK_B70E886CFCBBB0ED FOREIGN KEY (wedding_id) REFERENCES wedding (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE budget DROP FOREIGN KEY FK_73F2F77BFCBBB0ED');
        $this->addSql('ALTER TABLE event DROP FOREIGN KEY FK_3BAE0AA7642B8210');
        $this->addSql('ALTER TABLE expense DROP FOREIGN KEY FK_2D3A8DA636ABA6B8');
        $this->addSql('ALTER TABLE expense DROP FOREIGN KEY FK_2D3A8DA6F603EE73');
        $this->addSql('ALTER TABLE guest DROP FOREIGN KEY FK_ACB79A35FCBBB0ED');
        $this->addSql('ALTER TABLE guest DROP FOREIGN KEY FK_ACB79A35ECFF285C');
        $this->addSql('ALTER TABLE guest DROP FOREIGN KEY FK_ACB79A35C269C709');
        $this->addSql('ALTER TABLE invitation DROP FOREIGN KEY FK_F11D61A2FCBBB0ED');
        $this->addSql('ALTER TABLE invitation DROP FOREIGN KEY FK_F11D61A29A4AA658');
        $this->addSql('ALTER TABLE notification DROP FOREIGN KEY FK_BF5476CAFCBBB0ED');
        $this->addSql('ALTER TABLE notification DROP FOREIGN KEY FK_BF5476CA9A4AA658');
        $this->addSql('ALTER TABLE photo DROP FOREIGN KEY FK_14B78418FCBBB0ED');
        $this->addSql('ALTER TABLE photo DROP FOREIGN KEY FK_14B78418A2B28FE8');
        $this->addSql('ALTER TABLE rsvp_response DROP FOREIGN KEY FK_90649B549A4AA658');
        $this->addSql('ALTER TABLE rsvp_response DROP FOREIGN KEY FK_90649B54443707B0');
        $this->addSql('ALTER TABLE `table` DROP FOREIGN KEY FK_F6298F46FCBBB0ED');
        $this->addSql('ALTER TABLE task DROP FOREIGN KEY FK_527EDB25FCBBB0ED');
        $this->addSql('ALTER TABLE timeline_event DROP FOREIGN KEY FK_1BC087E1FCBBB0ED');
        $this->addSql('ALTER TABLE vendor DROP FOREIGN KEY FK_F52233F6FCBBB0ED');
        $this->addSql('ALTER TABLE vendor_file DROP FOREIGN KEY FK_A65233CFF603EE73');
        $this->addSql('ALTER TABLE wedding DROP FOREIGN KEY FK_5BC25C96642B8210');
        $this->addSql('ALTER TABLE wedding_form_field DROP FOREIGN KEY FK_B70E886CFCBBB0ED');
        $this->addSql('DROP TABLE budget');
        $this->addSql('DROP TABLE event');
        $this->addSql('DROP TABLE expense');
        $this->addSql('DROP TABLE guest');
        $this->addSql('DROP TABLE invitation');
        $this->addSql('DROP TABLE notification');
        $this->addSql('DROP TABLE photo');
        $this->addSql('DROP TABLE rsvp_response');
        $this->addSql('DROP TABLE `table`');
        $this->addSql('DROP TABLE task');
        $this->addSql('DROP TABLE timeline_event');
        $this->addSql('DROP TABLE user');
        $this->addSql('DROP TABLE vendor');
        $this->addSql('DROP TABLE vendor_file');
        $this->addSql('DROP TABLE wedding');
        $this->addSql('DROP TABLE wedding_form_field');
    }
}
