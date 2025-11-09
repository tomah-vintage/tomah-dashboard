# Qpick Dashboard Design Guidelines

## Brand Identity

### Logo & Navigation

- **Logo**: "Tom Ax" restaurant brand name.
- **Color**: Red accent for branding, with a dark sidebar and a light content area.
- **Navigation**: Vertical sidebar on the left, with icons and text.
- **CTA Buttons**: Rounded corners, blue background for primary actions, white for secondary.

### Color Palette

#### Primary Colors

- **Primary Blue**: `#2563EB` (Primary CTAs, interactive elements, highlights)
- **Branding Red**: `#DC2626` (Sidebar active state, branding text)
- **Sidebar Background**: `#111827` (Dark Gray)
- **Content Background**: `#F3F4F6` (Light Gray)
- **Card/Component Background**: `#FFFFFF` (White)
- **Text (Dark)**: `#1F2937`
- **Text (Light)**: `#FFFFFF`

#### Status Colors

- **Success**: `#16A34A` (Completed status, positive indicators)
- **Warning**: `#FBBF24` (Pending or attention states)
- **Error**: `#DC2626` (Cancelled status, errors)
- **Info**: `#2563EB` (Informational elements)

## Typography

### Font Hierarchy

- **Primary Font**: Sans-serif (Inter or similar)
- **Headings**: Bold, for page and section titles.
- **Body Text**: Regular weight, high contrast for readability.
- **Small Text**: Used for secondary information in tables or metadata.

### Scale & Weights

- **Page Title**: 24px, Bold (700)
- **Section Headers**: 20px, Bold (700)
- **Body Text**: 16px, Regular (400)
- **Small Text**: 14px, Regular (400)

## Layout System

### Grid Structure

- **Layout**: Two-column layout with a fixed sidebar and a flexible main content area.
- **Spacing**: Consistent spacing based on an 8px grid unit.
- **Padding**: 24px for main content areas, 16px for cards/tables.

### Component Spacing

- **Section Margins**: 48px between major sections.
- **Card Padding**: 24px internal padding.
- **Button Padding**: 12px vertical, 24px horizontal.
- **Icon Spacing**: 8px from text elements.

## Component Design

### Sidebar Navigation

- **Background**: Dark gray (`#111827`).
- **Width**: Approximately 280px.
- **Typography**: 16px, regular weight, white text.
- **Active State**: Red text (`#DC2626`) with a red left border.
- **Hover State**: Subtle gray background lightening.

### Header Bar

- **Background**: White with a bottom border.
- **Height**: 64px.
- **Content**: Breadcrumbs on the left; notification and profile icons on the right.

### Cards & Panels

- **Background**: White.
- **Border Radius**: 8px.
- **Border**: 1px solid `#E5E7EB` (Gray-200). The main content panel has a prominent blue border.
- **Shadow**: Subtle drop shadow.
- **Padding**: 24px.

### Tables

- **Header**: Bold text, gray bottom border.
- **Row**: Alternating row colors are not used, but selected rows have a light blue background.
- **Row Dividers**: Solid light gray line.
- **Cell Padding**: 16px.

### Buttons

- **Primary**: Blue background (`#2563EB`), white text.
- **Secondary**: White background, dark text, gray border.
- **Border Radius**: 8px.
- **Padding**: 10px vertical, 16px horizontal for standard buttons.
- **Icon Buttons**: Used for actions like "Filter" and "Export".

**Note**: Always use the `Button` component from `src/lib/components/ui/button/Button.svelte` for creating buttons to ensure consistency. Refer to `GEMINI.md` for usage details.

### Inputs

- **Style**: Consistent styling for all text, textarea, checkbox, and other input types.
- **Border Radius**: 8px.
- **Padding**: 10px vertical, 16px horizontal.
- **Focus State**: Blue outline for consistency with the primary action color.

**Note**: Always use the `Input` component from `src/lib/components/ui/input/Input.svelte` for creating form inputs to ensure consistency. Refer to `GEMINI.md` for usage details.

## Icon System

### Style

- **Source**: Lucide icons are used for all UI icons.
- **Type**: Outlined icons are used primarily.
- **Size**: 24px standard.
- **Color**: Inherits from parent text color.

## Interactive States

### Hover Effects

- **Buttons**: Subtle color darkening.
- **Table Rows**: Light gray background.
- **Links**: Underline or color change to blue.

### Focus States

- **Accessibility**: Clear, visible focus indicators.
- **Color**: Blue outline for consistency with the primary action color.
- **Visibility**: High contrast for accessibility.

## Responsive Design

### Breakpoints

- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px+

### Mobile Adaptations

- **Navigation**: Sidebar collapses into a hamburger menu.
- **Layout**: Single column stacking for content.
- **Typography**: Reduced scale for smaller screens.
- **Touch Targets**: Minimum 44px for all interactive elements.

## Accessibility Guidelines

### Color Contrast

- **Text**: Minimum 4.5:1 contrast ratio against its background.
- **Large Text**: Minimum 3:1 contrast ratio.
- **Interactive Elements**: Clear visual feedback on state changes.

### Typography

- **Hierarchy**: Clear heading structure (H1, H2, H3).
- **Readability**: Adequate line spacing and font sizes.
- **Language**: Clear, concise copy.

## Animation & Transitions

### Principles

- **Duration**: 150-250ms for UI transitions.
- **Easing**: Ease-out for most interactions.
- **Purpose**: Provide feedback and enhance user experience without being distracting.

### Common Animations

- **Hover States**: Subtle background or color changes.
- **State Changes**: Smooth transitions for elements like dropdowns or accordions.

---

**Note**: This design system emphasizes clean, modern aesthetics with strong data visualization capabilities. The orange accent color should be used strategically to guide user attention and create visual hierarchy throughout the interface.
