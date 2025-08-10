### **Development Plan: Phase 4 - Folder Structure Refactoring (with Route Groups)**

#### **Objective**
To refactor the `src/routes` directory using SvelteKit **Route Groups**. This will separate features by user role (`pladmin`, `rsadmin`) in the codebase while keeping the URLs clean and avoiding visible role-based path segments (e.g., `/users` instead of `/pladmin/users`).

---

#### **Step 1: Create New Role-Based Route Group Directories**

1.  **Create Base Directories:**
    *   Create the new route group directories. The parentheses make them invisible to the SvelteKit router.
    *   **Command:** `mkdir -p "src/routes/(pladmin)" "src/routes/(rsadmin)"`

---

#### **Step 2: Relocate Existing Routes into Route Groups**

1.  **Move Platform Admin (`pladmin`) Features:**
    *   Relocate features into the `(pladmin)` group.
    *   **Command 1 (Users):** `mv src/routes/dashboard/users "src/routes/(pladmin)/users"`
    *   **Command 2 (Restaurants):** `mv src/routes/restaurants "src/routes/(pladmin)/restaurants"`

2.  **Move Restaurant Admin (`rsadmin`) Features:**
    *   Relocate features into the `(rsadmin)` group.
    *   **Command 1 (Menu):** `mv src/routes/restaurants/menu "src/routes/(rsadmin)/menu"`
    *   **Command 2 (Seating):** `mv src/routes/dashboard/restaurants/[restaurantId]/seating "src/routes/(rsadmin)/seating"`

---

#### **Step 3: Update Code References and Links**

1.  **Update Sidebar Navigation (`src/lib/components/Sidebar.svelte`):**
    *   Read the `Sidebar.svelte` file.
    *   Modify all `href` attributes to point to the new, cleaner URLs.
        *   `/pladmin/restaurants` becomes `/restaurants`.
        *   `/pladmin/users` becomes `/users`.
        *   `/rsadmin/menu` becomes `/menu`.
        *   `/rsadmin/seating` becomes `/seating`.

2.  **Update Internal Component Links:**
    *   The "Back to All Users" link in `src/routes/(pladmin)/users/[userId]/+page.svelte` must be updated to point to `/users`.

---

#### **Step 4: Update Server-Side Logic**

1.  **Update Route Protection in Hooks:**
    *   Modify `src/hooks.server.ts`.
    *   Since the URL path no longer contains the role, the protection logic must inspect the route ID, which *does* contain the group name.
    *   The new logic should be: `if (event.route.id.includes('(pladmin)') || event.route.id.includes('(rsadmin)'))`. This correctly protects the routes within the groups.

---

#### **Step 5: Cleanup**

1.  **Remove Old Directories:**
    *   Remove the now-empty `dashboard` directory.
    *   **Command:** `rm -rf src/routes/dashboard`