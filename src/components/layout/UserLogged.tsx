// Imports
import { useEffect, useState } from 'react';
import { ReadUserService } from '@/services/users.services';
import Dot from '@/components/shared/Dot';
import { IUser } from '@/lib/interfaces/user.interface';
import { useNavigate } from 'react-router-dom';
// React component
function UserLogged({ user }: { user: number }) {
	const [actualUser, setActualUser] = useState<IUser>();
	const navigate = useNavigate();

	useEffect(() => {
		function getUser() {
			ReadUserService(String(user)).then((data) => {
				if (data instanceof Error || data.status === 401) navigate('/');
				if (data) setActualUser(data);
			});
		}
		getUser();
	}, [navigate, user]);

	return (
		<div className='mr-2 flex items-center'>
			<Dot type={actualUser?.type} text={actualUser?.name.charAt(0).toUpperCase()} width='24px' />
			<div className='ml-2 flex text-sm text-slate-400'>{actualUser?.name}</div>
		</div>
	);
}
// Export React component
export default UserLogged;
