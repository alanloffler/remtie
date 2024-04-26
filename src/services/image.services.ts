import { FieldValues } from 'react-hook-form';
import { IImage } from '@/lib/interfaces/image.interface';
import { store } from '@/services/store.services';
import { Roles } from '@/lib/constants';

export class ImageServices {
	static readonly API_URL: string = import.meta.env.VITE_REACT_BACKEND_API;

	static async findByProperty(id: number) {
		try {
			const token = store.getState().authToken;
            let sql: string = '';
            if (store.getState().role === Roles.ADMIN) {
                sql = `${ImageServices.API_URL}/images/${id}/allByPropertyWithDeleted`;
            } else {
                sql = `${ImageServices.API_URL}/images/${id}/allByProperty`;
            }
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
		const formData = new FormData();
		formData.append('file', data as Blob);
		try {
			const token: string = store.getState().authToken;
			const query: Response = await fetch(`${ImageServices.API_URL}/images/upload/${id}/`, {
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
    // TODO RENAME FUNCTIONS
	static async removeSoft(id: number) {
		try {
            const token: string = store.getState().authToken;
			const query: Response = await fetch(`${ImageServices.API_URL}/images/${id}/soft`, {
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
			const query: Response = await fetch(`${ImageServices.API_URL}/images/${id}`, {
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

	static async removeMany(ids: IImage[]) {
		try {
			return await Promise.all(ids.map((image) => ImageServices.remove(image.id))).then((response) => {
				const allOk = response.some((response) => response.status === 400);
				if (allOk) {
					return { status: 400, message: '400 Bad Request | Images not deleted' };
				} else {
					return { status: 200, message: '200 OK | Images deleted' };
				}
			});
		} catch (error) {
			return error;
		}
	}
}
