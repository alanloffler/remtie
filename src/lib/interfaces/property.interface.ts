import { IUser } from "./user.interface";

export interface IProperty {
	id: number;
	type: string;
	is_active: boolean;
    isFavorite: boolean;
	business_type: string;
	title: string;
	short_description: string;
	long_description: string;
	street: string;
	city: string;
	state: string;
	zip: string;
	price: number;
	created_by: number;
	created_at?: string;
	updated_at?: string;
    deletedAt?: string;
	[attribute: string]: string | number | boolean | undefined | IUser;
	color: string;
    user?: IUser;
}
