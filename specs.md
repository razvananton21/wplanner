# Wedding Planner Application - Technical Specification

## Infrastructure

### Docker Configuration

#### Container Architecture
1. **Frontend Container (`frontend`)**
   - Base: Node 18 Alpine
   - Development port: 3000
   - Volume mounts:
     - `./frontend:/app`
     - `/app/node_modules` (anonymous volume)
   - Development mode with hot reload
   - Production build uses Nginx
   - **API Routing**:
     - All API requests are made to `http://localhost:3000/api`
     - Vite dev server proxies `/api` requests to the backend container
     - Proxy target: `http://backend` (Docker container name)
     - This setup ensures consistent API routing in development

2. **Backend Container (`backend`)**
   - Base: PHP 8.2 Apache
   - Port: 80
   - Container name: `backend`
   - Volume mounts:
     - `./backend:/var/www/html`
     - `/var/www/html/vendor` (anonymous volume)
   - Apache with mod_rewrite enabled
   - JWT key generation during build
   - Composer for dependency management
   - **API Endpoints**:
     - All endpoints are under `/api` prefix
     - Accessible within Docker network as `http://backend`
     - Accessible from host as `http://localhost:80`

3. **Database Container (`database`)**
   - MySQL 8.0
   - Port: 3306
   - Environment variables:
     - MYSQL_ROOT_PASSWORD: root
     - MYSQL_DATABASE: wplanner
   - Persistent volume: mysql_data

#### Container Dependencies
- Frontend depends on Backend
- Backend depends on Database

### Network Configuration

#### Development Environment
- Frontend Vite dev server runs on port 3000
  - All frontend code makes API requests to `http://localhost:3000/api`
  - Vite's proxy configuration forwards these to the backend container
  - This is the ONLY correct configuration for development
  - Never modify API requests to use port 8000 or any other port

#### CORS Configuration (Apache)
- Allowed Origin: http://localhost:3000
- Allowed Methods: GET, POST, PUT, DELETE, OPTIONS
- Allowed Headers: Content-Type, Authorization, Accept
- Credentials: Allowed
- Exposed Headers: Authorization

## Application Architecture

### Frontend Architecture

#### Core Technologies
- React (JavaScript)
- Redux Toolkit for state management
- Material-UI component library with custom styled components
- React Router for routing
- Axios for API communication
- Styled Components for advanced styling
- Glass-morphism and modern UI effects

#### Key Components
1. **Authentication**
   - Login/Register forms
   - JWT token management
   - Protected routes

2. **Wedding Management**
   - Wedding creation/editing
   - Wedding details display
   - Wedding settings

3. **Guest Management**
   - Guest list view
   - Guest creation/editing
   - Bulk guest import
   - RSVP tracking

4. **RSVP Form System**
   - Modern, mobile-first design
   - Glass-morphism effects with backdrop blur
   - Custom styled components:
     - AttendancePill: Modern toggle container with hover effects
     - StyledCard: Enhanced cards with glass effect
     - StyledTextField: Modern input fields with hover states
     - StyledSwitch: Custom-designed toggle switch
     - StyledButton: Gradient buttons with animations
     - SectionPaper: Section containers with hover effects
   - Enhanced UX features:
     - Smooth transitions and animations
     - Visual feedback on all interactions
     - Responsive typography
     - Intuitive form sections
     - Clear visual hierarchy
   - Mobile optimizations:
     - Touch-friendly hit areas
     - Responsive spacing
     - Optimized font sizes
     - Adaptive layouts
   - Visual enhancements:
     - Gradient backgrounds
     - Subtle shadows
     - Consistent border radiuses
     - Modern color transitions
     - Interactive hover states

#### Form Field Types
1. **Text Input**
   - Enhanced styling with hover effects
   - Clear focus states
   - Consistent padding and spacing

2. **Text Area**
   - Multi-line input support
   - Expandable area
   - Styled consistently with other inputs

3. **Dropdown Select**
   - Custom styled menu items
   - Clear selected state
   - Smooth open/close animations

4. **Checkbox**
   - Modern checkbox design
   - Container with hover effects
   - Clear selected state visualization

5. **Radio Buttons**
   - Card-style option containers
   - Visual feedback on selection
   - Hover and active states
   - Grouped in an intuitive layout

6. **Date Picker**
   - Integrated with form styling
   - Clear date selection
   - Mobile-friendly interface

#### UI/UX Features
1. **Attendance Toggle**
   - Prominent pill-style container
   - Clear Yes/No labels
   - Smooth state transitions
   - Encouraging feedback messages
   - Centered layout for emphasis

2. **Form Sections**
   - Grouped fields by purpose
   - Clear section headers
   - Consistent spacing
   - Visual separation
   - Hover effects for interaction

3. **Responsive Design**
   - Adapts to all screen sizes
   - Optimized spacing for mobile
   - Touch-friendly controls
   - Readable typography at all sizes

4. **Visual Feedback**
   - Hover effects on all interactive elements
   - Clear focus states
   - Loading indicators
   - Success/error states
   - Update notifications

5. **Accessibility**
   - High contrast text
   - Clear focus indicators
   - Proper ARIA labels
   - Keyboard navigation support

#### Design System
1. **Colors**
   - Primary color with gradient variations
   - Semantic colors for states
   - Consistent opacity levels
   - Smooth transitions

2. **Typography**
   - Responsive font sizes
   - Clear hierarchy
   - Consistent weights
   - Optimal line heights

3. **Spacing**
   - Consistent spacing scale
   - Responsive margins/padding
   - Proper element separation
   - Mobile-optimized gaps

4. **Effects**
   - Glass-morphism
   - Subtle shadows
   - Smooth transitions
   - Hover animations
   - Focus effects

### Code Organization

#### Directory Structure
- `/components` - React components organized by feature
  - `/form-builder` - Form builder related components
  - `/rsvp` - RSVP system components
  - `/guests` - Guest management components
  - `/tables` - Table management components
  - `/layout` - Layout components
  - `/routing` - Routing components
  - `/shared` - Shared/common components
- `/services` - API and service layer
- `/store` - Redux store and slices
- `/hooks` - Custom React hooks
- `/theme` - Theme configuration
- `/pages` - Page components
- `/styles` - Global styles

#### Code Maintenance
- Regular cleanup of unused files
- Consistent file organization
- Clear component hierarchy
- Proper separation of concerns
- Documentation of changes in specification files

### Backend Architecture

#### Core Technologies
- Symfony 6 Framework
- Doctrine ORM
- JWT Authentication
- MySQL Database
- Monolog for logging
- MailHog for email testing in development

#### Entity Structure

1. **User Entity**
   ```php
   class User
   {
       private ?int $id;
       private ?string $email;
       private ?string $name;
       private array $roles;
       private ?string $password;
       private ?string $firstName;
       private ?string $lastName;
       private ?string $phone;
       private Collection $managedWeddings;
       private Collection $invitations;
       private ?Table $tableAssignment;
       private ?array $preferences;
       private \DateTimeImmutable $createdAt;
       private \DateTimeImmutable $updatedAt;
   }
   ```

2. **Wedding Entity**
   ```php
   class Wedding
   {
       private ?int $id;
       private ?string $title;
       private ?string $description;
       private ?\DateTimeImmutable $date;
       private ?string $venue;
       private ?string $language;
       private ?User $admin;
       private Collection $tables;
       private Collection $photos;
       private Collection $invitations;
       private Collection $formFields;
       private ?\DateTimeImmutable $deletedAt;
   }
   ```

3. **Guest Entity**
   ```php
   class Guest
   {
       private ?int $id;
       private ?string $firstName;
       private ?string $lastName;
       private ?string $email;
       private string $status;
       private ?Wedding $wedding;
       private ?Table $table;
       private ?string $dietaryRestrictions;
       private bool $plusOne;
       private ?string $rsvpToken;
       private string $category;
   }
   ```

4. **WeddingFormField Entity**
   ```php
   class WeddingFormField
   {
       private ?int $id;
       private ?Wedding $wedding;
       private ?string $label;
       private string $type;
       private ?array $options;
       private bool $required;
       private int $displayOrder;
       private ?string $placeholder;
       private ?string $helpText;
       private string $section;
   }
   ```

5. **RsvpResponse Entity**
   ```php
   class RsvpResponse
   {
       private ?int $id;
       private ?Guest $guest;
       private ?WeddingFormField $field;
       private ?string $value;
   }
   ```

6. **Notification Entity**
   ```php
   class Notification
   {
       private ?int $id;
       private ?Wedding $wedding;
       private ?string $type;
       private ?string $message;
       private bool $isRead;
       private ?\DateTimeImmutable $createdAt;
       private ?\DateTimeImmutable $readAt;
       private ?Guest $guest;
   }
   ```

### Table Management [✓]

#### Entity Structure [✓]
```php
class Table
{
    private ?int $id;
    private ?string $name;
    private ?int $capacity;
    private ?int $minCapacity;
    private string $shape;
    private ?array $dimensions;
    private ?string $location;
    private bool $isVIP;
    private ?array $metadata;
    private ?Wedding $wedding;
    private Collection $guests;
    private int $guestCount;
    private int $availableSeats;
}
```

#### API Endpoints [✓]

1. **Table Management**
   - GET `/api/weddings/{id}/tables` - List all tables for a wedding ✓
   - POST `/api/weddings/{id}/tables` - Create a new table ✓
   - GET `/api/tables/{id}` - Get table details ✓
   - PUT `/api/tables/{id}` - Update table ✓
   - DELETE `/api/tables/{id}` - Delete table ✓

2. **Guest Assignment**
   - PUT `/api/tables/{id}/guests` - Assign guests to table ✓
   - DELETE `/api/tables/{id}/guests/{guestId}` - Remove guest from table ✓
   - POST `/api/tables/validate-assignment` - Validate guest assignments ✓

#### Security [✓]

1. **Table Voter**
   - Supports view, edit, delete, and assign_guests attributes ✓
   - Checks user permissions based on wedding ownership ✓
   - Validates guest assignment operations ✓

2. **Security Annotations**
   - `#[IsGranted('view', 'wedding')]` for listing tables ✓
   - `#[IsGranted('edit', 'wedding')]` for creating tables ✓
   - `#[IsGranted('view', 'table')]` for viewing table details ✓
   - `#[IsGranted('edit', 'table')]` for updating tables ✓
   - `#[IsGranted('delete', 'table')]` for deleting tables ✓
   - `#[IsGranted('assign_guests', 'table')]` for guest assignments ✓

#### Frontend Components [✓]

1. **TableList**
   - Displays all tables for a wedding ✓
   - Supports adding, editing, and deleting tables ✓
   - Shows table details including capacity and guest count ✓
   - Provides access to guest assignment functionality ✓

2. **TableForm**
   - Form for creating and editing tables ✓
   - Fields:
     - Name ✓
     - Capacity ✓
     - Minimum Capacity ✓
     - Shape (round, rectangular, square) ✓
     - Location (optional) ✓
     - VIP status ✓

3. **TableAssignment**
   - Interface for managing guest assignments ✓
   - Displays:
     - Currently assigned guests ✓
     - Available guests ✓
     - Capacity information ✓
   - Features:
     - Drag and drop interface ✓
     - Search functionality ✓
     - Validation of assignments ✓
     - Dietary restrictions display ✓

#### State Management [✓]

1. **Table Slice**
   - Manages table data in Redux store ✓
   - Handles async operations:
     - Fetching tables ✓
     - Creating tables ✓
     - Updating tables ✓
     - Deleting tables ✓
     - Guest assignments ✓
   - Tracks loading and error states ✓

2. **Table Service**
   - Handles API communication ✓
   - Methods for all table operations ✓
   - Uses axios instance with JWT authentication ✓

#### Features [✓]
- Table creation and management ✓
- Guest seating assignments ✓
- Capacity tracking ✓
- VIP table designation ✓
- Location tracking ✓
- Guest count monitoring ✓
- Available seats calculation ✓
- Assignment validation ✓
- Dietary restrictions consideration ✓
- Timeline management ✓

#### API Endpoints

1. **Authentication**
   - POST `/api/login` - User login
   - POST `/api/register` - User registration

2. **Wedding Management**
   - GET `/api/weddings` - List weddings
   - POST `/api/weddings` - Create wedding
   - GET `/api/weddings/{id}` - Get wedding details
   - PUT `/api/weddings/{id}` - Update wedding
   - DELETE `/api/weddings/{id}` - Delete wedding

3. **Guest Management**
   - GET `/api/weddings/{id}/guests` - List guests
   - POST `/api/weddings/{id}/guests` - Create guest
   - PUT `/api/weddings/{id}/guests/{guestId}` - Update guest
   - DELETE `/api/weddings/{id}/guests/{guestId}` - Delete guest
   - POST `/api/weddings/{id}/guests/bulk` - Bulk create guests

4. **Timeline Management**
   - GET `/api/weddings/{id}/timeline` - List timeline events
   - POST `/api/weddings/{id}/timeline` - Create timeline event
   - PUT `/api/weddings/{id}/timeline/{eventId}` - Update timeline event
   - DELETE `/api/weddings/{id}/timeline/{eventId}` - Delete timeline event

5. **Form Builder**
   - GET `/api/weddings/{id}/rsvp-form` - List form fields (excludes deleted fields)
   - POST `/api/weddings/{id}/rsvp-form` - Create form field
   - PUT `/api/weddings/{id}/rsvp-form/{fieldId}` - Update form field
   - DELETE `/api/weddings/{id}/rsvp-form/{fieldId}` - Soft delete form field
   - PUT `/api/weddings/{id}/rsvp-form/reorder` - Reorder form fields

6. **RSVP System**
   - GET `/api/rsvp/{token}/guest` - Get guest details and existing responses
     - Returns only active (non-deleted) form fields
     - Includes responses for deleted fields marked as obsolete
     - Sets needsUpdate flag when form structure has changed
   - GET `/api/rsvp/{token}/fields` - Get active form fields only
   - POST `/api/rsvp/{token}` - Submit RSVP (updates guest status and stores responses)
   - GET `/api/weddings/{weddingId}/guests/{guestId}/rsvp` - Get RSVP responses

   Response handling:
   - Guest responses are stored in the `rsvp_response` table
   - Each response links to a specific form field and guest
   - Responses are preserved when fields are soft-deleted
   - Guest status is automatically updated based on attendance choice
   - Previous responses are loaded when revisiting the RSVP form
   - All responses are visible in the wedding management interface
   - Soft-deleted fields are marked as obsolete in responses

7. **Notification System**
   - GET `/api/weddings/{id}/notifications` - List notifications
   - PUT `/api/notifications/{id}/read` - Mark notification as read
   - PUT `/api/weddings/{id}/notifications/read-all` - Mark all notifications as read

#### Email System
- Development environment uses MailHog
  - SMTP server on port 1025
  - Web interface on port 8025
  - Captures all outgoing emails
  - No actual emails sent in development
- Email types:
  - RSVP invitations
  - RSVP confirmation
  - Notification emails

### Security

#### Authentication
- JWT-based authentication
  - Token expiration set to 7 days (604800 seconds)
  - Token generation with private/public key pair
  - Token validation middleware
  - Role-based access control
  - User email as token identifier
  - Bearer token authorization
  - Query parameter token support
  - No cookie-based tokens

#### Data Protection
- HTTPS enforcement
- CSRF protection
- Input validation
- SQL injection prevention
- XSS protection
- Rate limiting

### Database Schema
- Proper foreign key constraints
- Indexes on frequently queried fields
- Soft delete implementation where needed
- Audit timestamps (created_at, updated_at)

## Development Workflow

### Local Development
1. Start containers: `docker-compose up -d`
2. Frontend available at: http://localhost:3000
3. Backend API at: http://localhost:80
4. Database at: localhost:3306

### Environment Configuration
- Frontend: `.env` for API base URL
- Backend: `.env` for database, JWT, and other services
- Docker: `docker-compose.yml` for container configuration
- Symfony commands configured to run non-interactively by default
  - All doctrine:migrations commands run without confirmation
  - Configuration set in `services.yaml`
  - Improves automation and CI/CD workflow

### Data Management

#### Soft Delete Implementation
- Entities supporting soft delete:
  - Wedding (deletedAt field)
  - Guest (deletedAt field)
  - WeddingFormField (deletedAt field)
- Benefits:
  - Preserves data integrity
  - Maintains referential integrity
  - Allows data recovery
  - Prevents cascade delete issues with RSVP responses
- Implementation:
  - Uses nullable DateTimeImmutable field
  - Repository methods exclude deleted records
  - Delete operations set timestamp instead of removing records

### RSVP System

#### API Endpoints

1. **RSVP Form**
   - GET `/api/rsvp/{token}/guest` - Get guest details and existing responses
     - Returns guest information, status, and previous responses
     - Includes `needsUpdate` flag and update message only for existing responses
     - Guest status affects default attendance state:
       - 'pending': attending defaults to true
       - 'confirmed': attending defaults to true
       - 'declined': attending defaults to false
   - GET `/api/rsvp/{token}/fields` - Get form fields
   - POST `/api/rsvp/{token}` - Submit RSVP (updates guest status and stores responses)

#### Frontend Routes
- `/rsvp/{token}` - RSVP form page
  - Handles new submissions and updates
  - Shows update message only when form fields have changed
  - Maintains consistent attendance state based on guest status

#### Response Handling
- Guest responses are stored in the `rsvp_response` table
- Each response links to a specific form field and guest
- Responses are preserved and can be updated
- Guest status is automatically updated based on attendance choice
- Previous responses are loaded when revisiting the RSVP form
- All responses are visible in the wedding management interface

#### Form Behavior
- New RSVPs default to "attending" state
- Update notifications only shown for existing responses
- Form fields dynamically shown/hidden based on attendance
- Attendance switch reflects guest's current status
- Proper handling of first-time vs update submissions 

### Guest Management

#### Plus-One System
- Guest Entity:
  - `plusOne` boolean field to indicate if guest can bring a plus-one
  - `plusOneOf` relationship to track which guest brought them as plus-one
  - `plusOnes` collection to track plus-ones brought by this guest
- Soft Delete Implementation:
  - Plus-one guests are soft-deleted when:
    - The main guest is deleted
    - The plus-one is removed via RSVP form
    - The main guest's plus-one capability is revoked
- Data Integrity:
  - Maintains relationship between main guest and plus-one
  - Preserves historical data through soft deletes
  - Allows reactivation of previously added plus-ones

#### Guest List Display
- Main Guest Card:
  - Shows "Bringing [Plus-One Name] as plus one" when they have added a plus-one
  - Displays status (confirmed/pending/declined)
  - Shows guest category
- Plus-One Guest Card:
  - Shows "Plus one of [Main Guest Name]"
  - Inherits wedding access from main guest
  - Maintains separate RSVP responses

#### Guest Creation
- Add Guest Form:
  - "Allow Plus One" toggle switch
  - When enabled, allows guest to add a plus-one via RSVP
  - Plus-one capability can be modified later
- Bulk Import:
  - Supports plus-one flag in import data
  - Maintains plus-one relationships

### Code Maintenance [✓]
- Regular cleanup of unused entities and files
  - Removed unused `GuestResponse` entity and repository
  - Removed unused `TableConfiguration` entity
  - Fixed incorrect `setName` usage in `User` entity
  - Proper separation between `firstName` and `lastName`
- Consistent file organization
- Clear component hierarchy
- Proper separation of concerns
- Documentation of changes in specification files