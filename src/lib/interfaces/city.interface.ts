export interface ICityForm {
    city: string;
    state: string;
    zip: string;
}

export interface ICity extends ICityForm {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}