import { IRoleForm } from '@/lib/interfaces/role.interface';
import { store } from '@/services/store.services';

export class RolesServices {
	static readonly API_URL: string = import.meta.env.VITE_REACT_BACKEND_API;

	static async findAll() {
		try {
			const token = store.getState().authToken;
			const query: Response = await fetch(`${RolesServices.API_URL}/roles`, {
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

	static async findOne(name: string) {
		try {
			const token = store.getState().authToken;
			const query: Response = await fetch(`${RolesServices.API_URL}/roles/${name}`, {
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

	static async create(data: IRoleForm) {
		try {
			const token = store.getState().authToken;
			const query: Response = await fetch(`${RolesServices.API_URL}/roles`, {
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

	static async update(id: number, data: IRoleForm) {
		try {
			const token = store.getState().authToken;
			const query: Response = await fetch(`${RolesServices.API_URL}/roles/${id}`, {
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

	static async remove(id: number) {
		try {
			const token = store.getState().authToken;
			const query: Response = await fetch(`${RolesServices.API_URL}/roles/${id}`, {
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
}
