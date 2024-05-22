import { FieldValues } from 'react-hook-form';
// import { IImage } from '@/lib/interfaces/image.interface';
import { store } from '@/services/store.services';
import { Roles } from '@/lib/constants';

export class ImageServices {
	static readonly API_URL: string = import.meta.env.VITE_REACT_BACKEND_API;

	static async findByProperty(id: number) {
		try {
			const token: string = store.getState().authToken;
			let sql: string = `${ImageServices.API_URL}/images/${id}/allByProperty`;
			if (store.getState().role === Roles.ADMIN) sql = `${ImageServices.API_URL}/images/${id}/allByPropertyWithDeleted`;
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

	static async create(id: number, data: FieldValues) {
		const formData: FormData = new FormData();
		formData.append('file', data as Blob);
		try {
			const token: string = store.getState().authToken;
			const sql: string = `${ImageServices.API_URL}/images/upload/${id}/`;
			const query: Response = await fetch(sql, {
				method: 'POST',
				body: formData,
				// No other headers because of boundary in multipart/form-data
				headers: { Authorization: `Bearer ${token}` }
			});
			return await query.json();
		} catch (error) {
			return error;
		}
	}

	static async removeSoft(id: number) {
		try {
			const token: string = store.getState().authToken;
			const sql: string = `${ImageServices.API_URL}/images/${id}/soft`;
			const query: Response = await fetch(sql, {
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
			const token: string = store.getState().authToken;
			const sql: string = `${ImageServices.API_URL}/images/${id}`;
			const query: Response = await fetch(sql, {
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
            const token: string = store.getState().authToken;
            const sql: string = `${ImageServices.API_URL}/images/${id}/restore`;
            const query: Response = await fetch(sql, {
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
