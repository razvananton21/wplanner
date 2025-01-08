# Comprehensive Codebase Documentation

## Project Structure Overview

### Entry Points and Core Files

#### Frontend Entry (`frontend/src/`)
- `main.jsx`
  - Application bootstrap
  - Redux store initialization
  - Theme provider setup
  - Router configuration
  - Root render point
  - Dependencies: React, Redux, MUI Theme

- `App.jsx`
  - Root component
  - Route definitions
  - Layout wrapper
  - Authentication guard
  - Global error boundary
  - Dependencies: Layout components, Router components

### Frontend Architecture

#### Component Organization (`frontend/src/components/`)

1. **Layout Components** (`components/layout/`)
   - `Layout.jsx`: Main layout wrapper
     - Manages responsive sidebar
     - Handles navigation state
     - Provides context providers
     - Used by: All authenticated pages
     - Dependencies: Header, Sidebar, Navigation

   - `Header.jsx`: Application header
     - User profile menu
     - Notification center
     - Quick actions
     - Used by: Layout.jsx
     - Dependencies: NotificationService, AuthContext

   - `Sidebar.jsx`: Navigation sidebar
     - Dynamic menu generation
     - Active route highlighting
     - Collapse/expand logic
     - Used by: Layout.jsx
     - Dependencies: Navigation config, Router

2. **Wedding Components** (`components/weddings/`)
   - `WeddingList.jsx`: Wedding management
     - Grid/list view toggle
     - Wedding card rendering
     - Sorting and filtering
     - Used by: WeddingsPage
     - Dependencies: WeddingService, WeddingCard

   - `WeddingDetails.jsx`: Wedding information
     - Tab-based navigation
     - Section management
     - Form handling
     - Used by: WeddingPage
     - Dependencies: All wedding-related services

   - `WeddingForm.jsx`: Wedding creation/editing
     - Multi-step form
     - Validation logic
     - Image handling
     - Used by: CreateWeddingPage, EditWeddingPage
     - Dependencies: WeddingService, FormBuilder

3. **Guest Components** (`components/guests/`)
   - `GuestList.jsx`: Guest management
     - Table/grid view
     - Bulk actions
     - Filter system
     - Used by: GuestsPage, WeddingDetails
     - Dependencies: GuestService, TableService

   - `GuestForm.jsx`: Guest creation/editing
     - Form validation
     - Plus-one handling
     - Category management
     - Used by: GuestList, GuestDialog
     - Dependencies: GuestService, ValidationUtils

4. **RSVP Components** (`components/rsvp/`)
   - `RsvpForm.jsx`: Public RSVP form
     - Dynamic field rendering
     - Validation system
     - Plus-one handling
     - Used by: RsvpPage
     - Dependencies: RsvpService, FormBuilder

   - `FormBuilder.jsx`: RSVP form builder
     - Field type selection
     - Drag-and-drop ordering
     - Preview mode
     - Used by: WeddingDetails
     - Dependencies: FormFieldService

5. **Table Components** (`components/tables/`)
   - `TableList.jsx`: Table management
     - Grid view
     - Capacity tracking
     - Category filtering
     - Used by: TablesPage
     - Dependencies: TableService

   - `TableAssignment.jsx`: Guest seating
     - Drag-and-drop interface
     - Capacity validation
     - Auto-assignment
     - Used by: TableList
     - Dependencies: TableService, GuestService

#### Services (`frontend/src/services/`)

1. **API Configuration** (`services/api.js`)
   - Base axios instance
   - Request/response interceptors
   - Error handling
   - Token management
   - Used by: All service modules

2. **Authentication** (`services/authService.js`)
   - Login/logout handling
   - Token management
   - User session
   - Used by: Auth components, Guards
   - Endpoints: POST /login, POST /logout

3. **Wedding Management** (`services/weddingService.js`)
   - CRUD operations
   - File uploads
   - Settings management
   - Used by: Wedding components
   - Endpoints: All /weddings/* routes

4. **Guest Management** (`services/guestService.js`)
   - Guest CRUD
   - Bulk operations
   - RSVP management
   - Used by: Guest components
   - Endpoints: All /guests/* routes

5. **RSVP Handling** (`services/rsvpService.js`)
   - Form submission
   - Token validation
   - Response tracking
   - Used by: RSVP components
   - Endpoints: All /rsvp/* routes

6. **Table Management** (`services/tableService.js`)
   - Table CRUD
   - Guest assignment
   - Capacity management
   - Used by: Table components
   - Endpoints: All /tables/* routes

#### State Management (`frontend/src/store/`)

1. **Store Configuration** (`store/index.js`)
   - Redux store setup
   - Middleware configuration
   - State persistence
   - Used by: main.jsx

2. **Authentication** (`store/authSlice.js`)
   - User state
   - Token management
   - Login status
   - Used by: Auth components, Guards

3. **Wedding Management** (`store/weddingSlice.js`)
   - Wedding list
   - Active wedding
   - Form states
   - Used by: Wedding components

4. **Guest Management** (`store/guestSlice.js`)
   - Guest list
   - Selection state
   - Filter options
   - Used by: Guest components

5. **Table Management** (`store/tableSlice.js`)
   - Table list
   - Assignment state
   - Capacity tracking
   - Used by: Table components

#### Custom Hooks (`frontend/src/hooks/`)

1. **Authentication** (`hooks/useAuth.js`)
   - Login state
   - User context
   - Permission checks
   - Used by: Protected components

2. **Form Management** (`hooks/useForm.js`)
   - Form state
   - Validation
   - Submission
   - Used by: All forms

3. **API Communication** (`hooks/useApi.js`)
   - Request handling
   - Loading states
   - Error management
   - Used by: Service components

### Backend Architecture

#### Controllers (`backend/src/Controller/`)

1. **Authentication** (`AuthController.php`)
   - Login handling
   - Registration
   - Password reset
   - Dependencies: AuthService, UserRepository
   - Used by: Frontend auth services

2. **Wedding Management** (`WeddingController.php`)
   - CRUD operations
   - File handling
   - Settings management
   - Dependencies: WeddingService, FileService
   - Used by: Frontend wedding services

3. **Guest Management** (`GuestController.php`)
   - Guest CRUD
   - Bulk operations
   - RSVP handling
   - Dependencies: GuestService, RsvpService
   - Used by: Frontend guest services

4. **RSVP System** (`RsvpController.php`)
   - Form configuration
   - Response handling
   - Token validation
   - Dependencies: RsvpService, GuestService
   - Used by: Frontend RSVP services

5. **Table Management** (`TableController.php`)
   - Table CRUD
   - Guest assignment
   - Capacity validation
   - Dependencies: TableService, GuestService
   - Used by: Frontend table services

#### Entities (`backend/src/Entity/`)

1. **User** (`User.php`)
   - Authentication data
   - Profile information
   - Role management
   - Used by: AuthController, UserRepository

2. **Wedding** (`Wedding.php`)
   - Basic information
   - Settings
   - Relationships
   - Used by: WeddingController, GuestController

3. **Guest** (`Guest.php`)
   - Guest information
   - RSVP data
   - Table assignment
   - Used by: GuestController, RsvpController

4. **Table** (`Table.php`)
   - Table details
   - Capacity rules
   - Guest assignments
   - Used by: TableController

5. **RsvpResponse** (`RsvpResponse.php`)
   - Response data
   - Form fields
   - Validation rules
   - Used by: RsvpController

#### Repositories (`backend/src/Repository/`)

1. **User** (`UserRepository.php`)
   - User queries
   - Authentication checks
   - Profile management
   - Used by: AuthController, Security

2. **Wedding** (`WeddingRepository.php`)
   - Wedding queries
   - Relationship loading
   - Statistics
   - Used by: WeddingController

3. **Guest** (`GuestRepository.php`)
   - Guest queries
   - RSVP tracking
   - Assignment checks
   - Used by: GuestController, TableController

4. **Table** (`TableRepository.php`)
   - Table queries
   - Capacity validation
   - Assignment management
   - Used by: TableController

#### Services (`backend/src/Service/`)

1. **Authentication** (`AuthService.php`)
   - Token generation
   - Password handling
   - Session management
   - Used by: AuthController

2. **File Management** (`FileService.php`)
   - Upload handling
   - Storage management
   - Cleanup tasks
   - Used by: Multiple controllers

3. **Email** (`EmailService.php`)
   - Template rendering
   - Queue management
   - Error handling
   - Used by: Multiple controllers

#### Security (`backend/src/Security/`)

1. **Authentication** (`JwtAuthenticator.php`)
   - Token validation
   - User loading
   - Error handling
   - Used by: Security system

2. **Voters** (`Security/Voter/`)
   - `WeddingVoter.php`: Wedding permissions
   - `TableVoter.php`: Table permissions
   - `GuestVoter.php`: Guest permissions
   - Used by: Controllers

## Communication Patterns

### Frontend → Backend Flow

1. **Authentication Flow**
   ```
   LoginForm.jsx
   → authService.js
   → AuthController.php
   → UserRepository.php
   → Database
   ```

2. **Wedding Management Flow**
   ```
   WeddingForm.jsx
   → weddingService.js
   → WeddingController.php
   → WeddingRepository.php
   → Database
   ```

3. **Guest Management Flow**
   ```
   GuestList.jsx
   → guestService.js
   → GuestController.php
   → GuestRepository.php
   → Database
   ```

4. **RSVP Flow**
   ```
   RsvpForm.jsx
   → rsvpService.js
   → RsvpController.php
   → [GuestRepository.php, RsvpRepository.php]
   → Database
   ```

5. **Table Management Flow**
   ```
   TableAssignment.jsx
   → tableService.js
   → TableController.php
   → [TableRepository.php, GuestRepository.php]
   → Database
   ```

### State Updates Flow

1. **Component → Redux**
   ```
   Component
   → dispatch(action)
   → reducer
   → state update
   → component re-render
   ```

2. **API → Redux**
   ```
   Service
   → API call
   → response
   → dispatch(action)
   → reducer
   → state update
   ```

## Common Modification Scenarios

### Adding New Guest Field
1. Update `Guest.php` entity
2. Modify `GuestController.php`
3. Update `GuestForm.jsx`
4. Modify `guestService.js`
5. Update `GuestList.jsx`

### Modifying RSVP Logic
1. Update `RsvpController.php`
2. Modify `RsvpForm.jsx`
3. Update `rsvpService.js`
4. Adjust `RsvpResponse.php`

### Enhancing Table Assignment
1. Modify `TableController.php`
2. Update `TableAssignment.jsx`
3. Adjust `tableService.js`
4. Update `Table.php`

This documentation provides a comprehensive map of:
1. File locations and purposes
2. Component relationships
3. Data flow patterns
4. Common modification patterns
5. Dependencies and interactions

Use this as a reference when making modifications to ensure all related components are properly updated.