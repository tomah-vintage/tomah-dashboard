# Phase 1.2: API Integration and TanStack Query Update

This document outlines the development plan for updating the application to use the new API endpoints and refactoring the data layer to use TanStack Query for all data fetching and mutations.

## 1. Overview

The goal of this phase is to replace the existing mock API with the new live API endpoints and to implement a robust data fetching and caching strategy using TanStack Query. This will involve creating new query files for each feature, updating the UI components to use these queries, and creating new type definitions based on the API responses.

## 2. API Endpoints

The following API endpoints will be used:

-   **Roles**: `http://unsxq3jnun.ap-northeast-1.awsapprunner.com/api/roles/`
-   **Permissions**: `http://unsxq3jnun.ap-northeast-1.awsapprunner.com/api/permissions/`
-   **Role Permissions**: `http://unsxq3jnun.ap-northeast-1.awsapprunner.com/api/rolepermissions/`
-   **Users**: `http://unsxq3jnun.ap-northeast-1.awsapprunner.com/api/users/`
-   **Restaurants**: `http://unsxq3jnun.ap-northeast-1.awsapprunner.com/api/restaurants/`
-   **Table**: `http://unsxq3jnun.ap-northeast-1.awsapprunner.com/api/table/`
-   **Box Container**: `http://unsxq3jnun.ap-northeast-1.awsapprunner.com/api/box-container/`
-   **Box**: `http://unsxq3jnun.ap-northeast-1.awsapprunner.com/api/box/`
-   **Item Category**: `http://unsxq3jnun.ap-northeast-1.awsapprunner.com/api/item-category/`
-   **Menu Item**: `http://unsxq3jnun.ap-northeast-1.awsapprunner.com/api/menu-item/`
-   **Order**: `http://unsxq3jnun.ap-northeast-1.awsapprunner.com/api/order/`
-   **Order Item**: `http://unsxq3jnun.ap-northeast-1.awsapprunner.com/api/order-item/`
-   **Payment Method**: `http://unsxq3jnun.ap-northeast-1.awsapprunner.com/api/payment-method/`
-   **Order Payment**: `http://unsxq3jnun.ap-northeast-1.awsapprunner.com/api/order-payment/`
-   **Subscription Plan**: `http://unsxq3jnun.ap-northeast-1.awsapprunner.com/api/subscription-plan/`
-   **Subscription**: `http://unsxq3jnun.ap-northeast-1.awsapprunner.com/api/subscription/`
-   **Invoice**: `http://unsxq3jnun.ap-northeast-1.awsapprunner.com/api/invoice/`
-   **Token**: `http://unsxq3jnun.ap-northeast-1.awsapprunner.com/api/token/`
-   **Token Refresh**: `http://unsxq3jnun.ap-northeast-1.awsapprunner.com/api/token/refresh/`

## 3. Development Steps

### Step 1: Authentication

-   **File**: `src/lib/queries/auth-queries.ts`
-   **Task**: Create `createLoginMutation` and `createRefreshTokenMutation`.
-   **Details**: The `createLoginMutation` will handle the POST request to the `/api/token/` endpoint, and the `createRefreshTokenMutation` will handle the POST request to the `/api/token/refresh/` endpoint.
-   **File**: `src/routes/login/+page.svelte`
-   **Task**: Update the login form to use the `createLoginMutation`.
-   **Details**: The form will call the mutation on submit and handle loading and error states.

### Step 2: Restaurant Management

-   **File**: `src/lib/queries/restaurant-queries.ts`
-   **Task**: Update `createGetRestaurantsQuery`, `createAddRestaurantMutation`, `createUpdateRestaurantMutation`, and `createDeleteRestaurantMutation` to use the new API endpoint.
-   **Details**: Replace the mock API endpoint with the live endpoint for all restaurant-related queries and mutations.
-   **File**: `src/lib/types/restaurant.ts`
-   **Task**: Update the `Restaurant` and `RestaurantFormData` types to match the API response.
-   **File**: `src/lib/components/restaurant-management/`
-   **Task**: Update all components in this directory to use the updated queries.

### Step 3: User and Role Management

-   **Files**: `src/lib/queries/user-queries.ts`, `src/lib/queries/role-queries.ts`, `src/lib/queries/permission-queries.ts`
-   **Task**: Create queries and mutations for users, roles, and permissions.
-   **Details**: Implement functions for fetching, creating, updating, and deleting each resource.
-   **Files**: `src/lib/types/user.ts`, `src/lib/types/role.ts`, `src/lib/types/permission.ts`
-   **Task**: Create type definitions for users, roles, and permissions.
-   **Files**: `src/lib/components/user-management/`, `src/lib/components/role-management/`, `src/lib/components/permission-management/`
-   **Task**: Create UI components for managing users, roles, and permissions.
-   **Files**: `src/routes/users/`, `src/routes/roles/`, `src/routes/permissions/`
-   **Task**: Create routes for user, role, and permission management.

### Step 4: Menu Management

-   **Files**: `src/lib/queries/menu-item-queries.ts`, `src/lib/queries/item-category-queries.ts`
-   **Task**: Create queries and mutations for menu items and item categories.
-   **Files**: `src/lib/types/menu-item.ts`, `src/lib/types/item-category.ts`
-   **Task**: Create type definitions for menu items and item categories.
-   **File**: `src/lib/components/menu-management/`
-   **Task**: Update all components in this directory to use the new queries.

## 4. General Tasks

-   **Environment Variables**: All API URLs should be stored in environment variables.
-   **Error Handling**: Implement robust error handling for all API requests.
-   **Loading States**: Implement loading states for all data fetching operations.
-   **Authentication**: Ensure that all API requests include the necessary authentication tokens.
-   **Testing**: Write tests for all new queries and mutations.