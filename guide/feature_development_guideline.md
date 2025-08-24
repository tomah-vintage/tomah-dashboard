# SvelteKit New Feature Development Template

## Design Guidelines
All components and styles must adhere to the design system defined in `@guide/design_guideline.md`. This includes color palette, typography, spacing, and component styles.
- All user-facing text within the application must be in Mongolian. For example, "Loading..." should be "Ачаалж байна...".

## Feature Overview
- **Feature Name**: [e.g., user-profile, product-catalog, shopping-cart]
- **Description**: [Brief description of what this feature does]
- **User Stories**: 
  - As a [user type], I want to [action] so that [benefit]
  - As a [user type], I want to [action] so that [benefit]
- **Acceptance Criteria**: [List key requirements that must be met]

## File Structure to Create

```
src/routes/[feature-name]/
├── +page.svelte              # Main feature page
├── +page.server.ts           # Server-side logic (if needed)
├── +layout.svelte            # Feature-specific layout (if needed)
└── [sub-routes]/             # Sub-pages if needed
    ├── +page.svelte
    └── +page.server.ts

src/lib/components/[feature-name]/
├── FeatureMain.svelte        # Main feature component
├── FeatureForm.svelte        # Form component (if needed)
├── FeatureList.svelte        # List/grid component (if needed)
├── FeatureCard.svelte        # Individual item component
└── index.ts                  # Export all components

src/lib/types/[feature-name].ts  # TypeScript interfaces
src/lib/utils/[feature-name].ts  # Utility functions
src/lib/stores/[feature-name].ts # Svelte stores (if needed)
```

## Development Steps

### 1. Type Definitions
Create `src/lib/types/[feature-name].ts`:
```typescript
export interface FeatureItem {
  id: string;
  // Add specific properties
}

export interface FeatureFormData {
  // Form field types
}

export interface FeatureState {
  // State management types
}
```

### 2. Utility Functions
Create `src/lib/utils/[feature-name].ts`:
```typescript
import type { FeatureItem, FeatureFormData } from '$lib/types/[feature-name]';

export const validateFeatureData = (data: FeatureFormData): boolean => {
  // Validation logic
};

export const formatFeatureItem = (item: FeatureItem): FormattedItem => {
  // Formatting logic
};

export const apiEndpoints = {
  list: '/api/[feature-name]',
  create: '/api/[feature-name]',
  update: '/api/[feature-name]',
  delete: '/api/[feature-name]'
};
```

### 3. Store Management (if needed)
Create `src/lib/stores/[feature-name].ts`:
```typescript
import { writable } from 'svelte/store';
import type { FeatureItem, FeatureState } from '$lib/types/[feature-name]';

export const featureStore = writable<FeatureState>({
  items: [],
  loading: false,
  error: null
});

export const featureActions = {
  async loadItems() {
    // Load data logic
  },
  async createItem(data: FeatureFormData) {
    // Create logic
  },
  async updateItem(id: string, data: Partial<FeatureFormData>) {
    // Update logic
  },
  async deleteItem(id: string) {
    // Delete logic
  }
};
```

### 4. Main Components

#### Create `src/lib/components/[feature-name]/FeatureMain.svelte`:
```svelte
<script lang="ts">
  import type { FeatureItem } from '$lib/types/[feature-name]';
  import FeatureList from './FeatureList.svelte';
  import FeatureForm from './FeatureForm.svelte';
  
  export let items: FeatureItem[] = [];
  export let loading = false;
  export let error: string | null = null;
  
  // Component logic
</script>

<div class="feature-main">
  <header>
    <h1>[Feature Name]</h1>
    <!-- Add feature header content -->
  </header>
  
  <main>
    {#if loading}
      <div class="loading">Loading...</div>
    {:else if error}
      <div class="error">{error}</div>
    {:else}
      <FeatureList {items} />
    {/if}
  </main>
</div>

<style>
  /* Component styles */
</style>
```

#### Create `src/lib/components/[feature-name]/FeatureForm.svelte`:
```svelte
<script lang="ts">
  import type { FeatureFormData } from '$lib/types/[feature-name]';
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher<{
    submit: FeatureFormData;
    cancel: void;
  }>();
  
  export let initialData: Partial<FeatureFormData> = {};
  export let isEditing = false;
  
  let formData: FeatureFormData = {
    // Initialize form data
    ...initialData
  };
  
  let errors: Record<string, string> = {};
  
  const validateForm = (): boolean => {
    errors = {};
    // Add validation logic
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = () => {
    if (validateForm()) {
      dispatch('submit', formData);
    }
  };
</script>

<form on:submit|preventDefault={handleSubmit}>
  <!-- Form fields -->
  
  <div class="form-actions">
    <button type="submit" disabled={!validateForm()}>
      {isEditing ? 'Update' : 'Create'}
    </button>
    <button type="button" on:click={() => dispatch('cancel')}>
      Cancel
    </button>
  </div>
</form>

<style>
  /* Form styles */
</style>
```

#### Create `src/lib/components/[feature-name]/FeatureList.svelte`:
```svelte
<script lang="ts">
  import type { FeatureItem } from '$lib/types/[feature-name]';
  import FeatureCard from './FeatureCard.svelte';
  
  export let items: FeatureItem[] = [];
  export let emptyMessage = 'No items found';
</script>

<div class="feature-list">
  {#if items.length === 0}
    <div class="empty-state">
      <p>{emptyMessage}</p>
    </div>
  {:else}
    <div class="items-grid">
      {#each items as item (item.id)}
        <FeatureCard {item} />
      {/each}
    </div>
  {/if}
</div>

<style>
  /* List styles */
</style>
```

#### Create `src/lib/components/[feature-name]/FeatureCard.svelte`:
```svelte
<script lang="ts">
  import type { FeatureItem } from '$lib/types/[feature-name]';
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher<{
    edit: FeatureItem;
    delete: string;
    view: FeatureItem;
  }>();
  
  export let item: FeatureItem;
</script>

<div class="feature-card">
  <div class="card-content">
    <!-- Card content based on FeatureItem properties -->
  </div>
  
  <div class="card-actions">
    <button on:click={() => dispatch('view', item)}>
      View
    </button>
    <button on:click={() => dispatch('edit', item)}>
      Edit
    </button>
    <button on:click={() => dispatch('delete', item.id)}>
      Delete
    </button>
  </div>
</div>

<style>
  /* Card styles */
</style>
```

#### Create `src/lib/components/[feature-name]/index.ts`:
```typescript
export { default as FeatureMain } from './FeatureMain.svelte';
export { default as FeatureForm } from './FeatureForm.svelte';
export { default as FeatureList } from './FeatureList.svelte';
export { default as FeatureCard } from './FeatureCard.svelte';
```

### 5. Main Page Implementation

#### Create `src/routes/[feature-name]/+page.svelte`:
```svelte
<script lang="ts">
  import type { PageData } from './$types';
  import { FeatureMain } from '$lib/components/[feature-name]';
  import { featureStore, featureActions } from '$lib/stores/[feature-name]';
  
  export let data: PageData;
  
  // Page logic
</script>

<svelte:head>
  <title>[Feature Name] | Your App</title>
  <meta name="description" content="[Feature description]" />
</svelte:head>

<FeatureMain 
  items={data.items}
  loading={$featureStore.loading}
  error={$featureStore.error}
/>
```

#### Create `src/routes/[feature-name]/+page.server.ts` (if needed):
```typescript
import type { PageServerLoad } from './$types';
import type { FeatureItem } from '$lib/types/[feature-name]';

export const load: PageServerLoad = async ({ params, url, fetch }) => {
  try {
    // Load data from API or other sources
    const items: FeatureItem[] = [];
    
    return {
      items
    };
  } catch (error) {
    console.error('Error loading feature data:', error);
    return {
      items: [],
      error: 'Failed to load data'
    };
  }
};
```

## API Integration (if needed)

### Create `src/routes/api/[feature-name]/+server.ts`:
```typescript
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
  try {
    // GET logic
    return json({ items: [] });
  } catch (error) {
    return json({ error: 'Failed to fetch items' }, { status: 500 });
  }
};

export const POST: RequestHandler = async ({ request }) => {
  try {
    const data = await request.json();
    // POST logic
    return json({ success: true });
  } catch (error) {
    return json({ error: 'Failed to create item' }, { status: 500 });
  }
};
```

## Testing Requirements

### Unit Tests
Create `src/lib/components/[feature-name]/FeatureMain.test.ts`:
```typescript
import { render, screen } from '@testing-library/svelte';
import FeatureMain from './FeatureMain.svelte';

describe('FeatureMain', () => {
  it('renders correctly', () => {
    render(FeatureMain, { items: [] });
    expect(screen.getByText('[Feature Name]')).toBeInTheDocument();
  });
  
  // Add more tests
});
```

### Integration Tests
- Test API endpoints
- Test form submissions
- Test component interactions
- Test error handling

## Accessibility Checklist
- [ ] Proper ARIA labels on interactive elements
- [ ] Keyboard navigation support
- [ ] Screen reader announcements for state changes
- [ ] Proper heading hierarchy
- [ ] Color contrast compliance
- [ ] Focus management
- [ ] Error message association with form fields

## Performance Considerations
- [ ] Lazy loading for large lists
- [ ] Debounced search/filter inputs
- [ ] Optimistic updates for better UX
- [ ] Proper loading states
- [ ] Error boundaries
- [ ] Code splitting if feature is large

## Security Considerations
- [ ] Input validation and sanitization
- [ ] CSRF protection for forms
- [ ] Rate limiting for API endpoints
- [ ] Proper authentication checks
- [ ] Data validation on both client and server

## Review Checklist
- [ ] All TypeScript types are properly defined
- [ ] Components are reusable and well-structured
- [ ] Error handling is implemented
- [ ] Loading states are present
- [ ] Form validation is comprehensive
- [ ] API endpoints are secure
- [ ] Tests cover main functionality
- [ ] Accessibility requirements are met
- [ ] Performance is optimized
- [ ] Code follows project conventions

## Documentation
- [ ] Add feature to main README
- [ ] Document API endpoints
- [ ] Add inline code comments
- [ ] Update type definitions
- [ ] Add usage examples

---

**Note**: Replace `[feature-name]` with your actual feature name throughout all files. Customize the types, components, and logic based on your specific feature requirements.