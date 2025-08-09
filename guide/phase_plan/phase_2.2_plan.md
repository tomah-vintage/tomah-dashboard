### **Development Plan: Role-Based Access Control (RBAC)**

#### **Objective**
Implement a robust RBAC system where a user's roles and permissions, received upon login, determine their access to specific pages and UI elements. The system will be enforced on the server for security and reflected on the client for a seamless user experience.

---

#### **Phase 1: Data Structures & Authentication Flow**

1.  **Define RBAC Types:**
    *   Update `src/lib/types/auth.ts` to include detailed types for users, roles, and permissions.

    ```typescript
    // src/lib/types/auth.ts

    export type Permission = 'view-dashboard' | 'manage-restaurants' | 'edit-menus' | 'view-seating-charts';

    export interface User {
      id: string;
      email: string;
      name: string;
      roles: string[];
      permissions: Permission[];
    }

    export interface Session {
      user: User | null;
      accessToken: string | null;
    }
    ```

2.  **Update Authentication Logic (with Mock Data):**
    *   For development, the login process will generate a **mock** user object with a predefined set of roles and permissions.
    *   This mock user object will be stored in the session cookie, simulating a real login.
    *   This avoids the need for a live authentication provider during initial development.

---

#### **Phase 2: Server-Side Enforcement (Security Layer)**

1.  **Centralize Session Handling with Hooks:**
    *   Use the `src/hooks.server.ts` file to manage the user's session on every request.
    *   On each request, read the session cookie, validate it, and populate `event.locals` with the user's data. This makes the user's session universally available in all server-side load functions.

    ```typescript
    // src/hooks.server.ts
    import type { Handle } from '@sveltejs/kit';
    import type { User } from '$lib/types/auth';

    export const handle: Handle = async ({ event, resolve }) => {
      // 1. Get session from cookie
      const sessionId = event.cookies.get('session_id');

      if (sessionId) {
        // 2. Validate session and fetch user data.
        // For now, `getUserFromSession` will return a hardcoded mock user.
        const user: User | null = await getUserFromSession(sessionId);
        if (user) {
          event.locals.user = user;
        }
      }

      return resolve(event);
    };
    ```

2.  **Implement Route Protection:**
    *   In the same `src/hooks.server.ts` file, add logic to check for required permissions on protected routes.
    *   Adopt a convention: protected routes will export a `requiredPermissions` array from their `+page.server.ts` file.
    *   The hook will check if the user in `event.locals` has the necessary permissions. If not, it will redirect them to a login or an unauthorized page.

    ```typescript
    // src/hooks.server.ts (continued)
    import { redirect, error } from '@sveltejs/kit';

    export const handle: Handle = async ({ event, resolve }) => {
      // ... (session handling from above)

      // 3. Route Protection Logic
      const routeId = event.route.id;
      if (routeId?.includes('(protected)')) { // Example using layout groups
        if (!event.locals.user) {
          throw redirect(303, '/login');
        }

        // Optional: Check for specific permissions defined on the page
        const module = await resolveModule(routeId); // Helper to import the page's module
        const requiredPermissions = module?.requiredPermissions as Permission[];

        if (requiredPermissions) {
          const hasPermission = requiredPermissions.every(p =>
            event.locals.user.permissions.includes(p)
          );
          if (!hasPermission) {
            throw error(403, 'Forbidden');
          }
        }
      }

      return resolve(event);
    };
    ```

---

#### **Phase 3: Client-Side UX (UI Layer)**

1.  **Expose User Data to the Client:**
    *   In the root `src/routes/+layout.server.ts`, read the user data from `event.locals` and return it. This makes the user object available to the root layout and all child pages.

    ```typescript
    // src/routes/+layout.server.ts
    import type { LayoutServerLoad } from './$types';

    export const load: LayoutServerLoad = async ({ locals }) => {
      return {
        user: locals.user // Pass the user from the hook to the layout data
      };
    };
    ```

2.  **Create a Reactive Session Store:**
    *   Create a new Svelte store to hold the session state on the client. This allows components across the app to reactively update when the user's state changes.

    ```typescript
    // src/lib/stores/sessionStore.ts
    import { writable } from 'svelte/store';
    import type { User } from '$lib/types/auth';

    export const sessionStore = writable<{ user: User | null }>({ user: null });
    ```

3.  **Initialize the Store:**
    *   In the root `src/routes/+layout.svelte`, subscribe to the `data` prop (from the `load` function) and use it to set the initial value of the `sessionStore`.

    ```svelte
    <!-- src/routes/+layout.svelte -->
    <script lang="ts">
      import type { PageData } from './$types';
      import { sessionStore } from '$lib/stores/sessionStore';

      export let data: PageData;

      // Set the store value whenever the layout data changes
      $: $sessionStore.user = data.user;
    </script>
    ```

4.  **Conditionally Render UI Elements:**
    *   Now, any component can import and use the `sessionStore` to conditionally render UI elements, such as navigation links in the sidebar.

    ```svelte
    <!-- src/lib/components/Sidebar.svelte -->
    <script lang="ts">
      import { sessionStore } from '$lib/stores/sessionStore';

      // Helper function for cleaner templates
      const hasPermission = (p: Permission) => $sessionStore.user?.permissions.includes(p);
    </script>

    <nav>
      <ul>
        {#if $sessionStore.user}
          <li><a href="/dashboard">Dashboard</a></li>

          {#if hasPermission('manage-restaurants')}
            <li><a href="/restaurants">Manage Restaurants</a></li>
          {/if}

          {#if hasPermission('edit-menus')}
            <li><a href="/restaurants/menu">Edit Menus</a></li>
          {/if}
        {/if}
      </ul>
    </nav>
    ```
