// Icons: Lucide (https://lucide.dev/)
import { Menu } from 'lucide-react';
// UI: Shadcn-ui (https://ui.shadcn.com/)
import { Button } from '@/components/ui/button';
// import { ModeToggle } from "@/components/ui/mode-toggle";
// App
import { LayoutConfig } from '@/lib/config/layout.config';
import { Link } from 'react-router-dom';
import { store } from '@/services/store.services';
// .env constants
const APP_URL: string = import.meta.env.VITE_APP_URL;
// React component
function Header() {
	const toggleOpen = store((state) => state.toggleOpen);

	return (
		<header className='flex h-[76px] pl-8 pr-5 items-center justify-between border-b border-slate-800 bg-slate-700 shadow-md shadow-slate-300'>
			<div className='hidden md:inline-flex lg:inline-flex'></div>
			<Link to={`${APP_URL}/`}>
				<h1 className='text-xl font-bold text-gray-200'>{LayoutConfig.appName}</h1>
			</Link>
			<div className='flex gap-5 items-center'>
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
