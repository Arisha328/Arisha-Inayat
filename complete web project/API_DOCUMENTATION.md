# Outfitters E-Commerce RESTful APIs

## Base URL
```
http://localhost:3000/api
```

## Authentication
Protected endpoints require a JWT token in the `Authorization` header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🔓 PUBLIC ENDPOINTS (No Authentication Required)

### 1. Get All Products
**Endpoint:** `GET /api/products`

**Query Parameters:**
- `category` (optional): Filter by category (Men, Women, Juniors, Kids)
- `search` (optional): Search by product name
- `sortBy` (optional): Sort by 'price-asc', 'price-desc', 'rating', 'name', 'default'
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)

**Example Request:**
```bash
curl -X GET "http://localhost:3000/api/products?category=Men&page=1&limit=10"
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "_id": "6a05c7701ccc29d67a082844",
        "name": "Embroidered Slogan Print T-Shirt",
        "price": 4490,
        "category": "Men",
        "stock": 50,
        "image": "/images/p1.png",
        "rating": 4,
        "fit": "Regular Fit",
        "subCategory": "T-Shirts"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "pageSize": 10,
      "totalProducts": 30,
      "totalPages": 3
    }
  }
}
```

---

### 2. Get Single Product
**Endpoint:** `GET /api/products/:id`

**Example Request:**
```bash
curl -X GET "http://localhost:3000/api/products/6a05c7701ccc29d67a082844"
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "6a05c7701ccc29d67a082844",
    "name": "Embroidered Slogan Print T-Shirt",
    "price": 4490,
    "category": "Men",
    "stock": 50,
    "image": "/images/p1.png",
    "rating": 4,
    "fit": "Regular Fit",
    "subCategory": "T-Shirts",
    "description": "Product description here"
  }
}
```

---

## 🔐 AUTHENTICATION ENDPOINTS

### 3. User Login
**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "customer@example.com",
  "password": "password123"
}
```

**Example Request:**
```bash
curl -X POST "http://localhost:3000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com",
    "password": "password123"
  }'
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user_id_here",
      "name": "John Doe",
      "email": "customer@example.com",
      "role": "customer"
    }
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

### 4. User Registration
**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "customer@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Example Request:**
```bash
curl -X POST "http://localhost:3000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "customer@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user_id_here",
      "name": "John Doe",
      "email": "customer@example.com",
      "role": "customer"
    }
  }
}
```

---

## 🔐 PROTECTED ENDPOINTS (Authentication Required)

### 5. Get User Profile
**Endpoint:** `GET /api/user/profile`

**Example Request:**
```bash
curl -X GET "http://localhost:3000/api/user/profile" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "user_id_here",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  }
}
```

---

### 6. Create Order
**Endpoint:** `POST /api/orders`

**Request Body:**
```json
{
  "items": [
    {
      "id": "6a05c7701ccc29d67a082844",
      "name": "Embroidered Slogan Print T-Shirt",
      "price": 4490,
      "quantity": 2,
      "image": "/images/p1.png"
    }
  ],
  "customer": {
    "name": "John Doe",
    "email": "john@example.com",
    "address": "123 Main Street, City, Country",
    "phone": "+92-300-1234567"
  },
  "total": 8980
}
```

**Example Request:**
```bash
curl -X POST "http://localhost:3000/api/orders" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "items": [...],
    "customer": {...},
    "total": 8980
  }'
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Order placed successfully",
  "data": {
    "orderId": "order_id_here",
    "total": 8980,
    "status": "pending"
  }
}
```

---

### 7. Get All Orders
**Endpoint:** `GET /api/orders`

**Example Request:**
```bash
curl -X GET "http://localhost:3000/api/orders" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "order_id_here",
      "customer": {
        "name": "John Doe",
        "email": "john@example.com",
        "address": "123 Main Street",
        "phone": "+92-300-1234567"
      },
      "total": 8980,
      "status": "pending",
      "createdAt": "2026-05-14T10:00:00Z"
    }
  ]
}
```

---

### 8. Get Single Order
**Endpoint:** `GET /api/orders/:id`

**Example Request:**
```bash
curl -X GET "http://localhost:3000/api/orders/order_id_here" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "order_id_here",
    "user": "user_id_here",
    "customer": {
      "name": "John Doe",
      "email": "john@example.com",
      "address": "123 Main Street",
      "phone": "+92-300-1234567"
    },
    "items": [
      {
        "productId": "6a05c7701ccc29d67a082844",
        "name": "Embroidered Slogan Print T-Shirt",
        "price": 4490,
        "quantity": 2,
        "image": "/images/p1.png"
      }
    ],
    "total": 8980,
    "status": "pending",
    "createdAt": "2026-05-14T10:00:00Z"
  }
}
```

---

## Error Responses

### 400 - Bad Request
```json
{
  "success": false,
  "message": "Validation error message"
}
```

### 401 - Unauthorized
```json
{
  "success": false,
  "message": "No token provided. Please log in."
}
```

### 404 - Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 - Server Error
```json
{
  "success": false,
  "message": "Error message"
}
```

---

## Token Information

- **Token Type:** JWT (JSON Web Token)
- **Expiration:** 7 days from issue
- **Algorithm:** HS256
- **Header Format:** `Authorization: Bearer <token>`

---

## Testing with Postman/Curl

### Step 1: Login to get token
```bash
curl -X POST "http://localhost:3000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com",
    "password": "password123"
  }'
```

### Step 2: Use token in protected endpoints
```bash
curl -X GET "http://localhost:3000/api/user/profile" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Notes

- All timestamps are in ISO 8601 format
- Prices are in PKR (Pakistani Rupees)
- Tokens expire after 7 days of issue
- Always include `Content-Type: application/json` for POST requests
- Passwords are never returned in API responses
