import { IImage } from '@/lib/interfaces';
import { FieldValues } from 'react-hook-form';

export class ImageServices {
	static readonly apiUrl: string = import.meta.env.VITE_REACT_BACKEND_API;

	static async getByProperty(id: number) {
		try {
			const query: Response = await fetch(ImageServices.apiUrl + `/images/${id}`, {
				method: 'GET',
				headers: { 'content-type': 'application/json;charset=UTF-8' }
			});
			return await query.json();
		} catch (e) {
			return e;
		}
	}

	static async create(id: number, data: FieldValues) {
		console.log(data, id);
		const formData = new FormData();
		formData.append('file', data as Blob);
		try {
			const query: Response = await fetch(ImageServices.apiUrl + '/images/' + Number(id), {
				method: 'POST',
				// No headers because of boundary in multipart/form-data
				body: formData
			});
			return await query.json();
		} catch (e) {
			return e;
		}
	}

	static async delete(id: number) {
		try {
			const query: Response = await fetch(ImageServices.apiUrl + `/images/${id}`, {
				method: 'DELETE',
				headers: { 'content-type': 'application/json;charset=UTF-8' }
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
