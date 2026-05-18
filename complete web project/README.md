# Outfitters Clone

A full-stack e-commerce web application built with Node.js, Express, MongoDB, EJS templates, and JWT authentication.

## Features

- Product catalog with category filters, search, sorting, and pagination
- Customer login and registration
- Protected order creation endpoint
- User profile endpoint
- Admin dashboard for product management
- Session-based authentication for frontend routes
- JWT-protected REST API endpoints
- Seed script to populate products and test users

## Tech Stack

- Node.js
- Express
- MongoDB / Mongoose
- EJS
- bcryptjs
- express-session
- connect-mongo
- JSON Web Tokens
- multer

## Installation

1. Clone the repository or copy the project folder.
2. Open terminal in the project root.
3. Install dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env` file in the project root to configure runtime settings. The app loads environment variables automatically with `dotenv`.

Supported variables:

```env
MONGO_URI=mongodb://localhost:27017/outfitters
SESSION_SECRET=your-session-secret
JWT_SECRET=your-jwt-secret
PORT=3000
```

If no `.env` is provided, the app will use defaults:

- MongoDB: `mongodb://localhost:27017/outfitters`
- Session secret: `outfitters-secret`
- JWT secret: `outfitters-jwt-secret-key-2026`
- Port: `3000`

## Seed Database

The project includes `seed.js` to populate sample product data and test users.

Run:

```bash
node seed.js
```

Default seeded users:

- Admin: `admin@outfitters.com` / `admin123`
- Customer: `customer@example.com` / `password123`

## Run the App

Start the app:

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

## Frontend Pages

- `/` - Home page
- `/products` - Product list
- `/cart` - Cart page
- `/checkout` - Checkout page (requires login)
- `/login` - Login page
- `/register` - Registration page
- `/admin` - Admin dashboard (requires admin session)

## API Endpoints

### Public

- `GET /api/products` - List products
- `GET /api/products/:id` - Get single product details

### Authentication

- `POST /api/auth/login` - Login and receive JWT (token includes `user_id`, `email`, and `role`)
- `POST /api/auth/register` - Create a new account

### Protected

- `GET /api/user/profile` - Get current user profile
- `POST /api/orders` - Create a new order
- `GET /api/orders` - Get current user orders
- `GET /api/orders/:id` - Get order detail

> Note: The API router is mounted on both `/api` and `/api/v1`.
> JWT tokens include `role` and are used with `Authorization: Bearer <token>`.

## Example API Request

```bash
curl -X GET "http://localhost:3000/api/v1/products"
```

## Notes

- Make sure MongoDB is running locally before starting the app.
- Use the seed script for a ready-to-test dataset.
- JWT-protected API endpoints require the `Authorization: Bearer <token>` header.

## Project Structure

- `app.js` - Main Express application
- `routes/` - Express routes for API and admin
- `models/` - Mongoose schemas for User, Product, Order
- `config/` - Database connection config
- `middleware/` - Authentication and token middleware
- `public/` - Static assets (CSS, JS, images)
- `views/` - EJS templates
- `seed.js` - Database seeding script
