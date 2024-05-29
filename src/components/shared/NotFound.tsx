// UI: Shadcn-ui (https://ui.shadcn.com/)
import { Button } from '@/components/ui/button';
import { ButtonsConfig } from '@/lib/config/buttons.config';
import { GeneralConfig } from '@/lib/config/general.config';
// App
import { useNavigate } from 'react-router-dom';
// React component
function NotFound() {
    const navigate = useNavigate();

	return (
		<div className='flex min-h-[75vh] w-full flex-col items-center justify-center space-y-4 py-6 text-center'>
			<div className='space-y-2'>
				<h1 className='text-4xl font-extrabold tracking-tighter sm:text-5xl'>{GeneralConfig.page404.title}</h1>
				<p className='mx-auto max-w-[600px] text-gray-500 dark:text-gray-400 md:text-xl/relaxed'>{GeneralConfig.page404.message}</p>
			</div>
			<Button variant='default' onClick={() => navigate(-1)} className='bg-sky-400 font-semibold uppercase shadow-md hover:bg-sky-500'>{ButtonsConfig.actions.back}</Button>
		</div>
	);
}
// Export React component
export default NotFound;