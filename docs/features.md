# Existing Features

This document provides a comprehensive list of currently implemented features in the Finance Behavioral System.

## 🔐 User Authentication
The system provides a secure authentication layer using Laravel Sanctum to manage user access and data privacy.

- **Account Management**:
    - **Registration**: Users can create new accounts.
    - **Login/Logout**: Secure session management.
- **Protected Access**: All financial data routes are protected by authentication middleware.
- **Profile Management**: Endpoint to retrieve the currently authenticated user's information.

## 📊 Dashboard
The Dashboard serves as the central hub for financial overview and quick insights.

- **Summary Cards**: Real-time display of:
    - **Total Income**: Sum of all recorded income transactions.
    - **Total Expenses**: Sum of all recorded expense transactions.
    - **Net Balance**: The difference between total income and total expenses.
- **Data Visualization**:
    - **Income vs Expense Bar Chart**: A visual comparison of cash flow.
    - **Expense Breakdown Pie Chart**: Distributed view of spending across categories.
## 💸 Transaction Management
Core functionality for tracking and managing financial events.

- **Transaction List**: A detailed table showing:
    - Date (formatted)
    - Category
    - Description
    - Amount
    - Type (Income/Expense)
- **Manual Entry**: Form to add new transactions with validation.
- **User Isolation**: Users can only view, create, update, or delete their own transactions.
- **Categorization**: Transactions are associated with system or custom categories.
- **Custom Categories**: Users can create their own categories tailored to their spending habits.
- **Responsive Layout**: Optimized for both desktop and mobile viewing.

## 🧭 UI / UX
Modern, responsive interface built with premium design principles.

- **Sidebar Navigation**: Fixed, collapsible sidebar with intuitive icons.
- **Responsive Design**: Fluid layout that adapts to various screen sizes.
- **Shadcn-Vue Integration**: High-quality, accessible UI components.
- **Glassmorphism & Micro-animations**: Subtle visual effects for a premium feel.
- **Theming**: Consistent color palette and typography.

## 🛠️ Internal Utilities & System
Robust technical foundation for stability and performance.

- **Date Formatter**: A specialized utility to transform date strings (e.g., `1/1/2001` → `Jan 1, 2001`) with full safety and validation.
- **Type Safety**: End-to-end TypeScript implementation for reduced runtime errors.
- **State Management**: Centralized reactive state using Pinia.
- **Clean Architecture**: Decoupled backend (Laravel) and frontend (Vue) for long-term maintainability.

## 🧪 Testing
- **Frontend Quality**: Comprehensive Jest tests for stores and utilities.
- **Backend Quality**: Robust Pest tests for API endpoints and services.
