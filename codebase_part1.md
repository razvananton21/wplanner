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

#### Task Components (`components/tasks/`)
- `TaskList.jsx`
  - List/grid view of tasks
  - Filtering by category and status
  - Sorting and reordering
  - Task completion toggle
  - Used by: WeddingDetails
  - Dependencies: TaskService

- `TaskForm.jsx`
  - Task creation/editing
  - Category selection
  - Priority levels
  - Due date handling
  - Used by: TaskList
  - Dependencies: TaskService

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

#### Task Service (`services/taskService.js`)
- Methods:
  ```javascript
  getTasks(weddingId)
  getIncompleteTasks(weddingId)
  getTasksByCategory(weddingId, category)
  getOverdueTasks(weddingId)
  getUpcomingTasks(weddingId, days)
  createTask(weddingId, data)
  getTask(weddingId, taskId)
  updateTask(weddingId, taskId, data)
  deleteTask(weddingId, taskId)
  reorderTasks(weddingId, taskOrders)
  ```
- Used by: Task components
- Endpoints: `/api/weddings/{id}/tasks/*`

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

## Core Components

### Budget Management
- `Budget.jsx`: Main budget management component
  - Budget overview section
  - Category breakdown
  - Expense management
  - Collapsible sections
  - Integration with vendors

- `BudgetOverview.jsx`: Budget summary component
  - Total budget display
  - Spending summary
  - Progress visualization
  - Category allocation display

- `ExpenseList.jsx`: Expense management component
  - List of all expenses
  - Filtering and sorting
  - Payment status tracking
  - Due date management
  - Vendor expense integration

- `ExpenseForm.jsx`: Expense creation/editing component
  - Category selection
  - Amount input
  - Payment status
  - Due date selection
  - Vendor association

### Redux Integration

#### Budget Slice
```javascript
const budgetSlice = createSlice({
  name: 'budget',
  initialState: {
    budget: null,
    expenses: [],
    summary: null,
    loading: false,
    error: null
  },
  reducers: {
    // Budget reducers
    setBudget: (state, action) => {
      state.budget = action.payload;
    },
    setExpenses: (state, action) => {
      state.expenses = action.payload;
    },
    setSummary: (state, action) => {
      state.summary = action.payload;
    },
    // Loading states
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});
```

#### Budget Thunks
```javascript
// Fetch budget data
export const fetchBudget = createAsyncThunk(
  'budget/fetchBudget',
  async (weddingId) => {
    const response = await budgetService.getBudget(weddingId);
    return response.data;
  }
);

// Create/update expense
export const createExpense = createAsyncThunk(
  'budget/createExpense',
  async ({ weddingId, data }) => {
    const response = await budgetService.createExpense(weddingId, data);
    return response.data;
  }
);
```

### API Services

#### Budget Service
```javascript
const budgetService = {
  // Get budget and summary
  getBudget: async (weddingId) => {
    return await api.get(`/weddings/${weddingId}/budget`);
  },

  // Get expenses
  getExpenses: async (weddingId) => {
    return await api.get(`/weddings/${weddingId}/expenses`);
  },

  // Create expense
  createExpense: async (weddingId, data) => {
    return await api.post(`/weddings/${weddingId}/expenses`, data);
  },

  // Update expense
  updateExpense: async (weddingId, expenseId, data) => {
    return await api.put(`/weddings/${weddingId}/expenses/${expenseId}`, data);
  }
};
```

### Vendor Integration

#### Vendor Components
- `VendorList.jsx`: Enhanced with budget information
  - Price display
  - Deposit tracking
  - Payment status
  - Automatic expense creation

- `VendorForm.jsx`: Updated with financial fields
  - Price input
  - Deposit amount
  - Payment tracking
  - Contract status

### Styling

#### Budget Styles
```javascript
// Budget overview styles
const BudgetOverviewContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  '&:hover': {
    boxShadow: theme.shadows[4]
  }
}));

// Expense list styles
const ExpenseListContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  '& .MuiDataGrid-root': {
    border: 'none'
  }
}));

// Category breakdown styles
const CategoryBreakdownGrid = styled(Grid)(({ theme }) => ({
  gap: theme.spacing(2),
  marginTop: theme.spacing(2)
}));
```

### Utils

#### Budget Calculations
```javascript
// Calculate budget utilization
export const calculateUtilization = (spent, total) => {
  if (!total) return 0;
  return (spent / total) * 100;
};

// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};
``` 

#### Vendor-Budget Integration (`src/store/`)

#### Vendor-Budget State Management
```javascript
// Vendor slice with budget integration
const vendorSlice = createSlice({
  name: 'vendor',
  initialState: {
    items: [],
    loading: false,
    error: null,
    files: {
      uploading: boolean,
      error: null
    }
  },
  reducers: {
    // ... existing vendor reducers ...
  },
  extraReducers: (builder) => {
    builder
      .addCase(createVendor.fulfilled, (state, action) => {
        state.items.push(action.payload);
        // Trigger budget refresh after vendor creation
        dispatch(fetchBudget(action.payload.weddingId));
      })
      .addCase(updateVendor.fulfilled, (state, action) => {
        const index = state.items.findIndex(v => v.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
          // Trigger budget refresh after vendor update
          dispatch(fetchBudget(action.payload.weddingId));
        }
      });
  }
});

// Vendor thunks with budget integration
export const createVendor = createAsyncThunk(
  'vendor/create',
  async ({ weddingId, data }, { dispatch }) => {
    const response = await vendorService.createVendor(weddingId, data);
    // After vendor creation, create associated expenses
    await budgetService.createExpensesFromVendor(weddingId, response.data.id);
    return response.data;
  }
);

export const updateVendor = createAsyncThunk(
  'vendor/update',
  async ({ weddingId, vendorId, data }, { dispatch }) => {
    const response = await vendorService.updateVendor(weddingId, vendorId, data);
    // After vendor update, sync associated expenses
    await budgetService.syncVendorExpenses(weddingId, vendorId);
    return response.data;
  }
);
```

#### Vendor Components with Budget Integration

```javascript
// VendorForm.jsx - Enhanced with budget integration
const VendorForm = ({ wedding }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    price: 0,
    depositAmount: 0,
    depositPaid: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(createVendor({
      weddingId: wedding.id,
      data: formData
    }));
    // Budget will be automatically updated through the thunk
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* ... existing form fields ... */}
      <Typography variant="h6">Financial Details</Typography>
      <TextField
        label="Total Price"
        type="number"
        value={formData.price}
        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
      />
      <TextField
        label="Deposit Amount"
        type="number"
        value={formData.depositAmount}
        onChange={(e) => setFormData({ ...formData, depositAmount: parseFloat(e.target.value) })}
      />
      <FormControlLabel
        control={
          <Switch
            checked={formData.depositPaid}
            onChange={(e) => setFormData({ ...formData, depositPaid: e.target.checked })}
          />
        }
        label="Deposit Paid"
      />
      {/* ... rest of the form ... */}
    </form>
  );
};

// VendorList.jsx - Enhanced with budget information
const VendorList = ({ wedding }) => {
  const vendors = useSelector(state => state.vendor.items);
  const budget = useSelector(state => state.budget.budget);

  const getVendorExpenses = (vendorId) => {
    return budget?.expenses.filter(e => e.vendor?.id === vendorId) || [];
  };

  return (
    <Grid container spacing={2}>
      {vendors.map(vendor => (
        <Grid item xs={12} md={6} key={vendor.id}>
          <VendorCard
            vendor={vendor}
            expenses={getVendorExpenses(vendor.id)}
            onUpdate={(data) => handleVendorUpdate(vendor.id, data)}
          />
        </Grid>
      ))}
    </Grid>
  );
};

// VendorCard.jsx - Enhanced with expense display
const VendorCard = ({ vendor, expenses }) => {
  const depositExpense = expenses.find(e => e.type === 'vendor_deposit');
  const balanceExpense = expenses.find(e => e.type === 'vendor_total');

  return (
    <Card>
      <CardContent>
        {/* ... existing vendor details ... */}
        <Box mt={2}>
          <Typography variant="subtitle1">Financial Status</Typography>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Typography>Total Price: {formatCurrency(vendor.price)}</Typography>
              <Typography>Deposit: {formatCurrency(vendor.depositAmount)}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>
                Deposit Status: {depositExpense?.status || 'Not Set'}
              </Typography>
              <Typography>
                Balance Status: {balanceExpense?.status || 'Not Set'}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};
``` 