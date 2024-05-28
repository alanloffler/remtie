import { IState } from "./state.interface";

export interface ICityForm {
    city: string;
    state: number;
    zip: string;
}

export interface ICity {
    id: number;
    city: string;
    state: IState;
    zip: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}