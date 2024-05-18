import { IBusinessForm } from '@/lib/interfaces/inputs.interface';
import { store } from './store.services';

export class BusinessServices {
	static readonly API_URL: string = import.meta.env.VITE_REACT_BACKEND_API;

	static async findAllUI() {
		try {
			const token = store.getState().authToken;
			const query: Response = await fetch(`${BusinessServices.API_URL}/business`, {
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

    static async findAll() {
		try {
			const token = store.getState().authToken;
			const query: Response = await fetch(`${BusinessServices.API_URL}/business/withDeleted`, {
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

    static async create(data: IBusinessForm) {
		try {
			const token = store.getState().authToken;
			const query: Response = await fetch(`${BusinessServices.API_URL}/business`, {
				method: 'POST',
                body: JSON.stringify(data),
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
            const query: Response = await fetch(`${BusinessServices.API_URL}/business/${id}/restore`, {
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

	static async removeSoft(id: number) {
		try {
			const token = store.getState().authToken;
			const query: Response = await fetch(`${BusinessServices.API_URL}/business/${id}/soft`, {
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

    static async remove(id: number) {
		try {
			const token = store.getState().authToken;
			const query: Response = await fetch(`${BusinessServices.API_URL}/business/${id}`, {
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
}
