# Development Plan

## Phase 1: Core Admin & Authentication
*   **Admin Login:** Implement secure login for main administrators.
*   **User Management:**
    *   Register new users (including salesperson and restaurant admins).
    *   Login functionality for all user roles.
    *   View user history.
*   **Initial Restaurant Registration:**
    *   Salesperson flow to add new restaurants via the Admin portal.
    *   Provide username and password for Restaurant Admin Portal.

## Phase 2: Dashboard & Basic Restaurant Management
*   **Main Admin Dashboard:**
    *   Display key statistics about restaurants (e.g., active, disabled).
    *   List all registered restaurants.
    *   Initial sales insights (basic overview).
*   **Restaurant Management (CRUD):**
    *   Create, Read, Update, Delete (CRUD) functionality for restaurant profiles.
    *   Ability to disable/enable restaurants.
*   **Basic Menu Control:**
    *   Add new food items to a restaurant's menu.
    *   Control active/inactive status of food items on the menu.

## Phase 3: Advanced Restaurant & Menu Management
*   **Detailed Menu Management:**
    *   Comprehensive CRUD for menu items, including categories, modifiers, and pricing.
*   **Seating Area Control:**
    *   Add and remove tables for dine-in areas.
    *   Generate and print QR codes for tables (for menu access).
*   **Subscription Management:**
    *   Functionality to view and manage subscription payment bill information for restaurants.

## Phase 4: Take-out & Heat-retaining Box Integration
*   **Heat-retaining Box Integration:**
    *   Functionality to place and receive orders from the heat-retaining boxes.
    *   Admin role ability to open containers.
    *   Mechanism to send fix requests for box issues.
*   **SMS Notifications to User:**
    *   Automated SMS notification to users when their take-out order is ready.
*   **User Order Retrieval:**
    *   System for users to retrieve food from the heat-retaining box using a 4-6 digit number received via SMS.
    *   Automated order closure upon successful retrieval.

## Phase 5: Reporting & Support
*   **Advanced Sales & Operational Insights:**
    *   Detailed sales reports and deeper operational insights for both Restaurant Admins and Main Admins.
*   **Data Export:**
    *   Ability to export sales and insights data into Excel templates for integration with third-party finance/ERP platforms.
*   **Customer Support & FAQ:**
    *   Develop a comprehensive FAQ page for Company Admin, Restaurant Admin, and End Users.