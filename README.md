Small Business Stock Tracker & Reorder Alert System

Project Title
StockSimple – Essential Inventory and Low-Stock Alert Dashboard 2. Problem Statement

Small retailers and local warehouses often use disorganized spreadsheets to manage product inventory, leading to frequent stockouts of popular items or excess stock of slow movers. They need a simple, centralized application to track current stock levels, quickly log product movements (in/out), and automatically generate low-stock alerts to simplify reordering.

System Architecture
Structure: Client (Frontend) → Backend (API & Alert Logic) → Database Example Stack: Frontend: React.js Backend: Node.js + Express Database: PostgreSQL (Relational). Authentication: JWT-based. Hosting: Frontend Vercel Backend Render Database Supabase

Key Features
Category Features Authentication & Authorization User registration, login, logout. Simple access: Authenticated users (staff/owner) can update stock and view all data. CRUD Operations Create, Read, Update, Delete for two core entities: Products (Name, SKU, Cost) and Stock Movements (In/Out logs). Frontend Routing Pages: Home (Alert Dashboard), Login, Product Catalog, Inventory Log, Stock Update Form. Low-Stock Alerts On the dashboard, display a clear, colored list of all products whose current stock level is below a user-defined minimum threshold (the "reorder point"). Quick Stock Adjustment A simple form allowing staff to log a positive or negative stock adjustment with a reason (e.g., Received shipment: +50, Damaged: -2). Visual Inventory Report A Bar Chart showing the value or quantity of the top 5 highest- and lowest-stocked items. Hosting Deploy both backend and frontend to accessible URLs. Searching, Sorting & Filtering To enable users to quickly locate specific products, organize inventory data effectively, and focus on relevant items when managing stock or analyzing performance. Pagination To improve performance and usability when managing large inventories by displaying data in smaller, manageable chunks rather than loading all records at once. Routing for multiple pages To provide a smooth, app-like navigation experience across all key sections of the StockSimple dashboard — enabling users to move between pages without full page reloads, while maintaining authentication and consistent layout.

Tech Stack
Technologies: Frontend: React.js, React Router, Axios, Recharts, TailwindCSS

Backend: Node.js, Express.js

Database: PostgreSQL (Prisma)

Authentication: JWT (JSON Web Tokens)

AI: Not Required

Hosting: Vercel (Frontend), Render (Backend), ElephantSQL (Database)

API Overview
Endpoint Method Description Access /api/auth/login POST Authenticate user Public /api/products GET Get all products with current stock levels Authenticated /api/movements POST Log a stock increase or decrease transaction Authenticated /api/dashboard/alerts GET Get the list of products below the reorder point Authenticated /api/products/:sku PUT Update a product's details or reorder point Authenticated /api/reports/toplow GET Get data for top/low stock reports Authenticated
