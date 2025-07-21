# Technical Design Document: Digital Menu & Food Ordering System

## 1. Background

This platform serves as a digital menu and food ordering system for restaurants. What sets it apart from others is its focus on take-out: users can place orders for pick-up, and once the food is ready, they receive an SMS notification. The food is then stored in a heat-retaining container, from which the user can conveniently collect their order.

## 2. Requirements

### 2.1. Non-technical Requirements

*   **Company | Restaurant Control**
    *   Add new restaurant
    *   Disable restaurant
    *   Edit restaurant
    *   Get subscription payment bill information
    *   Menu control
    *   Add new foods to menu
    *   Control active foods from menu
*   **Order Control**
    *   Able to create new order from menu
    *   Two options: take-out and dine-in
    *   Kitchen receives order information in real-time
    *   Places order in a heat-retaining box if the order is for take-out
    *   Gives VAT receipt
*   **Heat-retaining Box**
    *   Able to place order
    *   Able to receive placed order
    *   Able to open containers by admin role
    *   Able to send fix request
*   **Insight**
    *   Sales
    *   ...etc
*   **Notification**
    *   Real-time with Kitchen
    *   By SMS to user
*   **Seating Area Control**
    *   Add or Remove tables
    *   Print QR for table
*   **User Control**
    *   Register new user
    *   Login user
    *   See user history
*   **Customer Support**
    *   FAQ page for Company Admin, Restaurant Admin, and User

### 2.2. Functional Requirements

*   Heat-retaining Box UI (Android App)
*   Main Admin UI (Web)
*   Restaurant Admin UI (Web)
*   User Order UI (Web)
*   Kitchen UI (Web)

## 3. Non-Goals

*   All sorts of testing (unit, integration, e2e).

## 4. Tech Stacks

### 4.1. 🌐 Frontend: SvelteKit

*   **Framework:** SvelteKit
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **UI Components:** Skeleton UI
*   **Forms/Validation:** Zod
*   **Backend Integration:** TanStack Query
*   **Auth Integration:** Call Python backend for login/signup via API
*   **Deployment:** Vercel

### 4.2. 🐍 Backend: Python

*   **Framework:** Django
*   **Language:** Python
*   **Features:** REST API
*   **Deployment:** EC2 Docker

### 4.3. 🔁 n8n (Workflow Automation)

*   **Use Cases:**
    *   Trigger SMS via webhook when the backend marks an order as ready.
    *   Send daily reports or inventory syncs.
    *   Create Insights.
*   **Deployment:** EC2 Docker

### 4.4. 📲 SMS / Notification

*   **Provider:** MessagePro

### 4.5. 🗄️ Database

*   **Database:** PostgreSQL
*   **Deployment:** Supabase

### 4.6. 📱 Android App

*   **Language:** Kotlin | Java
*   **UI:** Jetpack Compose
*   **HTTP:** Retrofit to call backend API

## 5. User Stories

### 5.1. Register New Restaurant

We will assume that our salesperson will first reach out to restaurants and handle their registration through the admin web portal.

1.  **Salesperson** → Opens Admin portal.
2.  **Salesperson** → Navigates to the “Register new Restaurant” page.
3.  **Salesperson** → Fills in the necessary information about the new restaurant.
4.  **Salesperson** → Provides the username and password for the Restaurant Admin Portal to the newly registered restaurant.
5.  **Restaurant Admin** → Logs into the Restaurant Admin Portal.
6.  **Restaurant Admin** → Creates the menu.
7.  **Restaurant Admin** → Selects subscription options (e.g., heat-retaining container).
8.  **Restaurant Admin** → Creates the seating area (tables) and places QR codes for menus on the tables.

### 5.2. Insight

Insights serve two main purposes: first, to provide the owner or management with sales data and deeper operational insights; and second, to allow exporting Excel templates for integration with external finance and ERP platforms.

*   **Restaurant Admin Journey**
    1.  **Restaurant Admin** → Opens the Restaurant Admin Portal.
    2.  **Restaurant Admin** → Navigates to the insights tab.
    3.  **Restaurant Admin** → Sees all sales and deeper insights.
    4.  **Restaurant Admin** → Exports Excel templates (which can be uploaded to third-party finance platforms).
*   **Main Admin Journey**
    1.  **Main Admin** → Opens the Main Admin Portal.
    2.  **Main Admin** → Navigates to the insights tab.
    3.  **Main Admin** → Sees all sales and deeper insights (from all restaurants).
    4.  **Main Admin** → Exports Excel templates (which can be uploaded to third-party finance platforms).

### 5.3. Placing an Order

When placing an order, there are two options: ordering from the seating area for dine-in, or placing an online order for takeout.

*   **From Seating Area (Dine-In)**
    1.  **User** → Takes a seat in the seating area.
    2.  **User** → Scans the QR code on the table to see the menu and place an order.
    3.  **User** → Selects food and places the order (Payment → Gets VAT Receipt).
    4.  **Kitchen** → Receives and starts preparing the order.
    5.  **Kitchen** → Finishes the food and closes the order.
    6.  **Waiter** → Delivers the food to the ordered table.
*   **From Online (Takeout)**
    1.  **User** → Scans a QR code or clicks on a link to place an online order.
    2.  **User** → Selects food and places the order (Payment → Gets VAT Receipt).
    3.  **Kitchen** → Receives and starts preparing the order.
    4.  **Kitchen** → Finishes the food.
    5.  **Waiter** → Gets the ordered food and places it in a warm, heat-retaining box.
    6.  **Software** → Sends an SMS to notify the user that the order is ready.
    7.  **User** → Comes to the restaurant and retrieves the food from the heat-retaining box by entering a 4-6 digit number received via SMS.
    8.  **Software** → Closes the order.

## 6. Architecture

![Architecture Diagram](./architecture.png)
