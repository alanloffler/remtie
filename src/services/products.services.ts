import { Roles } from '@/lib/constants';
import { store } from '@/services/store.services';

export class ProductsServices {
	static readonly API_URL: string = import.meta.env.VITE_REACT_BACKEND_API;
	static abortController: AbortController = new AbortController();

	static async findAll() {
		try {
			const token: string = store.getState().authToken;
			const sql: string = `${ProductsServices.API_URL}/properties`;
			const query: Response = await fetch(sql, {
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

	static async findOne(id: number) {
		try {
			const token: string = store.getState().authToken;
			let sql: string = `${ProductsServices.API_URL}/properties/${id}`;
			if (store.getState().role === Roles.ADMIN) sql = `${ProductsServices.API_URL}/properties/${id}/withDeleted`;
			const query: Response = await fetch(sql, {
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

	static async create(data: object) {
		if (ProductsServices.abortController) ProductsServices.abortController.abort();
		ProductsServices.abortController = new AbortController();
		const signal: AbortSignal = ProductsServices.abortController.signal;
		try {
			const token: string = store.getState().authToken;
			const sql: string = `${ProductsServices.API_URL}/properties`;
			const query: Response = await fetch(sql, {
				method: 'POST',
				signal: signal,
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

	static async update(id: number, data: object) {
		if (ProductsServices.abortController) ProductsServices.abortController.abort();
		ProductsServices.abortController = new AbortController();
		const signal: AbortSignal = ProductsServices.abortController.signal;
		try {
			const token: string = store.getState().authToken;
			const sql: string = `${ProductsServices.API_URL}/properties/${id}`;
			const query: Response = await fetch(sql, {
				method: 'PATCH',
				signal: signal,
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

	static async restore(id: number) {
		if (ProductsServices.abortController) ProductsServices.abortController.abort();
		ProductsServices.abortController = new AbortController();
		const signal: AbortSignal = ProductsServices.abortController.signal;
		try {
			const token: string = store.getState().authToken;
			const sql: string = `${ProductsServices.API_URL}/properties/${id}/restore`;
			const query: Response = await fetch(sql, {
				method: 'PATCH',
				signal: signal,
				headers: {
					Authorization: `Bearer ${token}`
				}
			});
			return await query.json();
		} catch (error) {
			return error;
		}
	}

	static async removeSoft(id: number) {
		if (ProductsServices.abortController) ProductsServices.abortController.abort();
		ProductsServices.abortController = new AbortController();
		const signal: AbortSignal = ProductsServices.abortController.signal;
		try {
			const token: string = store.getState().authToken;
			const sql: string = `${ProductsServices.API_URL}/properties/${id}/soft`;
			const query: Response = await fetch(sql, {
				method: 'DELETE',
				signal: signal,
				headers: {
					Authorization: `Bearer ${token}`
				}
			});
			return await query.json();
		} catch (error) {
			return error;
		}
	}

	static async remove(id: number) {
		if (ProductsServices.abortController) ProductsServices.abortController.abort();
		ProductsServices.abortController = new AbortController();
		const signal: AbortSignal = ProductsServices.abortController.signal;
		try {
			const token: string = store.getState().authToken;
			const sql: string = `${ProductsServices.API_URL}/properties/${id}`;
			const query: Response = await fetch(sql, {
				method: 'DELETE',
				signal: signal,
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

	static async switchActive(id: number, active: boolean) {
		if (ProductsServices.abortController) ProductsServices.abortController.abort();
		ProductsServices.abortController = new AbortController();
		const signal: AbortSignal = ProductsServices.abortController.signal;
		try {
			const token: string = store.getState().authToken;
			const sql: string = `${ProductsServices.API_URL}/properties/${id}/active`;
			const query: Response = await fetch(sql, {
				method: 'PATCH',
				signal: signal,
				body: JSON.stringify({ is_active: active === true ? 1 : 0 }),
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
