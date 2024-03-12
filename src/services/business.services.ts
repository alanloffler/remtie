// Business service: used in the business type select input
export class BusinessServices {
	static readonly apiUrl: string = import.meta.env.VITE_REACT_BACKEND_API;

	static async getBusiness() {
		try {
			const query: Response = await fetch(`${BusinessServices.apiUrl}/ui/business`, {
				method: 'GET',
				headers: { 'content-type': 'application/json;charset=UTF-8' }
			});
            return await query.json();
		} catch (e) {
			return e;
		}
	}
}