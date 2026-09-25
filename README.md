# Loan Management Backend

A RESTful backend application for managing loan applications, user authentication, and loan approval workflows.

The application is built using **Node.js, Express.js, MongoDB, and Mongoose**. It provides JWT-based authentication and allows authenticated customers to apply for loans, view their loans, and update pending applications. Administrators can approve or reject loan applications.

---

## Features

### User Authentication

* User registration
* User login
* JWT-based authentication
* Access token and refresh token generation
* Password hashing using bcrypt
* Password verification
* Logout
* Change current password
* Get current authenticated user
* Role-based user model with `customer` and `admin` roles

### Loan Management

* Apply for a loan
* View all loans belonging to the authenticated user
* View a specific loan using its ID
* Update a pending loan application
* Approve a loan
* Reject a loan
* Loan status management

### Security

* JWT authentication middleware
* Protected loan routes
* Password hashing with bcrypt
* Refresh token support
* User ownership validation before accessing or updating loans

### Error Handling

The project uses custom utility classes and middleware for consistent error handling and API responses:

* `ApiError`
* `ApiResponse`
* `asyncHandler`

---

## Tech Stack

| Technology | Purpose              |
| ---------- | -------------------- |
| Node.js    | Backend runtime      |
| Express.js | REST API framework   |
| MongoDB    | Database             |
| Mongoose   | MongoDB ODM          |
| JWT        | Authentication       |
| bcryptjs   | Password hashing     |
| JavaScript | Programming language |

---

## Project Architecture

The backend follows a layered structure:

```text
Request
   ↓
Route
   ↓
Authentication Middleware
   ↓
Controller
   ↓
Mongoose Model
   ↓
MongoDB
   ↓
API Response
```

For example, when a customer applies for a loan:

```text
POST /api/v1/loans/apply
        ↓
loan.route.js
        ↓
verifyJWT
        ↓
applyLoan
        ↓
Loan.create()
        ↓
MongoDB
        ↓
ApiResponse
```

---

## Project Structure

```text
project-root/
│
├── src/
│   │
│   ├── controllers/
│   │   ├── user.controller.js
│   │   └── loan.controller.js
│   │
│   ├── middlewares/
│   │   └── auth.middleware.js
│   │
│   ├── models/
│   │   ├── user.model.js
│   │   └── loan.model.js
│   │
│   ├── routes/
│   │   ├── user.route.js
│   │   └── loan.route.js
│   │
│   └── utils/
│       ├── ApiError.js
│       ├── ApiResponse.js
│       └── AsyncHandler.js
│
├── app.js
├── server.js
├── package.json
└── .env
```

---

# Authentication

The application uses **JWT-based authentication**.

When a user logs in successfully, the backend generates:

* Access Token
* Refresh Token

The access token is used to authenticate protected API requests.

The authentication middleware checks the token from either:

```text
Cookie:
accessToken
```

or:

```text
Authorization: Bearer <access_token>
```

The middleware verifies the token and retrieves the user from MongoDB.

```text
Client Request
      ↓
Authorization Header / Cookie
      ↓
verifyJWT Middleware
      ↓
JWT Verification
      ↓
Find User
      ↓
req.user
      ↓
Controller
```

---

# User Model

The `User` model contains the following fields:

| Field          | Type   | Description           |
| -------------- | ------ | --------------------- |
| `fullName`     | String | User's full name      |
| `email`        | String | Unique email address  |
| `password`     | String | Hashed password       |
| `phNumber`     | String | Unique phone number   |
| `role`         | String | `customer` or `admin` |
| `refreshToken` | String | Stored refresh token  |
| `createdAt`    | Date   | Creation timestamp    |
| `updatedAt`    | Date   | Last update timestamp |

### User Roles

The system currently supports:

```text
customer
admin
```

The default role is:

```text
customer
```

---

# Loan Model

Each loan belongs to a user through a MongoDB ObjectId reference.

```text
User
 │
 │ 1
 │
 │
 │ *
Loan
```

### Loan Fields

| Field              | Type     | Description              |
| ------------------ | -------- | ------------------------ |
| `user`             | ObjectId | Reference to User        |
| `loanAmount`       | Number   | Requested loan amount    |
| `loantenure`       | Number   | Loan tenure              |
| `anualincome`      | Number   | Annual income            |
| `monthlyincome`    | Number   | Monthly income           |
| `creditscore`      | Number   | Credit score             |
| `loanpurpose`      | String   | Purpose of the loan      |
| `employmentstatus` | String   | Employment status        |
| `workexperience`   | Number   | Work experience          |
| `existingloans`    | Number   | Number of existing loans |
| `status`           | String   | Current loan status      |
| `createdAt`        | Date     | Loan creation time       |
| `updatedAt`        | Date     | Last update time         |

### Loan Status

The loan status can be:

```text
pending
approved
decline
```

New loan applications automatically receive:

```text
pending
```

---

# API Endpoints

Base URL:

```text
/api/v1
```

---

## User APIs

### Register User

```http
POST /api/v1/users/register
```

Creates a new user account.

---

### Login

```http
POST /api/v1/users/login-user
```

Authenticates the user and generates authentication tokens.

---

### Logout

```http
POST /api/v1/users/logout
```

Authentication required.

```text
Middleware:
verifyJWT
```

---

### Refresh Access Token

```http
POST /api/v1/users/refresh-token
```

Generates a new access token using the refresh token.

---

### Change Password

```http
POST /api/v1/users/change-password
```

Authentication required.

---

### Get Current User

```http
GET /api/v1/users/me
```

Authentication required.

Returns information about the currently authenticated user.

---

# Loan APIs

## Apply for Loan

```http
POST /api/v1/loans/apply
```

Authentication required.

### Middleware

```text
verifyJWT
```

### Required Information

```json
{
  "loanAmount": 500000,
  "loantenure": 5,
  "anualincome": 600000,
  "monthlyincome": 50000,
  "creditscore": 750,
  "loanpurpose": "Home renovation",
  "employmentstatus": "Employed",
  "workexperience": 3,
  "existingloans": 1
}
```

The authenticated user's ID is automatically assigned to the loan.

---

## Get My Loans

```http
GET /api/v1/loans/my-loans
```

Authentication required.

Returns all loans belonging to the currently authenticated user.

---

## Get Loan By ID

```http
GET /api/v1/loans/:loan_id
```

Authentication required.

Example:

```http
GET /api/v1/loans/64abc123...
```

The API verifies that the authenticated user owns the requested loan before returning it.

---

## Update Loan

```http
PATCH /api/v1/loans/:loan_id
```

Authentication required.

A loan can only be updated while its status is:

```text
pending
```

Example request:

```json
{
  "loanAmount": 600000,
  "workexperience": 4,
  "loanpurpose": "Home renovation"
}
```

The authenticated user must be the owner of the loan.

---

## Approve Loan

```http
PATCH /api/v1/loans/:loan_id/approve
```

Authentication required.

Changes the loan status to:

```text
approved
```

Only loans with a `pending` status should be approved.

> The current route uses JWT authentication. A separate admin authorization middleware should be added before using this endpoint in a production environment.

---

## Reject Loan

```http
PATCH /api/v1/loans/:loan_id/reject
```

Authentication required.

Changes the loan status to:

```text
decline
```

Only pending loans should be rejected.

> The current implementation should also be protected with an admin/loan-officer authorization middleware for production use.

---

# Loan Application Workflow

The basic loan workflow is:

```text
User Registration
       ↓
User Login
       ↓
JWT Authentication
       ↓
Apply for Loan
       ↓
Loan Created
       ↓
Status = pending
       ↓
Loan Reviewed
      / \
     /   \
Approve  Reject
   ↓       ↓
approved  decline
```

---

# Validation

The loan controller validates the following information before creating an application.

### String Fields

The following fields must contain valid non-empty strings:

```text
loanpurpose
employmentstatus
```

### Numeric Fields

The following fields must contain numbers:

```text
loanAmount
loantenure
anualincome
monthlyincome
creditscore
workexperience
```

### Credit Score

The credit score must be between:

```text
300 - 900
```

### Loan Amount

The loan amount must be greater than:

```text
0
```

### Loan Tenure

Loan tenure must be greater than:

```text
0
```

### Income

Annual and monthly income must be greater than:

```text
0
```

### Work Experience

Work experience cannot be negative.

---

# Error Handling

The application uses a custom `ApiError` class for handling errors.

Example:

```javascript
throw new ApiError(
    404,
    "Loan not found"
);
```

Controllers are wrapped using `asyncHandler` to simplify asynchronous error handling.

Example:

```javascript
const getMyLoans = asyncHandler(async (req, res) => {
    // controller logic
});
```

---

# API Response Structure

Successful API responses use the custom `ApiResponse` class.

Example:

```javascript
return res.status(200).json(
    new ApiResponse(
        200,
        loan,
        "Loan fetched successfully"
    )
);
```

A typical response follows the structure:

```json
{
  "statusCode": 200,
  "data": {},
  "message": "Loan fetched successfully",
  "success": true
}
```

---

# Environment Variables

Create a `.env` file in the project root.

Example:

```env
PORT=8000

MONGODB_URI=your_mongodb_connection_string

ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d

REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d
```

Do not commit the `.env` file to GitHub.

Add it to `.gitignore`:

```text
.env
node_modules/
```

---

# Installation

Clone the repository:

```bash
git clone <your-repository-url>
```

Navigate into the project:

```bash
cd <project-name>
```

Install dependencies:

```bash
npm install
```

Create the `.env` file and configure the required environment variables.

Start the development server:

```bash
npm run dev
```

Or start the application normally:

```bash
npm start
```

---

# Testing

The APIs can be tested using tools such as:

* Postman
* Thunder Client
* Insomnia

Recommended testing order:

```text
1. Register
      ↓
2. Login
      ↓
3. Get Current User
      ↓
4. Apply Loan
      ↓
5. Get My Loans
      ↓
6. Get Loan By ID
      ↓
7. Update Pending Loan
      ↓
8. Approve / Reject Loan
```

---

# Security Considerations

The current backend implements:

* Password hashing
* JWT authentication
* Protected routes
* User ownership verification
* Refresh token mechanism
* Environment-based secrets

For a production-ready implementation, the following can be added:

* Admin authorization middleware
* Rate limiting
* Request validation using a validation library
* HTTP security headers
* Input sanitization
* Refresh token rotation
* Audit logs for loan approval/rejection
* Centralized error-handling middleware

---

# Future Improvements

Possible improvements include:

* Admin dashboard
* Loan eligibility calculation
* EMI calculation
* Loan repayment tracking
* Email notifications
* OTP verification
* Redis caching
* Rate limiting
* Loan application document uploads
* Loan approval history
* Admin-specific APIs
* Pagination and filtering for loans
* Search by loan status
* AI-based loan assistance

---

# Author

Sarabu Aneesh
