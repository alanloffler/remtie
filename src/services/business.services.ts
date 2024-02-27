// Business service: used in the business type select input
class BusinessService {
	readonly apiUrl: string = import.meta.env.VITE_REACT_BACKEND_API;

	async getBusiness() {
		try {
			const query: Response = await fetch(this.apiUrl + '/ui/business', {
				method: 'GET',
				headers: { 'content-type': 'application/json;charset=UTF-8' }
			});
            return await query.json();
		} catch (e) {
			return e;
		}
	}
}

export default new BusinessService();
