# Wedding Planner Application - Functional Specification

## Overview
The Wedding Planner Application is a comprehensive web-based system designed to manage wedding invitations, RSVPs, and seating arrangements. The application consists of a React-based frontend and a PHP backend, providing a seamless experience for both wedding hosts and guests.

## Core Features

### 1. Digital Invitations
- Interactive digital invitation cards with flip animation
- PDF download option for offline viewing
- Email-based invitation system with personalized links
- Bilingual support (Romanian/English)

### 2. RSVP Management
- Digital RSVP form with the following fields:
  - First and last name
  - Email address
  - Phone number
  - Attendance confirmation
  - Dietary preferences (vegetarian/regular)
  - Additional guests (up to 4)
  - Special preferences/notes
- Email notifications for new RSVPs
- Automatic guest list updates

### 3. Table Planner
- Interactive drag-and-drop interface
- Two view modes:
  - Table View: Visual representation of round tables
  - List View: Detailed list of table assignments
- Features per table:
  - Maximum 10 seats per table
  - Visual indicators for:
    - Vegetarian guests
    - Additional guests
    - Special preferences
    - Children
  - Table statistics (occupied seats, vegetarian count, children count)
- Guest management:
  - Unseated guests list
  - Guest details popup
  - Drag-and-drop seat assignment
  - Guest removal from seats

## Technical Specifications

### Frontend
- Built with React and Vite
- Key dependencies:
  - Framer Motion for animations
  - Styled Components for styling
  - React Router for navigation
  - Axios for API communication

### Backend
- PHP-based backend
- Features:
  - RESTful API endpoints
  - Email templating system
  - Database migrations
  - Entity management

### Database Schema
Core entities include:
- Invitations
- Guests
- Table Configurations
- RSVPs

## User Interface

### Guest Interface
1. Landing Page
   - Interactive invitation card
   - RSVP button
   - PDF download option

2. RSVP Form
   - Personal details section
   - Dietary preferences
   - Additional guests management
   - Special requirements input

### Admin Interface
1. Dashboard
   - Overview of RSVPs
   - Guest statistics

2. Table Planner
   - Interactive seating arrangement
   - Table management controls
   - Guest assignment system

3. Guest List
   - Comprehensive guest management
   - RSVP status tracking
   - Dietary preferences overview

## Security and Performance
- Secure invitation links
- Rate limiting for RSVP submissions
- Optimized table drag-and-drop operations
- Responsive design for all screen sizes

## Future Enhancements
- Multi-language support
- Guest meal selection
- Automated email reminders
- Mobile app version
- Integration with wedding registry services 