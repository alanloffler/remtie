// Icons: Lucide (https://lucide.dev/)
import { Home, LayoutDashboard, UserRound } from 'lucide-react';
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
                absolute 
                bottom-0
                top-0
                z-30 
                order-first 
                flex 
                w-48
                -translate-x-full
                flex-col 
                overflow-y-auto 
                border-r
                bg-white
                px-2
                py-4 
                transition
                duration-200
                ease-in-out 
                md:relative 
                md:w-48 
                md:translate-x-0`}>
			<div className='group flex w-full flex-col gap-4 py-2'>
				<div className='grid gap-1 px-2'>
					<Link to={`${appUrl}/`}>
						<Button variant='ghost' onClick={() => handleClick(1)} className={`w-full justify-start gap-2 ${clicked === 1 && ' bg-accent'}`}>
							<LayoutDashboard size='24' strokeWidth='2' className='h-4 w-4' />
							Tablero
						</Button>
					</Link>

					<Link to={`${appUrl}/productos`}>
						<Button variant='ghost' onClick={() => handleClick(2)} className={`w-full justify-start gap-2 ${clicked === 2 && ' bg-accent'}`}>
							<Home size='24' strokeWidth='2' className='h-4 w-4' />
							Productos
						</Button>
					</Link>

					<Link to={`${appUrl}/usuarios`}>
						<Button variant='ghost' onClick={() => handleClick(3)} className={`w-full justify-start gap-2 ${clicked === 3 && ' bg-accent'}`}>
							<UserRound size='24' strokeWidth='2' className='h-4 w-4' />
							Usuarios
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
