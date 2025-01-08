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

#### Vendor Management (`VendorController.php`)
- Purpose: Vendor and file management
- Endpoints:
  ```php
  #[Route('/api/weddings/{weddingId}/vendors', methods: ['GET', 'POST'])]
  #[Route('/api/weddings/{weddingId}/vendors/{id}', methods: ['GET', 'PUT', 'DELETE'])]
  #[Route('/api/weddings/{weddingId}/vendors/{id}/files', methods: ['POST'])]
  #[Route('/api/weddings/{weddingId}/vendors/{id}/files/{fileId}', methods: ['DELETE'])]
  ```
- Dependencies:
  - VendorService
  - FileService
  - WeddingRepository
- Used by: Frontend vendor services

#### Task Management (`TaskController.php`)
- Purpose: Task CRUD and management operations
- Endpoints:
  ```php
  #[Route('/api/weddings/{id}/tasks', methods: ['GET', 'POST'])]
  #[Route('/api/weddings/{id}/tasks/incomplete', methods: ['GET'])]
  #[Route('/api/weddings/{id}/tasks/category/{category}', methods: ['GET'])]
  #[Route('/api/weddings/{id}/tasks/overdue', methods: ['GET'])]
  #[Route('/api/weddings/{id}/tasks/upcoming', methods: ['GET'])]
  #[Route('/api/weddings/{id}/tasks/{taskId}', methods: ['GET', 'PUT', 'DELETE'])]
  #[Route('/api/weddings/{id}/tasks/reorder', methods: ['PUT'])]
  ```
- Dependencies:
  - TaskService
  - TaskRepository
  - WeddingRepository
- Used by: Frontend task services

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

#### Vendor Entity (`Vendor.php`)
- Properties:
  ```php
  private ?int $id;
  private ?string $name;
  private ?string $company;
  private ?string $type;
  private string $status;
  private ?string $phone;
  private ?string $email;
  private ?string $website;
  private ?string $address;
  private ?string $notes;
  private ?float $price;
  private ?float $depositAmount;
  private ?bool $depositPaid;
  private ?bool $contractSigned;
  private Collection $files;
  private ?\DateTimeImmutable $createdAt;
  private ?\DateTimeImmutable $updatedAt;
  ```
- Relationships:
  - ManyToOne: wedding
  - OneToMany: files
- Used by:
  - VendorController
  - VendorRepository
  - WeddingController

#### VendorFile Entity (`VendorFile.php`)
- Properties:
  ```php
  private ?int $id;
  private ?Vendor $vendor;
  private ?string $filename;
  private ?string $originalFilename;
  private ?string $mimeType;
  private ?int $size;
  private ?string $type;
  private ?\DateTimeImmutable $createdAt;
  ```
- Relationships:
  - ManyToOne: vendor
- Used by:
  - VendorController
  - FileService

#### Task Entity (`Task.php`)
- Properties:
  ```php
  private ?int $id;
  private ?string $title;
  private ?string $description;
  private ?string $category;
  private ?string $status;
  private int $priority;
  private bool $isCompleted;
  private ?\DateTimeImmutable $dueDate;
  private ?string $notes;
  private int $displayOrder;
  private ?Wedding $wedding;
  private ?\DateTimeImmutable $createdAt;
  private ?\DateTimeImmutable $updatedAt;
  ```
- Relationships:
  - ManyToOne: wedding
- Used by:
  - TaskController
  - TaskRepository
  - TaskService

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

#### Vendor Repository (`VendorRepository.php`)
- Methods:
  ```php
  public function findByWedding(Wedding $wedding): array
  public function findByWeddingAndType(Wedding $wedding, string $type): array
  public function findByWeddingAndStatus(Wedding $wedding, string $status): array
  ```
- Used by:
  - VendorController
  - VendorService

#### VendorFile Repository (`VendorFileRepository.php`)
- Methods:
  ```php
  public function findByVendor(Vendor $vendor): array
  public function findByVendorAndType(Vendor $vendor, string $type): array
  ```
- Used by:
  - VendorController
  - FileService

#### Task Repository (`TaskRepository.php`)
- Methods:
  ```php
  public function findByWedding(Wedding $wedding): array
  public function findIncompleteByWedding(Wedding $wedding): array
  public function findByWeddingAndCategory(Wedding $wedding, string $category): array
  public function findOverdueTasks(Wedding $wedding): array
  public function findUpcomingTasks(Wedding $wedding, int $days): array
  public function save(Task $task, bool $flush = false): void
  public function remove(Task $task, bool $flush = false): void
  ```
- Used by:
  - TaskController
  - TaskService

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

#### Vendor Service (`VendorService.php`)
- Methods:
  ```php
  public function create(array $data, Wedding $wedding): Vendor
  public function update(Vendor $vendor, array $data): Vendor
  public function delete(Vendor $vendor): void
  public function uploadFile(Vendor $vendor, UploadedFile $file): string
  ```
- Dependencies:
  - VendorRepository
  - FileService
- Used by:
  - VendorController

#### Task Service (`TaskService.php`)
- Methods:
  ```php
  public function getTask(int $id): ?Task
  public function update(Task $task, array $data): Task
  public function delete(Task $task): void
  ```
- Dependencies:
  - TaskRepository
  - ValidatorInterface
- Used by:
  - TaskController

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

## Budget Management

### Entities

#### Budget Entity
```php
#[ORM\Entity(repositoryClass: BudgetRepository::class)]
class Budget
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\OneToOne(inversedBy: 'budget')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Wedding $wedding = null;

    #[ORM\Column]
    private float $totalAmount = 0.0;

    #[ORM\Column(type: Types::JSON)]
    private array $categoryAllocations = [];

    #[ORM\OneToMany(mappedBy: 'budget', targetEntity: Expense::class, orphanRemoval: true)]
    private Collection $expenses;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $updatedAt = null;
}
```

#### Expense Entity
```php
#[ORM\Entity(repositoryClass: ExpenseRepository::class)]
class Expense
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'expenses')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Budget $budget = null;

    #[ORM\ManyToOne]
    private ?Vendor $vendor = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $category = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $description = null;

    #[ORM\Column]
    private float $amount = 0.0;

    #[ORM\Column(length: 255)]
    private string $type = 'other';

    #[ORM\Column(length: 255)]
    private string $status = 'pending';

    #[ORM\Column(nullable: true)]
    private ?float $paidAmount = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $dueDate = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $paidAt = null;

    #[ORM\Column]
    private bool $isVendorExpense = false;
}
```

### Services

#### Budget Service
```php
class BudgetService
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private ExpenseService $expenseService
    ) {}

    public function getBudget(Wedding $wedding): ?Budget
    {
        return $this->entityManager->getRepository(Budget::class)
            ->findOneBy(['wedding' => $wedding]);
    }

    public function createBudget(Wedding $wedding, float $totalAmount, array $categoryAllocations): Budget
    {
        $budget = new Budget();
        $budget->setWedding($wedding);
        $budget->setTotalAmount($totalAmount);
        $budget->setCategoryAllocations($categoryAllocations);
        
        $this->entityManager->persist($budget);
        $this->entityManager->flush();
        
        return $budget;
    }

    public function createExpenseFromVendor(Vendor $vendor): void
    {
        $wedding = $vendor->getWedding();
        $budget = $this->getBudget($wedding);
        
        if (!$budget || !$vendor->getPrice()) {
            return;
        }

        // Create deposit expense if applicable
        if ($vendor->getDepositAmount()) {
            $this->expenseService->createExpense(
                $budget,
                $vendor,
                'Deposit for ' . $vendor->getName(),
                $vendor->getDepositAmount(),
                'vendor_deposit',
                $vendor->isDepositPaid() ? 'paid' : 'pending'
            );
        }

        // Create remaining balance expense
        $remainingAmount = $vendor->getPrice() - ($vendor->getDepositAmount() ?? 0);
        if ($remainingAmount > 0) {
            $this->expenseService->createExpense(
                $budget,
                $vendor,
                'Remaining balance for ' . $vendor->getName(),
                $remainingAmount,
                'vendor_total',
                'pending'
            );
        }
    }
}
```

#### Expense Service
```php
class ExpenseService
{
    public function __construct(
        private EntityManagerInterface $entityManager
    ) {}

    public function createExpense(
        Budget $budget,
        ?Vendor $vendor,
        string $description,
        float $amount,
        string $type = 'other',
        string $status = 'pending'
    ): Expense {
        $expense = new Expense();
        $expense->setBudget($budget);
        $expense->setVendor($vendor);
        $expense->setDescription($description);
        $expense->setAmount($amount);
        $expense->setType($type);
        $expense->setStatus($status);
        $expense->setIsVendorExpense($vendor !== null);
        
        if ($status === 'paid') {
            $expense->setPaidAmount($amount);
            $expense->setPaidAt(new \DateTimeImmutable());
        }
        
        $this->entityManager->persist($expense);
        $this->entityManager->flush();
        
        return $expense;
    }

    public function updateExpenseStatus(Expense $expense, string $status, ?float $paidAmount = null): void
    {
        $expense->setStatus($status);
        
        if ($status === 'paid') {
            $expense->setPaidAmount($expense->getAmount());
            $expense->setPaidAt(new \DateTimeImmutable());
        } elseif ($status === 'partial' && $paidAmount !== null) {
            $expense->setPaidAmount($paidAmount);
            $expense->setPaidAt(new \DateTimeImmutable());
        }
        
        $this->entityManager->flush();
    }
}
```

### Controllers

#### Budget Controller
```php
class BudgetController extends AbstractController
{
    #[Route('/api/weddings/{id}/budget', name: 'get_wedding_budget', methods: ['GET'])]
    #[IsGranted('view', 'wedding')]
    public function getBudget(Wedding $wedding): JsonResponse
    {
        $budget = $this->budgetService->getBudget($wedding);
        
        if (!$budget) {
            return $this->json([
                'budget' => null,
                'summary' => [
                    'totalBudget' => 0,
                    'totalSpent' => 0,
                    'totalPaid' => 0,
                    'totalPending' => 0,
                    'remainingBudget' => 0,
                    'categoryAllocations' => [],
                    'spentByCategory' => [],
                    'pendingByCategory' => []
                ]
            ]);
        }

        return $this->json([
            'budget' => $budget,
            'summary' => $this->budgetService->getBudgetSummary($budget)
        ]);
    }

    #[Route('/api/weddings/{id}/expenses', name: 'get_wedding_expenses', methods: ['GET'])]
    #[IsGranted('view', 'wedding')]
    public function getExpenses(Wedding $wedding): JsonResponse
    {
        $budget = $this->budgetService->getBudget($wedding);
        
        return $this->json([
            'expenses' => $budget ? $budget->getExpenses() : [],
            'budget' => $budget,
            'summary' => $budget ? $this->budgetService->getBudgetSummary($budget) : null
        ]);
    }
}
```

### Security

#### Budget Voter
```php
class BudgetVoter extends Voter
{
    protected function supports(string $attribute, mixed $subject): bool
    {
        return in_array($attribute, ['view', 'edit'])
            && $subject instanceof Budget;
    }

    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool
    {
        $user = $token->getUser();
        if (!$user instanceof User) {
            return false;
        }

        $wedding = $subject->getWedding();

        return match($attribute) {
            'view' => $this->canView($wedding, $user),
            'edit' => $this->canEdit($wedding, $user),
            default => false,
        };
    }
}
```

### Vendor-Budget Integration

#### Database Schema
```sql
CREATE TABLE vendor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    wedding_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'contacted',
    price DECIMAL(10,2),
    deposit_amount DECIMAL(10,2),
    deposit_paid BOOLEAN DEFAULT FALSE,
    contract_signed BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (wedding_id) REFERENCES wedding(id)
);

CREATE TABLE expense (
    id INT AUTO_INCREMENT PRIMARY KEY,
    budget_id INT NOT NULL,
    vendor_id INT,
    category VARCHAR(50),
    description TEXT,
    amount DECIMAL(10,2) NOT NULL,
    type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    paid_amount DECIMAL(10,2),
    due_date DATETIME,
    paid_at DATETIME,
    is_vendor_expense BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (budget_id) REFERENCES budget(id),
    FOREIGN KEY (vendor_id) REFERENCES vendor(id)
);
```

#### VendorService with Budget Integration
```php
class VendorService
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private BudgetService $budgetService,
        private FileService $fileService
    ) {}

    public function createVendor(Wedding $wedding, array $data): Vendor
    {
        $vendor = new Vendor();
        $vendor->setWedding($wedding);
        $vendor->setName($data['name']);
        $vendor->setCompany($data['company'] ?? null);
        $vendor->setType($data['type']);
        $vendor->setPrice($data['price'] ?? null);
        $vendor->setDepositAmount($data['depositAmount'] ?? null);
        $vendor->setDepositPaid($data['depositPaid'] ?? false);
        
        $this->entityManager->persist($vendor);
        $this->entityManager->flush();
        
        // Create vendor expenses in budget if price is set
        if ($vendor->getPrice()) {
            $this->budgetService->createExpenseFromVendor($vendor);
        }
        
        return $vendor;
    }

    public function updateVendor(Vendor $vendor, array $data): Vendor
    {
        $oldPrice = $vendor->getPrice();
        $oldDeposit = $vendor->getDepositAmount();
        $oldDepositPaid = $vendor->isDepositPaid();
        
        // Update vendor data
        $vendor->setName($data['name']);
        $vendor->setCompany($data['company'] ?? null);
        $vendor->setType($data['type']);
        $vendor->setPrice($data['price'] ?? null);
        $vendor->setDepositAmount($data['depositAmount'] ?? null);
        $vendor->setDepositPaid($data['depositPaid'] ?? false);
        
        $this->entityManager->flush();
        
        // Sync expenses if financial details changed
        if ($oldPrice !== $vendor->getPrice() ||
            $oldDeposit !== $vendor->getDepositAmount() ||
            $oldDepositPaid !== $vendor->isDepositPaid()) {
            $this->budgetService->syncVendorExpenses($vendor);
        }
        
        return $vendor;
    }
}
```

#### BudgetService with Vendor Integration
```php
class BudgetService
{
    public function syncVendorExpenses(Vendor $vendor): void
    {
        $budget = $this->getBudget($vendor->getWedding());
        if (!$budget) {
            return;
        }

        // Remove existing vendor expenses
        $existingExpenses = $this->expenseRepository->findBy([
            'vendor' => $vendor,
            'budget' => $budget
        ]);
        foreach ($existingExpenses as $expense) {
            $this->entityManager->remove($expense);
        }
        
        // Create new expenses based on current vendor data
        $this->createExpenseFromVendor($vendor);
        
        $this->entityManager->flush();
    }

    public function createExpenseFromVendor(Vendor $vendor): void
    {
        $budget = $this->getBudget($vendor->getWedding());
        if (!$budget || !$vendor->getPrice()) {
            return;
        }

        // Create deposit expense if applicable
        if ($vendor->getDepositAmount()) {
            $depositExpense = new Expense();
            $depositExpense->setBudget($budget);
            $depositExpense->setVendor($vendor);
            $depositExpense->setCategory($vendor->getType());
            $depositExpense->setDescription('Deposit for ' . $vendor->getName());
            $depositExpense->setAmount($vendor->getDepositAmount());
            $depositExpense->setType('vendor_deposit');
            $depositExpense->setStatus($vendor->isDepositPaid() ? 'paid' : 'pending');
            $depositExpense->setIsVendorExpense(true);
            
            if ($vendor->isDepositPaid()) {
                $depositExpense->setPaidAmount($vendor->getDepositAmount());
                $depositExpense->setPaidAt(new \DateTimeImmutable());
            }
            
            $this->entityManager->persist($depositExpense);
        }

        // Create remaining balance expense
        $remainingAmount = $vendor->getPrice() - ($vendor->getDepositAmount() ?? 0);
        if ($remainingAmount > 0) {
            $balanceExpense = new Expense();
            $balanceExpense->setBudget($budget);
            $balanceExpense->setVendor($vendor);
            $balanceExpense->setCategory($vendor->getType());
            $balanceExpense->setDescription('Remaining balance for ' . $vendor->getName());
            $balanceExpense->setAmount($remainingAmount);
            $balanceExpense->setType('vendor_total');
            $balanceExpense->setStatus('pending');
            $balanceExpense->setIsVendorExpense(true);
            
            $this->entityManager->persist($balanceExpense);
        }
        
        $this->entityManager->flush();
    }
}
```

#### ExpenseRepository with Vendor Queries
```php
class ExpenseRepository extends ServiceEntityRepository
{
    public function findVendorExpenses(Vendor $vendor): array
    {
        return $this->createQueryBuilder('e')
            ->andWhere('e.vendor = :vendor')
            ->andWhere('e.isVendorExpense = true')
            ->setParameter('vendor', $vendor)
            ->orderBy('e.type', 'ASC')
            ->getQuery()
            ->getResult();
    }

    public function findExpensesByCategory(Budget $budget): array
    {
        return $this->createQueryBuilder('e')
            ->select('e.category', 'SUM(e.amount) as total', 'SUM(e.paidAmount) as paid')
            ->andWhere('e.budget = :budget')
            ->setParameter('budget', $budget)
            ->groupBy('e.category')
            ->getQuery()
            ->getResult();
    }
}
```

This documentation provides:
1. Detailed backend structure
2. File relationships
3. Database schema
4. Security implementation
5. Common modification patterns 