export class DashboardServices {
	static readonly apiUrl: string = import.meta.env.VITE_REACT_BACKEND_API;

	static async getPropertiesByCategory() {
		try {
			const request: Response = await fetch(`${DashboardServices.apiUrl}/dashboard/properties/categories`, {
				method: 'GET'
			});
			return await request.json();
		} catch (error) {
			return error;
		}
	}

	static async getLatestProperties(id: number) {
		try {
			const request: Response = await fetch(`${DashboardServices.apiUrl}/dashboard/properties/latest/${id}`, {
				method: 'GET'
			});
			return await request.json();
		} catch (error) {
			return error;
		}
	}
}
