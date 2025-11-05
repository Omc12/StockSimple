# StockSimple – Essential Inventory and Low-Stock Alert Dashboard

## Project Overview

StockSimple is a centralized application designed to help small retailers and local warehouses manage their product inventory efficiently. It addresses the common issues of disorganized spreadsheets that often lead to stockouts of popular items or excess stock of slow-moving products. With StockSimple, users can track current stock levels, log product movements, and receive automatic low-stock alerts to simplify the reordering process.

## Features

- **User Authentication**: Secure user registration, login, and logout functionalities using JWT for authentication.
- **CRUD Operations**: Manage products and stock movements with Create, Read, Update, and Delete operations.
- **Low-Stock Alerts**: Get notified of products that fall below a user-defined minimum stock level.
- **Visual Inventory Reports**: View bar charts displaying the top 5 highest and lowest stocked items.
- **Quick Stock Adjustments**: Easily log stock increases or decreases with reasons.
- **Responsive Design**: A professional dark-themed interface that is user-friendly and accessible.
- **Search, Sort, and Filter**: Quickly locate specific products and manage inventory effectively.
- **Pagination**: Improve performance by displaying inventory data in manageable chunks.
- **Multi-Page Routing**: Smooth navigation across different sections of the application.

## Tech Stack

- **Frontend**: React.js, React Router, Axios, Recharts, TailwindCSS
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL (using Prisma)
- **Authentication**: JWT (JSON Web Tokens)
- **Hosting**: Vercel (Frontend), Render (Backend), ElephantSQL (Database)

## System Architecture

```
Client (Frontend) → Backend (API & Alert Logic) → Database
```

## API Overview

- **POST /api/auth/login**: Authenticate user (Public)
- **GET /api/products**: Get all products with current stock levels (Authenticated)
- **POST /api/movements**: Log a stock increase or decrease transaction (Authenticated)
- **GET /api/dashboard/alerts**: Get the list of products below the reorder point (Authenticated)
- **PUT /api/products/:sku**: Update a product's details or reorder point (Authenticated)
- **GET /api/reports/toplow**: Get data for top/low stock reports (Authenticated)

## Getting Started

### Prerequisites

- Node.js
- PostgreSQL
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd stocksimple
   ```

2. Set up the backend:
   - Navigate to the `backend` directory.
   - Install dependencies:
     ```
     npm install
     ```
   - Create a `.env` file based on `.env.example` and configure your database connection.
   - Run migrations:
     ```
     npx prisma migrate dev
     ```
   - Start the backend server:
     ```
     npm start
     ```

3. Set up the frontend:
   - Navigate to the `frontend` directory.
   - Install dependencies:
     ```
     npm install
     ```
   - Start the frontend application:
     ```
     npm run dev
     ```

### Usage

- Access the application in your browser at `http://localhost:3000` (or the port specified by your setup).
- Use the login and signup pages to create an account and manage your inventory.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.