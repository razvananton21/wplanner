# Backend Architecture Documentation

## Core Components

### 1. Controllers (`src/Controller/`)

#### Authentication (`AuthController.php`)
- Purpose: User authentication
- Endpoints:
  ```php
  #[Route('/api/login', methods: ['POST'])]
  #[Route('/api/register', methods: ['POST'])]
  #[Route('/api/logout', methods: ['POST'])]
  #[Route('/api/refresh-token', methods: ['POST'])]
  ```
- Dependencies:
  - AuthService
  - UserRepository
  - JWTTokenManagerInterface
- Used by: Frontend auth services

#### Wedding Management (`WeddingController.php`)
- Purpose: Wedding CRUD operations
- Endpoints:
  ```php
  #[Route('/api/weddings', methods: ['GET', 'POST'])]
  #[Route('/api/weddings/{id}', methods: ['GET', 'PUT', 'DELETE'])]
  #[Route('/api/weddings/{id}/settings', methods: ['PUT'])]
  #[Route('/api/weddings/{id}/image', methods: ['POST'])]
  ```
- Dependencies:
  - WeddingService
  - FileService
  - WeddingRepository
- Used by: Frontend wedding services

#### Guest Management (`GuestController.php`)
- Purpose: Guest operations
- Endpoints:
  ```php
  #[Route('/api/weddings/{id}/guests', methods: ['GET', 'POST'])]
  #[Route('/api/weddings/{id}/guests/bulk', methods: ['POST'])]
  #[Route('/api/weddings/{wedding}/guests/{id}', methods: ['GET', 'PUT', 'DELETE'])]
  ```
- Dependencies:
  - GuestService
  - WeddingRepository
  - TableService
- Used by: Frontend guest services

#### RSVP Management (`RsvpController.php`)
- Purpose: RSVP handling
- Endpoints:
  ```php
  #[Route('/api/rsvp/{token}/guest', methods: ['GET'])]
  #[Route('/api/rsvp/{token}/fields', methods: ['GET'])]
  #[Route('/api/rsvp/{token}', methods: ['POST'])]
  ```
- Dependencies:
  - RsvpService
  - GuestService
  - FormFieldService
- Used by: Frontend RSVP services

#### Table Management (`TableController.php`)
- Purpose: Table and seating
- Endpoints:
  ```php
  #[Route('/api/weddings/{id}/tables', methods: ['GET', 'POST'])]
  #[Route('/api/weddings/{wedding}/tables/{id}', methods: ['GET', 'PUT', 'DELETE'])]
  #[Route('/api/weddings/{wedding}/tables/{id}/assign', methods: ['POST'])]
  ```
- Dependencies:
  - TableService
  - GuestService
  - WeddingRepository
- Used by: Frontend table services

### 2. Entities (`src/Entity/`)

#### User Entity (`User.php`)
- Properties:
  ```php
  private ?int $id;
  private ?string $email;
  private ?string $password;
  private array $roles;
  private ?string $firstName;
  private ?string $lastName;
  private Collection $managedWeddings;
  ```
- Relationships:
  - OneToMany: managedWeddings
- Used by:
  - AuthController
  - UserRepository
  - Security system

#### Wedding Entity (`Wedding.php`)
- Properties:
  ```php
  private ?int $id;
  private ?string $title;
  private ?string $description;
  private ?\DateTimeImmutable $date;
  private ?string $venue;
  private ?User $admin;
  private Collection $guests;
  private Collection $tables;
  private Collection $formFields;
  ```
- Relationships:
  - ManyToOne: admin
  - OneToMany: guests, tables, formFields
- Used by:
  - WeddingController
  - GuestController
  - TableController

#### Guest Entity (`Guest.php`)
- Properties:
  ```php
  private ?int $id;
  private ?string $firstName;
  private ?string $lastName;
  private ?string $email;
  private ?Wedding $wedding;
  private ?Table $table;
  private bool $plusOne;
  private ?string $rsvpToken;
  private string $category;
  ```
- Relationships:
  - ManyToOne: wedding, table
  - OneToOne: rsvpResponse
- Used by:
  - GuestController
  - RsvpController
  - TableController

#### Table Entity (`Table.php`)
- Properties:
  ```php
  private ?int $id;
  private ?string $name;
  private ?int $capacity;
  private ?Wedding $wedding;
  private Collection $guests;
  private string $category;
  ```
- Relationships:
  - ManyToOne: wedding
  - OneToMany: guests
- Used by:
  - TableController
  - GuestController

#### RsvpResponse Entity (`RsvpResponse.php`)
- Properties:
  ```php
  private ?int $id;
  private ?Guest $guest;
  private array $responses;
  private bool $attending;
  private ?\DateTimeImmutable $respondedAt;
  ```
- Relationships:
  - OneToOne: guest
- Used by:
  - RsvpController
  - GuestController

### 3. Repositories (`src/Repository/`)

#### User Repository (`UserRepository.php`)
- Methods:
  ```php
  public function findByEmail(string $email): ?User
  public function findByToken(string $token): ?User
  public function save(User $user): void
  ```
- Used by:
  - AuthController
  - Security system

#### Wedding Repository (`WeddingRepository.php`)
- Methods:
  ```php
  public function findByAdmin(User $admin): array
  public function findWithGuests(int $id): ?Wedding
  public function findWithTables(int $id): ?Wedding
  public function save(Wedding $wedding): void
  ```
- Used by:
  - WeddingController
  - GuestController
  - TableController

#### Guest Repository (`GuestRepository.php`)
- Methods:
  ```php
  public function findByWedding(Wedding $wedding): array
  public function findByToken(string $token): ?Guest
  public function findByTable(Table $table): array
  public function save(Guest $guest): void
  ```
- Used by:
  - GuestController
  - RsvpController
  - TableController

#### Table Repository (`TableRepository.php`)
- Methods:
  ```php
  public function findByWedding(Wedding $wedding): array
  public function findWithGuests(int $id): ?Table
  public function save(Table $table): void
  ```
- Used by:
  - TableController
  - GuestController

### 4. Services (`src/Service/`)

#### Authentication Service (`AuthService.php`)
- Methods:
  ```php
  public function login(string $email, string $password): string
  public function register(array $data): User
  public function refreshToken(string $token): string
  public function validateToken(string $token): bool
  ```
- Dependencies:
  - UserRepository
  - JWTTokenManagerInterface
- Used by:
  - AuthController
  - Security system

#### Wedding Service (`WeddingService.php`)
- Methods:
  ```php
  public function create(array $data, User $admin): Wedding
  public function update(Wedding $wedding, array $data): Wedding
  public function delete(Wedding $wedding): void
  public function uploadImage(Wedding $wedding, UploadedFile $file): string
  ```
- Dependencies:
  - WeddingRepository
  - FileService
- Used by:
  - WeddingController

#### Guest Service (`GuestService.php`)
- Methods:
  ```php
  public function create(Wedding $wedding, array $data): Guest
  public function bulkCreate(Wedding $wedding, array $guests): array
  public function update(Guest $guest, array $data): Guest
  public function delete(Guest $guest): void
  ```
- Dependencies:
  - GuestRepository
  - TableService
- Used by:
  - GuestController
  - RsvpController

#### Table Service (`TableService.php`)
- Methods:
  ```php
  public function create(Wedding $wedding, array $data): Table
  public function update(Table $table, array $data): Table
  public function delete(Table $table): void
  public function assignGuests(Table $table, array $guestIds): void
  ```
- Dependencies:
  - TableRepository
  - GuestRepository
- Used by:
  - TableController

### 5. Security (`src/Security/`)

#### JWT Authenticator (`JwtAuthenticator.php`)
- Purpose: Token authentication
- Methods:
  ```php
  public function authenticate(Request $request): Passport
  public function onAuthenticationSuccess(): Response
  public function onAuthenticationFailure(): Response
  ```
- Used by:
  - Security system
  - All protected endpoints

#### Voters
- `WeddingVoter.php`
  ```php
  public function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool
  // Attributes: VIEW, EDIT, DELETE
  ```

- `TableVoter.php`
  ```php
  public function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool
  // Attributes: VIEW, EDIT, DELETE, ASSIGN_GUESTS
  ```

- `GuestVoter.php`
  ```php
  public function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool
  // Attributes: VIEW, EDIT, DELETE
  ```

## Database Schema

### Core Tables
```sql
CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(180) UNIQUE NOT NULL,
    roles JSON NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
);

CREATE TABLE wedding (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date DATETIME,
    venue VARCHAR(255),
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    FOREIGN KEY (admin_id) REFERENCES user(id)
);

CREATE TABLE guest (
    id INT AUTO_INCREMENT PRIMARY KEY,
    wedding_id INT NOT NULL,
    table_id INT,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    rsvp_token VARCHAR(255) UNIQUE,
    plus_one BOOLEAN DEFAULT false,
    category VARCHAR(50),
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    FOREIGN KEY (wedding_id) REFERENCES wedding(id),
    FOREIGN KEY (table_id) REFERENCES `table`(id)
);

CREATE TABLE `table` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    wedding_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    capacity INT NOT NULL,
    category VARCHAR(50),
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    FOREIGN KEY (wedding_id) REFERENCES wedding(id)
);

CREATE TABLE rsvp_response (
    id INT AUTO_INCREMENT PRIMARY KEY,
    guest_id INT NOT NULL,
    responses JSON NOT NULL,
    attending BOOLEAN NOT NULL,
    responded_at DATETIME NOT NULL,
    FOREIGN KEY (guest_id) REFERENCES guest(id)
);
```

## Common Modification Patterns

### Adding New Guest Field
1. Update database:
   ```sql
   ALTER TABLE guest ADD COLUMN new_field VARCHAR(255);
   ```
2. Update entity:
   ```php
   // Guest.php
   private ?string $newField;
   // Add getter/setter
   ```
3. Update repository:
   ```php
   // GuestRepository.php
   public function findByNewField(string $value): array
   ```
4. Update controller:
   ```php
   // GuestController.php
   // Add field to validation and response
   ```

### Modifying Table Assignment
1. Update service:
   ```php
   // TableService.php
   public function validateAssignment(Table $table, array $guestIds): bool
   ```
2. Update controller:
   ```php
   // TableController.php
   // Add validation logic
   ```
3. Update entity:
   ```php
   // Table.php
   // Add validation rules
   ```

This documentation provides:
1. Detailed backend structure
2. File relationships
3. Database schema
4. Security implementation
5. Common modification patterns 