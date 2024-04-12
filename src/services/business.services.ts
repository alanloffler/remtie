import { store } from "./store.services";

// Business service: used in the business type select input
export class BusinessServices {
	static readonly apiUrl: string = import.meta.env.VITE_REACT_BACKEND_API;

	static async getBusiness() {
		try {
            const token = store.getState().authToken;
			const query: Response = await fetch(`${BusinessServices.apiUrl}/business`, {
				method: 'GET',
				headers: {
                    'content-type': 'application/json;charset=UTF-8',
                    Authorization: 'Bearer ' + token
                }
			});
            return await query.json();
		} catch (e) {
			return e;
		}
	}
}