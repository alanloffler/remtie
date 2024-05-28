import { IProperty } from '@/lib/interfaces/property.interface';
import { store } from '@/services/store.services';

export class FavoritesServices {
	static readonly API_URL: string = import.meta.env.VITE_REACT_BACKEND_API;
	static abortController: AbortController = new AbortController();

	static async findAll() {
		try {
			const token: string = store.getState().authToken;
			const sql: string = `${FavoritesServices.API_URL}/favorites`;
			const query: Response = await fetch(sql, {
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

	static async findOne(id: number) {
		try {
			const token: string = store.getState().authToken;
			const sql: string = `${FavoritesServices.API_URL}/favorites/${id}`;
			const query: Response = await fetch(sql, {
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

    static async createFavorite(property: IProperty) {
        if (FavoritesServices.abortController) FavoritesServices.abortController.abort();
		FavoritesServices.abortController = new AbortController();
		const signal: AbortSignal = FavoritesServices.abortController.signal;
        try {
            const token: string = store.getState().authToken;
            const sql: string = `${FavoritesServices.API_URL}/favorites/${property.id}`;
            const query: Response = await fetch(sql, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json;charset=UTF-8',
                    Authorization: `Bearer ${token}`
                },
                signal: signal
            });
            return await query.json();
        } catch (error) {
            return error;
        }
    }

    static async removeFavorite(property: IProperty) {
        if (FavoritesServices.abortController) FavoritesServices.abortController.abort();
		FavoritesServices.abortController = new AbortController();
		const signal: AbortSignal = FavoritesServices.abortController.signal;
        try {
            const token: string = store.getState().authToken;
            const sql: string = `${FavoritesServices.API_URL}/favorites/${property.id}`;
            const query: Response = await fetch(sql, {
                method: 'DELETE',
                headers: {
                    'content-type': 'application/json;charset=UTF-8',
                    Authorization: `Bearer ${token}`
                },
                signal: signal
            });
            return await query.json();
        } catch (error) {
            return error;
        }
    }
}
