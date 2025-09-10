## Phase 1.3: Sidebar Redesign

### Objective
Redesign the application sidebar to match the provided visual example, enhancing user experience and visual consistency.

### Key Features
- User Profile Display
- Search Functionality
- Icon-based Navigation Menu
- Logout Button
- Dark Mode Toggle

### Technologies
SvelteKit, TypeScript, Tailwind CSS, Skeleton UI (for base components if applicable, or custom styling).

### Development Steps

#### 1. Setup & Dependencies
- Ensure necessary icon library is installed (e.g., `@lucide/svelte` or `svelte-heroicons`). If not, install it.
- Review Tailwind CSS configuration for custom colors/spacing if needed.

#### 2. Component Restructuring (`src/lib/components/Sidebar.svelte`)
- Refactor `Sidebar.svelte` to accommodate new sections:
    - User profile section (top).
    - Search input section.
    - Main navigation links.
    - Bottom section (Logout, Dark Mode).

#### 3. User Profile Section
- Implement a component or section for displaying user initials/avatar, name, and role (e.g., "AC", "Web developer").
- **Styling**: 
    - Background: White (`#FFFFFF`).
    - Text Color: Dark Charcoal (`#2C2C2C`).
    - Font Size: Body Text (16px) for name, Small Text (14px) for role.
    - Padding: Consistent with 24px base unit.
- Add a clickable arrow icon for potential profile expansion/navigation.

#### 4. Search Input
- Integrate a search input field with a magnifying glass icon.
- **Styling**: 
    - Background: Light Gray (`#F8F9FA`).
    - Text Color: Dark Charcoal (`#2C2C2C`).
    - Border Radius: `8px` (similar to buttons).
    - Padding: `12px` vertical, `24px` horizontal (similar to buttons).
    - Placeholder Text: "Search..." in a lighter shade of Dark Charcoal.
- Style it to match the example's rounded corners and background.

#### 5. Navigation Menu
- Replace existing text-only links with icon-and-text pairs.
- Identify appropriate icons for "Dashboard", "Revenue", "Notifications", "Analytics", "Chart", "Setting", "Wallets".
- **Styling**: 
    - Text Color: Dark Charcoal (`#2C2C2C`).
    - Icon Color: Dark Charcoal (`#2C2C2C`).
    - Font Size: Body Text (16px).
    - Spacing: `24px` base unit for vertical rhythm between items.
    - Active State: Background color Orange/Coral (`#FF6B35`), text and icon color White (`#FFFFFF`).
    - Hover State: Subtle color darkening on background.
- Ensure proper spacing and alignment as per the design.
- Implement active state styling for selected navigation items.

#### 6. Logout Button
- Add a dedicated "Logout" button with an icon at the bottom of the sidebar.
- **Styling**: 
    - Text Color: Dark Charcoal (`#2C2C2C`).
    - Icon Color: Dark Charcoal (`#2C2C2C`).
    - Font Size: Body Text (16px).
    - Padding: `12px` vertical, `24px` horizontal.
- Style it to match the example.

#### 7. Dark Mode Toggle
- Implement a dark mode toggle switch with a moon icon.
- **Styling**: 
    - Icon Color: Dark Charcoal (`#2C2C2C`).
    - Text Color: Dark Charcoal (`#2C2C2C`).
    - Toggle Switch: Match example's visual style (e.g., rounded, with a circular handle).
- Integrate with Svelte stores for global theme management.
- Ensure the toggle visually matches the example.

#### 8. Styling (`src/app.css` or component-specific styles)
- Apply Tailwind CSS classes for layout, colors, typography, shadows, and spacing to match the design.
- **Overall Sidebar**: 
    - Background: White (`#FFFFFF`).
    - Border Radius: `12px` (similar to cards).
    - Subtle Drop Shadow: `0 4px 16px rgba(0,0,0,0.1)`.
    - Width: Fixed width as per example (e.g., `256px`).
- Pay attention to `border-radius`, padding, and margins.
- Ensure responsiveness for collapsed/expanded states (as shown in the image).

#### 9. State Management
- Create a Svelte store (`src/lib/stores/themeStore.ts`) for managing the dark mode state.
- Update `+layout.svelte` or `app.html` to apply the dark mode class to the `body` or `html` element based on the store.

#### 10. Accessibility
- Ensure all interactive elements (buttons, links, toggle) are keyboard navigable and have appropriate ARIA attributes.

#### 11. Testing
- Manually test the sidebar's appearance and functionality across different screen sizes.
- Verify dark mode toggle functionality.
- Verify navigation links.