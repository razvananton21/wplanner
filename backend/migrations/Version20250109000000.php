<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20250109000000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create vendor and vendor_file tables (PostgreSQL compatible)';
    }

    public function up(Schema $schema): void
    {
        // Use platform-agnostic SQL
        $this->addSql('CREATE TABLE vendor (
            id SERIAL NOT NULL,
            wedding_id INT NOT NULL,
            name VARCHAR(255) NOT NULL,
            company VARCHAR(255) DEFAULT NULL,
            type VARCHAR(50) NOT NULL,
            status VARCHAR(50) NOT NULL,
            phone VARCHAR(255) DEFAULT NULL,
            email VARCHAR(255) DEFAULT NULL,
            website VARCHAR(255) DEFAULT NULL,
            address VARCHAR(255) DEFAULT NULL,
            notes TEXT DEFAULT NULL,
            price DOUBLE PRECISION DEFAULT NULL,
            deposit_amount DOUBLE PRECISION DEFAULT NULL,
            deposit_paid BOOLEAN DEFAULT NULL,
            contract_signed BOOLEAN DEFAULT NULL,
            created_at TIMESTAMP NOT NULL,
            updated_at TIMESTAMP DEFAULT NULL,
            PRIMARY KEY(id)
        )');
        
        $this->addSql('CREATE INDEX IDX_F52233F6FCBBB0ED ON vendor (wedding_id)');
        
        $this->addSql('CREATE TABLE vendor_file (
            id SERIAL NOT NULL,
            vendor_id INT NOT NULL,
            filename VARCHAR(255) NOT NULL,
            original_filename VARCHAR(255) NOT NULL,
            mime_type VARCHAR(100) NOT NULL,
            size INT NOT NULL,
            type VARCHAR(50) NOT NULL,
            created_at TIMESTAMP NOT NULL,
            PRIMARY KEY(id)
        )');
        
        $this->addSql('CREATE INDEX IDX_A65233CFF603EE73 ON vendor_file (vendor_id)');
        
        $this->addSql('ALTER TABLE vendor ADD CONSTRAINT FK_F52233F6FCBBB0ED FOREIGN KEY (wedding_id) REFERENCES wedding (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE vendor_file ADD CONSTRAINT FK_A65233CFF603EE73 FOREIGN KEY (vendor_id) REFERENCES vendor (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE vendor_file DROP CONSTRAINT FK_A65233CFF603EE73');
        $this->addSql('ALTER TABLE vendor DROP CONSTRAINT FK_F52233F6FCBBB0ED');
        $this->addSql('DROP TABLE vendor_file');
        $this->addSql('DROP TABLE vendor');
    }
} 