# ECommerceWebsite

# E-Commerce Platform - Frontend (React)

## 1. Introduction
This project is the frontend implementation of an E-Commerce Platform designed to allow users to browse products, manage shopping carts, make payments, and track orders. It features a responsive and intuitive user interface built with React to ensure accessibility across all devices.

## 2. Core Modules
The application is divided into five primary modules as per the design specifications[cite: 6]:
* **Product Management**: Browsing and viewing detailed product listings[cite: 7, 30].
* **Shopping Cart**: Managing items, quantities, and calculating total prices[cite: 9, 49].
* **Order Management**: Checkout processing, payment status, and order tracking[cite: 11, 12, 66].
* **User Authentication**: Secure registration, login, and profile management[cite: 13, 14].
* **Admin Dashboard**: Restricted interface for managing products, orders, and viewing sales analytics[cite: 15, 16, 106].

## 3. Technology Stack
* **Frontend**: React.js with React Router for SPA navigation[cite: 19].
* **State Management**: React Context API (Auth and Cart states).
* **Backend Communication**: RESTful API integration using Axios[cite: 20, 23].
* **Styling**: Responsive CSS/Modern UI Framework.

## 4. Project Structure
The project follows a feature-based folder structure to maintain the Low-Level Design (LLD) integrity:
```bash
src/
├── components/   # Reusable UI elements (Common, Layout, Module-specific)
├── context/      # Global state for Authentication and Shopping Cart
├── pages/        # Main views: Home, ProductListing, Cart, Checkout, Admin
├── services/     # API service layer for backend communication
└── routes/       # Route guards for User and Admin protected areas
```
## 5. Key Features
* **Product Browsing**: Dynamic product grid with detailed views including Name, Description, Price, and ImageURL.
* **Shopping Cart**: Real-time cart management allowing users to add/remove items and adjust quantities.
* **Secure Checkout**: Integration for shipping information and simulated payment processing.
* **Order Tracking**: User-facing order history with status tracking (Pending, Shipped, Delivered).
* **Admin Tools**: Comprehensive dashboard for product CRUD operations and platform analytics.

## 6. Non-Functional Requirements
* **Performance**: Optimized rendering and API handling to support up to 1,000 concurrent users.
* **Scalability**: Component-based architecture designed for horizontal scaling and easy feature extension.
* **Security**: Implementation of JWT-based authentication and Route Guards for Role-Based Access Control (RBAC).
* **Usability**: Mobile-first responsive design to ensure accessibility across all device types and screen sizes.

## 7. Setup and Installation
1.  **Clone the Repository**:
    ```bash
    git clone <repository-url>
    cd ecommerce-frontend
    ```
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Environment Configuration**:
    Create a `.env` file in the root directory and add your Backend API URL:
    ```env
    REACT_APP_API_URL=http://localhost:5000/api
    ```
4.  **Start the Application**:
    ```bash
    npm start
    ```
    The application will be available at `http://localhost:3000`.
