# Wedding Planner Application - Technical Stack

## Frontend Stack

### Core
- **Framework**: React 18.2.0
- **Build Tool**: Vite 5.0.8
- **Language**: JavaScript (JSX)

### UI/UX
- **Styling**: Styled Components 6.1.8
- **Animations**: Framer Motion 11.15.0
- **Drag & Drop**: @hello-pangea/dnd 17.0.0
- **Fonts**:
  - Dancing Script (decorative)
  - Montserrat (primary)

### Routing & State Management
- **Router**: React Router DOM 6.21.3
- **HTTP Client**: Axios 1.6.7

### Development Tools
- **Linting**: ESLint 8.55.0
  - eslint-plugin-react
  - eslint-plugin-react-hooks
  - eslint-plugin-react-refresh
- **Type Checking**: @types/react, @types/react-dom

## Backend Stack

### Core
- **Framework**: Symfony (PHP)
- **Database**: MySQL/MariaDB
- **Server**: Apache/Nginx

### Features
- **ORM**: Doctrine
- **Migrations**: Doctrine Migrations
- **Email**: Symfony Mailer
- **Templates**: Twig Template Engine

### API
- **Architecture**: RESTful
- **Format**: JSON
- **Authentication**: JWT (JSON Web Tokens)

## Development & Deployment

### Version Control
- Git
- GitHub/GitLab

### Development Environment
- **Local Server**: PHP Built-in Server
- **Database**: Local MySQL/MariaDB
- **Node Version**: >= 18.x
- **PHP Version**: >= 8.x

### Deployment
- **Frontend**: Static hosting (e.g., Netlify, Vercel)
- **Backend**: PHP-compatible hosting
- **Database**: Managed MySQL service

## Testing & Quality Assurance

### Frontend Testing
- React Testing Library
- Jest
- ESLint for code quality

### Backend Testing
- PHPUnit
- Symfony Testing Framework

## Infrastructure & Services

### Email Services
- SMTP server for transactional emails
- Email templates using Twig

### Storage
- Local file system for PDFs
- Database for user data and configurations

### Security
- HTTPS/TLS
- CORS configuration
- Rate limiting
- Input validation
- XSS protection

## Development Tools

### IDEs & Editors
- VS Code recommended extensions:
  - ESLint
  - Prettier
  - PHP Intelephense
  - React Developer Tools

### Package Managers
- **Frontend**: npm/yarn
- **Backend**: Composer

## Monitoring & Logging

### Error Tracking
- Console logging
- Server-side error logs
- PHP error reporting

### Performance Monitoring
- Browser DevTools
- Network request monitoring
- Database query logging

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers 