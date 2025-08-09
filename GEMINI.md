# Gemini Project Development Guidelines

This document provides comprehensive development, design, and feature implementation guidelines for the Tomah Dashboard project.

---

## 1. Project Overview & Core Technologies

- **Framework**: SvelteKit
- **Language**: TypeScript/JavaScript (TypeScript is mandatory for all new files)
- **Styling**: Tailwind CSS and Skeleton UI
- **Authentication**: TBD
- **UI Components**: Skeleton UI

---

## 2. Development Standards

### 2.1. Code Style & Structure
- Use TypeScript for all new files.
- Follow SvelteKit file-based routing conventions.
- Use `+page.svelte` for pages and `+layout.svelte` for layouts.
- Place reusable components in `src/lib/components/`.
- Use `src/lib/utils/` for utility functions.
- Store types in `src/lib/types/`.
- Use kebab-case for file names and component names.

### 2.2. Component Guidelines
- Create functional, accessible components.
- Use proper TypeScript interfaces for props.
- Include JSDoc comments for complex components.
- Use Svelte stores for state management when needed.
- Implement proper error boundaries.

### 2.3. API & Data Handling
- Use `+page.server.ts` for server-side data loading.
- Implement proper form actions in `+page.server.ts`.
- For all client-side API calls, use the `apiFetch` utility from `$lib/utils/api.ts` to ensure consistent authentication and automatic token refresh handling.
- Use `$lib/server/` for server-only code.
- Implement proper error handling and validation.
- Use environment variables for sensitive data.

### 2.4. File Structure Requirements
```
src/
├── app.html
├── app.css
├── routes/
│   ├── +layout.svelte
│   ├── +layout.server.ts
│   ├── +page.svelte
│   ├── +page.server.ts
│   └── [feature]/
│       ├── +page.svelte
│       └── +page.server.ts
├── lib/
│   ├── components/
│   │   ├── ui/           # Reusable UI components
│   │   └── [feature]/    # Feature-specific components
│   ├── stores/           # Svelte stores
│   ├── utils/            # Utility functions
│   ├── types/            # TypeScript types
│   └── server/           # Server-only code
└── static/               # Static assets
```

---

## 3. Design System & Guidelines

### 3.1. Brand Identity & Color Palette

- **Logo**: Clean, minimalist curved design.
- **Primary Colors**:
  - **Orange/Coral**: `#FF6B35` (Primary CTAs, accents, highlights)
  - **Dark Charcoal**: `#2C2C2C` (Text, navigation, logo)
  - **Light Gray**: `#F8F9FA` (Background, cards)
  - **White**: `#FFFFFF` (Cards, button backgrounds)
- **Status Colors**:
  - **Success**: `#4CAF50`
  - **Warning**: `#FF9800`
  - **Error**: `#F44336`
  - **Info**: `#2196F3`

### 3.2. Typography

- **Primary Font**: Sans-serif (Inter or similar).
- **Scale & Weights**:
  - **Hero Title**: 48px+, Bold (700)
  - **Section Headers**: 32px, Bold (700)
  - **Body Text**: 16px, Regular (400)
  - **Small Text**: 14px, Regular (400)

### 3.3. Layout & Spacing

- **Grid**: Flexible grid system with consistent gutters.
- **Spacing**: 24px base unit for vertical rhythm.
- **Padding**: 16px minimum for cards, 24px for sections.
- **Section Margins**: 80px+ between major sections.

### 3.4. Component Design

- **Navigation Bar**: 72px height, white background with subtle shadow. Active state is orange.
- **Cards & Panels**: White background, `12px` border-radius, subtle drop shadow (`0 4px 16px rgba(0,0,0,0.1)`), `24px` padding.
- **Buttons**:
  - **Primary**: Orange background, white text, `8px` border-radius.
  - **Secondary**: White background, dark text, subtle border.
  - **Padding**: 12px vertical, 24px horizontal.

### 3.5. Interactive States

- **Hover**: Subtle color darkening on buttons, shadow increase on cards.
- **Focus**: High-contrast orange outline for accessibility.

### 3.6. Responsive Design

- **Breakpoints**: Mobile (320-767px), Tablet (768-1023px), Desktop (1024px+).
- **Adaptations**: Use hamburger menus, single-column stacking, and reduced typography scale for smaller screens. Ensure touch targets are at least 44px.

---

## 4. New Feature Development Workflow

This template must be followed for all new feature development.

### 4.1. File Structure to Create
Replace `[feature-name]` with the actual feature name (e.g., `user-profile`).

```
src/routes/[feature-name]/
├── +page.svelte
└── +page.server.ts (if needed)

src/lib/components/[feature-name]/
├── FeatureMain.svelte
├── FeatureForm.svelte
├── FeatureList.svelte
├── FeatureCard.svelte
└── index.ts

src/lib/types/[feature-name].ts
src/lib/utils/[feature-name].ts
src/lib/stores/[feature-name].ts (if needed)
```

### 4.2. Development Steps

**Step 1: Type Definitions (`src/lib/types/[feature-name].ts`)**
```typescript
export interface FeatureItem {
  id: string;
  // Add specific properties
}

export interface FeatureFormData {
  // Form field types
}
```

**Step 2: Utility Functions (`src/lib/utils/[feature-name].ts`)**
```typescript
import type { FeatureItem, FeatureFormData } from '$lib/types/[feature-name]';

export const validateFeatureData = (data: FeatureFormData): boolean => {
  // Validation logic
};

export const apiEndpoints = {
  list: '/api/[feature-name]',
  create: '/api/[feature-name]',
  // etc.
};
```

**Step 3: Store Management (`src/lib/stores/[feature-name].ts`)**
```typescript
import { writable } from 'svelte/store';
import type { FeatureItem } from '$lib/types/[feature-name]';

export const featureStore = writable({
  items: [] as FeatureItem[],
  loading: false,
  error: null as string | null
});
```

**Step 4: Create Components (`src/lib/components/[feature-name]/`)**
- **`FeatureMain.svelte`**: The main container component for the feature.
- **`FeatureForm.svelte`**: The form for creating/editing items.
- **`FeatureList.svelte`**: The component to display a list or grid of items.
- **`FeatureCard.svelte`**: The component for a single item in the list.
- **`index.ts`**: Export all components from this file.

**Step 5: Page Implementation (`src/routes/[feature-name]/+page.svelte`)**
```svelte
<script lang="ts">
  import type { PageData } from './$types';
  import { FeatureMain } from '$lib/components/[feature-name]';
  
  export let data: PageData;
</script>

<svelte:head>
  <title>[Feature Name]</title>
</svelte:head>

<FeatureMain items={data.items} />
```

**Step 6: Server-Side Logic (`src/routes/[feature-name]/+page.server.ts`)**
```typescript
import type { PageServerLoad } from './$types';
import type { FeatureItem } from '$lib/types/[feature-name]';

export const load: PageServerLoad = async () => {
  try {
    // Load data from API or other sources
    const items: FeatureItem[] = []; 
    return { items };
  } catch (error) {****
    return { items: [], error: 'Failed to load data' };
  }
};
```

---

## 5. Global Guidelines

### 5.1. Security
- Validate ALL user inputs on the server.
- Use proper authentication checks.
- Implement CSRF protection for forms.
- Sanitize data before database operations.
- Use environment variables for secrets.

### 5.2. Performance
- Implement code splitting and lazy loading.
- Optimize bundle size.
- Implement caching strategies.
- Consider preloading for critical routes.

### 5.3. Accessibility
- Use proper ARIA labels and roles.
- Ensure full keyboard navigation.
- Maintain a logical heading hierarchy (H1, H2, etc.).
- Ensure color contrast meets WCAG 2.1 AA standards (4.5:1 for normal text).
- Manage focus states effectively.

### 5.4. Environment Variables
The following variables are required.
```
# Required environment variables
AUTH_SECRET=
PUBLIC_SITE_URL=
# Add your specific variables here
```

### 5.5. Code Quality & Review Checklist
- [ ] TypeScript types are properly defined and used.
- [ ] Components are accessible (ARIA, keyboard nav, focus).
- [ ] Comprehensive error handling is implemented.
- [ ] Loading states are present for all async operations.
- [ ] Responsive design is working correctly on all specified breakpoints.
- [ ] Security best practices are followed.
- [ ] Tests cover the main functionality.