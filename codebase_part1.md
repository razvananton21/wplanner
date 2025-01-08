# Frontend Architecture Documentation

## Entry Points

### 1. Application Bootstrap (`main.jsx`)
- Purpose: Application initialization
- Key responsibilities:
  - Redux store setup
  - Theme provider configuration
  - Router initialization
  - Root component rendering
- Dependencies:
  - React
  - Redux
  - Material-UI
  - React Router

### 2. Root Component (`App.jsx`)
- Purpose: Application shell
- Key responsibilities:
  - Route definitions
  - Authentication guards
  - Layout management
  - Global error handling
- Dependencies:
  - Layout components
  - Router components
  - Auth context

## Core Directories

### 1. Components (`src/components/`)

#### Layout Components (`components/layout/`)
- `Layout.jsx`
  - Main application wrapper
  - Manages responsive sidebar
  - Handles navigation state
  - Used by: All authenticated pages
  - Dependencies: Header, Sidebar

- `Header.jsx`
  - Top navigation bar
  - User profile menu
  - Notification center
  - Used by: Layout.jsx
  - Dependencies: NotificationService

- `Sidebar.jsx`
  - Navigation menu
  - Route highlighting
  - Collapse behavior
  - Used by: Layout.jsx
  - Dependencies: Router

#### Wedding Components (`components/weddings/`)
- `WeddingList.jsx`
  - Grid/list view
  - Sorting/filtering
  - Wedding cards
  - Used by: WeddingsPage
  - Dependencies: WeddingService

- `WeddingDetails.jsx`
  - Information display
  - Section management
  - Form handling
  - Used by: WeddingPage
  - Dependencies: All wedding services

- `WeddingForm.jsx`
  - Creation/editing
  - Multi-step form
  - Image handling
  - Used by: Create/Edit pages
  - Dependencies: WeddingService

#### Guest Components (`components/guests/`)
- `GuestList.jsx`
  - Table/grid view
  - Bulk actions
  - Filtering system
  - Used by: GuestsPage
  - Dependencies: GuestService

- `GuestForm.jsx`
  - Guest data form
  - Plus-one handling
  - Category management
  - Used by: GuestList
  - Dependencies: GuestService

#### RSVP Components (`components/rsvp/`)
- `RsvpForm.jsx`
  - Dynamic fields
  - Validation logic
  - Plus-one handling
  - Used by: RsvpPage
  - Dependencies: RsvpService

- `FormBuilder.jsx`
  - Field configuration
  - Drag-and-drop
  - Preview mode
  - Used by: WeddingDetails
  - Dependencies: FormService

#### Table Components (`components/tables/`)
- `TableList.jsx`
  - Table management
  - Capacity tracking
  - Category filtering
  - Used by: TablesPage
  - Dependencies: TableService

- `TableAssignment.jsx`
  - Guest seating
  - Drag-and-drop
  - Validation
  - Used by: TableList
  - Dependencies: TableService

#### Vendor Components (`components/vendors/`)
- `VendorList.jsx`
  - Grid layout display
  - Status indicators
  - Financial overview
  - Contact information
  - File management
  - Used by: WeddingDetails
  - Dependencies: VendorService

- `VendorForm.jsx`
  - Vendor creation/editing
  - File upload handling
  - Status management
  - Type selection
  - Used by: VendorList
  - Dependencies: VendorService

### 2. Services (`src/services/`)

#### API Configuration (`api.js`)
- Base configuration
- Interceptors
- Error handling
- Token management
- Used by: All services

#### Authentication (`authService.js`)
- Methods:
  ```javascript
  login(email, password)
  logout()
  refreshToken()
  getUser()
  updateProfile(data)
  ```
- Used by: Auth components
- Endpoints: `/api/login`, `/api/logout`

#### Wedding Management (`weddingService.js`)
- Methods:
  ```javascript
  getWeddings()
  getWedding(id)
  createWedding(data)
  updateWedding(id, data)
  deleteWedding(id)
  uploadImage(id, file)
  ```
- Used by: Wedding components
- Endpoints: `/api/weddings/*`

#### Guest Management (`guestService.js`)
- Methods:
  ```javascript
  getGuests(weddingId)
  createGuest(weddingId, data)
  updateGuest(weddingId, guestId, data)
  deleteGuest(weddingId, guestId)
  bulkCreate(weddingId, guests)
  ```
- Used by: Guest components
- Endpoints: `/api/weddings/{id}/guests/*`

#### RSVP Management (`rsvpService.js`)
- Methods:
  ```javascript
  getForm(token)
  submitRsvp(token, data)
  getGuest(token)
  updateResponses(token, responses)
  ```
- Used by: RSVP components
- Endpoints: `/api/rsvp/*`

#### Table Management (`tableService.js`)
- Methods:
  ```javascript
  getTables(weddingId)
  createTable(weddingId, data)
  updateTable(weddingId, tableId, data)
  deleteTable(weddingId, tableId)
  assignGuests(weddingId, tableId, guestIds)
  ```
- Used by: Table components
- Endpoints: `/api/weddings/{id}/tables/*`

#### Vendor Management (`vendorService.js`)
- Methods:
  ```javascript
  getVendors(weddingId)
  getVendor(weddingId, vendorId)
  createVendor(weddingId, data)
  updateVendor(weddingId, vendorId, data)
  deleteVendor(weddingId, vendorId)
  uploadFile(weddingId, vendorId, file, type)
  deleteFile(weddingId, vendorId, fileId)
  ```
- Used by: Vendor components
- Endpoints: `/api/weddings/{id}/vendors/*`

### 3. State Management (`src/store/`)

#### Store Configuration (`store.js`)
- Redux setup
- Middleware
- State persistence
- Used by: `main.jsx`

#### Authentication (`authSlice.js`)
- State shape:
  ```javascript
  {
    user: User | null,
    token: string | null,
    loading: boolean,
    error: Error | null
  }
  ```
- Actions:
  - login.pending/fulfilled/rejected
  - logout
  - updateProfile
- Used by: Auth components

#### Wedding Management (`weddingSlice.js`)
- State shape:
  ```javascript
  {
    list: Wedding[],
    active: Wedding | null,
    loading: boolean,
    error: Error | null
  }
  ```
- Actions:
  - fetchWeddings
  - createWedding
  - updateWedding
  - deleteWedding
- Used by: Wedding components

#### Guest Management (`guestSlice.js`)
- State shape:
  ```javascript
  {
    items: Guest[],
    selected: Guest[],
    filters: FilterOptions,
    loading: boolean,
    error: Error | null
  }
  ```
- Actions:
  - fetchGuests
  - createGuest
  - updateGuest
  - deleteGuest
  - bulkCreate
- Used by: Guest components

#### Table Management (`tableSlice.js`)
- State shape:
  ```javascript
  {
    items: Table[],
    assignments: Assignment[],
    loading: boolean,
    error: Error | null
  }
  ```
- Actions:
  - fetchTables
  - createTable
  - updateTable
  - deleteTable
  - assignGuests
- Used by: Table components

#### Vendor State Management (`vendorSlice.js`)
- State shape:
  ```javascript
  {
    items: Vendor[],
    loading: boolean,
    error: Error | null,
    files: {
      uploading: boolean,
      error: Error | null
    }
  }
  ```
- Actions:
  - fetchVendors
  - createVendor
  - updateVendor
  - deleteVendor
  - uploadFile
  - deleteFile
- Used by: Vendor components

### 4. Custom Hooks (`src/hooks/`)

#### Authentication (`useAuth.js`)
- Purpose: Auth state management
- Features:
  - Login state
  - User context
  - Permissions
- Used by: Protected components

#### Form Management (`useForm.js`)
- Purpose: Form handling
- Features:
  - Form state
  - Validation
  - Submission
- Used by: All forms

#### API Communication (`useApi.js`)
- Purpose: API interaction
- Features:
  - Request handling
  - Loading states
  - Error management
- Used by: Service components 