# Adding New Endpoints Guide

## Backend (Symfony)

### 1. Create a Controller Method
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

### 2. Add Security Annotations
```php
// For endpoints that need wedding access
#[IsGranted('view', 'wedding')]  // For viewing wedding data
#[IsGranted('edit', 'wedding')]  // For modifying wedding data

// For endpoints that need table access
#[IsGranted('view', 'table')]    // For viewing table data
#[IsGranted('edit', 'table')]    // For modifying table data
#[IsGranted('delete', 'table')]  // For deleting table data
```

### 3. Create a Voter (if needed)
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

### 4. Add Entity (if needed)
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

### 5. Create Migration
```bash
php bin/console make:migration
php bin/console doctrine:migrations:migrate
```

## Frontend (React)

### 1. Add API Service Method
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

### 2. Create Redux Slice
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

### 3. Add Slice to Store
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

### 4. Create Component
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

### 5. Add Route
```javascript
// In src/App.jsx or your router configuration

import YourComponent from './components/your/YourComponent';

// Add to your routes
<Route path="/your-path" element={<YourComponent />} />
```

## Best Practices

### Backend
1. Always use appropriate security annotations
2. Validate input data
3. Return consistent JSON responses
4. Use proper HTTP methods and status codes
5. Document API endpoints
6. Handle errors gracefully
7. Use soft delete where appropriate

### Frontend
1. Use the api instance for all HTTP requests
2. Handle loading and error states
3. Use Redux for state management
4. Follow the established project structure
5. Implement proper error handling
6. Use Material-UI components for consistency
7. Make components reusable where possible 