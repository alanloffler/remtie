// App
import { IUserCreate } from '@/lib/interfaces/user.interface';
import { store } from './store.services';
import { Roles } from '@/lib/constants';
// Service class
export class UsersServices {
	static readonly #API_URL = import.meta.env.VITE_REACT_BACKEND_API;

	static async create(data: IUserCreate) {
		try {
			const token = store.getState().authToken;
			const query: Response = await fetch(`${UsersServices.#API_URL}/auth/register`, {
				method: 'POST',
				headers: {
					'content-type': 'application/json;charset=UTF-8',
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify(data)
			});
			return await query.json();
		} catch (e) {
			return e;
		}
	}

	static async getAll() {
		try {
			const token = store.getState().authToken;
			const query: Response = await fetch(`${UsersServices.#API_URL}/users`, {
				method: 'GET',
				headers: {
					'content-type': 'application/json;charset=UTF-8',
					Authorization: `Bearer ${token}`
				}
			});
			return await query.json();
		} catch (e) {
			return e;
		}
	}

	static async findOne(id: number) {
		try {
			const token = store.getState().authToken;
			let url: string = '';
			if (store.getState().role === Roles.ADMIN) {
				url = `${UsersServices.#API_URL}/users/${id}/withDeleted`;
			} else {
				url = `${UsersServices.#API_URL}/users/${id}`;
			}
			const query: Response = await fetch(url, {
				method: 'GET',
				headers: {
					'content-type': 'application/json;charset=UTF-8',
					Authorization: `Bearer ${token}`
				}
			});
			return await query.json();
		} catch (e) {
			return e;
		}
	}

	static async update(id: number, data: IUserCreate) {
		try {
			const token = store.getState().authToken;
			const query: Response = await fetch(`${UsersServices.#API_URL}/users/${id}`, {
				method: 'PATCH',
				headers: {
					'content-type': 'application/json;charset=UTF-8',
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify(data)
			});
			return await query.json();
		} catch (e) {
			return e;
		}
	}

	static async restore(id: number) {
		try {
			const token = store.getState().authToken;
			const query: Response = await fetch(`${UsersServices.#API_URL}/users/${id}/restore`, {
				method: 'PATCH',
				headers: {
					'content-type': 'application/json;charset=UTF-8',
					Authorization: `Bearer ${token}`
				}
			});
			return await query.json();
		} catch (e) {
			return e;
		}
	}

	static async removeSoft(id: number) {
		try {
			const token = store.getState().authToken;
			const query: Response = await fetch(`${UsersServices.#API_URL}/users/${id}/soft`, {
				method: 'DELETE',
				headers: {
					'content-type': 'application/json;charset=UTF-8',
					Authorization: `Bearer ${token}`
				}
			});
			return await query.json();
		} catch (e) {
			return e;
		}
	}

	static async remove(id: number) {
		try {
			const token = store.getState().authToken;
			const query: Response = await fetch(`${UsersServices.#API_URL}/users/${id}`, {
				method: 'DELETE',
				headers: {
					'content-type': 'application/json;charset=UTF-8',
					Authorization: `Bearer ${token}`
				}
			});
			return await query.json();
		} catch (e) {
			return e;
		}
	}
}
