# Phase 1 Development Plan: Authentication, Restaurant & Menu Control

This document provides a granular, step-by-step development plan for Phase 1, covering the implementation of a secure authentication system and the core features for managing restaurants and their menus.

---

### 1.1. Authentication

**Objective**: To secure the dashboard by implementing a robust login system. Only authenticated users with the correct role (e.g., `MAIN_ADMIN`, `RESTAURANT_ADMIN`) will be able to access the dashboard routes.

**Feature Breakdown:**
- **Task**: Implement a login system for dashboard access.
- **User Story**: As an Admin, I want to log in securely to the dashboard to access the administrative features.
- **Sub-tasks**:
    - [ ] **UI**: Create the login page UI at the `/login` route.
    - [ ] **Component**: Build a `LoginForm` component with fields for username and password.
    - [ ] **Validation**: Implement client-side validation to ensure fields are not empty.
    - [ ] **Action**: Create a SvelteKit form action to handle the login submission.
    - [ ] **API Call**: The action will call the backend's `/api/auth/login` endpoint.
    - [ ] **Session Management**: Upon successful login, create an HTTP-only, secure cookie to store the session token.
    - [ ] **Routing**: Implement a server hook (`hooks.server.ts`) to protect all routes under `/dashboard/*`.
    - [ ] **Redirects**: The hook will redirect any unauthenticated user from a protected route to `/login`.
    - [ ] **Logout**: Implement a logout mechanism that clears the session cookie and redirects to the login page.

**Technical Implementation:**
- **File Structure**:
  ```
  src/routes/login/
  ├── +page.svelte
  └── +page.server.ts
  src/routes/logout/
  └── +server.ts
  src/hooks.server.ts
  src/lib/components/auth/
  ├── LoginForm.svelte
  └── index.ts
  src/lib/types/auth.ts
  ```
- **Data Models (`auth.ts`)**:
  ```typescript
  export interface UserCredentials {
    username: string;
    password: string;
  }

  export interface AuthUser {
    id: string;
    username: string;
    role: 'MAIN_ADMIN' | 'RESTAURANT_ADMIN';
  }
  ```
- **UI/Component Details**:
  - `LoginForm.svelte`: A simple form with two `input` fields (`type="text"` for username, `type="password"` for password) and a submit button. It should display error messages returned from the server action.
- **Server Logic**:
  - `src/routes/login/+page.server.ts`:
    - `actions.default`: 
      1.  Receives `username` and `password` from the form.
      2.  Calls the backend API (e.g., `POST /api/auth/login`).
      3.  If the API returns a success (200 OK) with a token, set a secure, HTTP-only cookie.
      4.  Redirect the user to `/dashboard`.
      5.  If the API returns an error (e.g., 401 Unauthorized), return the error message to the form for display.
  - `src/hooks.server.ts`:
    - `handle`: 
      1.  Checks if the request path starts with `/dashboard`.
      2.  If it does, verify the session cookie.
      3.  If the cookie is invalid or missing, redirect to `/login`.
      4.  If valid, allow the request to proceed.
  - `src/routes/logout/+server.ts`:
    - `POST`: A request to this endpoint will clear the session cookie and return a redirect response to `/login`.

---

### 1.2. Restaurant Management

**Objective**: To create the interface for `MAIN_ADMIN` users to manage all restaurants on the platform.

**Feature Breakdown:**
- **Task**: Create the "Restaurant Control" section in the dashboard.
- **User Story**: As a Main Admin, I want to add, edit, and disable restaurants to manage the platform's partners.
- **Sub-tasks**:
    - [ ] **UI**: Design the main layout for restaurant management, likely a two-panel view with a list on one side and a form/details view on the other.
    - [ ] **List View**: Implement `RestaurantList.svelte` to display restaurants in a table or card layout, showing key details and status.
    - [ ] **Add Form**: Implement `RestaurantForm.svelte` for adding a new restaurant. It should be triggered by an "Add New" button.
    - [ ] **Edit Form**: The same `RestaurantForm.svelte` should be used for editing, pre-filled with the selected restaurant's data.
    - [ ] **Status Toggle**: Add a switch or button in the list view to quickly enable or disable a restaurant.
    - [ ] **Billing View**: Create a simple view or modal to display subscription billing info.

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
  ```typescript
  export interface Restaurant {
    id: string;
    name: string;
    address: string;
    phone: string;
    email: string;
    isActive: boolean;
    subscriptionTier: 'BASIC' | 'PREMIUM';
    billingInfo: string; // Simplified for now
  }

  export interface RestaurantFormData {
    name: string;
    address: string;
    phone: string;
    email: string;
  }
  ```
- **UI/Component Details**:
  - `RestaurantList.svelte`: A table with columns for Name, Address, Status, and Actions (Edit, View Billing). Each row will have a toggle switch for the `isActive` status.
  - `RestaurantForm.svelte`: A form with text inputs for name, address, phone, and email. It will have a "Save" button and a "Cancel" button.
- **Server Logic (`+page.server.ts`)**:
  - `load`: Fetches the complete list of restaurants from the backend API.
  - `actions`:
    - `createRestaurant`: Validates the `RestaurantFormData`, calls the backend `POST /api/restaurants` endpoint, and refreshes the page data.
    - `updateRestaurant`: Validates the `RestaurantFormData`, calls `PUT /api/restaurants/{id}`, and refreshes data.
    - `toggleStatus`: Receives `restaurantId` and new `status`, calls `PATCH /api/restaurants/{id}/status`, and refreshes data.

---

### 1.3. Menu Management

**Objective**: To allow `RESTAURANT_ADMIN` users to manage their specific restaurant's menu.

**Feature Breakdown:**
- **Task**: Build the "Menu Control" interface for each restaurant.
- **User Story**: As a Restaurant Admin, I want to add new food items and control which items are available on the menu.
- **Sub-tasks**:
    - [ ] **UI**: Create the menu management page, accessible via a route like `/dashboard/menu`.
    - [ ] **List View**: Display all of the restaurant's menu items, showing name, price, and active status.
    - [ ] **Add/Edit Form**: Create a `MenuForm.svelte` for adding and editing menu items, including fields for name, description, price, and an image upload field.
    - [ ] **Status Toggle**: Implement a switch to control if a menu item is visible to customers.

**Technical Implementation:**
- **File Structure**:
  ```
  src/routes/dashboard/menu/
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
  ```typescript
  export interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    isActive: boolean;
  }

  export interface MenuFormData {
    name: string;
    description: string;
    price: number;
    image?: File;
  }
  ```
- **UI/Component Details**:
  - `MenuList.svelte`: A grid or list of `MenuItem` cards. Each card displays the item's image, name, price, and an "Edit" button and an `isActive` toggle.
  - `MenuForm.svelte`: A modal or separate panel form with fields for all `MenuFormData` properties. The image field will be of `type="file"`.
- **Server Logic (`+page.server.ts`)**:
  - `load`: Fetches the menu items for the currently logged-in `RESTAURANT_ADMIN`'s associated restaurant.
  - `actions`:
    - `createMenuItem`: Handles form data, including the file upload. It will call the backend `POST /api/menu-items` endpoint.
    - `updateMenuItem`: Handles updates, including if a new image is uploaded. Calls `PUT /api/menu-items/{id}`.
    - `toggleStatus`: Toggles the `isActive` flag for a menu item via `PATCH /api/menu-items/{id}/status`.
