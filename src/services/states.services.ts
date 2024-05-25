import { store } from './store.services';

export class StatesServices {
	static readonly API_URL: string = import.meta.env.VITE_REACT_BACKEND_API;

	static async findAll() {
		try {
			const token = store.getState().authToken;
			const query: Response = await fetch(`${StatesServices.API_URL}/states`, {
				method: 'GET',
				headers: {
					'content-type': 'application/json;charset=UTF-8',
					Authorization: `Bearer ${token}`
				}
			});
			return await query.json();
		} catch (error) {
			return error;
		}
	}

    static async findAllAdmin() {
        try {
            const token = store.getState().authToken;
            const query: Response = await fetch(`${StatesServices.API_URL}/states/admin`, {
                method: 'GET',
                headers: {
                    'content-type': 'application/json;charset=UTF-8',
                    Authorization: `Bearer ${token}`
                }
            });
            return await query.json();
        } catch (error) {
            return error;
        }
    }
}