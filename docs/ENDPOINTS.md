# API Documentation and Development Guide

This document provides a comprehensive overview of all API endpoints in the Wedding Planner application. It serves as the primary reference for:
- Available endpoints and their purposes
- Request/response formats
- Authentication requirements
- Permission requirements
- Query parameters and pagination
- File upload specifications

## API Endpoints Documentation

### Authentication [✓]

#### Login
- **POST** `/api/login`
- Authenticates a user and returns a JWT token (7-day expiration)
- **Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "token": "string",
    "refresh_token": "string",
    "expires_at": "datetime",
    "user": {
      "id": "integer",
      "email": "string",
      "firstName": "string",
      "lastName": "string",
      "avatar": "string"
    }
  }
  ```

#### Google OAuth
- **GET** `/api/auth/google/url`
- Returns the Google OAuth URL for authentication
- **Response**:
  ```json
  {
    "url": "string"
  }
  ```

- **POST** `/api/auth/google/callback`
- Handles the Google OAuth callback
- **Body**:
  ```json
  {
    "code": "string"
  }
  ```
- **Response**:
  ```json
  {
    "token": "string",
    "refresh_token": "string",
    "user": {
      "id": "integer",
      "email": "string",
      "firstName": "string",
      "lastName": "string",
      "avatar": "string"
    }
  }
  ```

#### Token Refresh
- **POST** `/api/auth/token/refresh`
- Refreshes an expired JWT token
- **Body**:
  ```json
  {
    "refresh_token": "string"
  }
  ```
- **Response**:
  ```json
  {
    "token": "string",
    "refresh_token": "string"
  }
  ```

#### Logout
- **POST** `/api/logout`
- Logs out the current user

#### Current User
- **GET** `/api/me`
- Returns information about the currently authenticated user
- **Response**:
  ```json
  {
    "id": "integer",
    "email": "string",
    "firstName": "string",
    "lastName": "string",
    "avatar": "string",
    "roles": ["string"]
  }
  ```

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

### Wedding Management [✓]

#### List Weddings
- **GET** `/api/weddings`
- Returns list of weddings for the authenticated user

#### Get Wedding
- **GET** `/api/weddings/{id}`
- Returns detailed information about a specific wedding
- **Required Permission**: `view` on wedding

### Guest Management [✓]

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

### RSVP Management [✓]

#### Get Guest by RSVP Token
- **GET** `/api/rsvp/{token}/guest`
- Returns guest information using RSVP token

#### Submit RSVP
- **POST** `/api/rsvp/{token}`
- Submits RSVP response for a guest
- **Body**: (varies based on form fields)

### Table Management [✓]

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

### Vendor Management [✓]

#### List Vendors
- **GET** `/api/weddings/{id}/vendors`
- Returns list of vendors for a wedding
- **Required Permission**: `view` on wedding
- **Query Parameters**:
  - `type`: Filter by vendor type
  - `status`: Filter by vendor status

#### Create Vendor
- **POST** `/api/weddings/{id}/vendors`
- Creates a new vendor for a wedding
- **Required Permission**: `edit` on wedding
- **Body**:
  ```json
  {
    "name": "string",
    "company": "string",
    "type": "string",
    "status": "string",
    "phone": "string",
    "email": "string",
    "website": "string",
    "address": "string",
    "notes": "string",
    "price": "number",
    "depositAmount": "number",
    "depositPaid": "boolean",
    "contractSigned": "boolean"
  }
  ```

#### Update Vendor
- **PUT** `/api/weddings/{id}/vendors/{vendorId}`
- Updates a vendor's information
- **Required Permission**: `edit` on wedding
- **Body**: Same as Create Vendor

#### Delete Vendor
- **DELETE** `/api/weddings/{id}/vendors/{vendorId}`
- Deletes a vendor
- **Required Permission**: `edit` on wedding

#### Upload Vendor File
- **POST** `/api/weddings/{id}/vendors/{vendorId}/files`
- Uploads a file for a vendor
- **Required Permission**: `edit` on wedding
- **Body**: multipart/form-data
  ```json
  {
    "file": "file",
    "type": "string"
  }
  ```

#### Delete Vendor File
- **DELETE** `/api/weddings/{id}/vendors/{vendorId}/files/{fileId}`
- Deletes a vendor's file
- **Required Permission**: `edit` on wedding

### Task Management [✓]

#### List Tasks
- **GET** `/api/weddings/{id}/tasks`
- Returns list of tasks for a wedding
- **Required Permission**: `view` on wedding
- **Query Parameters**:
  - `category`: Filter by category
  - `status`: Filter by status
  - `completed`: Filter by completion status

#### Get Incomplete Tasks
- **GET** `/api/weddings/{id}/tasks/incomplete`
- Returns list of incomplete tasks
- **Required Permission**: `view` on wedding

#### Get Tasks by Category
- **GET** `/api/weddings/{id}/tasks/category/{category}`
- Returns tasks for a specific category
- **Required Permission**: `view` on wedding

#### Get Overdue Tasks
- **GET** `/api/weddings/{id}/tasks/overdue`
- Returns list of overdue tasks
- **Required Permission**: `view` on wedding

#### Get Upcoming Tasks
- **GET** `/api/weddings/{id}/tasks/upcoming`
- Returns list of upcoming tasks
- **Required Permission**: `view` on wedding

#### Create Task
- **POST** `/api/weddings/{id}/tasks`
- Creates a new task
- **Required Permission**: `edit` on wedding
- **Body**:
  ```json
  {
    "title": "string",
    "description": "string",
    "category": "string",
    "priority": "integer",
    "dueDate": "datetime",
    "notes": "string"
  }
  ```

#### Update Task
- **PUT** `/api/weddings/{id}/tasks/{taskId}`
- Updates a task
- **Required Permission**: `edit` on wedding
- **Body**: Same as Create Task

#### Delete Task
- **DELETE** `/api/weddings/{id}/tasks/{taskId}`
- Deletes a task
- **Required Permission**: `edit` on wedding

#### Reorder Tasks
- **PUT** `/api/weddings/{id}/tasks/reorder`
- Updates the display order of tasks
- **Required Permission**: `edit` on wedding
- **Body**:
  ```json
  {
    "taskOrders": [
      {
        "id": "integer",
        "order": "integer"
      }
    ]
  }
  ```

### Budget Management [✓]

#### Get Budget
- **GET** `/api/weddings/{id}/budget`
- Returns budget information and summary
- **Required Permission**: `view` on wedding
- **Response**:
  ```json
  {
    "budget": {
      "id": "integer",
      "totalAmount": "number",
      "categoryAllocations": "object",
      "expenses": "array"
    },
    "summary": {
      "totalBudget": "number",
      "totalSpent": "number",
      "totalPaid": "number",
      "totalPending": "number",
      "remainingBudget": "number",
      "categoryAllocations": "object",
      "spentByCategory": "object",
      "pendingByCategory": "object"
    }
  }
  ```

#### Create/Update Budget
- **POST/PUT** `/api/weddings/{id}/budget`
- Creates or updates budget information
- **Required Permission**: `edit` on wedding
- **Body**:
  ```json
  {
    "totalAmount": "number",
    "categoryAllocations": {
      "category": "number"
    }
  }
  ```

#### List Expenses
- **GET** `/api/weddings/{id}/expenses`
- Returns list of expenses
- **Required Permission**: `view` on wedding
- **Query Parameters**:
  - `category`: Filter by category
  - `status`: Filter by status
  - `vendor`: Filter by vendor

#### Create Expense
- **POST** `/api/weddings/{id}/expenses`
- Creates a new expense
- **Required Permission**: `edit` on wedding
- **Body**:
  ```json
  {
    "category": "string",
    "description": "string",
    "amount": "number",
    "type": "string",
    "status": "string",
    "dueDate": "datetime",
    "vendorId": "integer"
  }
  ```

#### Update Expense
- **PUT** `/api/weddings/{id}/expenses/{expenseId}`
- Updates an expense
- **Required Permission**: `edit` on wedding
- **Body**: Same as Create Expense

#### Delete Expense
- **DELETE** `/api/weddings/{id}/expenses/{expenseId}`
- Deletes an expense
- **Required Permission**: `edit` on wedding

#### Get Budget Summary
- **GET** `/api/weddings/{id}/budget/summary`
- Returns budget summary information
- **Required Permission**: `view` on wedding

### Photo Gallery [TODO]

#### List Photos
- **GET** `/api/weddings/{id}/photos`
- Returns list of photos
- **Required Permission**: `view` on wedding
- **Query Parameters**:
  - `metadata`: Filter by metadata
  - `takenAt`: Filter by date taken

#### Upload Photo
- **POST** `/api/weddings/{id}/photos`
- Uploads a new photo
- **Required Permission**: `edit` on wedding
- **Body**: multipart/form-data
  ```json
  {
    "file": "file",
    "metadata": "object"
  }
  ```

#### Update Photo Metadata
- **PUT** `/api/weddings/{id}/photos/{photoId}/metadata`
- Updates photo metadata
- **Required Permission**: `edit` on wedding
- **Body**:
  ```json
  {
    "metadata": "object"
  }
  ```

#### Delete Photo
- **DELETE** `/api/weddings/{id}/photos/{photoId}`
- Deletes a photo
- **Required Permission**: `edit` on wedding

### File Management [✓]

#### Serve File
- **GET** `/api/uploads/{type}/{filename}`
- Serves uploaded files

### Test Endpoints [✓]

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

### Timeline

#### List Timeline Events
- **GET** `/api/weddings/{weddingId}/timeline`
- Returns list of timeline events for a wedding
- **Required Permission**: `view` on wedding
- **Response**:
  ```json
  {
    "events": [
      {
        "id": "integer",
        "title": "string",
        "description": "string",
        "startTime": "datetime",
        "endTime": "datetime",
        "type": "string",
        "updatedAt": "datetime"
      }
    ]
  }
  ```

#### Create Timeline Event
- **POST** `/api/weddings/{weddingId}/timeline`
- Creates a new timeline event for a wedding
- **Required Permission**: `edit` on wedding
- **Body**:
  ```json
  {
    "title": "string",
    "description": "string",
    "startTime": "datetime",
    "endTime": "datetime",
    "type": "string"
  }
  ```

#### Update Timeline Event
- **PUT** `/api/weddings/{weddingId}/timeline/{id}`
- Updates an existing timeline event
- **Required Permission**: `edit` on wedding
- **Body**:
  ```json
  {
    "title": "string",
    "description": "string",
    "startTime": "datetime",
    "endTime": "datetime",
    "type": "string"
  }
  ```

#### Delete Timeline Event
- **DELETE** `/api/weddings/{weddingId}/timeline/{id}`
- Deletes a timeline event
- **Required Permission**: `edit` on wedding

## Response Formats

### Success Response
```json
{
  "data": "mixed",
  "message": "string"
}
```

### Error Response
```json
{
  "error": "string",
  "message": "string",
  "details": "object"
}
```

## Authentication

All endpoints except those marked as public require a valid JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Rate Limiting

- 60 requests per minute per IP
- 1000 requests per hour per user
- Responses include rate limit headers:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`

## Pagination

Endpoints that return lists support pagination through query parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

Response includes pagination metadata:
```json
{
  "data": [],
  "meta": {
    "current_page": "integer",
    "per_page": "integer",
    "total_pages": "integer",
    "total_items": "integer"
  }
}
``` 