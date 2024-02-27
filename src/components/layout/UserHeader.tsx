// App
import { useEffect, useState } from 'react';
import { ReadUserService } from '@/services/users.services';
// React component
function UserHeader({ user }: { user: number }) {
	const [bgColor, setBgColor] = useState<string>('');
	const [actualUser, setActualUser] = useState<string>('');
	const [firstLetter, setFirstLetter] = useState<string>('');

	useEffect(() => {
		function getUser() {
			ReadUserService(String(user)).then((data) => {
				if (data) {
					setActualUser(data.name);
					setFirstLetter(data.type.charAt(0));
					data.type === 'admin' ? setBgColor('bg-rose-600') : setBgColor('bg-sky-600');
				}
			});
		}
		getUser();
	}, [user]);

	return (
		<div className='mr-4 flex items-center'>
			<div className={'mr-2 flex h-6 w-6 items-center justify-center rounded-full text-sm font-semibold uppercase ' + bgColor}>{firstLetter}</div>
			<div className='flex text-sm font-semibold'>{actualUser}</div>
		</div>
	);
}
// Export React component
export default UserHeader;
