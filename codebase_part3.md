# Communication Patterns and Integration

## Frontend-Backend Communication

### 1. Authentication Flow
```mermaid
graph TD
    A[LoginForm.jsx] -->|credentials| B[authService.js]
    B -->|POST /api/login| C[AuthController.php]
    C -->|validate| D[AuthService.php]
    D -->|query| E[UserRepository.php]
    E -->|user| D
    D -->|generate| F[JWT Token]
    F -->|token| C
    C -->|response| B
    B -->|dispatch| G[authSlice.js]
    G -->|update| H[Redux Store]
```

### 2. Wedding Management Flow
```mermaid
graph TD
    A[WeddingForm.jsx] -->|data| B[weddingService.js]
    B -->|POST/PUT| C[WeddingController.php]
    C -->|validate| D[WeddingService.php]
    D -->|save| E[WeddingRepository.php]
    E -->|wedding| D
    D -->|result| C
    C -->|response| B
    B -->|dispatch| F[weddingSlice.js]
    F -->|update| G[Redux Store]
```

### 3. Guest Management Flow
```mermaid
graph TD
    A[GuestList.jsx] -->|data| B[guestService.js]
    B -->|POST/PUT| C[GuestController.php]
    C -->|validate| D[GuestService.php]
    D -->|save| E[GuestRepository.php]
    E -->|guest| D
    D -->|result| C
    C -->|response| B
    B -->|dispatch| F[guestSlice.js]
    F -->|update| G[Redux Store]
```

### 4. RSVP Flow
```mermaid
graph TD
    A[RsvpForm.jsx] -->|token| B[rsvpService.js]
    B -->|GET guest| C[RsvpController.php]
    C -->|find| D[GuestService.php]
    D -->|query| E[GuestRepository.php]
    E -->|guest| D
    D -->|guest| C
    C -->|response| B
    B -->|update| F[RsvpForm State]
```

### 5. Table Management Flow
```mermaid
graph TD
    A[TableAssignment.jsx] -->|assignment| B[tableService.js]
    B -->|POST assign| C[TableController.php]
    C -->|validate| D[TableService.php]
    D -->|update| E[TableRepository.php]
    E -->|table| D
    D -->|result| C
    C -->|response| B
    B -->|dispatch| F[tableSlice.js]
    F -->|update| G[Redux Store]
```

### 6. Vendor Management Flow
```mermaid
graph TD
    A[VendorList.jsx] -->|data| B[vendorService.js]
    B -->|GET/POST/PUT/DELETE| C[VendorController.php]
    C -->|validate| D[VendorService.php]
    D -->|save| E[VendorRepository.php]
    E -->|vendor| D
    D -->|result| C
    C -->|response| B
    B -->|dispatch| F[vendorSlice.js]
    F -->|update| G[Redux Store]
```

### 7. File Upload Flow
```mermaid
graph TD
    A[VendorForm.jsx] -->|file| B[vendorService.js]
    B -->|POST multipart| C[VendorController.php]
    C -->|process| D[FileService.php]
    D -->|save| E[File System]
    D -->|create| F[VendorFileRepository.php]
    F -->|file| D
    D -->|result| C
    C -->|response| B
    B -->|dispatch| G[vendorSlice.js]
    G -->|update| H[Redux Store]
```

## State Management Patterns

### 1. Data Loading
```javascript
// Component
useEffect(() => {
    dispatch(fetchData())
        .unwrap()
        .then(handleSuccess)
        .catch(handleError);
}, [dispatch]);

// Slice
const fetchData = createAsyncThunk(
    'slice/fetchData',
    async (_, { rejectWithValue }) => {
        try {
            const response = await service.getData();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);
```

### 2. Form Submission
```javascript
// Component
const handleSubmit = async (data) => {
    try {
        await dispatch(submitData(data)).unwrap();
        handleSuccess();
    } catch (error) {
        handleError(error);
    }
};

// Slice
const submitData = createAsyncThunk(
    'slice/submitData',
    async (data, { rejectWithValue }) => {
        try {
            const response = await service.submit(data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);
```

### 3. Real-time Updates
```javascript
// Component
useEffect(() => {
    const subscription = websocket.subscribe(
        channel,
        (data) => dispatch(updateData(data))
    );
    return () => subscription.unsubscribe();
}, [dispatch]);

// Slice
const updateData = createAction('slice/updateData');
```

## Error Handling Patterns

### 1. API Error Handling
```javascript
// Service Layer
try {
    const response = await api.request({
        method,
        url,
        data,
        validateStatus: (status) => status < 500
    });
    return response.data;
} catch (error) {
    if (error.response) {
        // Handle specific error responses
        switch (error.response.status) {
            case 400:
                throw new ValidationError(error.response.data);
            case 401:
                throw new AuthenticationError();
            case 403:
                throw new AuthorizationError();
            case 404:
                throw new NotFoundError();
            default:
                throw new ApiError(error.response.data);
        }
    }
    throw new NetworkError();
}
```

### 2. Component Error Handling
```javascript
// Component
const [error, setError] = useState(null);

const handleSubmit = async (data) => {
    try {
        await dispatch(submitData(data)).unwrap();
        handleSuccess();
    } catch (error) {
        if (error instanceof ValidationError) {
            setFormErrors(error.details);
        } else if (error instanceof AuthenticationError) {
            navigate('/login');
        } else {
            setError(error.message);
        }
    }
};
```

### 3. Global Error Handling
```javascript
// Error Boundary
class ErrorBoundary extends React.Component {
    state = { error: null };

    static getDerivedStateFromError(error) {
        return { error };
    }

    componentDidCatch(error, errorInfo) {
        logError(error, errorInfo);
    }

    render() {
        if (this.state.error) {
            return <ErrorDisplay error={this.state.error} />;
        }
        return this.props.children;
    }
}
```

## Integration Points

### 1. Authentication Integration
- Frontend: `authService.js`, `authSlice.js`
- Backend: `AuthController.php`, `AuthService.php`
- Communication: JWT tokens
- Storage: LocalStorage, Redux store

### 2. Form Management Integration
- Frontend: `useForm.js`, form components
- Backend: Validation constraints
- Communication: Validation errors
- Storage: Component state, Redux store

### 3. File Upload Integration
- Frontend: `FileUpload.jsx`, `fileService.js`
- Backend: `FileController.php`, `FileService.php`
- Communication: Multipart form data
- Storage: File system, database references

### 4. Notification Integration
- Frontend: `NotificationCenter.jsx`, `notificationService.js`
- Backend: `NotificationController.php`, WebSocket server
- Communication: WebSocket, REST API
- Storage: Redux store, database

### 5. Vendor Management Integration
- Frontend: `vendorService.js`, `vendorSlice.js`
- Backend: `VendorController.php`, `VendorService.php`
- Communication: REST API, Multipart form data
- Storage: File system, database

### 6. File Management Integration
- Frontend: `VendorForm.jsx`, `vendorService.js`
- Backend: `VendorController.php`, `FileService.php`
- Communication: Multipart form data
- Storage: File system, database references

## Testing Integration

### 1. Frontend Testing
```javascript
// Component Tests
describe('Component', () => {
    it('handles successful submission', async () => {
        const mockDispatch = jest.fn();
        const { result } = renderHook(() => useDispatch());
        result.current = mockDispatch;

        const { getByRole } = render(<Component />);
        await userEvent.click(getByRole('button'));

        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'slice/submit'
            })
        );
    });
});

// Service Tests
describe('Service', () => {
    it('handles API errors', async () => {
        const mockError = new Error('API Error');
        api.request.mockRejectedValue(mockError);

        await expect(service.submit(data))
            .rejects
            .toThrow('API Error');
    });
});
```

### 2. Backend Testing
```php
// Controller Tests
public function testSubmission(): void
{
    $client = static::createClient();
    $response = $client->request('POST', '/api/endpoint', [
        'json' => $data
    ]);

    $this->assertResponseIsSuccessful();
    $this->assertJsonContains(['status' => 'success']);
}

// Service Tests
public function testValidation(): void
{
    $this->expectException(ValidationException::class);
    $service->process($invalidData);
}
```

This documentation provides:
1. Detailed communication flows
2. State management patterns
3. Error handling strategies
4. Integration points
5. Testing approaches 