# Qpick Dashboard Development Plan - Phase 2 (Revised)

This document outlines the revised development plan for **Phase 2: Seating Area Control**, prioritizing an API-driven approach consistent with the project's architecture.

---

## 1. Phase Objective & Key Features

**Objective**: To empower Restaurant Administrators with the tools to digitally manage their physical table layout, generate unique QR codes for each table to facilitate online ordering, and easily print these codes for placement in the restaurant.

**User Story**: As a Restaurant Admin, I need to manage my restaurant's table layout and generate QR codes for ordering.

### Functional Requirements:
- **Table Management**: An interface to add new tables and remove existing ones.
- **QR Code Generation**: Automatic generation of a unique QR code for every table created.
- **QR Code Visualization**: A way to view the generated QR code for each table within the dashboard.
- **Printing**: A user-friendly feature to print individual QR codes.
- **Sidebar Navigation**: A link in the sidebar to access the Seating Area Control page.

---

## 2. Technical Implementation Plan

This revised plan incorporates a dedicated API for table management and updates the UI to consume it.

### Step 2.1: Update Sidebar Navigation

Modify `src/lib/components/Sidebar.svelte` to include a link to the seating management page under the "Restaurants" section, ensuring it's discoverable.

### Step 2.2: File Structure Setup

Create the necessary files and directories for the feature, including the new API routes.

```
src/
├── lib/
│   ├── components/
│   │   └── seating-area-control/
│   │       ├── SeatingAreaMain.svelte
│   │       ├── TableList.svelte
│   │       ├── TableCard.svelte
│   │       ├── QRCodeModal.svelte
│   │       └── index.ts
│   └── types/
│       └── seating.ts
└── routes/
    ├── api/
    │   └── restaurants/
    │       └── [restaurantId]/
    │           └── tables/
    │               ├── +server.ts
    │               └── [tableId]/
    │                   └── +server.ts
    └── dashboard/
        └── restaurants/
            └── [restaurantId]/
                └── seating/
                    ├── +page.svelte
                    └── +page.server.ts
```

### Step 2.3: Data Models (`seating.ts`)

Define the TypeScript interfaces for the seating data structures. (No changes from the original plan).

**File**: `src/lib/types/seating.ts`
```typescript
export interface Table {
  id: string;
  restaurantId: string;
  name: string; // e.g., "Table 5", "Patio 2"
  qrCodeUrl: string; // Will store a data URL of the generated QR code
  orderUrl: string; // The URL embedded in the QR code
}

export interface TableFormData {
  name: string;
}
```

### Step 2.4: API Endpoint Development

Create the backend API endpoints to handle all CRUD operations for tables.

**Dependency**: `qrcode`

**File**: `.../api/restaurants/[restaurantId]/tables/+server.ts`
- **`GET`**: Fetches all tables for the specified `restaurantId` from the database.
- **`POST`**: Creates a new table. It will receive the table name, generate a unique ID, construct the `orderUrl`, generate the `qrCodeUrl` using the `qrcode` library, and save the new `Table` object to the database.

**File**: `.../api/restaurants/[restaurantId]/tables/[tableId]/+server.ts`
- **`DELETE`**: Deletes the table with the specified `tableId` from the database.

### Step 2.5: Component Development (`seating-area-control`)

Develop the Svelte components for the UI. (No changes from the original plan).

- `SeatingAreaMain.svelte`
- `TableList.svelte`
- `TableCard.svelte`
- `QRCodeModal.svelte`
- `index.ts`

### Step 2.6: Page Server-Side Logic (`seating/+page.server.ts`)

Implement the server-side logic for the seating page, which will now act as a client to the new API.

**File**: `.../seating/+page.server.ts`
- **`load`**: Uses `fetch` to call the `GET /api/restaurants/[restaurantId]/tables` endpoint to retrieve the list of tables.
- **`actions`**:
  - `addTable`: Uses `fetch` to send a `POST` request to `/api/restaurants/[restaurantId]/tables` with the new table's data.
  - `removeTable`: Uses `fetch` to send a `DELETE` request to `/api/restaurants/[restaurantId]/tables/[tableId]`.

### Step 2.7: Page Implementation (`seating/+page.svelte`)

Create the main page that ties the components and server data together. (No changes from the original plan).

---

## 3. Acceptance Criteria & Checklist

- [ ] A link to "Seating" is present in the sidebar under "Restaurants".
- [ ] API endpoints for table management (`GET`, `POST`, `DELETE`) are created and functional.
- [ ] The Seating page loads table data by calling the new API.
- [ ] Adding a table on the page successfully calls the `POST` API endpoint and updates the UI.
- [ ] Removing a table on the page successfully calls the `DELETE` API endpoint and updates the UI.
- [ ] The QR code modal and printing functionality work as intended.
