## Phase 1.4: Dark and Light Mode Implementation

### Objective
Implement a robust dark and light mode switching mechanism across the application, ensuring visual consistency and user preference persistence.

### Key Features
- User-initiated theme toggle (via sidebar).
- Persistence of user's theme preference (using Local Storage).
- Automatic theme detection based on system preference.
- Dynamic styling of UI components based on the active theme.

### Technologies
SvelteKit, TypeScript, Tailwind CSS, Svelte Stores.

### Development Steps

#### 1. Review Existing Setup
- Verify the `src/lib/stores/themeStore.ts` file is correctly implemented to:
    - Use `writable` from `svelte/store`.
    - Read initial theme from `localStorage` or system preference (`window.matchMedia`).
    - Persist theme changes to `localStorage`.
    - Toggle the `dark` class on the `document.documentElement`.
    - **Note**: A `console.log` was added for debugging purposes.
- Confirm `src/app.html` has `class="dark"` for initial dark mode application.
- Confirm `src/lib/components/Sidebar.svelte` correctly uses `$themeStore` for the toggle switch `checked` state and `toggleDarkMode` function.

#### 2. Tailwind CSS Configuration (`tailwind.config.cjs`)
- Ensure `darkMode: 'class'` is configured in `tailwind.config.cjs` to enable class-based dark mode.
- Define dark mode specific colors and styles in `tailwind.config.cjs` or directly in components using `dark:` prefix.

#### 3. Global Styling (`src/app.css`)
- Define base styles for light and dark themes.
- **Light Mode (Default)**:
    - Background: Light Gray (`#F8F9FA`).
    - Text Color: Dark Charcoal (`#2C2C2C`).
- **Dark Mode**:
    - Background: `gray-900` (used in `Sidebar.svelte` and `+layout.svelte`).
    - Text Color: Lighter shades (e.g., `gray-100` or `white`).

#### 4. Component-Specific Styling
- Go through key components (e.g., `+layout.svelte`, `+page.svelte` files, `src/lib/components/`) and apply `dark:` prefixed Tailwind classes where necessary.
- **`src/lib/components/Sidebar.svelte`**: 
    - `aside` tag: `bg-white dark:bg-gray-900`.
    - User profile text: `dark:text-white`.
    - Search input: `dark:bg-gray-800`, `dark:text-white`, `dark:placeholder-gray-400`.
    - Search icon: `dark:text-gray-300`.
    - Navigation links: `dark:text-white`, `dark:hover:bg-gray-700`.
    - Logout button: `dark:text-white`, `dark:hover:bg-gray-700`.
    - Dark mode toggle section background: `dark:bg-gray-700`.
    - Dark mode toggle icon and text: `dark:text-white`.
- **`src/routes/+layout.svelte`**: 
    - `main` tag: `bg-[#F8F9FA] dark:bg-gray-900`.
- Pay attention to:
    - Backgrounds of cards, panels, and main content areas.
    - Text colors for headings, body text, and links.
    - Border colors.
    - Icon colors.
    - Input field backgrounds and text colors.

#### 5. Layout Integration (`src/routes/+layout.svelte`)
- The `+layout.svelte` file now relies solely on the `themeStore.subscribe` method in `src/lib/stores/themeStore.ts` to apply/remove the `dark` class on the `document.documentElement`. The `onMount` logic for theme application was simplified.

#### 6. Testing
- Manually test the dark mode toggle in the sidebar.
- Verify that all UI elements and pages correctly switch between light and dark themes.
- Check persistence of the theme preference after refreshing the page.
- Test on different browsers to ensure `localStorage` and `matchMedia` behave as expected.
- Verify accessibility: ensure sufficient contrast in both modes.