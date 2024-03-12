// TODO: change to a class like others services
// Imports
import { User } from '@/lib/interfaces';
import { store } from './store.services';
// .env constants
const apiUrl: string = import.meta.env.VITE_REACT_BACKEND_API;

async function GetAllUsers() {
	try {

		const token = store.getState().authToken;
		const query: Response = await fetch(apiUrl + '/users', {
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

async function CreateUser(data: User) {
	try {
		const query: Response = await fetch(apiUrl + '/auth/signup', {
			method: 'POST',
			headers: { 'content-type': 'application/json;charset=UTF-8' },
			body: JSON.stringify(data)
		});
		return await query.json();
	} catch (e) {
		return e;
	}
}

async function ReadUserService(id: string) {
	try {
        const token = store.getState().authToken;
		const query: Response = await fetch(apiUrl + '/users/' + Number(id), {
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

async function UpdateUserService(id: string, data: User) {
	try {
        const token = store.getState().authToken;
		const query: Response = await fetch(apiUrl + '/users/' + Number(id), {
			method: 'PUT',
			headers: {
				'content-type': 'application/json;charset=UTF-8',
				Authorization: 'Bearer ' + token
			},
			body: JSON.stringify(data)
		});
		return await query.json();
	} catch (e) {
		return e;
	}
}

async function DeleteUserService(id: string) {
	try {
        const token = store.getState().authToken;
		const query: Response = await fetch(apiUrl + '/users/' + Number(id), {
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

export { GetAllUsers, CreateUser, ReadUserService, UpdateUserService, DeleteUserService };
