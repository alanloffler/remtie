// Icons: Lucide (https://lucide.dev/)
import { ArrowLeft } from 'lucide-react';
// UI: Shadcn-ui (https://ui.shadcn.com/)
import { Button } from '@/components/ui/button';
// App
import StickyMenu from '@/components/settings/StickyMenu';
import { Outlet, useNavigate } from 'react-router-dom';
import { Roles } from '@/lib/constants';
import { SettingsConfig } from '@/lib/config/settings.config';
import { store } from '@/services/store.services';
import { useEffect } from 'react';
// .env constants
const APP_URL: string = import.meta.env.VITE_APP_URL;
// React component
function Settings() {
	const navigate = useNavigate();

	useEffect(() => {
		if (store.getState().role !== Roles.ADMIN) navigate(`${APP_URL}/`);
	}, [navigate]);

	return (
		<main className='flex-1 overflow-y-auto animate-fadeIn'>
			<div className='flex flex-row items-center justify-between px-8 pt-8'>
				<h1 className='text-2xl font-normal text-slate-600'>{SettingsConfig.title}</h1>
				<Button variant='ghost' size='sm' onClick={() => navigate(-1)}>
					<ArrowLeft className='mr-2 h-4 w-4' />
					{SettingsConfig.buttons.back}
				</Button>
			</div>
			<section className='mt-8 w-full px-2'>
				<div className='flex flex-col mx-auto px-4 md:px-6 '>
					<StickyMenu className='w-full' />
					<div className='mt-6'>
						<Outlet />
					</div>
				</div>
			</section>
		</main>
	);
}
// Export React component
export default Settings;
