// App
import Dot from '@/components/shared/Dot';
import { IUser } from '@/lib/interfaces/user.interface';
import { UsersServices } from '@/services/users.services';
import { store } from '@/services/store.services';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// .env constants
const APP_URL: string = import.meta.env.VITE_APP_URL;
// React component
function UserLogged({ user }: { user: number }) {
	const [actualUser, setActualUser] = useState<IUser>();
	const navigate = useNavigate();

	useEffect(() => {
		function getUser() {
			UsersServices.findOne(user).then((data) => {
                if (data.id) {
                    setActualUser(data);
                    store.setState({ username: data.name });
                }
                if (data.statusCode > 399 || data instanceof Error) navigate(`${APP_URL}`);
			});
		}
		getUser();
	}, [navigate, user]);

	return (
		<div className='flex items-center space-x-2'>
			<Dot role={actualUser?.role} text={actualUser?.name.charAt(0).toUpperCase()} width='20px' />
			<div className='text-sm text-slate-500'>{actualUser?.name}</div>
		</div>
	);
}
// Export React component
export default UserLogged;
