// Icons: Lucide (https://lucide.dev/)
import { LogOut, Menu } from 'lucide-react';
// UI: Shadcn-ui (https://ui.shadcn.com/)
import { Button } from '@/components/ui/button';
// import { ModeToggle } from "@/components/ui/mode-toggle";
// App
import { Link, useNavigate } from 'react-router-dom';
import { store } from '@/services/store.services';
// .env constants
const appUrl: string = import.meta.env.VITE_APP_URL;
// React component
function Header() {
	const toggleOpen = store((state) => state.toggleOpen);
	const reset = store((state) => state.reset);
	const navigate = useNavigate();

	function Logout() {
		reset();
		navigate(0);
	}

	return (
		<header className='flex h-[76px] pl-8 pr-5 items-center justify-between border-b border-slate-800 bg-slate-700 shadow-md shadow-slate-300'>
			<div className='hidden md:inline-flex lg:inline-flex'></div>
			<Link to={appUrl} onClick={reset}>
				<h1 className='text-xl font-bold text-gray-200'>Room 202</h1>
			</Link>
			<div className='flex gap-5 items-center'>
				<Button variant='default' size='sm' onClick={() => Logout()} className='h-9 md:mr-1 bg-slate-300 text-sm text-slate-600 border border-slate-400 hover:bg-slate-200 hover:border-slate-200'>
					<LogOut strokeWidth='2.5' className='w-4 h-4 mr-2' />
                    Salir
				</Button>
				{/* <ModeToggle /> */}
				<Button onClick={toggleOpen} className='h-10 mobile-menu-button align-middle bg-slate-800 hover:bg-slate-900 border border-slate-900 hover:border-slate-900 focus:outline-none md:hidden'>
					<Menu />
				</Button>
			</div>
		</header>
	);
}
// Export React component
export default Header;
