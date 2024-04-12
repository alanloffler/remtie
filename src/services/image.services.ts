import { FieldValues } from 'react-hook-form';
import { IImage } from '@/lib/interfaces/image.interface';
import { store } from './store.services';

export class ImageServices {
	static readonly API_URL: string = import.meta.env.VITE_REACT_BACKEND_API;

	static async getByProperty(id: number) {
		try {
			const token = store.getState().authToken;
			const query: Response = await fetch(ImageServices.API_URL + `/images/${id}/allByProperty`, {
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

	static async create(id: number, data: FieldValues) {
		const formData = new FormData();
		formData.append('file', data as Blob);
		try {
			const token: string = store.getState().authToken;
			const query: Response = await fetch(`${ImageServices.API_URL}/images/upload/${id}/`, {
				method: 'POST',
				body: formData,
				// No other headers because of boundary in multipart/form-data
				headers: { Authorization: 'Bearer ' + token }
			});
			return await query.json();
		} catch (e) {
			return e;
		}
	}

	static async deleteSoft(id: number) {
		try {
            const token: string = store.getState().authToken;
			const query: Response = await fetch(ImageServices.API_URL + `/images/${id}/soft`, {
				method: 'DELETE',
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
	static async delete(id: number) {
		try {
            const token: string = store.getState().authToken;
			const query: Response = await fetch(ImageServices.API_URL + `/images/${id}`, {
				method: 'DELETE',
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

	static async deleteMany(ids: IImage[]) {
		try {
			return await Promise.all(ids.map((image) => ImageServices.delete(image.id))).then((response) => {
				const allOk = response.some((response) => response.status === 400);
				if (allOk) {
					return { status: 400, message: '400 Bad Request | Images not deleted' };
				} else {
					return { status: 200, message: '200 OK | Images deleted' };
				}
			});
		} catch (e) {
			return e;
		}
	}
}
