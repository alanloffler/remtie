// Categories service: used in the categories select input
export class CategoriesServices {
	static readonly apiUrl: string = import.meta.env.VITE_REACT_BACKEND_API;

	static async getCategories() {
		try {
			const query: Response = await fetch(`${CategoriesServices.apiUrl}/ui/categories`, {
				method: 'GET',
				headers: { 'content-type': 'application/json;charset=UTF-8' }
			});
            return await query.json();
		} catch (e) {
			return e;
		}
	}
}