import { ICityForm } from '@/lib/interfaces/city.interface';
import { store } from './store.services';

export class CitiesServices {
	static readonly API_URL: string = import.meta.env.VITE_REACT_BACKEND_API;

	static async create(data: ICityForm) {
		try {
			const token = store.getState().authToken;
			const query: Response = await fetch(`${CitiesServices.API_URL}/cities`, {
				method: 'POST',
				body: JSON.stringify(data),
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

	static async findAll() {
		try {
			const token = store.getState().authToken;
			const query: Response = await fetch(`${CitiesServices.API_URL}/cities`, {
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

	static async findAllAdmin() {
		try {
			const token = store.getState().authToken;
			const query: Response = await fetch(`${CitiesServices.API_URL}/cities/admin`, {
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

	static async update(id: number, values: ICityForm) {
		try {
			const token = store.getState().authToken;
			const query: Response = await fetch(`${CitiesServices.API_URL}/cities/${id}`, {
				method: 'PATCH',
				body: JSON.stringify(values),
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

	static async remove(id: number) {
		try {
			const token = store.getState().authToken;
			const query: Response = await fetch(`${CitiesServices.API_URL}/cities/${id}`, {
				method: 'DELETE',
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

	static async removeSoft(id: number) {
		try {
			const token = store.getState().authToken;
			const query: Response = await fetch(`${CitiesServices.API_URL}/cities/${id}/soft`, {
				method: 'DELETE',
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

	static async restore(id: number) {
		try {
			const token = store.getState().authToken;
			const query: Response = await fetch(`${CitiesServices.API_URL}/cities/${id}/restore`, {
				method: 'PATCH',
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
