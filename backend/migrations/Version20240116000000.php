<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20240116000000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create initial database schema';
    }

    public function up(Schema $schema): void
    {
        // Users
        $this->addSql('CREATE TABLE "user" (
            id SERIAL PRIMARY KEY,
            email VARCHAR(180) NOT NULL,
            roles TEXT NOT NULL,
            password VARCHAR(255) NOT NULL,
            first_name VARCHAR(255) DEFAULT NULL,
            last_name VARCHAR(255) DEFAULT NULL,
            avatar VARCHAR(255) DEFAULT NULL,
            google_id VARCHAR(255) DEFAULT NULL,
            refresh_token VARCHAR(255) DEFAULT NULL,
            token_expires_at TIMESTAMP(0) DEFAULT NULL,
            created_at TIMESTAMP(0) NOT NULL,
            updated_at TIMESTAMP(0) NOT NULL
        )');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_8D93D649E7927C74 ON "user" (email)');

        // Weddings
        $this->addSql('CREATE TABLE wedding (
            id SERIAL PRIMARY KEY,
            admin_id INT NOT NULL,
            title VARCHAR(255) NOT NULL,
            description TEXT DEFAULT NULL,
            date TIMESTAMP(0) DEFAULT NULL,
            venue VARCHAR(255) DEFAULT NULL,
            created_at TIMESTAMP(0) NOT NULL,
            updated_at TIMESTAMP(0) NOT NULL,
            CONSTRAINT FK_wedding_admin FOREIGN KEY (admin_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        )');

        // Tables
        $this->addSql('CREATE TABLE "table" (
            id SERIAL PRIMARY KEY,
            wedding_id INT NOT NULL,
            name VARCHAR(255) NOT NULL,
            capacity INT NOT NULL,
            category VARCHAR(50) DEFAULT NULL,
            created_at TIMESTAMP(0) NOT NULL,
            updated_at TIMESTAMP(0) NOT NULL,
            CONSTRAINT FK_table_wedding FOREIGN KEY (wedding_id) REFERENCES wedding (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        )');

        // Guests
        $this->addSql('CREATE TABLE guest (
            id SERIAL PRIMARY KEY,
            wedding_id INT NOT NULL,
            table_id INT DEFAULT NULL,
            first_name VARCHAR(255) NOT NULL,
            last_name VARCHAR(255) NOT NULL,
            email VARCHAR(255) DEFAULT NULL,
            status VARCHAR(50) DEFAULT \'pending\',
            dietary_restrictions TEXT DEFAULT NULL,
            plus_one BOOLEAN DEFAULT FALSE,
            rsvp_token VARCHAR(255) DEFAULT NULL,
            category VARCHAR(50) DEFAULT \'guest\',
            deleted_at TIMESTAMP(0) DEFAULT NULL,
            created_at TIMESTAMP(0) NOT NULL,
            updated_at TIMESTAMP(0) NOT NULL,
            CONSTRAINT FK_guest_wedding FOREIGN KEY (wedding_id) REFERENCES wedding (id) NOT DEFERRABLE INITIALLY IMMEDIATE,
            CONSTRAINT FK_guest_table FOREIGN KEY (table_id) REFERENCES "table" (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        )');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_guest_rsvp_token ON guest (rsvp_token)');

        // RSVP Responses
        $this->addSql('CREATE TABLE rsvp_response (
            id SERIAL PRIMARY KEY,
            guest_id INT NOT NULL,
            responses TEXT NOT NULL,
            attending BOOLEAN NOT NULL,
            responded_at TIMESTAMP(0) NOT NULL,
            CONSTRAINT FK_rsvp_guest FOREIGN KEY (guest_id) REFERENCES guest (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        )');

        // Vendors
        $this->addSql('CREATE TABLE vendor (
            id SERIAL PRIMARY KEY,
            wedding_id INT NOT NULL,
            name VARCHAR(255) NOT NULL,
            company VARCHAR(255) DEFAULT NULL,
            type VARCHAR(50) NOT NULL,
            status VARCHAR(50) DEFAULT \'contacted\',
            phone VARCHAR(255) DEFAULT NULL,
            email VARCHAR(255) DEFAULT NULL,
            website VARCHAR(255) DEFAULT NULL,
            address TEXT DEFAULT NULL,
            notes TEXT DEFAULT NULL,
            price NUMERIC(10,2) DEFAULT NULL,
            deposit_amount NUMERIC(10,2) DEFAULT NULL,
            deposit_paid BOOLEAN DEFAULT FALSE,
            contract_signed BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP(0) NOT NULL,
            updated_at TIMESTAMP(0) NOT NULL,
            CONSTRAINT FK_vendor_wedding FOREIGN KEY (wedding_id) REFERENCES wedding (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        )');

        // Tasks
        $this->addSql('CREATE TABLE task (
            id SERIAL PRIMARY KEY,
            wedding_id INT NOT NULL,
            title VARCHAR(255) NOT NULL,
            description TEXT DEFAULT NULL,
            category VARCHAR(50) DEFAULT NULL,
            status VARCHAR(50) DEFAULT NULL,
            priority INT DEFAULT 2,
            is_completed BOOLEAN DEFAULT FALSE,
            due_date TIMESTAMP(0) DEFAULT NULL,
            notes TEXT DEFAULT NULL,
            display_order INT DEFAULT 0,
            created_at TIMESTAMP(0) NOT NULL,
            updated_at TIMESTAMP(0) NOT NULL,
            CONSTRAINT FK_task_wedding FOREIGN KEY (wedding_id) REFERENCES wedding (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        )');

        // Budget
        $this->addSql('CREATE TABLE budget (
            id SERIAL PRIMARY KEY,
            wedding_id INT NOT NULL,
            total_amount NUMERIC(10,2) DEFAULT 0,
            category_allocations TEXT DEFAULT NULL,
            created_at TIMESTAMP(0) NOT NULL,
            updated_at TIMESTAMP(0) NOT NULL,
            CONSTRAINT FK_budget_wedding FOREIGN KEY (wedding_id) REFERENCES wedding (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        )');

        // Expenses
        $this->addSql('CREATE TABLE expense (
            id SERIAL PRIMARY KEY,
            budget_id INT NOT NULL,
            vendor_id INT DEFAULT NULL,
            category VARCHAR(50) DEFAULT NULL,
            description TEXT DEFAULT NULL,
            amount NUMERIC(10,2) NOT NULL,
            type VARCHAR(50) DEFAULT \'other\',
            status VARCHAR(50) DEFAULT \'pending\',
            paid_amount NUMERIC(10,2) DEFAULT NULL,
            due_date TIMESTAMP(0) DEFAULT NULL,
            paid_at TIMESTAMP(0) DEFAULT NULL,
            is_vendor_expense BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP(0) NOT NULL,
            updated_at TIMESTAMP(0) NOT NULL,
            CONSTRAINT FK_expense_budget FOREIGN KEY (budget_id) REFERENCES budget (id) NOT DEFERRABLE INITIALLY IMMEDIATE,
            CONSTRAINT FK_expense_vendor FOREIGN KEY (vendor_id) REFERENCES vendor (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        )');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE IF EXISTS expense');
        $this->addSql('DROP TABLE IF EXISTS budget');
        $this->addSql('DROP TABLE IF EXISTS task');
        $this->addSql('DROP TABLE IF EXISTS vendor');
        $this->addSql('DROP TABLE IF EXISTS rsvp_response');
        $this->addSql('DROP TABLE IF EXISTS guest');
        $this->addSql('DROP TABLE IF EXISTS "table"');
        $this->addSql('DROP TABLE IF EXISTS wedding');
        $this->addSql('DROP TABLE IF EXISTS "user"');
    }
} 