// import { IDashboardData } from '@/lib/interfaces/dashboard.interface';
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

	static async getLatestProperties(id: number) {
		try {
			const token: string = store.getState().authToken;
			const request: Response = await fetch(`${DashboardServices.API_URL}/properties/${id}/latest`, {
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

	// static async countByCreator() {
	// 	try {
	// 		const token: string = store.getState().authToken;
	// 		const request: Response = await fetch(`${DashboardServices.API_URL}/properties/dashboard/countByCreator`, {
	// 			method: 'GET',
	// 			headers: {
	// 				'content-type': 'application/json;charset=UTF-8',
	// 				Authorization: 'Bearer ' + token
	// 			}
	// 		});
	// 		return await request.json();
	// 	} catch (error) {
	// 		return error;
	// 	}
	// }

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
