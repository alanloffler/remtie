// App
import Dot from '@/components/shared/Dot';
import { IUser } from '@/lib/interfaces/user.interface';
import { UsersServices } from '@/services/users.services';
import { store } from '@/services/store.services';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// React component
function UserLogged({ user }: { user: number }) {
	const [actualUser, setActualUser] = useState<IUser | undefined>();
	const navigate = useNavigate();

	useEffect(() => {
		function getUser() {
			UsersServices.findOne(user).then((data) => {
				if (data instanceof Error || data.status === 401) navigate('/');
				if (data) setActualUser(data);
                store.setState({ username: data.name });
			});
		}
		getUser();
	}, [navigate, user]);

	return (
		<div className='mr-2 flex items-center'>
			<Dot role={actualUser?.role} text={actualUser?.name.charAt(0).toUpperCase()} width='24px' />
			<div className='ml-2 flex text-sm text-slate-400'>{actualUser?.name}</div>
		</div>
	);
}
// Export React component
export default UserLogged;
