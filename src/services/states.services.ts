import { IStateForm } from '@/lib/interfaces/state.interface';
import { store } from './store.services';

export class StatesServices {
	static readonly API_URL: string = import.meta.env.VITE_REACT_BACKEND_API;
    
    static async create(values: IStateForm) {
        try {
            const token = store.getState().authToken;
            const query: Response = await fetch(`${StatesServices.API_URL}/states`, {
                method: 'POST',
                body: JSON.stringify(values),
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

    static async update(id: number, values: IStateForm) {
        try {
            const token = store.getState().authToken;
            const query: Response = await fetch(`${StatesServices.API_URL}/states/${id}`, {
                method: 'PATCH',
                body: JSON.stringify(values),
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

    static async remove(id: number) {
        try {
            const token = store.getState().authToken;
            const query: Response = await fetch(`${StatesServices.API_URL}/states/${id}`, {
                method: 'DELETE',
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

    static async removeSoft(id: number) {
        try {
            const token = store.getState().authToken;
            const query: Response = await fetch(`${StatesServices.API_URL}/states/${id}/soft`, {
                method: 'DELETE',
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

    static async restore(id: number) {
        try {
            const token = store.getState().authToken;
            const query: Response = await fetch(`${StatesServices.API_URL}/states/${id}/restore`, {
                method: 'PATCH',
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