import { store } from './store.services';

export class DashboardServices {
	static readonly API_URL: string = import.meta.env.VITE_REACT_BACKEND_API;

	static async getPropertiesByCategory() {
		try {
			const token: string = store.getState().authToken;
			const request: Response = await fetch(`${DashboardServices.API_URL}/properties/dashboard/propertiesByCategories`, {
				method: 'GET',
				headers: {
					'content-type': 'application/json;charset=UTF-8',
					Authorization: 'Bearer ' + token
				}
			});
			return await request.json();
		} catch (error) {
			return error;
		}
	}

	static async getLatestProperties(id: number, owner: string) {
		let url: string = '';
		owner === '0' ? (url = 'latest') : (url = 'latestActiveUser');
		try {
			const token: string = store.getState().authToken;
			const request: Response = await fetch(`${DashboardServices.API_URL}/properties/${id}/${url}`, {
				method: 'GET',
				headers: {
					'content-type': 'application/json;charset=UTF-8',
					Authorization: 'Bearer ' + token
				}
			});
			return await request.json();
		} catch (error) {
			return error;
		}
	}

	static async getHeaderData() {
		try {
			const token: string = store.getState().authToken;
			const request: Response = await fetch(`${DashboardServices.API_URL}/properties/dashboard/dashboardStats`, {
				method: 'GET',
				headers: {
					'content-type': 'application/json;charset=UTF-8',
					Authorization: 'Bearer ' + token
				}
			});
			return await request.json();
		} catch (error) {
			return error;
		}
	}
}
