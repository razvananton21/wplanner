# Communication Patterns and Integration

This document outlines the integration patterns and communication flows between frontend and backend components of the Wedding Planner application. It serves as the primary reference for:
- Authentication and authorization flows
- Component communication patterns
- Data flow diagrams
- Error handling strategies
- Testing considerations

## Frontend-Backend Communication

### 1. Authentication Flow [✓]

### Google OAuth Integration [✓]

#### Flow Overview
1. User clicks "Continue with Google" button
2. Frontend fetches OAuth URL from backend
3. OAuth popup opens with Google login
4. User authorizes application
5. Google redirects to callback page
6. Callback page sends code to parent window
7. Parent window exchanges code for tokens
8. User data and tokens stored in Redux/localStorage

#### Component Communication
```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant G as Google

    U->>F: Click Google Login
    F->>B: GET /api/auth/google/url
    B-->>F: Return OAuth URL
    F->>G: Open OAuth Popup
    G->>U: Show Login Form
    U->>G: Authorize App
    G->>F: Redirect with Code
    F->>B: POST /api/auth/google/callback
    B->>G: Verify Code
    G-->>B: Return User Info
    B-->>F: Return Tokens + User
    F->>F: Store in Redux/localStorage
```

### Token Management [✓]

#### Token Flow
1. Access token stored in localStorage
2. Token added to API requests
3. Token refresh on expiration
4. Refresh token stored securely
5. Automatic token refresh flow

#### Token Refresh Flow
```mermaid
sequenceDiagram
    participant F as Frontend
    participant B as Backend
    participant R as Redis

    F->>B: API Request with Expired Token
    B-->>F: 401 Unauthorized
    F->>B: POST /api/auth/token/refresh
    B->>R: Validate Refresh Token
    R-->>B: Token Valid
    B-->>F: New Access Token
    F->>F: Update Stored Token
```

### User Avatar Handling [✓]

#### Avatar Flow
1. Avatar URL received from Google
2. URL stored in user entity
3. Avatar component displays image
4. Fallback to initials if no avatar
5. Real-time updates on profile changes

#### Component Integration
```javascript
// Frontend Components
const UserAvatar = () => {
    const user = useSelector(state => state.auth.user);
    return (
        <Avatar
            src={user.avatar}
            fallback={getInitials(user)}
        />
    );
};

// Backend Response
{
    "user": {
        "id": 1,
        "email": "user@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "avatar": "https://lh3.googleusercontent.com/..."
    }
}
```

### Error Handling [✓]

#### OAuth Errors
1. Invalid client configuration
2. User cancels authorization
3. Token exchange failures
4. Network connectivity issues
5. Invalid callback handling

#### Error Responses
```javascript
// Frontend Error Handling
try {
    await handleGoogleLogin(code);
} catch (error) {
    if (error.response?.status === 401) {
        // Handle unauthorized
    } else if (error.message === 'popup_closed') {
        // Handle user cancelled
    } else {
        // Handle other errors
    }
}

// Backend Error Responses
{
    "error": "invalid_grant",
    "message": "Invalid authorization code"
}
```

### Testing Considerations [✓]

#### Frontend Tests
1. OAuth button functionality
2. Popup handling
3. Token management
4. Avatar display
5. Error scenarios

#### Backend Tests
1. OAuth URL generation
2. Token exchange
3. User creation/update
4. Token refresh
5. Error handling

#### Integration Tests
1. Complete OAuth flow
2. Token refresh flow
3. Avatar updates
4. Error scenarios
5. Security validations

### 2. Wedding Management Flow [✓]
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

### 3. Guest Management Flow [✓]
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

### 4. RSVP Flow [✓]
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

### 5. Table Management Flow [✓]
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

### 6. Vendor Management Flow [✓]
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

### 7. Task Management Flow [✓]
```mermaid
graph TD
    A[TaskList.jsx] -->|data| B[taskService.js]
    B -->|GET/POST/PUT/DELETE| C[TaskController.php]
    C -->|validate| D[TaskService.php]
    D -->|save| E[TaskRepository.php]
    E -->|task| D
    D -->|result| C
    C -->|response| B
    B -->|dispatch| F[taskSlice.js]
    F -->|update| G[Redux Store]
```

### 8. File Upload Flow [✓]
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

### 9. Budget Management Flow [✓]
```mermaid
graph TD
    A[BudgetOverview.jsx] -->|data| B[budgetService.js]
    B -->|GET/POST/PUT| C[BudgetController.php]
    C -->|validate| D[BudgetService.php]
    D -->|save| E[BudgetRepository.php]
    E -->|budget| D
    D -->|result| C
    C -->|response| B
    B -->|dispatch| F[budgetSlice.js]
    F -->|update| G[Redux Store]
    
    H[ExpenseForm.jsx] -->|data| I[expenseService.js]
    I -->|POST/PUT| J[BudgetController.php]
    J -->|process| K[ExpenseService.php]
    K -->|save| L[ExpenseRepository.php]
    L -->|expense| K
    K -->|result| J
    J -->|response| I
    I -->|dispatch| M[budgetSlice.js]
    M -->|update| N[Redux Store]
```

#### Budget-Vendor Integration [✓]
```mermaid
graph TD
    A[VendorForm.jsx] -->|price update| B[vendorService.js]
    B -->|PUT| C[VendorController.php]
    C -->|update| D[VendorService.php]
    D -->|sync| E[BudgetService.php]
    E -->|create/update| F[ExpenseRepository.php]
    F -->|expense| E
    E -->|result| D
    D -->|response| C
    C -->|result| B
    B -->|dispatch| G[Redux Store]
```

### 10. Photo Gallery Flow [TODO]
```mermaid
graph TD
    A[PhotoGallery.jsx] -->|upload| B[photoService.js]
    B -->|POST multipart| C[PhotoController.php]
    C -->|process| D[PhotoService.php]
    D -->|save| E[PhotoRepository.php]
    E -->|photo| D
    D -->|result| C
    C -->|response| B
    B -->|dispatch| F[photoSlice.js]
    F -->|update| G[Redux Store]
```

## Error Handling Patterns [✓]

### Frontend Error Boundaries
```javascript
class ErrorBoundary extends React.Component {
    componentDidCatch(error, errorInfo) {
        // Log error to monitoring service
        logError(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <ErrorFallback />;
        }
        return this.props.children;
    }
}
```

### API Error Handling
```javascript
// Frontend Service
const apiClient = {
    async request(config) {
        try {
            const response = await axios(config);
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                await handleTokenRefresh();
                return this.request(config);
            }
            throw this.normalizeError(error);
        }
    }
};

// Backend Controller
public function handleException($e): JsonResponse
{
    if ($e instanceof ValidationException) {
        return $this->json(['errors' => $e->errors()], 422);
    }
    
    if ($e instanceof AuthenticationException) {
        return $this->json(['error' => 'Unauthorized'], 401);
    }
    
    return $this->json(['error' => 'Server Error'], 500);
}
```

## Testing Strategy [✓]

### Component Tests
1. Unit tests for React components
2. Integration tests for Redux flows
3. API client mocking
4. Error boundary testing
5. Form validation testing

### API Tests
1. Controller endpoint testing
2. Service method testing
3. Repository query testing
4. Authentication flow testing
5. File upload testing

### End-to-End Tests
1. Complete user flows
2. Error scenarios
3. File operations
4. Real API integration
5. Browser compatibility 