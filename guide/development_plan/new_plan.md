# Qpick Dashboard Development Plan (Updated for Two Admin Types)

This plan separates features between **Platform Admin (`pladmin`)** and **Restaurant Admin (`rsadmin`)** roles.
Each section contains feature breakdowns, user stories, technical implementations, and updated folder structures.
---

## **Platform Admin (`pladmin`) Features**

1. **Restaurants Management** – Add, edit, disable restaurants, and manage subscription billing.
2. **All Users Control** – View all users and their order history.
3. **Heat Retaining Container Control** *(new feature)* – Track, assign, and maintain delivery containers.
4. **FAQ Question & Answer Control** – Manage FAQs for all roles (Platform Admin, Restaurant Admin, End Users).
5. **Analytics & Statistics (Platform-Wide)** – View sales, performance, and operational insights across all restaurants.

---

## **Restaurant Admin (`rsadmin`) Features**

1. **Manage Own Restaurant** – Update restaurant details and view subscription info.
2. **Menu Control** – Add, edit, remove menu items; toggle availability.
3. **Orders** – View and manage incoming orders.
4. **Seating Area Control** – Add/remove tables, generate/print QR codes for ordering.
5. **Restaurant Analytics & Statistics** – View performance and insights for own restaurant.

---

## Phase 1: Authentication (Shared)

**Description:**
Both admin types log in through the same authentication flow, with role-based redirection after login.

**File Structure:**

```
src/routes/login/
├── +page.svelte
└── +page.server.ts
src/hooks.server.ts
src/lib/components/auth/
├── LoginForm.svelte
└── index.ts
src/lib/types/auth.ts
```

---

## **Platform Admin (`pladmin`) Features**

### 1.1. Restaurants Management

**Feature Breakdown:**

* **Task**: Add, edit, and disable restaurants; view subscription billing.
* **User Story**: As a Platform Admin, I want to manage all partner restaurants.

**Path:**

```
src/routes/pladmin/restaurants/
```

---

### 3.1. All Users Control

**Feature Breakdown:**

* **Task**: View all registered users and their order histories.
* **User Story**: As a Platform Admin, I want to monitor all users' activity.

**Path:**

```
src/routes/pladmin/users/
```

---

### 3.2. Heat Retaining Container Control *(New Feature)*

**Feature Breakdown:**

* **Task**: Manage inventory and distribution of heat-retaining delivery containers.
* **User Story**: As a Platform Admin, I want to track containers and their status.

**Sub-tasks:**

* [ ] **Container List**: Show all containers with status (in-use, returned, damaged).
* [ ] **Assign Containers**: Allocate containers to restaurants.
* [ ] **Return Tracking**: Mark containers as returned.
* [ ] **Maintenance Records**: Track repairs or replacements.

**Path:**

```
src/routes/pladmin/containers/
```

**Data Models:**
`src/lib/types/container.ts`

* `Container`: id, status, restaurantId, maintenanceLog.

**Components:**

* `ContainerList.svelte`
* `ContainerForm.svelte`

---

### 3.3. FAQ Question & Answer Control *(moved from 3.2)*

**Feature Breakdown:**

* **Task**: Manage a centralized FAQ knowledge base.
* **User Story**: As a Platform Admin, I want to edit FAQs for all roles.

**Path:**

```
src/routes/pladmin/support/faq/
```

---

### 4.1. Analytics and Statistics (Platform-Wide)

**Feature Breakdown:**

* **Task**: View sales and operational statistics across the platform.
* **User Story**: As a Platform Admin, I want to see global insights.

**Path:**

```
src/routes/pladmin/insights/
```

---

## **Restaurant Admin (`rsadmin`) Features**

### 1.1. Manage Own Restaurant

**Feature Breakdown:**

* **Task**: Edit own restaurant information and view subscription status.
* **User Story**: As a Restaurant Admin, I want to manage my restaurant details.

**Path:**

```
src/routes/rsadmin/restaurant/
```

---

### 1.2. Menu Control

**Feature Breakdown:**

* **Task**: Add/edit/remove menu items; toggle availability.
* **User Story**: As a Restaurant Admin, I want to manage my menu.

**Path:**

```
src/routes/rsadmin/menu/
```

---

### 2.1. Orders

**Feature Breakdown:**

* **Task**: View and manage customer orders.
* **User Story**: As a Restaurant Admin, I want to process incoming orders.

**Path:**

```
src/routes/rsadmin/orders/
```

---

### 2.2. Seating Area Control

**Feature Breakdown:**

* **Task**: Manage table layout and QR codes for ordering.
* **User Story**: As a Restaurant Admin, I want to control my seating area.

**Path:**

```
src/routes/rsadmin/seating/
```

---

### 4.1. Restaurant Analytics and Statistics

**Feature Breakdown:**

* **Task**: View restaurant-specific insights.
* **User Story**: As a Restaurant Admin, I want to monitor my own performance.

**Path:**

```
src/routes/rsadmin/insights/
```

---

## **Folder Structure Overview**

```
src/routes/
├── login/
├── pladmin/
│   ├── restaurants/
│   ├── users/
│   ├── containers/        # New Feature 3.2
│   ├── support/
│   │   └── faq/
│   └── insights/
└── rsadmin/
    ├── restaurant/
    ├── menu/
    ├── orders/
    ├── seating/
    └── insights/
```
