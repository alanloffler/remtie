// Icons: Lucide (https://lucide.dev/)
import { Home, UserRound } from 'lucide-react';
// UI: Shadcn-ui (https://ui.shadcn.com/)
import { Button } from '@/components/ui/button';
// App
import { store } from '@/services/store.services';
import { Link } from 'react-router-dom';
import UserLogged from '@/components/layout/UserLogged';
import { useEffect, useRef } from 'react';
// .env constants
const appUrl: string = import.meta.env.VITE_APP_URL;
// React component
function Sidebar() {
	const isOpen = store((state) => state.isOpen);
	const clicked = store((state) => state.clicked);
	const isClicked = store((state) => state.isClicked);
	const userId: number = store.getState().userId;
	const sidebarRef = useRef<HTMLDivElement>(null);

	function handleClick(item: number) {
		isClicked(item);
		if (isOpen === true) store.getState().toggleOpen();
	}

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (isOpen) {
				if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
					store.getState().toggleOpen();
				}
			}
		}

		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isOpen]);

	return (
		<nav
			ref={sidebarRef}
			className={`
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        w-46 
        md:w-46 
        absolute 
        bottom-0 
        top-0
        z-30
        order-first 
        -translate-x-full 
        overflow-y-auto
        border-r
        bg-white
        p-4 
        transition
        duration-200 
        ease-in-out 
        dark:border-[#2e2e2e]
        dark:bg-dark
        md:relative 
        md:translate-x-0`}>
			<div className='group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2'>
				<div className='grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2'>
					<Button asChild variant='ghost' onClick={() => handleClick(1)} className={clicked === 1 ? 'bg-accent' : ''}>
						<Link to={appUrl + '/productos'}>
							<Home size='24' strokeWidth='2' className='mr-2 h-4 w-4' />
							Productos
							<span className='ml-auto'></span>
						</Link>
					</Button>
					<Link to={appUrl + '/usuarios'} className='flex flex-col'>
						<Button variant='ghost' onClick={() => handleClick(2)} className={clicked === 2 ? 'bg-accent' : ''}>
							<UserRound size='24' strokeWidth='2' className='h=4 mr-2 w-4' />
							Usuarios
							<span className='ml-auto'></span>
						</Button>
					</Link>
				</div>
				<div className='fixed bottom-6 flex justify-between px-2'>
					<UserLogged user={userId} />
				</div>
			</div>
		</nav>
	);
}
// Export React component
export default Sidebar;
