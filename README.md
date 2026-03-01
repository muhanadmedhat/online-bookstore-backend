# 📖 ChapterOne Bookstore — Backend API

RESTful API for the ChapterOne online e-commerce bookstore. Built to provide a seamless shopping experience with secure authentication, book cataloging, cart management, and order processing.

---

## 👥 Meet the Team
This project was proudly built by:
- **Asaad Mansour**
- **Muhanad Medhat** 
- **Haneen Elesawy**
- **Mohammed Nagy**

---

## 🚀 Live Environment
- **Live API URL:** [https://online-bookstore-backend-production-4861.up.railway.app](https://online-bookstore-backend-production-4861.up.railway.app)
- **API Documentation:** `/api-docs` (Swagger UI available on running instance)

---

## ✨ Features
- **🔐 Authentication & Authorization:** JWT (Access & Refresh tokens) with bcrypt password hashing.
- **📧 Email Communications:** Optional email verification and password reset (via Nodemailer & Gmail).
- **🛍️ Catalog Management:** Books catalog with full-text search, filters, and pagination.
- **🛒 Shopping Cart:** Per-user shopping cart with real-time quantity management.
- **📦 Order Processing:** Order placement with strict stock validation and status transitions.
- **⭐ Reviews System:** Verified reviews (only for delivered purchases, limited to one per user per book).
- **🖼️ Media Handling:** Book cover image - Author Image - Category Image upload via Cloudinary & Multer.
- **🛡️ Security First:** Helmet security headers, CORS protection, and Rate limiting.
- **📋 Structured Logging:** Request and error logging with Morgan and Winston.

---

## 🏗️ Tech Stack
| Layer | Technology |
|---|---|
| **Runtime** | Node.js |
| **Framework** | Express.js |
| **Database** | MongoDB & Mongoose |
| **Auth** | JWT (JSON Web Tokens) & Bcrypt |
| **Validation** | Joi |
| **Image Upload** | Multer & Cloudinary |
| **Email Services** | Nodemailer & Gmail |
| **Logging** | Winston & Morgan |
| **Security** | Helmet, express-rate-limit, CORS |

---

## 📁 Project Structure

```text
.
├── app.js                  # Express app setup and middleware pipeline
├── server.js               # Application entry point
├── config/                 # Configurations (Swagger, DB, uploads)
│   ├── cloudinary.js       
│   ├── db.js               
│   ├── mailer.js           
│   ├── multer.js           
│   └── swagger.js          
├── controllers/            # Route handler logic
│   ├── auth.js             # Login, register, tokens
│   ├── users.js            # Profile controllers
│   ├── book.js             # Books CRUD
│   ├── author.js           # Authors CRUD
│   ├── category.js         # Categories CRUD
│   ├── cart.js             # Cart management
│   ├── order.js            # Order placement & status
│   └── review.js           # Book reviews
├── models/                 # Mongoose database schemas
│   └── (author, book, cart, category, order, review, users).js
├── routes/                 # Express route definitions
│   └── (auth, author, book, cart, category, index, order, review, users).js
├── middlewares/            # Custom middlewares
│   ├── auth.js             # Token verification and roles
│   ├── upload.js           # File uploads (multer)
│   └── validate.js         # Data validation
├── validations/            # Joi validation schemas for request bodies
│   └── (auth, author, book, cart, category, order, review, users).js
├── helpers/                # Reusable utilities
│   ├── CustomError.js      
│   ├── email.js            
│   ├── logger.js           
│   └── syncAverageRating.js
├── .env                    # Environment variables mapping
├── eslint.config.js        # Linter configuration
└── package.json            # Project metadata and dependencies
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB instance (Atlas)
- Cloudinary account (for image uploads)
- Gmail (optional, for email features)

### Installation
```bash
git clone https://github.com/HaneenElasawy/online-bookstore-backend.git
cd online-bookstore-backend
npm install
```

### Environment Variables
Create a `.env` file in the root directory:

```env
NODE_ENV=development
PORT=5000

MONGO_URI=MONGO_ATLAS_URL

JWT_SECRET=your_jwt_secret_here

# Email Verification (optional)
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_password

# Cloudinary (required)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Run Locally
```bash
# Development
npm run dev

# Production
npm start
```
The server will start on `http://localhost:5000`. 
Check the health endpoint at `http://localhost:5000/health`.

---

## 🗺️ API Endpoints

### Auth 
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/auth/me/test` | Test the API connection | Public |
| POST | `/auth/register` | Register | Public |
| POST | `/auth/verify-email` | Verify email | Public |
| POST | `/auth/login` | Login | Public |
| POST | `/auth/logout` | Logout | 🔒 User |
| POST | `/auth/refresh` | Refresh access token | Public |

### Users
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/users/me` | Get own profile | 🔒 User |
| PATCH | `/users/me` | Update profile | 🔒 User |
| PATCH | `/users/me/passwords` | Change password | 🔒 User |
| GET | `/users` | Get all user profiles | 🔑 Admin |
| DELETE | `/users/:id` | Delete user profile | 🔑 Admin |

### Books 
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/books` | List books (search, filter, paginate) | Public |
| GET | `/books/popular` | Get popular books | Public |
| GET | `/books/suggestions` | Get book suggestions | Public |
| GET | `/books/:id` | Get single book | Public |
| POST | `/books` | Create book (with cover image) | 🔑 Admin |
| PATCH | `/books/:id` | Update book | 🔑 Admin |
| DELETE | `/books/:id` | Soft delete book | 🔑 Admin |
> **Query params for GET `/books`:** `page`, `limit`, `category`, `author`

### Authors & Categories
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/authors` | List authors | Public |
| POST | `/authors` | Create author | 🔑 Admin |
| PATCH | `/authors/:id` | Update author | 🔑 Admin |
| GET | `/categories` | List categories | Public |
| POST | `/categories` | Create category | 🔑 Admin |
| PUT | `/categories/:id` | Update category | 🔑 Admin |
| DELETE| `/categories/:id` | Delete category | 🔑 Admin |

### Cart 
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/cart` | Get cart items | 🔒 User |
| POST | `/cart` | Add item | 🔒 User |
| PATCH | `/cart/:bookId` | Set exact quantity | 🔒 User |
| DELETE | `/cart/:bookId` | Remove item | 🔒 User |
| DELETE | `/cart` | Clear entire cart | 🔒 User |

### Orders 
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/orders` | Place order | 🔒 User |
| GET | `/orders` | Get user's orders | 🔒 User |
| GET | `/orders/admin/all` | Get all orders | 🔑 Admin |
| GET | `/orders/:id` | Get order by ID | 🔒 User (Owner) or 🔑 Admin |
| PATCH | `/orders/:id/status` | Update order delivery status | 🔑 Admin |
| PATCH | `/orders/:id/payment` | Update order payment status | 🔑 Admin |

### Reviews 
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/reviews?book_id=`| Get book reviews | Public |
| POST | `/reviews` | Add review | 🔒 User |
| DELETE | `/reviews/:id` | Delete own review | 🔒 User |

> ℹ️ **Note:** Users can only review books they have purchased.

---

## 🔄 Status Transitions

### Order Status Flow
```text
placed → processing → out for delivery → delivered
           
```

### Payment Status Flow
```text
pending → success 
```

---

## 🔒 Security Measures
- **Rate limiting:** Strict global request tracking (300 requests per 15 minutes), with stricter limits on authentication endpoints.
- **Helmet headers:** Standardized security headers enforced on all responses.
- **JWT Verification:** Secure token payloads required on all non-public routes.
- **Password Protection:** Encrypted with bcrypt algorithm.
- **Sanitized Outputs:** Clean API responses (hidden password hashes, internal paths).
