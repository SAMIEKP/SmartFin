# SmartFin Backend API

SmartFin Backend API is the server-side application for SmartFin Access Connect, a financial services platform that connects borrowers with loan providers in Malawi. It handles authentication, user management, loan product management, and loan application processing.

## Tech Stack

- Node.js with TypeScript.
- Express.js for the API framework.
- PostgreSQL for the database.
- JWT for authentication.
- bcryptjs for password hashing.
- express-validator for request validation.

## Project Structure

```bash
backend/
├── src/
│   ├── config/
│   │   └── database.ts
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── userController.ts
│   │   ├── productController.ts
│   │   └── applicationController.ts
│   ├── middleware/
│   │   └── auth.ts
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   ├── userRoutes.ts
│   │   ├── productRoutes.ts
│   │   └── applicationRoutes.ts
│   ├── utils/
│   └── server.ts
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

## Installation

1. Install dependencies:

```bash
cd backend
npm install
```

2. Set up environment variables:

```bash
cp .env.example .env
```

Then update `.env` with your local configuration:

```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=smartfin_db
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=your-secret-key-change-in-production
```

3. Set up PostgreSQL:

```bash
createdb smartfin_db
psql -d smartfin_db -f schema.sql
```

## Running the Server

Development mode:

```bash
npm run dev
```

Production build:

```bash
npm run build
npm start
```

The server runs on `http://localhost:5000`.

## API Endpoints

### Authentication Routes (`/api/auth`)

- `POST /api/auth/register` — Register a new user.
  - Body: `{ email, password, role, name, phone, location, incomeRange, institutionName, contactPerson, institutionType, registrationNumber }`
- `POST /api/auth/login` — Log in a user.
  - Body: `{ email, password }`
- `GET /api/auth/profile` — Get the authenticated user’s profile.

### User Routes (`/api/users`)

All routes require authentication.

- `PUT /api/users/profile` — Update user profile.
  - Body: `{ name, phone, location, incomeRange }`
- `GET /api/users/applications` — Get the current user’s applications.
- `GET /api/users/products` — Get available loan products.
  - Query params: `category`, `minAmount`, `maxAmount`

### Product Routes (`/api/products`)

All routes require authentication and a provider role.

- `POST /api/products` — Create a loan product.
  - Body: `{ name, category, minAmount, maxAmount, interestRate, tenure, description, eligibilityCriteria, requiredDocuments }`
- `GET /api/products` — Get the provider’s products.
- `PUT /api/products/:productId` — Update a loan product.
- `DELETE /api/products/:productId` — Delete a loan product.

### Application Routes (`/api/applications`)

All routes require authentication.

- `POST /api/applications` — Submit a loan application.
  - Body: `{ productId, answers, documents }`
- `GET /api/applications/:applicationId` — Get application details.
- `GET /api/applications/provider/all` — Get all applications for a provider.
  - Query params: `status`
- `PUT /api/applications/:applicationId/status` — Update application status.
  - Body: `{ status, notes }`

## Authentication

Protected routes require a JWT token in the `Authorization` header:

```bash
Authorization: Bearer <your-jwt-token>
```

## Database Schema

### Users Table

Stores both borrowers and loan providers, with role-based fields for each type of user.

### Loan Products Table

Stores loan products created by providers, including loan terms, eligibility criteria, required documents, and active status.

### Applications Table

Stores loan applications submitted by users, along with answers, uploaded documents, and status tracking.

## Error Handling

All endpoints return consistent error responses:

```json
{
  "error": "Error Type",
  "message": "Detailed error message"
}
```

Common HTTP status codes used in the API:

- `200` — Success.
- `201` — Created.
- `400` — Bad Request.
- `401` — Unauthorized.
- `403` — Forbidden.
- `404` — Not Found.
- `409` — Conflict.
- `500` — Internal Server Error.

## Development

Compile TypeScript:

```bash
npm run build
```

Run linting:

```bash
npm run lint
```

## Health Check

Check whether the API is running:

```bash
curl http://localhost:5000/health
```

Response:

```json
{
  "status": "OK",
  "message": "SmartFin Backend API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Security Notes

- Change `JWT_SECRET` before deploying.
- Use strong database credentials.
- Enable HTTPS in production.
- Add rate limiting for public endpoints.
- Sanitize and validate all user input.
- Keep dependencies updated regularly.
