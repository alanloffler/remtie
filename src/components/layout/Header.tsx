// Icons: Lucide (https://lucide.dev/)
import { Menu } from 'lucide-react';
// UI: Shadcn-ui (https://ui.shadcn.com/)
import { Button } from '@/components/ui/button';
// import { ModeToggle } from "@/components/ui/mode-toggle";
// App
import { Link, useNavigate } from 'react-router-dom';
import { store } from '@/services/store.services';
import UserHeader from '@/components/layout/UserHeader';
// .env constants
const appUrl: string = import.meta.env.VITE_APP_URL;
// React component
function Header() {
	const toggleOpen = store((state) => state.toggleOpen);
	const reset = store((state) => state.reset);
	const navigate = useNavigate();
	const userId: number = store.getState().userId;

	function Logout() {
		reset();
		navigate(0);
	}

	return (
		<header className='flex h-16 items-center justify-between border-b bg-white p-4 dark:border-[#2e2e2e] dark:bg-dark'>
			<div className='hidden md:inline-flex lg:inline-flex'></div>
			<Link to={appUrl} onClick={reset}>
				<h1 className='text-xl font-bold'>Room 202</h1>
			</Link>
			<div className='flex gap-3 align-middle'>
				<UserHeader user={userId} />
				<Button variant='outline' onClick={() => Logout()}>
					Salir
				</Button>
				{/* <ModeToggle /> */}
				<Button onClick={toggleOpen} className='mobile-menu-button align-middle hover:bg-gray-700 focus:outline-none md:hidden'>
					<Menu />
				</Button>
			</div>
		</header>
	);
}
// Export React component
export default Header;
