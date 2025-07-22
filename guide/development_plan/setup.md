Phase 1: Foundational Setup & Authentication
This initial phase focuses on setting up the core infrastructure and user authentication, which is a prerequisite for all other features.

Project Scaffolding:

Frontend: Initialize the SvelteKit project using npx sv create as per README.md. Set up the directory structure outlined in base_guideline.md (/lib/components, /lib/utils, /lib/types, etc.).
Backend: Initialize the Django project, configure REST framework, and set up for Docker deployment on EC2.
Database Setup:

Provision a PostgreSQL database using Supabase.
Define initial Django models for User (with roles like MAIN_ADMIN, RESTAURANT_ADMIN, CUSTOMER) and Company.
Authentication:

Backend: Implement API endpoints in Django for user registration, login (/api/auth/login), and session management (e.g., JWT).
Frontend: Create authentication-related pages (/login, /register). Implement logic in +layout.server.ts to manage user sessions and protect routes. Use SvelteKit form actions for login/signup forms.
Deployment Pipeline:

Set up basic CI/CD pipelines.
Frontend: Configure Vercel to deploy the SvelteKit application.
Backend: Configure GitHub Actions to build and deploy the Django Docker container to AWS EC2.
Phase 2: Restaurant Onboarding & Management (Admin Portals)
This phase implements the "Register New Restaurant" user story, enabling admins to manage restaurants, menus, and seating.

Backend (Django):

Extend the database schema with models for Restaurant, Menu, MenuItem, Table.
Develop secure REST API endpoints for CRUD (Create, Read, Update, Delete) operations on these models. Ensure only authorized admins can access them.
Frontend (SvelteKit - Main Admin Portal):

Feature: Restaurant Management.
File Structure: Following feature_development_guideline.md:
Route: src/routes/admin/restaurants/
Components: src/lib/components/restaurant-management/ (e.g., RestaurantForm.svelte, RestaurantList.svelte).
Types: src/lib/types/restaurant.ts (e.g., Restaurant, Menu interfaces).
Implementation:
Build a dashboard for the Main Admin to view, add, and edit restaurants.
Create a form (RestaurantForm.svelte) for the salesperson to register a new restaurant. Use Zod for validation as specified in TDD.md.
Frontend (SvelteKit - Restaurant Admin Portal):

Features: Menu Management and Seating Area Control.
Routes:
src/routes/portal/[restaurantId]/menu/
src/routes/portal/[restaurantId]/tables/
Implementation:
Build a UI for the Restaurant Admin to create and manage their menu items.
Build a UI to define tables and generate QR codes for them.