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

    static async toggleFavorite(property: IProperty) {
        property.isFavorite = !property.isFavorite;
        if (FavoritesServices.abortController) FavoritesServices.abortController.abort();
        FavoritesServices.abortController = new AbortController();
        const signal: AbortSignal = FavoritesServices.abortController.signal;
        try {
            const token: string = store.getState().authToken;
            let sql: string = '';
            let method: string = '';
            if (property.isFavorite === false) {
                sql = `${FavoritesServices.API_URL}/favorites/${property.id}`;
                method = 'DELETE';
            } else {
                sql = `${FavoritesServices.API_URL}/favorites/${property.id}`;
                method = 'POST';
            }
            const query: Response = await fetch(sql, {
                method: method,
                signal: signal,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return await query.json();
        } catch (error) {
            return error;
        }
    }
}