class ProductsServices {
	readonly apiUrl: string = import.meta.env.VITE_REACT_BACKEND_API;

	async getProducts() {
		try {
			const query: Response = await fetch(this.apiUrl + '/properties', {
				method: 'GET',
				headers: { 'content-type': 'application/json;charset=UTF-8' }
			});
			return await query.json();
		} catch (e) {
			return e;
		}
	}
}

export default new ProductsServices();
