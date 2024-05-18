export interface IBusiness {
	id: number;
	name: string;
	plural: string;
    createdBy: number;
    updatedBy: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
}

export interface IBusinessForm {
    name: string;
    plural: string;
}

export interface ICategory {
	id: number;
	name: string;
	plural: string;
	color: string;
    createdBy: number;
    updatedBy: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
}

export interface ICategoryForm {
    name: string;
    plural: string;
    color: string;
}
