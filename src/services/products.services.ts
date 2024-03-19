export class ProductsServices {
	static readonly apiUrl: string = import.meta.env.VITE_REACT_BACKEND_API;
	static abortController = new AbortController();

	static async getProducts() {
		try {
			const query: Response = await fetch(ProductsServices.apiUrl + '/properties', {
				method: 'GET',
				headers: { 'content-type': 'application/json;charset=UTF-8' }
			});
			return await query.json();
		} catch (error) {
			return error;
		}
	}

	static async getProduct(id: number) {
		try {
			const query: Response = await fetch(ProductsServices.apiUrl + '/properties/' + id, {
				method: 'GET',
				headers: { 'content-type': 'application/json;charset=UTF-8' }
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
            const createProduct: Response = await fetch(`${ProductsServices.apiUrl}/properties`, {
                method: 'POST',
                headers: { 'content-type': 'application/json;charset=UTF-8' },
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
			const productDeleted = await fetch(`${ProductsServices.apiUrl}/properties/${id}`, {
				method: 'DELETE',
				signal: signal
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
			const update: Response = await fetch(`${ProductsServices.apiUrl}/properties/${id}`, {
				method: 'PUT',
				headers: { 'content-type': 'application/json;charset=UTF-8' },
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
			const query: Response = await fetch(`${ProductsServices.apiUrl}/properties/${id}`, {
				method: 'PATCH',
				headers: { 'content-type': 'application/json;charset=UTF-8' },
				body: JSON.stringify({ active: active }),
				signal: signal
			});
			return await query.json();
		} catch (error) {
			return error;
		}
	}
}
