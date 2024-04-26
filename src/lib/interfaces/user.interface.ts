export interface IUser {
	createdAt?: string;
	deletedAt?: string;
	email: string;
	id: number;
	name: string;
	password?: string;
	phone?: string;
	role: string;
}

export interface IUserCreate {
	createdAt?: string;
	deletedAt?: string;
	email: string;
	name: string;
	password?: string;
	phone?: string;
	role: string;
}
