export interface IStateForm {
    state: string;
}

export interface IState extends IStateForm {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}