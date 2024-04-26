import { ReactElement } from 'react';

export interface IDialog {
	id: number;
	message: ReactElement | false;
	name: string;
	subtitle: string;
	title: string;
}
