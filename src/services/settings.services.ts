import { store } from '@/services/store.services';

export class SettingsServices {
	static readonly API_URL: string = import.meta.env.VITE_REACT_BACKEND_API;

	static async findOne(name: string) {
		try {
			const token = store.getState().authToken;
			const query: Response = await fetch(`${SettingsServices.API_URL}/settings/${name}`, {
				method: 'GET',
				headers: {
					'content-type': 'application/json;charset=UTF-8',
					Authorization: `Bearer ${token}`
				}
			});
			return await query.json();
		} catch (error) {
			return error;
		}
	}

	static async update(id: number, value: string | number) {
		try {
			const token: string = store.getState().authToken;
			const sql: string = `${SettingsServices.API_URL}/settings/${id}`;
			const query: Response = await fetch(sql, {
				method: 'PATCH',
				body: JSON.stringify({ value: value }),
				headers: {
					'content-type': 'application/json;charset=UTF-8',
					Authorization: `Bearer ${token}`
				}
			});
			return await query.json();
		} catch (error) {
			return error;
		}
	}
}
