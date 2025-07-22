# Dashboard Development Plan

## 1. Overview

The Dashboard is a web-based admin interface (SvelteKit + Tailwind CSS) for managing restaurants, users, seating, insights, and customer support. It is used by both Main Admins and Restaurant Admins.

---

## 2. Feature Breakdown & Milestones

### 2.1. Restaurant Control

- **Features:**
  - Add new restaurant
  - Edit restaurant details
  - Disable/enable restaurant
  - View subscription/payment info
  - Menu management (add/edit/disable foods)

- **Milestones:**
  1. **Restaurant List Page**
     - Table of all restaurants (name, status, subscription, actions)
     - Search/filter
  2. **Restaurant Form**
     - Add/edit restaurant details (name, address, contact, etc.)
     - Assign admin credentials
  3. **Subscription Info**
     - View and update subscription/payment status
  4. **Menu Management**
     - Link to menu management for each restaurant

### 2.2. Insights

- **Features:**
  - View sales and operational data
  - Export Excel templates for finance/ERP
  - Filter by restaurant, date, etc.

- **Milestones:**
  1. **Insights Dashboard**
     - Sales summary cards (total sales, orders, etc.)
     - Charts (sales over time, top items)
  2. **Export Functionality**
     - Export data as Excel/CSV
  3. **Multi-role Views**
     - Main Admin: all restaurants
     - Restaurant Admin: own restaurant only

### 2.3. Seating Area Control

- **Features:**
  - Add/remove tables
  - Print QR codes for tables

- **Milestones:**
  1. **Seating Area Page**
     - List of tables (table number, status)
     - Add/remove table functionality
  2. **QR Code Generation**
     - Generate and display QR code for each table
     - Print/download QR codes

### 2.4. User Control

- **Features:**
  - Register new users
  - Login/logout
  - View user history

- **Milestones:**
  1. **User List Page**
     - Table of users (name, email, role, status)
     - Search/filter
  2. **User Registration**
     - Form to add/register new users
  3. **User History**
     - View order history for each user

### 2.5. Customer Service

- **Features:**
  - FAQ page for Company Admin, Restaurant Admin, and User

- **Milestones:**
  1. **FAQ Management**
     - CRUD for FAQ entries (by role)
  2. **FAQ Display**
     - Display FAQ by user role in dashboard

---

## 3. Technical Steps

### 3.1. Project Setup

- SvelteKit + Tailwind CSS + Skeleton UI
- Set up routing and layouts for dashboard
- Implement authentication (API integration with backend)

### 3.2. Shared Components

- Sidebar navigation (links to all modules)
- Topbar (user info, logout)
- Loading and error states
- Responsive design

### 3.3. API Integration

- Define API endpoints for each module
- Use TanStack Query for data fetching/mutation
- Implement Zod validation for forms

### 3.4. State Management

- Use Svelte stores for global state (user, session, etc.)
- Feature-specific stores as needed

### 3.5. Testing

- Unit and integration tests for components and stores
- Mock API responses for frontend tests

---

## 4. Timeline Example (for reference)

| Week | Milestone                                      |
|------|------------------------------------------------|
| 1    | Project setup, authentication, layout          |
| 2    | Restaurant Control: list, add/edit, disable    |
| 3    | Menu management, subscription info             |
| 4    | Insights dashboard, export                     |
| 5    | Seating area control, QR code generation       |
| 6    | User control, user history                     |
| 7    | Customer service (FAQ), polish, testing        |

---

## 5. Deliverables

- Fully functional dashboard with all modules above
- Responsive, accessible UI
- API integration with backend
- Documentation for usage and deployment 