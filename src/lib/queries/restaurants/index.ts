// Re-export all restaurant queries for backward compatibility
// This allows importing from 'src/lib/queries/restaurants' instead of individual files

// List queries
export * from "./restaurant-list-queries";

// Create mutations
export * from "./restaurant-create-queries";

// Update mutations
export * from "./restaurant-update-queries";

// Delete mutations
export * from "./restaurant-delete-queries";

// Staff management
export * from "./restaurant-staff-queries";

// Subscription management
export * from "./restaurant-subscription-queries";

// EBARIMT configuration
export * from "./restaurant-ebarimt-queries";

// VAT receipts
export * from "./restaurant-vat-queries";
