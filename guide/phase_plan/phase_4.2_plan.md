# Phase 4.2: New Restaurant Form Development Plan

## 1. Objective
The primary objective of this phase is to create the "Add New Restaurant" page. This involves building a comprehensive form that allows platform administrators to input all necessary details for a new restaurant, including name, contact information, and images, based on the provided UI design.

## 2. UI Design Reference
The implementation will be based on the following design mock-up:

![New Restaurant Form](@guide/pictures/new-restaurant.png)


## 2. Feature Breakdown & File Structure
Following the project guidelines in `GEMINI.md`, the following files will be created:

-   **Route:** `src/routes/(pladmin)/restaurants/new/+page.svelte`
-   **Server Logic:** `src/routes/(pladmin)/restaurants/new/+page.server.ts`
-   **Main Component:** `src/lib/components/new-restaurant/NewRestaurantMain.svelte`
-   **Form Component:** `src/lib/components/new-restaurant/NewRestaurantForm.svelte`
-   **Image Upload Component:** `src/lib/components/new-restaurant/ImageUploader.svelte`
-   **Component Index:** `src/lib/components/new-restaurant/index.ts`
-   **Type Definitions:** `src/lib/types/restaurant.ts` (will be updated)

## 3. Development Steps

### Step 1: Routing Setup
1.  Create a new directory `src/routes/(pladmin)/restaurants/new`.
2.  Inside this directory, create `+page.svelte` and `+page.server.ts`.

### Step 2: Update Type Definitions
In `src/lib/types/restaurant.ts`, define a new interface for the form data.

```typescript
// src/lib/types/restaurant.ts

export interface NewRestaurantFormData {
  name: string;
  representativeName: string;
  phone: string;
  registrationNumber: string;
  workingHours: string;
  address: string;
  image?: File;
}
```

### Step 3: Server-Side Logic (`+page.server.ts`)
This file will handle the form submission.

1.  **Form Action:** Implement a `default` form action to process the `POST` request.
2.  **Data Validation:**
    -   Retrieve all form fields using `request.formData()`.
    -   Implement server-side validation (e.g., using `zod`) to ensure all required fields are present and correctly formatted.
    -   If validation fails, return a `400` status with the validation errors and the submitted data to repopulate the form.
3.  **API Call:**
    -   If validation is successful, call the backend API to create the new restaurant. The endpoint is likely `POST /api/restaurants`.
    -   The form data, including the image, will be sent in the request body.
4.  **Redirection:** Upon successful creation, redirect the user to the main restaurants list page (`/restaurants`).

### Step 4: Component Development

1.  **`ImageUploader.svelte`**:
    -   Create a component that provides a file input and a drop zone for image uploads.
    -   It should display a preview of the selected image.
    -   It will have "Upload Image" and "Cancel" buttons.

2.  **`NewRestaurantForm.svelte`**:
    -   Build the form using Skeleton UI components (`Input`, `Textarea`, `Button`).
    -   The form will have the following fields based on the design:
        -   Restaurant Name (text input)
        -   Representative's Name (text input)
        -   Phone (text input)
        -   Company Registration Number (text input)
        -   Working Hours (text input)
        -   Address (textarea)
    -   Integrate the `ImageUploader.svelte` component.
    -   The form will use `enhance` for progressive enhancement.
    -   It will display validation errors returned from the server.

3.  **`NewRestaurantMain.svelte`**:
    -   This component will serve as the main container for the feature.
    -   It will include the page title ("Add Restaurant") and breadcrumbs.
    -   It will contain the `NewRestaurantForm.svelte` component.

### Step 5: Page Implementation (`+page.svelte`)
1.  Set the page title using `<svelte:head>`.
2.  Import and render the `NewRestaurantMain.svelte` component.
3.  Pass the `form` prop from `export let form` to the main component to handle form state and validation feedback.

## 4. Styling
-   Use Tailwind CSS to style all components according to the design provided in the image.
-   Adhere to the color palette and spacing guidelines from `GEMINI.md`.
-   Ensure the form is responsive and usable on different screen sizes.

## 5. Testing
-   Manually test the form submission with both valid and invalid data.
-   Verify that error messages are displayed correctly.
-   Confirm that a successful submission creates a new restaurant and redirects as expected.
-   Check that the image upload functionality works correctly.
