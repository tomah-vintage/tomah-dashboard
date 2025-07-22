/**
 * @file Defines the core types for the Restaurant Management feature.
 */

export interface Restaurant {
	id: string;
	name: string;
	address: string;
	// ... other restaurant properties
}

export interface Menu {
	id:string;
	restaurantId: string;
	name: string;
}

export interface MenuItem {
	id: string;
	menuId: string;
	name: string;
	description: string;
	price: number;
}

export interface RestaurantFormData {
	name: string;
	address: string;
	// ... other form fields for creating/editing a restaurant
}