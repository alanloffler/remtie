export interface IProperty {
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
	created_by: number;
	created_at?: string;
	updated_at?: string;
    deletedAt?: string;
	[attribute: string]: string | number | boolean | undefined;
	color: string;
}
