// Icons: Lucide (https://lucide.dev/)
import { EllipsisVertical, FilePenIcon, Home, LayoutDashboard, LogOut, MapPinned, Settings, UserRound } from 'lucide-react';
// UI: Shadcn-ui (https://ui.shadcn.com/)
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
// App
import UserLogged from '@/components/layout/UserLogged';
import { LayoutConfig } from '@/lib/config/layout.config';
import { Link, useNavigate } from 'react-router-dom';
import { Roles } from '@/lib/constants';
import { Separator } from '@/components/ui/separator';
import { store } from '@/services/store.services';
import { useEffect, useRef } from 'react';
// .env constants
const APP_URL: string = import.meta.env.VITE_APP_URL;
// React component
function Sidebar() {
	const clicked = store((state) => state.clicked);
	const isClicked = store((state) => state.isClicked);
	const isOpen = store((state) => state.isOpen);
	const navigate = useNavigate();
	const reset = store((state) => state.reset);
	const role = store((state) => state.role);
	const sidebarRef = useRef<HTMLDivElement>(null);
	const userId: number = store.getState().userId;

	function handleClick(item: number) {
		isClicked(item);
		if (isOpen === true) store.getState().toggleOpen();
		if (item === 10) {
			sessionStorage.removeItem('sticky-menu');
			sessionStorage.setItem('sticky-menu', '1');
		}
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

	function Logout() {
		reset();
		navigate(0);
	}

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
                w-52
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
                md:w-52 
                md:translate-x-0`}>
			<div className='group flex w-full flex-col gap-4 py-2'>
				<div className='fixed left-0 top-0 h-12 w-full bg-slate-100'></div>
				<div className='fixed left-0 top-0 flex h-12 w-full flex-row items-center justify-between px-3'>
					<UserLogged user={userId} />
					<DropdownMenu>
						<Button variant='ghost' size='miniIcon' className='hover:bg-slate-200 focus-visible:ring-transparent focus-visible:ring-offset-0' asChild>
							<DropdownMenuTrigger>
								<EllipsisVertical strokeWidth='2' className='h-4 w-4 text-slate-500' />
							</DropdownMenuTrigger>
						</Button>
						<DropdownMenuContent align='end'>
							<DropdownMenuItem className='gap-2 text-xs' onClick={() => navigate(`${APP_URL}/usuario/${userId}`)}>
								<UserRound strokeWidth='2' className='h-4 w-4' />
								{LayoutConfig.userLogged.profile}
							</DropdownMenuItem>
							<DropdownMenuItem className='gap-2 text-xs' onClick={() => navigate(`${APP_URL}/usuario/modificar/${userId}`)}>
								<Settings strokeWidth='2' className='h-4 w-4' />
								{LayoutConfig.userLogged.edit}
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem className='gap-2 text-xs' onClick={Logout}>
								<LogOut strokeWidth='2' className='h-4 w-4' />
								{LayoutConfig.userLogged.logout}
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
				<div className='mt-8 grid gap-1 px-1 py-1'>
					<Link to={`${APP_URL}/`}>
						<Button variant='ghost' onClick={() => handleClick(0)} className={`w-full justify-start gap-2 pl-2 ${clicked === 0 && ' bg-accent'}`}>
							<Home size='24' strokeWidth='2' className='h-4 w-4' />
							{LayoutConfig.sidebar.menu.allProducts}
						</Button>
					</Link>
					<Link to={`${APP_URL}/mapa`}>
						<Button variant='ghost' onClick={() => handleClick(4)} className={`w-full justify-start gap-2 pl-2 ${clicked === 4 && ' bg-accent'}`}>
							<MapPinned size='24' strokeWidth='2' className='h-4 w-4' />
							{LayoutConfig.sidebar.menu.map}
						</Button>
					</Link>
					<Link to={`${APP_URL}/tablero`}>
						<Button variant='ghost' onClick={() => handleClick(1)} className={`w-full justify-start gap-2 pl-2 ${clicked === 1 && ' bg-accent'}`}>
							<LayoutDashboard size='24' strokeWidth='2' className='h-4 w-4' />
							{LayoutConfig.sidebar.menu.dashboard}
						</Button>
					</Link>
					<Link to={`${APP_URL}/productos`}>
						<Button variant='ghost' onClick={() => handleClick(2)} className={`flex w-full flex-row place-items-center justify-start gap-2 pl-2 ${clicked === 2 && ' bg-accent'}`}>
							<FilePenIcon size='24' strokeWidth='2' className='h-4 w-4' />
							{LayoutConfig.sidebar.menu.products}
						</Button>
					</Link>
					<Link to={`${APP_URL}/usuarios`}>
						<Button variant='ghost' onClick={() => handleClick(3)} className={`w-full justify-start gap-2 pl-2 ${clicked === 3 && ' bg-accent'}`}>
							<UserRound size='24' strokeWidth='2' className='h-4 w-4' />
							{LayoutConfig.sidebar.menu.users}
						</Button>
					</Link>
					{role === Roles.ADMIN && (
						<>
							<Separator className='my-4 h-[1px] bg-slate-200' />
							<Link to={`${APP_URL}/config/productos`}>
								<Button variant='ghost' onClick={() => handleClick(10)} className={`w-full justify-start gap-2 pl-2 ${clicked === 10 && ' bg-accent'}`}>
									<Settings size='24' strokeWidth='2' className='h-4 w-4' />
									{LayoutConfig.sidebar.menu.settings}
								</Button>
							</Link>
						</>
					)}
				</div>
			</div>
		</nav>
	);
}
// Export React component
export default Sidebar;
