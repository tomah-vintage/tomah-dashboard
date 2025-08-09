### **Development Plan: Phase 3.1 - User Control**

#### **Objective**
To build a "User Control" section where administrators can view a list of all platform users and inspect the order history for any individual user. This feature will be protected by a new `'manage-users'` permission.

---

#### **Step 1: Permissions and Scaffolding**

1.  **Update Permissions Type:**
    *   Add a new `'manage-users'` permission to the `Permission` type in `src/lib/types/auth.ts`.
    *   Update the mock user in `src/hooks.server.ts` to grant this new permission to the 'Admin User' for development purposes.

2.  **Create New Type Definitions (`src/lib/types/user.ts`):**
    *   Create a new file for user-specific types.
    *   Define the `PlatformUser` interface (to avoid conflict with the `User` in `auth.ts` which is for admins) and `OrderHistoryItem`.

    ```typescript
    // src/lib/types/user.ts
    export interface PlatformUser {
      id: string;
      name: string;
      email: string;
      registrationDate: string;
      orderCount: number;
    }

    export interface OrderHistoryItem {
      orderId: string;
      date: string;
      restaurantName: string;
      totalAmount: number;
      status: 'Completed' | 'Cancelled';
    }
    ```

3.  **Create File Structure:**
    *   Create the necessary directories and empty files as outlined in the plan:
        *   `src/routes/dashboard/users/+page.svelte`
        *   `src/routes/dashboard/users/+page.server.ts`
        *   `src/routes/dashboard/users/[userId]/+page.svelte`
        *   `src/routes/dashboard/users/[userId]/+page.server.ts`
        *   `src/lib/components/user-control/UserList.svelte`
        *   `src/lib/components/user-control/UserHistory.svelte`

---

#### **Step 2: User List Implementation**

1.  **Create the User List Component (`UserList.svelte`):**
    *   This component will receive a list of `PlatformUser` objects as a prop.
    *   It will display the users in a table with columns for Name, Email, Registration Date, and Order Count.
    *   Each row will have a "View History" link pointing to `/dashboard/users/[userId]`.
    *   Implement basic search/filter functionality at the top of the table.

2.  **Implement the Server Logic (`/dashboard/users/+page.server.ts`):**
    *   Add the permission check for `'manage-users'`.
    *   In the `load` function, create and return a list of mock `PlatformUser` data. This simulates fetching all users from the database.

3.  **Implement the Page (`/dashboard/users/+page.svelte`):**
    *   This page will receive the list of users from its `load` function.
    *   It will render the `UserList.svelte` component, passing the user data to it.
    *   Include a title like "User Management".

---

#### **Step 3: User Detail & Order History Implementation**

1.  **Create the User History Component (`UserHistory.svelte`):**
    *   This component will receive a `PlatformUser` object and a list of `OrderHistoryItem` objects as props.
    *   It will display the user's details (name, email) at the top.
    *   It will display the order history in a table with columns for Order ID, Date, Restaurant, Amount, and Status.

2.  **Implement the Server Logic (`/dashboard/users/[userId]/+page.server.ts`):**
    *   Add the permission check for `'manage-users'`.
    *   In the `load` function, use the `params.userId` to fetch data.
    *   Create and return a mock `PlatformUser` object and a list of mock `OrderHistoryItem` data. This simulates fetching a specific user's profile and their order history.

3.  **Implement the Page (`/dashboard/users/[userId]/+page.svelte`):**
    *   This page will receive the user details and order history from its `load` function.
    *   It will render the `UserHistory.svelte` component, passing the data to it.
    *   Include a dynamic title, e.g., `Order History for {data.user.name}`.

---

#### **Step 4: Sidebar Integration**

1.  **Add Sidebar Link:**
    *   Update `src/lib/components/Sidebar.svelte`.
    *   Add a new navigation link to `/dashboard/users` labeled "User Control".
    *   Wrap this link in an `{#if hasPermission('manage-users')}` block so it only appears for authorized administrators.
