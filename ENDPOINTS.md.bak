# API Documentation and Development Guide

## Part 1: API Endpoints Documentation

### Authentication

#### Login
- **POST** `/api/login`
- Authenticates a user and returns a JWT token
- **Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```

#### Logout
- **POST** `/api/logout`
- Logs out the current user

#### Current User
- **GET** `/api/me`
- Returns information about the currently authenticated user

### Admin

#### Register Admin
- **POST** `/api/admin/register`
- Registers a new admin user
- **Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```

#### Admin Dashboard
- **GET** `/api/admin/dashboard`
- Returns admin dashboard information

### Weddings

#### List Weddings
- **GET** `/api/weddings`
- Returns list of weddings for the authenticated user

#### Get Wedding
- **GET** `/api/weddings/{id}`
- Returns detailed information about a specific wedding
- **Required Permission**: `view` on wedding

### Guests

#### List Guests
- **GET** `/api/weddings/{id}/guests`
- Returns list of guests for a specific wedding
- **Required Permission**: `view` on wedding

#### Create Guest
- **POST** `/api/weddings/{id}/guests`
- Creates a new guest for a wedding
- **Required Permission**: `edit` on wedding
- **Body**:
  ```json
  {
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "category": "string",
    "plusOne": "boolean",
    "dietaryRestrictions": "string"
  }
  ```

#### Delete Guest
- **DELETE** `/api/weddings/{wedding}/guests/{id}`
- Soft deletes a guest and their plus-ones
- **Required Permission**: `edit` on wedding

### RSVP

#### Get Guest by RSVP Token
- **GET** `/api/rsvp/{token}/guest`
- Returns guest information using RSVP token

#### Submit RSVP
- **POST** `/api/rsvp/{token}`
- Submits RSVP response for a guest
- **Body**: (varies based on form fields)

### Tables

#### List Tables
- **GET** `/api/weddings/{id}/tables`
- Returns list of tables for a wedding
- **Required Permission**: `view` on wedding

#### Create Table
- **POST** `/api/weddings/{id}/tables`
- Creates a new table for a wedding
- **Required Permission**: `edit` on wedding

#### Delete Table
- **DELETE** `/api/tables/{id}`
- Deletes a table and removes guest assignments
- **Required Permission**: `delete` on table

#### Assign Guests to Table
- **PUT** `/api/tables/{id}/guests`
- Assigns guests to a table
- **Required Permission**: `assign_guests` on table
- **Body**:
  ```json
  {
    "guestIds": ["string"]
  }
  ```

### Photos

#### List Photos
- **GET** `/api/photos`
- Returns list of photos
- **Query Parameters**:
  - `wedding`: Filter by wedding ID

#### Create Photo
- **POST** `/api/photos`
- Creates a new photo
- **Required Permission**: `ROLE_USER`
- **Body**:
  ```json
  {
    "url": "string",
    "caption": "string",
    "metadata": "object"
  }
  ```

#### Get Photo
- **GET** `/api/photos/{id}`
- Returns photo details

#### Approve Photo
- **POST** `/api/photos/{id}/approve`
- Approves a photo
- **Required Permission**: `approve` on photo

### Notifications

#### List Notifications
- **GET** `/api/weddings/{id}/notifications`
- Returns list of notifications for a wedding
- **Required Permission**: `view` on wedding

#### Mark Notification as Read
- **POST** `/api/notifications/{id}/read`
- Marks a notification as read
- **Required Permission**: `view` on notification.wedding

#### Mark All Notifications as Read
- **POST** `/api/weddings/{id}/notifications/read-all`
- Marks all notifications for a wedding as read
- **Required Permission**: `view` on wedding

### Files

#### Serve File
- **GET** `/api/uploads/{type}/{filename}`
- Serves uploaded files

### Test Endpoints

#### Protected Test
- **GET** `/api/test/protected`
- Test endpoint for authenticated requests

#### Public Test
- **GET** `/api/test/public`
- Test endpoint for public access

### Invitations

#### List Invitations
- **GET** `/api/invitations`
- Returns list of invitations
- **Query Parameters**:
  - `wedding`: Filter by wedding ID
  - `guest`: Filter by guest ID

#### Create Invitation
- **POST** `/api/invitations`
- Creates a new invitation
- **Required Permission**: `ROLE_USER`
- **Body**:
  ```json
  {
    "wedding": "string",
    "guest": "string",
    "pdfUrl": "string"
  }
  ```

## Part 2: Adding New Endpoints Guide

### Backend (Symfony)

#### 1. Create a Controller Method
```php
// In src/Controller/YourController.php

#[Route('/api/your-endpoint', name: 'your_endpoint', methods: ['GET'])]
#[IsGranted('ROLE_USER')]  // Basic role check
public function yourEndpoint(): JsonResponse
{
    return $this->json([
        'data' => 'your data'
    ]);
}
```

#### 2. Add Security Annotations
```php
// For endpoints that need wedding access
#[IsGranted('view', 'wedding')]  // For viewing wedding data
#[IsGranted('edit', 'wedding')]  // For modifying wedding data

// For endpoints that need table access
#[IsGranted('view', 'table')]    // For viewing table data
#[IsGranted('edit', 'table')]    // For modifying table data
#[IsGranted('delete', 'table')]  // For deleting table data
```

#### 3. Create a Voter (if needed)
```php
// In src/Security/Voter/YourVoter.php

class YourVoter extends Voter
{
    protected function supports(string $attribute, mixed $subject): bool
    {
        return in_array($attribute, ['view', 'edit', 'delete'])
            && $subject instanceof YourEntity;
    }

    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool
    {
        $user = $token->getUser();
        if (!$user instanceof User) {
            return false;
        }

        return match($attribute) {
            'view' => $this->canView($subject, $user),
            'edit' => $this->canEdit($subject, $user),
            'delete' => $this->canDelete($subject, $user),
            default => false,
        };
    }
}
```

#### 4. Add Entity (if needed)
```php
// In src/Entity/YourEntity.php

#[ORM\Entity(repositoryClass: YourEntityRepository::class)]
class YourEntity
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    // Add your fields
}
```

#### 5. Create Migration
```bash
php bin/console make:migration
php bin/console doctrine:migrations:migrate
```

### Frontend (React)

#### 1. Add API Service Method
```javascript
// In src/services/yourService.js

const yourService = {
    // Get data
    getData: async (params) => {
        const response = await api.get('/your-endpoint', { params });
        return response.data;
    },

    // Create data
    createData: async (data) => {
        const response = await api.post('/your-endpoint', data);
        return response.data;
    },

    // Update data
    updateData: async (id, data) => {
        const response = await api.put(`/your-endpoint/${id}`, data);
        return response.data;
    },

    // Delete data
    deleteData: async (id) => {
        await api.delete(`/your-endpoint/${id}`);
    }
};

export { yourService };
```

#### 2. Create Redux Slice
```javascript
// In src/store/slices/yourSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { yourService } from '../../services/yourService';

export const fetchData = createAsyncThunk(
    'your/fetchData',
    async (params) => {
        return await yourService.getData(params);
    }
);

const yourSlice = createSlice({
    name: 'your',
    initialState: {
        data: [],
        loading: false,
        error: null
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchData.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export const { clearError } = yourSlice.actions;
export default yourSlice.reducer;
```

#### 3. Add Slice to Store
```javascript
// In src/store/store.js

import yourReducer from './slices/yourSlice';

const store = configureStore({
    reducer: {
        // ... other reducers
        your: yourReducer
    }
});
```

#### 4. Create Component
```javascript
// In src/components/your/YourComponent.jsx

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchData } from '../../store/slices/yourSlice';

const YourComponent = () => {
    const dispatch = useDispatch();
    const { data, loading, error } = useSelector((state) => state.your);

    useEffect(() => {
        dispatch(fetchData());
    }, [dispatch]);

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    return (
        // Your component JSX
    );
};

export default YourComponent;
```

#### 5. Add Route
```javascript
// In src/App.jsx or your router configuration

import YourComponent from './components/your/YourComponent';

// Add to your routes
<Route path="/your-path" element={<YourComponent />} />
```

### Best Practices

#### Backend
1. Always use appropriate security annotations
2. Validate input data
3. Return consistent JSON responses
4. Use proper HTTP methods and status codes
5. Document API endpoints
6. Handle errors gracefully
7. Use soft delete where appropriate

#### Frontend
1. Use the api instance for all HTTP requests
2. Handle loading and error states
3. Use Redux for state management
4. Follow the established project structure
5. Implement proper error handling
6. Use Material-UI components for consistency
7. Make components reusable where possible 