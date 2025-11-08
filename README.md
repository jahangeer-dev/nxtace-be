# Template Store Backend API

A robust Node.js backend API for the Mini SaaS Template Store, built following clean architecture principles with TypeScript, Express.js, MongoDB, and Passport.js authentication.

## 🚀 Features

- **Clean Architecture**: Domain-driven design with clear separation of concerns
- **Authentication**: JWT-based authentication with Passport.js strategies
- **Database**: MongoDB with Mongoose ODM
- **Security**: Helmet, CORS, rate limiting, and input validation
- **Logging**: Winston logger with structured logging
- **Error Handling**: Centralized error handling with proper HTTP status codes
- **TypeScript**: Full type safety with modern TypeScript features
- **Hot Reload**: Development server with watch mode

## 🛠 Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js v5.1.0
- **Language**: TypeScript v5.8.3
- **Database**: MongoDB with Mongoose v8.13.2
- **Authentication**: Passport.js with JWT and Local strategies
- **Password Hashing**: Argon2
- **Validation**: Zod for environment and input validation
- **Logging**: Winston v3.17.0
- **Security**: Helmet, CORS
- **Process Management**: tsx for development

## 🏗 Architecture Overview

```
src/
├── application/           # Business logic layer
│   ├── auth/             # Authentication use cases
│   ├── templates/        # Template business logic
│   └── favorites/        # Favorites management
├── config/               # Configuration management
│   ├── constants/        # Default configurations
│   ├── readers/          # Environment and app config
│   └── types/            # Configuration types
├── domain/               # Core domain layer
│   ├── entities/         # Database models (User, Template, Favorite)
│   └── interfaces/       # Repository contracts
├── infrastructure/       # External services layer
│   ├── database/         # Database implementations
│   │   ├── mongo/        # MongoDB client
│   │   └── repositories/ # Data access layer
│   └── http/             # HTTP server setup
│       ├── controllers/  # Request handlers
│       ├── middlewares/  # Express middlewares
│       ├── routes/       # API routes
│       └── server.ts     # Express server configuration
├── interfaces/           # External interfaces
│   └── rest/             # REST API entry point
└── shared/               # Shared utilities
    ├── observability/    # Logging and monitoring
    └── utils/            # Helper functions and utilities
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB 5.0+
- npm or yarn

### Installation

1. **Clone and navigate to the backend directory**
   ```bash
   cd template-store-be
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/template-store
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   JWT_EXPIRES_IN=7d
   PASSPORT_SECRET=your-passport-secret-key
   ALLOWED_ORIGIN=http://localhost:5173,http://localhost:3000
   ```

4. **Start MongoDB**
   ```bash
   # Using MongoDB service
   sudo systemctl start mongod
   
   # Or using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

5. **Seed the database with sample templates**
   ```bash
   npm run seed
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run seed` - Seed database with sample templates
- `npm run clean` - Clean build directory

## 📚 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register new user | No |
| POST | `/login` | User login | No |
| GET | `/me` | Get current user profile | Yes |

### Template Routes (`/api/templates`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all templates | No |
| GET | `/search?q=query&category=cat` | Search templates | No |
| GET | `/:id` | Get template by ID | No |

### Favorite Routes (`/api/favorites`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get user's favorite templates | Yes |
| POST | `/:templateId` | Add template to favorites | Yes |
| DELETE | `/:templateId` | Remove template from favorites | Yes |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | API health status |

## 🔐 Authentication Flow

### Registration
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe" // optional
}
```

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

### Response Format
```json
{
  "success": true,
  "data": {
    "token": "jwt-token-here",
    "user": {
      "id": "user-id",
      "email": "user@example.com",
      "name": "John Doe"
    }
  },
  "message": "Login successful"
}
```

### Using Protected Routes
Include the JWT token in the Authorization header:
```bash
Authorization: Bearer <jwt-token>
```

## 🗄 Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  email: String (unique, required),
  password: String (hashed, required),
  name: String (optional),
  createdAt: Date,
  updatedAt: Date
}
```

### Template Collection
```javascript
{
  _id: ObjectId,
  name: String (required),
  description: String (required),
  thumbnail_url: String (required),
  category: String (required),
  createdAt: Date,
  updatedAt: Date
}
```

### Favorite Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, required),
  templateId: ObjectId (ref: Template, required),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `3000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/template-store` |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_EXPIRES_IN` | JWT token expiration | `7d` |
| `PASSPORT_SECRET` | Passport session secret | - |
| `ALLOWED_ORIGIN` | CORS allowed origins | `http://localhost:5173,http://localhost:3000` |

### Database Indexes

The application automatically creates the following indexes:

- **User**: `email` (unique)
- **Template**: `category`, `name + description` (text search)
- **Favorite**: `userId + templateId` (compound unique)

## 🚦 Error Handling

The API uses consistent error response format:

```json
{
  "success": false,
  "message": "Error description",
  "stack": "Stack trace (development only)"
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized
- `404` - Not Found
- `409` - Conflict (e.g., duplicate email)
- `500` - Internal Server Error

## 📊 Logging

The application uses Winston for structured logging:

- **Console**: Colored output for development
- **File**: `logs/combined.log` for all logs
- **File**: `logs/error.log` for error logs only

Log levels: `error`, `warn`, `info`, `http`, `debug`

## 🔒 Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing protection
- **JWT**: Stateless authentication
- **Argon2**: Password hashing
- **Input Validation**: Request validation with proper error handling
- **MongoDB Injection**: Protection via Mongoose

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables for Production
Ensure to set secure values for:
- `JWT_SECRET` - Use a strong, random secret
- `MONGO_URI` - Production MongoDB connection
- `ALLOWED_ORIGIN` - Production frontend URLs

### Docker Support (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["npm", "start"]
```

## 🧪 Testing Sample Data

The seeded templates include:
- Modern Dashboard (Dashboard category)
- E-commerce Landing (E-commerce category)
- Portfolio Website (Portfolio category)
- Blog Template (Blog category)
- SaaS Landing Page (SaaS category)
- Corporate Website (Corporate category)
- Restaurant Menu (Restaurant category)
- Mobile App Landing (Mobile category)
- Photography Gallery (Photography category)
- Education Platform (Education category)

## 🤝 API Integration

This backend is designed to work with the React frontend. The API follows REST conventions and provides:

- Consistent JSON responses
- Proper HTTP status codes
- CORS configuration for frontend integration
- JWT authentication flow
- Comprehensive error handling

## 👨‍💻 Development

### Code Structure Guidelines

- **Controllers**: Handle HTTP requests/responses
- **Services**: Business logic implementation
- **Repositories**: Data access layer
- **Entities**: Database models
- **Middlewares**: Cross-cutting concerns

### Adding New Features

1. Define domain entities in `src/domain/entities/`
2. Create repository interface in `src/domain/interfaces/`
3. Implement repository in `src/infrastructure/database/repositories/`
4. Create service in `src/application/`
5. Add controller in `src/infrastructure/http/controllers/`
6. Define routes in `src/infrastructure/http/routes/`

---

## 📝 License

This project is part of a technical assessment task for demonstrating full-stack development skills.

---

## 🔗 Related

This backend is designed to work with the React frontend. See the frontend repository for client-side implementation details.
# nxtace-be
