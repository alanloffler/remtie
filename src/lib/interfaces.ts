// Interfaces
export interface Property {
	id: number;
	type: string;
	is_active: boolean;
	business_type: string;
	title: string;
	short_description: string;
	street: string;
	city: string;
	state: string;
	zip: string;
	price: number;
	// thumbnail: string;
	// images: string;
	created_by: number;
	// created_at?: string;
	// updated_at?: string;
	[attribute: string]: string | number | boolean;
	color: string;
}

export interface User {
	id?: string;
	name: string;
	phone: string;
	email: string;
	password?: string;
	type: string;
	created_at?: string;
}

export interface IImage {
	id: number;
	name: string;
	propertyId: number;
}

export interface IDashboardHeader {
	category: string;
	total: number;
	percentage: number;
	color: string;
}
