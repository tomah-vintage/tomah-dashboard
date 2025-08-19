/**
 * @file Defines the core types for the Restaurant Management feature.
 */

export interface Restaurant {
	id: string;
	name: string;
	logo: string;
	address: string;
	phone: string;
	email: string;
	status: 'active' | 'inactive';
	created_at: string;
}

export interface Menu {
	id: string;
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
	phone: string;
	email: string;
	status: 'active' | 'inactive';
}

export interface NewRestaurantFormData {
	name: string;
	representativeName: string;
	phone: string;
	registrationNumber: string;
	workingHours: string;
	address: string;
	image?: File;
}