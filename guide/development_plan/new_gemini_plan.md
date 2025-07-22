# Tomah Dashboard Development Plan (Detailed)

This document outlines the detailed development plan for the Tomah Dashboard, breaking down each feature into functional requirements and technical implementation steps, as per the guidelines in `GEMINI.md`.

---

## Phase 1: Authentication, Restaurant & Menu Control

This phase focuses on securing the dashboard and building the core functionalities for restaurant administrators to manage their establishment's information and menu offerings.

### 1.1. Authentication

**Feature Breakdown:**
- **Task**: Implement a login system for dashboard access.
- **User Story**: As an Admin, I want to log in to the dashboard to access the administrative features.
- **Sub-tasks**:
    - [ ] **Login Form**: Create a UI for username and password entry.
    - [ ] **Authentication Logic**: Handle form submission, call the backend API for validation, and manage the user session.
    - [ ] **Protected Routes**: Ensure that all dashboard routes require a valid login session.

**Technical Implementation:**
- **File Structure**:
  ```
  src/routes/login/
  ├── +page.svelte
  └── +page.server.ts
  src/hooks.server.ts
  src/lib/components/auth/
  ├── LoginForm.svelte
  └── index.ts
  src/lib/types/auth.ts
  ```
- **Data Models (`auth.ts`)**:
  - `UserCredentials`: Interface for login form data (username, password).
  - `AuthUser`: Interface for the authenticated user object stored in the session.
- **Components**:
  - `LoginForm.svelte`: A reusable form for user login.
- **Server Logic**:
  - `src/routes/login/+page.server.ts`:
    - `actions`:
      - `login`: Receives user credentials, calls the backend authentication endpoint, and on success, creates a session cookie.
  - `src/hooks.server.ts`:
    - `handle`: Checks for the session cookie on every request to a protected route. If the cookie is not present or invalid, it redirects the user to the `/login` page.

### 1.2. Restaurant Management

**Feature Breakdown:**
- **Task**: Create the "Restaurant Control" section in the dashboard.
- **User Story**: As a Main Admin, I want to add, edit, and disable restaurants to manage the platform's partners.
- **Sub-tasks**:
    - [ ] **Add New Restaurant**: Implement a form to capture all necessary restaurant details.
    - [ ] **Restaurant List View**: Display all registered restaurants with their current status.
    - [ ] **Edit Restaurant**: Create a form to modify existing restaurant details.
    - [ ] **Disable/Enable Restaurant**: Implement a toggle to change a restaurant's active status.
    - [ ] **Subscription Billing**: Develop a view to display subscription payment information.

**Technical Implementation:**
- **File Structure**:
  ```
  src/routes/dashboard/restaurants/
  ├── +page.svelte
  └── +page.server.ts
  src/lib/components/restaurant-management/
  ├── RestaurantManagementMain.svelte
  ├── RestaurantList.svelte
  ├── RestaurantForm.svelte
  └── index.ts
  src/lib/types/restaurant.ts
  ```
- **Data Models (`restaurant.ts`)**:
  - `Restaurant`: Interface for restaurant data (id, name, address, status, etc.).
  - `RestaurantFormData`: Type for the restaurant creation/edit form.
- **Components**:
  - `RestaurantManagementMain.svelte`: Main container for the feature.
  - `RestaurantList.svelte`: Displays a list of restaurants with edit/toggle buttons.
  - `RestaurantForm.svelte`: Form for adding and editing restaurants.
- **Server Logic (`+page.server.ts`)**:
  - `load`: Fetches and returns the list of all restaurants.
  - `actions`:
    - `addRestaurant`: Handles new restaurant submission.
    - `editRestaurant`: Handles updates to an existing restaurant.
    - `toggleStatus`: Handles changing the active status of a restaurant.

### 1.3. Menu Management

**Feature Breakdown:**
- **Task**: Build the "Menu Control" interface for each restaurant.
- **User Story**: As a Restaurant Admin, I want to add new food items and control which items are available on the menu.
- **Sub-tasks**:
    - [ ] **Add New Food**: Implement a form to add a new food item (name, description, price, image).
    - [ ] **Menu List View**: Display all food items for a restaurant.
    - [ ] **Control Active Foods**: Add a toggle to make a food item active or inactive.

**Technical Implementation:**
- **File Structure**:
  ```
  src/routes/dashboard/restaurants/[restaurantId]/menu/
  ├── +page.svelte
  └── +page.server.ts
  src/lib/components/menu-management/
  ├── MenuManagementMain.svelte
  ├── MenuList.svelte
  ├── MenuForm.svelte
  └── index.ts
  src/lib/types/menu.ts
  ```
- **Data Models (`menu.ts`)**:
  - `MenuItem`: Interface for a single food item.
  - `MenuFormData`: Type for the food item creation/edit form.
- **Components**:
  - `MenuManagementMain.svelte`: Main container for menu management.
  - `MenuList.svelte`: Displays menu items with edit/toggle controls.
  - `MenuForm.svelte`: Form for adding/editing food items.
- **Server Logic (`+page.server.ts`)**:
  - `load`: Fetches menu items for the specified `restaurantId`.
  - `actions`:
    - `addMenuItem`: Handles new food item submission.
    - `editMenuItem`: Handles updates to a food item.
    - `toggleMenuItemStatus`: Handles changing the active status of a food item.

---

## Phase 2: Seating Area Control

This phase covers the physical layout management of the restaurant.

**Feature Breakdown:**
- **Task**: Develop the "Seating Area Control" module.
- **User Story**: As a Restaurant Admin, I need to manage my restaurant's table layout and generate QR codes for ordering.
- **Sub-tasks**:
    - [ ] **Add/Remove Tables**: Create a UI to add and remove tables.
    - [ ] **Generate Table QR Codes**: Implement a function to generate a unique QR code for each table.
    - [ ] **Print QR Codes**: Add a feature to easily print the generated QR codes.

**Technical Implementation:**
- **File Structure**:
  ```
  src/routes/dashboard/restaurants/[restaurantId]/seating/
  ├── +page.svelte
  └── +page.server.ts
  src/lib/components/seating-area-control/
  ├── SeatingAreaMain.svelte
  ├── TableList.svelte
  └── index.ts
  src/lib/types/seating.ts
  ```
- **Data Models (`seating.ts`)**:
  - `Table`: Interface for a single table (id, name/number, qrCodeUrl).
- **Components**:
  - `SeatingAreaMain.svelte`: Main container for managing the seating area.
  - `TableList.svelte`: Displays a list of tables with options to remove or print QR codes.
- **Server Logic (`+page.server.ts`)**:
  - `load`: Fetches the list of tables for the specified `restaurantId`.
  - `actions`:
    - `addTable`: Creates a new table and generates its QR code.
    - `removeTable`: Deletes a table.
    - `printQRCodes`: An action that could prepare data for a printable view.

---

## Phase 3: User Administration & Support

This phase focuses on managing end-users and providing necessary support channels.

### 3.1. User Control

**Feature Breakdown:**
- **Task**: Build the "User Control" section for administrators.
- **User Story**: As a Main Admin, I need to view user information and their history.
- **Sub-tasks**:
    - [ ] **User List View**: Display a list of all registered users.
    - [ ] **View User History**: Create a detailed view to see a user's order history.

**Technical Implementation:**
- **File Structure**:
  ```
  src/routes/dashboard/users/
  ├── +page.svelte
  └── +page.server.ts
  src/routes/dashboard/users/[userId]/
  ├── +page.svelte
  └── +page.server.ts
  src/lib/components/user-control/
  ├── UserList.svelte
  └── UserHistory.svelte
  src/lib/types/user.ts
  ```
- **Data Models (`user.ts`)**:
  - `User`: Interface for user data.
  - `OrderHistoryItem`: Interface for a single item in a user's order history.
- **Components**:
  - `UserList.svelte`: Displays a searchable, paginated list of all users.
  - `UserHistory.svelte`: Displays the order history for a specific user.
- **Server Logic**:
  - `/dashboard/users/+page.server.ts`: `load` function fetches all users.
  - `/dashboard/users/[userId]/+page.server.ts`: `load` function fetches the profile and order history for the specified `userId`.

### 3.2. Customer Service (FAQ)

**Feature Breakdown:**
- **Task**: Create a centralized "Customer Support" module.
- **User Story**: As an administrator, I want to manage a knowledge base to help users and other admins.
- **Sub-tasks**:
    - [ ] **FAQ Management Page**: Implement a CMS-like interface to create, edit, and delete FAQs.
    - [ ] **Categorize FAQs**: Allow categorizing FAQs for different roles (Company Admin, Restaurant Admin, User).

**Technical Implementation:**
- **File Structure**:
  ```
  src/routes/dashboard/support/faq/
  ├── +page.svelte
  └── +page.server.ts
  src/lib/components/faq-management/
  ├── FaqMain.svelte
  ├── FaqForm.svelte
  └── FaqList.svelte
  src/lib/types/faq.ts
  ```
- **Data Models (`faq.ts`)**:
  - `FaqItem`: Interface for a single FAQ (id, question, answer, category).
  - `FaqCategory`: Enum or type for the different FAQ categories.
- **Components**:
  - `FaqMain.svelte`: Main container for the FAQ management page.
  - `FaqForm.svelte`: Form to add/edit an FAQ item.
  - `FaqList.svelte`: Displays FAQs, grouped by category.
- **Server Logic (`+page.server.ts`)**:
  - `load`: Fetches all FAQ items.
  - `actions`:
    - `addFaq`: Creates a new FAQ.
    - `editFaq`: Updates an existing FAQ.
    - `deleteFaq`: Removes an FAQ.

---

## Phase 4: Insights and Analytics

This phase is dedicated to providing valuable data and analytics.

**Feature Breakdown:**
- **Task**: Develop the "Insight" dashboard.
- **User Story**: As a Restaurant Admin or Main Admin, I want to see sales data and other operational insights.
- **Sub-tasks**:
    - [ ] **Sales Dashboard**: Create visualizations (charts, graphs) for key sales metrics.
    - [ ] **Role-Based Views**: Ensure admins see data relevant to their role.
    - [ ] **Data Export**: Add functionality to export data to an Excel template.

**Technical Implementation:**
- **File Structure**:
  ```
  src/routes/dashboard/insights/
  ├── +page.svelte
  └── +page.server.ts
  src/routes/api/export/insights/+server.ts
  src/lib/components/insights/
  ├── InsightsMain.svelte
  ├── SalesChart.svelte
  ├── MetricCard.svelte
  └── DataExportButton.svelte
  src/lib/types/insights.ts
  src/lib/utils/charts.ts
  ```
- **Data Models (`insights.ts`)**:
  - `SalesData`: Interface for sales data points.
  - `Metric`: Interface for a single KPI metric.
- **Components**:
  - `InsightsMain.svelte`: Main container for the dashboard, arranging charts and metrics.
  - `SalesChart.svelte`: Reusable chart component (e.g., using Chart.js).
  - `MetricCard.svelte`: Displays a single, important number (e.g., "Total Revenue").
  - `DataExportButton.svelte`: A button that triggers the data export.
- **Server Logic**:
  - `/dashboard/insights/+page.server.ts`: `load` function fetches all data needed for the visualizations.
  - `/api/export/insights/+server.ts`: `GET` handler that queries the data, formats it, and returns an Excel file.
