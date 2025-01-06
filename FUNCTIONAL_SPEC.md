# Wedding Planner Application - Functional Specification

## Overview
A comprehensive wedding planning application that helps couples manage their wedding preparations, guest lists, and seating arrangements.

## Current Implementation Status

### 1. Authentication System [✓]
- User registration with email validation
- JWT-based authentication
- Role-based access control
- Secure password handling
- Protected routes in frontend
- Token refresh mechanism

### 2. Guest Management System [✓]

#### Guest Entity Structure [✓]
```php
class Guest
{
    private ?int $id = null;
    private ?string $firstName = null;
    private ?string $lastName = null;
    private ?string $email = null;
    private string $status = 'pending';
    private ?Wedding $wedding = null;
    private ?Table $table = null;
    private ?string $dietaryRestrictions = null;
    private bool $plusOne = false;
    private ?string $rsvpToken = null;
    private string $category = 'guest';
    private ?\DateTimeImmutable $deletedAt = null;
}
```

#### Features [✓]
- Create individual guests
- Bulk upload guests via CSV
- Edit guest details
- Delete guests
- View guest list with filters and search
- Automatic RSVP token generation
- Email sending with RSVP links
- Guest categorization (guest, family, etc.)
- Plus-one guest support
- Dietary restrictions tracking
- Table assignments
- Soft delete support
- Data preservation after deletion

### 3. RSVP System [✓]

#### Form Design [✓]
- Modern, mobile-first interface
- Intuitive form flow and navigation
- Clear visual hierarchy
- Responsive design for all devices
- Optimized touch interactions
- Smooth animations and transitions

#### Attendance Toggle [✓]
- Prominent placement for key decision
- Clear Yes/No options with visual feedback
- Encouraging messages based on selection
- Smooth state transitions
- Mobile-optimized touch targets

#### Form Fields [✓]
- Multiple field types supported:
  - Text input with modern styling
  - Multi-line text areas
  - Dropdown selects with smooth animations
  - Checkboxes with clear states
  - Radio buttons with card-style options
  - Date picker with consistent styling
- Enhanced visual feedback:
  - Hover effects
  - Focus states
  - Selection indicators
  - Error states
- Accessibility features:
  - Clear labels
  - High contrast
  - Keyboard navigation
  - Screen reader support

#### Visual Design [✓]
- Glass-morphism effects:
  - Subtle transparency
  - Backdrop blur
  - Modern card design
- Consistent styling:
  - Typography scale
  - Color palette
  - Spacing system
  - Border radiuses
- Interactive elements:
  - Hover animations
  - Click/tap feedback
  - Loading states
  - Success/error indicators

#### Mobile Experience [✓]
- Touch-optimized:
  - Large hit areas
  - Proper spacing
  - Easy scrolling
- Responsive layout:
  - Adapts to screen size
  - Maintains readability
  - Preserves functionality
- Performance optimized:
  - Smooth animations
  - Quick loading
  - Efficient updates

#### Form Sections [✓]
- Logical grouping of fields
- Clear section headers
- Visual separation
- Collapsible when not needed
- Maintains context

#### Update Handling [✓]
- Clear update notifications
- Pre-filled existing responses
- Visual indicators for changes
- Smooth transition between states
- Data preservation

#### RSVP Response Management [✓]
- Public RSVP form accessible via unique token
- Smart attendance handling:
  - New RSVPs default to "attending"
  - Status-based defaults (pending/confirmed -> attending, declined -> not attending)
  - Attendance choice preserved on updates
- Custom form field responses
- Response storage and retrieval
- Guest status tracking (pending/confirmed/declined)
- No authentication required for RSVP submissions
- Response viewing in guest list
- Persistent form responses with prefilling on revisit
- Complete response history in wedding management interface
- Intelligent field handling:
  - Only active fields shown in form
  - Deleted fields marked as obsolete
  - Previous responses preserved
  - Clear update indicators when form changes

#### Plus-One Management
1. **Guest Creation with Plus-One Option**
   - Toggle switch in guest creation form
   - When enabled, guest can bring one additional person
   - Plus-one capability visible in guest list

2. **RSVP Form Plus-One Section**
   - Only visible if guest has plus-one capability
   - Collects essential information:
     - First Name (required)
     - Last Name (required)
     - Email (optional)
     - Same form fields as main guest
   - Toggle switch to indicate bringing a plus-one
   - Dynamic form display based on toggle state

3. **Plus-One Data Management**
   - Plus-ones stored as separate guest entities
   - Linked to main guest through relationship
   - Soft delete implementation for data integrity
   - Automatic deletion when:
     - Main guest is deleted
     - Plus-one is removed from RSVP
     - Plus-one capability is revoked

4. **Guest List Display**
   - Clear indication of plus-one relationships
   - Main guest shows "Bringing [Name] as plus one"
   - Plus-one shows "Plus one of [Name]"
   - Status indicators for both guests
   - Proper handling in guest list filters

5. **Data Consistency**
   - Plus-one responses stored separately
   - Status sync between main guest and plus-one
   - Proper handling of RSVP updates
   - Historical data preservation through soft deletes

### 4. Table Management [✓]
- Table creation and management ✓
  - Name, capacity, and shape configuration ✓
  - VIP table designation ✓
  - Location tracking ✓
  - Minimum capacity settings ✓
  - Available seats monitoring ✓
- Guest seating assignments ✓
  - Drag-and-drop interface ✓
  - Search functionality ✓
  - Capacity validation ✓
  - Dietary restrictions display ✓
  - Guest count tracking ✓
- Table capacity management ✓
  - Maximum capacity limits ✓
  - Minimum capacity requirements ✓
  - Available seats calculation ✓
  - Capacity validation ✓
- Dietary restrictions visualization ✓
  - Display in guest list ✓
  - Consideration during assignments ✓
  - Warning indicators ✓
- Conflict detection ✓
  - Capacity limit enforcement ✓
  - Assignment validation ✓
  - Real-time feedback ✓
  - Wedding membership validation ✓
  - Duplicate assignment prevention ✓

### 5. Wedding Details [⏳]
- Basic wedding information
- Timeline management
- Vendor management
- Budget tracking
- Task checklist
- Photo gallery

### 6. Notification System [✓]

#### Features
- RSVP submission notifications
- RSVP update notifications
- Notification management interface
- Mark notifications as read
- Bulk mark notifications as read
- Real-time notification updates

#### Notification Types
- New RSVP submission
- RSVP update
- Guest status changes
- Future: Table assignment notifications
- Future: Wedding detail updates

### 7. Email System [✓]

#### Development Environment
- MailHog integration
- Email capture and display
- Web interface for email review
- No external email service required

#### Email Features
- RSVP invitation emails
- RSVP confirmation emails
- Notification emails
- Email template support
- HTML email support
- Future: Custom email templates

## Technical Architecture
- Frontend: React with Material-UI
- Backend: Symfony 6
- Database: MySQL
- Authentication: JWT
- File Storage: Local/S3
- Email: SMTP/SES
- Docker containerization

## Security Considerations
- HTTPS enforcement
- CSRF protection
- Input validation
- Rate limiting
- SQL injection prevention
- XSS protection
- JWT token security
- Role-based access control

## User Interface
- Material Design components
- Responsive layout
- Mobile-friendly design
- Intuitive navigation
- Form validation feedback
- Loading states
- Error handling
- Success notifications

## Future Enhancements
1. Table Management
   - Interactive seating chart
   - Table templates
   - Guest preferences consideration
   - Group seating optimization

2. Wedding Details
   - Timeline visualization
   - Budget charts and reports
   - Vendor contact management
   - Task reminders and notifications
   - Photo upload and organization

3. Enhanced RSVP Features
   - Email template customization
   - Response analytics and reporting
   - Multilingual support
   - QR code generation for RSVP links
   - Guest meal preferences
   - Plus-one guest details collection

## Data Management

### Soft Delete Implementation [✓]
- Non-destructive deletion
- Data recovery possible
- Maintains data relationships
- Preserves historical data
- Prevents orphaned records

### Logging System [✓]
- Monolog integration
- Structured logging
- Error tracking
- Debug information
- Activity logging
