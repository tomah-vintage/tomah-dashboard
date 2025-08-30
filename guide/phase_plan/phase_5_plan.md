# Phase 5: Seating Table Plan Development Plan

## 1. Objective
The primary goal of this phase is to create a visual and interactive seating table management page. This feature will allow restaurant staff to design their floor plan by adding, moving, and configuring tables. It will also serve as a real-time dashboard to view table statuses (e.g., available, occupied, reserved).

## 2. Feature Breakdown & User Stories
- **As a restaurant manager, I want to create a new seating layout for my restaurant.**
- **As a restaurant manager, I want to add tables of different shapes (rectangle, circle) and sizes to the layout.**
- **As a restaurant manager, I want to drag and drop tables to arrange them on the floor plan.**
- **As a restaurant manager, I want to edit table details like capacity and label.**
- **As a restaurant manager, I want to save the layout.**
- **As a staff member, I want to view the seating plan to see which tables are available, occupied, or reserved.**

## 3. File Structure
Following the project guidelines, the file structure will be as follows:

```
src/
├── lib/
│   ├── components/
│   │   └── seating-plan/
│   │       ├── SeatingPlanCanvas.svelte  # The main interactive canvas
│   │       ├── Table.svelte              # Component for a single table
│   │       ├── TableToolbar.svelte       # Toolbar with actions (Add, Save)
│   │       ├── TableEditorModal.svelte   # Modal to edit table properties
│   │       └── index.ts
│   ├── types/
│   │   └── seating-plan.ts
│   ├── stores/
│   │   └── seating-plan-store.ts
│   └── utils/
│       └── seating-plan.ts
└── routes/
    └── (rsadmin)/
        └── seating-plan/
            ├── +page.svelte
            └── +page.server.ts
```

## 4. Data Model & Types (`src/lib/types/seating-plan.ts`)
```typescript
export enum TableShape {
  Rectangle = 'rectangle',
  Circle = 'circle',
}

export enum TableStatus {
  Available = 'available',
  Occupied = 'occupied',
  Reserved = 'reserved',
}

export interface SeatingTable {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  shape: TableShape;
  capacity: number;
  label: string;
  status: TableStatus;
}

export interface SeatingLayout {
  id: string;
  restaurantId: string;
  name: string;
  tables: SeatingTable[];
}
```

## 5. Development Steps

### Step 1: Setup & Scaffolding
- Create the file structure as outlined above.
- Define the initial types in `seating-plan.ts`.

### Step 2: Server-Side Logic (`+page.server.ts`)
- Implement the `load` function to fetch the seating layout for the current restaurant from the backend.
- Implement form actions for:
  - `saveLayout`: To create or update the entire seating layout.
  - `deleteTable`: To remove a table from the layout.

### Step 3: State Management (`seating-plan-store.ts`)
- Create a writable Svelte store to manage the `SeatingLayout` data on the client-side. This will allow for reactive updates across components as tables are moved or edited.

### Step 4: UI Components (`src/lib/components/seating-plan/`)
- **`Table.svelte`**:
  - Visually render a table based on its properties (`shape`, `width`, `height`).
  - Display its `label` and `capacity`.
  - Use color-coding to indicate the `status`.
  - Make the component draggable and resizable (a library like `interact.js` could be useful here).
- **`SeatingPlanCanvas.svelte`**:
  - The main container for the tables.
  - Render all `Table` components based on the data from the store.
  - Handle the drag-and-drop logic, updating the `x` and `y` coordinates in the store.
- **`TableToolbar.svelte`**:
  - Contain buttons for "Add Table" and "Save Layout".
  - The "Save Layout" button will trigger the form submission.
- **`TableEditorModal.svelte`**:
  - A modal form that opens when a table is selected for editing.
  - Allow users to change `label`, `capacity`, and `shape`.

### Step 5: Page Implementation (`+page.svelte`)
- Assemble the main components: `SeatingPlanCanvas` and `TableToolbar`.
- Load the initial layout data from `export let data`.
- Initialize the `seating-plan-store` with the server-loaded data.
- Implement the logic to add new tables to the store when the "Add Table" button is clicked.
- Handle opening the `TableEditorModal` when a table is double-clicked or an "edit" action is triggered.

### Step 6: API Integration
- Define API endpoint constants in `src/lib/utils/seating-plan.ts`.
- Ensure the `+page.server.ts` `load` and action functions correctly call the backend APIs to fetch and persist data.

## 6. Testing Strategy
- **Manual Testing**:
  - Verify that tables can be added, moved, and resized.
  - Check that table properties can be edited and saved correctly.
  - Confirm that the layout is persisted after a page refresh.
  - Test responsive behavior to ensure the canvas is usable on different screen sizes.
- **Automated Testing (Optional but Recommended)**:
  - Write unit tests for utility functions.
  - Write component tests to verify the rendering and behavior of the `Table` and `TableToolbar` components.

## 7. Dependencies
- Consider using a lightweight and robust library for drag-and-drop functionality, such as `interact.js` or `svelte-dnd-action`, to simplify development and ensure good performance.
