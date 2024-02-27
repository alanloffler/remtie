// Categories service: used in the categories select input
class CategoriesService {
	readonly apiUrl: string = import.meta.env.VITE_REACT_BACKEND_API;

	async getCategories() {
		try {
			const query: Response = await fetch(this.apiUrl + '/ui/categories', {
				method: 'GET',
				headers: { 'content-type': 'application/json;charset=UTF-8' }
			});
            return await query.json();
		} catch (e) {
			return e;
		}
	}
}

export default new CategoriesService();