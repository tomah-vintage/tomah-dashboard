# Phase 1.1: Shared Store with TanStack Query

## 1. Overview

This document outlines the development plan for implementing a shared data layer using TanStack Query. This will replace the existing Svelte stores for managing server-side state, providing a more robust and efficient solution for data fetching, caching, and synchronization.

## 2. Rationale

The current implementation uses Svelte stores for state management, which is effective for client-side state but has limitations when dealing with server-side data. TanStack Query offers several advantages:

- **Automatic Caching**: Reduces redundant data fetching and improves performance.
- **Data Synchronization**: Keeps data fresh across multiple components.
- **Server-Side State Management**: Simplifies handling of loading, error, and success states.
- **Optimistic Updates**: Improves user experience by updating UI before the server responds.

## 3. Implementation Steps

### Step 1: Installation

Add TanStack Query to the project:

```bash
bun install @tanstack/svelte-query
```

### Step 2: Create Query Client

Create a new file `src/lib/utils/query-client.ts` to initialize and export the query client.

```typescript
// src/lib/utils/query-client.ts
import { QueryClient } from '@tanstack/svelte-query';

export const queryClient = new QueryClient();
```

### Step 3: Wrap Application in QueryClientProvider

Modify the root layout `src/routes/+layout.svelte` to wrap the application with `QueryClientProvider`.

```svelte
<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import { QueryClientProvider } from '@tanstack/svelte-query';
  import { queryClient } from '$lib/utils/query-client';
</script>

<QueryClientProvider client={queryClient}>
  <slot />
</QueryClientProvider>
```

### Step 4: Create JSON Database and API Routes

To provide a persistent data source for the application, a simple JSON file-based database will be used.

**1. Create `db.json`:**
A new file at `src/lib/server/db.json` will store the restaurant data.

**2. Create Database Utilities:**
A utility module at `src/lib/server/database.ts` will handle reading from and writing to the `db.json` file.

**3. Create API Endpoints:**
The following API routes will be created to handle CRUD operations:
- `src/routes/api/restaurants/+server.ts`: Handles `GET` (all) and `POST` requests.
- `src/routes/api/restaurants/[id]/+server.ts`: Handles `PUT` and `DELETE` requests for a specific restaurant.

### Step 5: Create Shared Queries and Mutations

Create a new file `src/lib/queries/restaurant-queries.ts` to store shared queries and mutations. Note that for Svelte, we use `createQuery` and `createMutation`.

```typescript
// src/lib/queries/restaurant-queries.ts
import { createQuery, createMutation, useQueryClient } from '@tanstack/svelte-query';
import type { Restaurant, RestaurantFormData } from '$lib/types/restaurant';

export const createGetRestaurantsQuery = () => createQuery<Restaurant[], Error>({
  queryKey: ['restaurants'],
  queryFn: async () => { /* ... */ }
});

export const createAddRestaurantMutation = () => {
  const queryClient = useQueryClient();
  return createMutation<Restaurant, Error, RestaurantFormData>({
    mutationFn: async (newRestaurant) => { /* ... */ },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
    },
  });
};
```

### Step 6: Refactor Existing Data Fetching

Refactor the `restaurant-management` feature to use the new TanStack Query hooks.

- **`src/lib/stores/restaurant-management.ts`**: This file will be deleted.
- **`src/lib/utils/restaurant-management.ts`**: This file will be deleted.
- **Components**: Update components to use `createQuery` and `createMutation` hooks.

#### Example: Fetching Restaurants in a Component

```svelte
// src/lib/components/restaurant-management/RestaurantManagementMain.svelte
<script lang="ts">
  import { createGetRestaurantsQuery } from '$lib/queries/restaurant-queries';

  const getRestaurants = createGetRestaurantsQuery();

  $: ({ data: items, isLoading: loading, error } = $getRestaurants);
</script>

{#if loading}
  <p>Loading...</p>
{:else if error}
  <p>Error loading restaurants.</p>
{:else}
  <!-- Render restaurants -->
{/if}
```

## 4. Timeline

- **Day 1**: Installation and setup of TanStack Query.
- **Day 2**: Create JSON database and API routes.
- **Day 3-4**: Refactor `restaurant-management` feature and create shared queries.
- **Day 5**: Testing and validation.

## 5. Risks and Mitigation

- **Learning Curve**: The team may need time to get familiar with TanStack Query. Mitigation: Provide documentation and examples.
- **File-based DB**: The JSON file database is not suitable for production environments. Mitigation: Plan for a proper database solution in a future phase.
