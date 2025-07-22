# RelooMate Backend API

A Node.js + Express backend API for the RelooMate student housing platform. This API provides user authentication, profile management, and onboarding content for the React Native mobile application.

## Features

- **User Registration & Authentication**: Secure user registration with password hashing and JWT-based authentication
- **Protected Routes**: JWT-protected endpoints for user profile access
- **Student Housing Onboarding**: Dedicated endpoint for onboarding content with housing-specific steps
- **Input Validation**: Comprehensive validation using express-validator
- **Error Handling**: Professional error responses with consistent JSON format
- **CORS Support**: Configured for React Native app integration
- **MongoDB Integration**: User data persistence with Mongoose ODM

## API Endpoints

### Authentication
- `POST /api/v1/users/register` - Register a new user
- `POST /api/v1/users/login` - User login

### User Management
- `GET /api/v1/users/profile` - Get user profile (Protected route)
- `GET /api/v1/users/logout` - Get user profile (Protected route)

### Onboarding
- `GET /api/v1/users/onboarding` - Get onboarding steps  (Protected Route)

### Health Check
- `GET /api/v1/healthcheck` - API health status

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Local Development Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   
   Create a `.env` file in the root directory with the following variables:
   ```env
   
   PORT=8080
   MONGODB_URI=mongodb+srv://demo.net
   NODE_ENV=development # changing this will avoid stack traces in the error response
   ACCESS_TOKEN_SECRET=LD9cv1kBfgRHVIg9GG_OGzh9TUkcyqgZAaM0o3DmVkx08MCFRSzMocyO3UtNdDNtoCJ0X0-5nLwK7fdO 
   ACCESS_TOKEN_EXPIRY=1d
   REFRESH_TOCKEN_SECRET=CMdDNtowK7fX0-5D9cv0oJ008MCFRSLHVTUkcyqgZAaIg9GG_OGzh9zMocyO3UtN1kBfLRn3DmVkxdO
   REFRESH_TOCKEN_EXPIRY=10d
   # CORS_ORIGIN=http://localhost # add the frontend URL (more secure)
   CORS_ORIGIN=*
   ```

3. **Start MongoDB**
   
   Make sure MongoDB is running on your system:
   ```bash
   # For macOS (with Homebrew)
   brew services start mongodb-community
   
   # For Ubuntu/Linux
   sudo systemctl start mongod
   
   # Or use MongoDB Atlas cloud instance
   ```

4. **Run the Server**
   ```bash
   npm start
   # or for development
   npm run dev
   ```

5. **Verify Installation**
   
   Open your browser or API client and visit:
   ```
   http://localhost:8080/api/v1/health
   ```

## API Usage Examples

### Register a New User
```bash
curl -X POST http://localhost:8080/api/v1/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

### Login User
```bash
curl -X POST http://localhost:8080/api/v1/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

### Get User Profile (Protected)
```bash
curl -X GET http://localhost:8080/api/v1/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get Onboarding Steps
```bash
curl -X GET http://localhost:8080/api/v1/onboarding
```

## Response Format

All API responses follow this consistent format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data here
  }
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    // Validation errors (if applicable)
  ]
}
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

Tokens expire in 7 days by default (configurable via JWT_EXPIRES_IN environment variable).

## Database Schema

### User Model
```javascript
{
  name: String (required, 2-50 characters),
  email: String (required, unique, valid email),
  password: String (required, min 6 characters, bcrypt hashed),
  createdAt: Date,
  updatedAt: Date
}
```

## Development

### Project Structure
```
├── models/          # MongoDB schemas
├── routes/          # API route handlers
├── middleware/      # Custom middleware
├── server.js        # Main application file
├── .env            # Environment variables
└── README.md       # Documentation
```

### Adding New Routes
1. Create route file in `/routes` directory
2. Import and use in `server.js`
3. Add appropriate middleware for authentication/validation

## Deployment

### Production Environment Variables
```env
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/reloomate
JWT_SECRET=your-production-jwt-secret-key-make-it-strong
JWT_EXPIRES_IN=7d
NODE_ENV=production
```

### Docker Deployment
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```


