# E-Commerce API

A comprehensive RESTful API for e-commerce platforms with user authentication, product management, reviews, and orders.

## Overview

This API provides all the backend functionality needed for an e-commerce application, including:

- User authentication and management
- Product catalog with filtering and search
- Product reviews and ratings
- Order processing and management

## Live Demo

**Deployed Website:** [E-Commerce API](https://e-commerce-api-alri.onrender.com)

Check out the live application to see the API in action!

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local instance or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/nebula001/E-Commerce-API.git
   cd E-Commerce-API
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:

   ```
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_LIFETIME=1d
   NODE_ENV = development
   ```

4. Start the server:

   ```
   npm start
   ```

   For development with automatic restarts:

   ```
   npm run dev
   ```

## Authentication

The API uses cookie-based authentication. After successful login or registration, a secure HTTP-only cookie is set that must be included in subsequent requests.

### Authentication Endpoints

| Method | Endpoint         | Description                          |
| ------ | ---------------- | ------------------------------------ |
| POST   | `/auth/register` | Register a new user                  |
| POST   | `/auth/login`    | Authenticate and receive auth cookie |
| GET    | `/auth/logout`   | End session and clear auth cookie    |

## API Endpoints

### Users

| Method | Endpoint                    | Description         | Access        |
| ------ | --------------------------- | ------------------- | ------------- |
| GET    | `/users`                    | List all users      | Admin only    |
| GET    | `/users/{id}`               | Get user by ID      | Authenticated |
| GET    | `/users/showMe`             | Get current user    | Authenticated |
| PATCH  | `/users/updateUser`         | Update user details | Authenticated |
| PATCH  | `/users/updateUserPassword` | Change password     | Authenticated |

### Products

| Method | Endpoint                | Description                      | Access     |
| ------ | ----------------------- | -------------------------------- | ---------- |
| GET    | `/products`             | List all products with filtering | Public     |
| POST   | `/products`             | Create a product                 | Admin only |
| POST   | `/products/uploadImage` | Upload product image             | Admin only |
| GET    | `/products/{id}`        | Get product by ID                | Public     |
| PATCH  | `/products/{id}`        | Update a product                 | Admin only |
| DELETE | `/products/{id}`        | Delete a product                 | Admin only |
| GET    | `/products/{id}/review` | Get product reviews              | Public     |

### Reviews

| Method | Endpoint        | Description      | Access         |
| ------ | --------------- | ---------------- | -------------- |
| GET    | `/reviews`      | List all reviews | Public         |
| POST   | `/reviews`      | Create a review  | Authenticated  |
| GET    | `/reviews/{id}` | Get review by ID | Public         |
| PATCH  | `/reviews/{id}` | Update a review  | Owner only     |
| DELETE | `/reviews/{id}` | Delete a review  | Owner or admin |

### Orders

| Method | Endpoint                  | Description             | Access         |
| ------ | ------------------------- | ----------------------- | -------------- |
| GET    | `/orders`                 | List all orders         | Admin only     |
| POST   | `/orders`                 | Create an order         | Authenticated  |
| GET    | `/orders/showAllMyOrders` | Get current user orders | Authenticated  |
| GET    | `/orders/{id}`            | Get order by ID         | Owner or admin |
| PATCH  | `/orders/{id}`            | Update order status     | Admin only     |

## Request & Response Examples

### User Registration

**Request:**

```json
POST /auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**

```json
Status: 201 Created
{
  "id": "user123",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user"
}
```

### Creating a Product

**Request:**

```json
POST /products
{
  "name": "Ergonomic Chair",
  "price": 299.99,
  "description": "Premium office chair with excellent lumbar support",
  "category": "Furniture",
  "company": "ErgoDesign",
  "colors": ["black", "gray"],
  "featured": true,
  "freeShipping": true,
  "inventory": 50
}
```

**Response:**

```json
Status: 201 Created
{
  "id": "product123",
  "name": "Ergonomic Chair",
  "price": 299.99,
  "description": "Premium office chair with excellent lumbar support",
  "image": "default.jpg",
  "category": "Furniture",
  "company": "ErgoDesign",
  "colors": ["black", "gray"],
  "featured": true,
  "freeShipping": true,
  "inventory": 50,
  "averageRating": 0,
  "numOfReviews": 0,
  "user": "admin123",
  "createdAt": "2025-04-25T12:00:00Z",
  "updatedAt": "2025-04-25T12:00:00Z"
}
```

### Placing an Order

**Request:**

```json
POST /orders
{
  "tax": 29.99,
  "shippingFee": 15.00,
  "items": [
    {
      "name": "Ergonomic Chair",
      "price": 299.99,
      "image": "uploads/chair.jpg",
      "amount": 1,
      "product": "product123"
    }
  ]
}
```

**Response:**

```json
Status: 201 Created
{
  "id": "order123",
  "tax": 29.99,
  "shippingFee": 15.00,
  "subtotal": 299.99,
  "total": 344.98,
  "items": [
    {
      "name": "Ergonomic Chair",
      "price": 299.99,
      "image": "uploads/chair.jpg",
      "amount": 1,
      "product": "product123"
    }
  ],
  "status": "pending",
  "user": "user123",
  "clientSecret": "payment_secret_123",
  "paymentIntentId": "payment_intent_123",
  "createdAt": "2025-04-25T12:30:00Z",
  "updatedAt": "2025-04-25T12:30:00Z"
}
```

## Query Parameters for Products

The `/products` endpoint supports several query parameters for filtering and sorting:

- `name`: Filter by product name (partial match)
- `featured`: Filter by featured status (true/false)
- `sort`: Sort by field (e.g., `price`, `name`, `-price` for descending)
- `fields`: Select specific fields to return

Example: `GET /products?featured=true&sort=-price&fields=name,price,image`

## Error Responses

| Status Code | Description                            |
| ----------- | -------------------------------------- |
| 400         | Bad Request - Invalid input data       |
| 401         | Unauthorized - Authentication required |
| 403         | Forbidden - Insufficient permissions   |
| 404         | Not Found - Resource does not exist    |
| 409         | Conflict - Resource already exists     |

## Data Models

### User

- id: string
- name: string
- email: string
- role: "user" | "admin"
- createdAt: date-time
- updatedAt: date-time

### Product

- id: string
- name: string
- price: number
- description: string
- image: string (URL)
- category: string
- company: string
- colors: string[]
- featured: boolean
- freeShipping: boolean
- inventory: integer
- averageRating: number
- numOfReviews: integer
- user: string (ID)
- createdAt: date-time
- updatedAt: date-time

### Review

- id: string
- rating: number (1-5)
- title: string
- comment: string
- user: string (ID)
- product: string (ID)
- createdAt: date-time
- updatedAt: date-time

### Order

- id: string
- tax: number
- shippingFee: number
- subtotal: number
- total: number
- items: OrderItem[]
- status: "pending" | "failed" | "paid" | "delivered" | "canceled"
- user: string (ID)
- clientSecret: string
- paymentIntentId: string
- createdAt: date-time
- updatedAt: date-time

## Security

- Authentication is handled via secure HTTP-only cookies
- Role-based access control for administrative functions
- Input validation for all endpoints
