# KidSafe Backend

This will be the backend for the KidSafe parental control and usage monitoring application built with NestJS.

## Planned Features

- RESTful API endpoints for all frontend functionality
- Authentication with JWT tokens
- Database integration for persistent storage
- Child profile management
- Usage tracking and reporting
- Time limit enforcement
- Website blocking rules

## Tech Stack (Planned)

- NestJS
- TypeScript
- MongoDB (or PostgreSQL)
- Passport.js for authentication
- Jest for testing

## Getting Started

The backend project will be implemented in a future phase.

## API Endpoints (Planned)

### Authentication
- POST /auth/login - Parent login
- POST /auth/register - Parent registration
- POST /auth/child-login - Child login with device ID
- POST /auth/logout - Logout

### Child Profiles
- GET /profiles - Get all child profiles for parent
- GET /profiles/:id - Get specific child profile
- POST /profiles - Create a new child profile
- PATCH /profiles/:id - Update a child profile
- DELETE /profiles/:id - Delete a child profile

### Usage Monitoring
- GET /usage/:childId - Get child usage statistics
- GET /usage/:childId/weekly - Get weekly usage data
- POST /usage/log - Log new activity
- GET /usage/reports - Generate usage reports

### Time Limits
- GET /limits/:childId - Get time limits for a child
- PUT /limits/:childId - Update time limits for a child

### Website Blocking
- GET /blocks/:childId - Get blocked websites for a child
- PUT /blocks/:childId - Update blocked websites for a child 