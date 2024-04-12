import { store } from "./store.services";

export class ProductsServices {
	static readonly API_URL: string = import.meta.env.VITE_REACT_BACKEND_API;
	static abortController = new AbortController();

	static async getProducts() {
		try {
            const token = store.getState().authToken;
			const query: Response = await fetch(`${ProductsServices.API_URL}/properties`, {
				method: 'GET',
				headers: { 
                    'content-type': 'application/json;charset=UTF-8',
                    Authorization: 'Bearer ' + token
                }
			});
			return await query.json();
		} catch (error) {
			return error;
		}
	}

	static async getProduct(id: number) {
		try {
            const token = store.getState().authToken;
			const query: Response = await fetch(`${ProductsServices.API_URL}/properties/${id}`, {
				method: 'GET',
				headers: {
                    'content-type': 'application/json;charset=UTF-8',
                    Authorization: 'Bearer ' + token
                }
			});
			return await query.json();
		} catch (error) {
			return error;
		}
	}

	static async create(data: object) {
        const token = store.getState().authToken;
		if (ProductsServices.abortController) ProductsServices.abortController.abort();
		ProductsServices.abortController = new AbortController();
		const signal: AbortSignal = ProductsServices.abortController.signal;

		try {
			const createProduct: Response = await fetch(`${ProductsServices.API_URL}/properties`, {
				method: 'POST',
				headers: {
                    'content-type': 'application/json;charset=UTF-8',
                    Authorization: 'Bearer ' + token
                },
				body: JSON.stringify(data),
				signal: signal
			});
			return await createProduct.json();
		} catch (error) {
			return error;
		}
	}

	static async deleteProduct(id: number) {
		if (ProductsServices.abortController) ProductsServices.abortController.abort();
		ProductsServices.abortController = new AbortController();
		const signal = ProductsServices.abortController.signal;

		try {
            const token = store.getState().authToken;
			const productDeleted = await fetch(`${ProductsServices.API_URL}/properties/${id}/soft`, {
				method: 'DELETE',
				signal: signal,
                headers: {
                    Authorization: 'Bearer ' + token
                }
			});
			return await productDeleted.json();
		} catch (error) {
			return error;
		}
	}

	static async update(id: number, data: object) {
		if (ProductsServices.abortController) ProductsServices.abortController.abort();
		ProductsServices.abortController = new AbortController();
		const signal: AbortSignal = ProductsServices.abortController.signal;

		try {
            const token = store.getState().authToken;
			const update: Response = await fetch(`${ProductsServices.API_URL}/properties/${id}`, {
				method: 'PATCH',
				headers: {
                    'content-type': 'application/json;charset=UTF-8',
                    Authorization: 'Bearer ' + token
                },
				body: JSON.stringify(data),
				signal: signal
			});
			return await update.json();
		} catch (error) {
			return error;
		}
	}

	static async switchActive(id: number, active: boolean) {
		if (ProductsServices.abortController) ProductsServices.abortController.abort();
		ProductsServices.abortController = new AbortController();
		const signal = ProductsServices.abortController.signal;

		try {
            const token = store.getState().authToken;
			const query: Response = await fetch(`${ProductsServices.API_URL}/properties/${id}/active`, {
				method: 'PATCH',
				headers: {
                    'content-type': 'application/json;charset=UTF-8',
                    Authorization: 'Bearer ' + token
                },
				body: JSON.stringify({ is_active: active === true ? 1 : 0 }),
				signal: signal
			});
			return await query.json();
		} catch (error) {
			return error;
		}
	}
}
