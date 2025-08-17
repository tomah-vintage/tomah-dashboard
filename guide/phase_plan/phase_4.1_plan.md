# Phase 4.1: Restaurant Detail Page Enhancement

## 1. Overview

This phase focuses on enhancing the restaurant detail page for platform admins (`pladmin`). The goal is to provide a comprehensive view of a restaurant, including its core information, media assets, and key performance indicators through order insights.

**Affected Route:** `/restaurants/[restaurantId]`
**Affected Files:**

- `src/routes/(pladmin)/restaurants/[restaurantId]/+page.svelte`
- `src/routes/(pladmin)/restaurants/[restaurantId]/+page.server.ts`
- `src/lib/types/restaurant.ts` (potentially)
- `src/lib/components/restaurant-detail/*` (new components)

## 2. Feature Breakdown

### 2.1. Restaurant Information Display

- **Objective:** Display essential restaurant details clearly at the top of the page.
- **Tasks:**
  - Display Restaurant Name (already implemented).
  - Display Restaurant Address/Location.
  - Display "Created At" timestamp, formatted for readability.
  - Add a map view for the location (e.g., using Leaflet or a static map API).

### 2.2. Image Gallery

- **Objective:** Showcase restaurant images in an organized and visually appealing manner.
- **Tasks:**
  - Create a new component `ImageGallery.svelte`.
  - The component should display a grid of restaurant images (`restaurant_img_urls`).
  - Implement a modal or lightbox to view images in full screen when clicked.
  - Handle cases where there are no images.

### 2.3. Order Insights Section

- **Objective:** Provide `pladmin` with valuable insights into the restaurant's performance.
- **Tasks:**
  - **Data Fetching:**
    - Define what "order insights" mean. This could be:
      - Total orders
      - Total revenue
      - Average order value
      - Top selling items
    - Create new query functions in `src/lib/queries/order-queries.ts` (or similar) to aggregate this data. This might require a new `orders` table/collection in the database.
  - **Component Creation:**
    - Create a new component `OrderInsights.svelte`.
    - Display the key metrics in a clean, easy-to-read format (e.g., using stat cards).
    - Consider adding a simple chart (e.g., using Chart.js or a Svelte chart library) to visualize order trends over time.
  - **Integration:**
    - Load the insights data in `+page.server.ts`.
    - Pass the data to the `OrderInsights.svelte` component on the page.

## 3. Data Model Considerations

- The `Restaurant` type in `src/lib/types/restaurant.ts` should be checked to ensure it includes `restaurant_img_urls`.
- A new data type for `OrderInsight` might be needed in a new `src/lib/types/order.ts` file.
- The database schema might need an `orders` table with relations to restaurants and menu items.

## 4. Development Steps

1.  **Update `+page.server.ts`:**
    - Modify the `load` function to fetch all necessary data: restaurant details, images, and order insights.
2.  **Enhance `+page.svelte`:**
    - Structure the page layout to include the different sections (Info, Gallery, Insights).
3.  **Develop `ImageGallery.svelte` component:**
    - Build the component to display images as described above.
4.  **Develop `OrderInsights.svelte` component:**
    - First, implement the backend logic for fetching and calculating insights.
    - Then, build the frontend component to display the data.
5.  **Styling and UX:**
    - Ensure the page is responsive and follows the design guidelines from `GEMINI.md`.
    - Add loading states for the data-heavy sections like insights.
    - Add clear error messages if data fails to load.

## 5. Acceptance Criteria

- A pladmin can navigate to `/restaurants/[restaurantId]`.
- The page displays the restaurant's name, address, and creation date.
- The page displays a gallery of the restaurant's images.
- The page displays a section with order insights (e.g., total orders, total revenue).
- The page is well-designed, responsive, and provides a good user experience.
