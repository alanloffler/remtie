import { Roles } from '@/lib/constants';
import { store } from '@/services/store.services';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const APP_URL: string = import.meta.env.VITE_APP_URL;

// React component
function Settings({ role }: { role: string }) {
	const navigate = useNavigate();

	useEffect(() => {
		if (role !== Roles.ADMIN) {
			navigate(`${APP_URL}/`);
		}
	}, [navigate, role]);
	return <>{store.getState().role === Roles.ADMIN && <div>Settings {role}</div>}</>;
}
// Export React component
export default Settings;
