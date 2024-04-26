// Icons: Lucide (https://lucide.dev/)
import { Home, LayoutDashboard, LogOut, Settings, UserRound } from 'lucide-react';
// UI: Shadcn-ui (https://ui.shadcn.com/)
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
// App
import UserLogged from '@/components/layout/UserLogged';
import { Link, useNavigate } from 'react-router-dom';
import { Roles } from '@/lib/constants';
import { Separator } from '@radix-ui/react-separator';
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
	const sidebarRef = useRef<HTMLDivElement>(null);
	const userId: number = store.getState().userId;
	const reset = store((state) => state.reset);
	const role = store((state) => state.role);

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
				<div className='fixed left-0 top-0 h-12 w-full bg-slate-100'></div>
				<div className='fixed left-0 top-2 flex w-full flex-row justify-between px-3'>
					<UserLogged user={userId} />
					<DropdownMenu>
						<DropdownMenuTrigger className='rounded-md bg-transparent outline-none hover:bg-slate-300'>
							<Button variant='ghost' size='miniIcon'>
								<svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className='lucide lucide-ellipsis-vertical'>
									<circle cx='12' cy='12' r='1' />
									<circle cx='12' cy='5' r='1' />
									<circle cx='12' cy='19' r='1' />
								</svg>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align='end'>
							<DropdownMenuItem className='gap-2' onClick={() => navigate(`${APP_URL}/usuario/${userId}`)}>
								<UserRound strokeWidth='2' className='h-4 w-4' />
								Perfil
							</DropdownMenuItem>
							<DropdownMenuItem className='gap-2' onClick={() => navigate(`${APP_URL}/usuario/modificar/${userId}`)}>
								<Settings strokeWidth='2' className='h-4 w-4' />
								Editar
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem className='gap-2' onClick={Logout}>
								<LogOut strokeWidth='2' className='h-4 w-4' />
								Salir
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
				<div className='mt-8 grid gap-1 px-2'>
					<Link to={`${APP_URL}/`}>
						<Button variant='ghost' onClick={() => handleClick(1)} className={`w-full justify-start gap-2 ${clicked === 1 && ' bg-accent'}`}>
							<LayoutDashboard size='24' strokeWidth='2' className='h-4 w-4' />
							Tablero
						</Button>
					</Link>
					<Link to={`${APP_URL}/productos`}>
						<Button variant='ghost' onClick={() => handleClick(2)} className={`w-full justify-start gap-2 ${clicked === 2 && ' bg-accent'}`}>
							<Home size='24' strokeWidth='2' className='h-4 w-4' />
							Productos
						</Button>
					</Link>
					<Link to={`${APP_URL}/usuarios`}>
						<Button variant='ghost' onClick={() => handleClick(3)} className={`w-full justify-start gap-2 ${clicked === 3 && ' bg-accent'}`}>
							<UserRound size='24' strokeWidth='2' className='h-4 w-4' />
							Usuarios
						</Button>
					</Link>
					{role === Roles.ADMIN && (
						<>
							<Separator className='my-4 h-[1px] bg-slate-200' />
							<Link to={`${APP_URL}/config`}>
								<Button variant='ghost' onClick={() => handleClick(4)} className={`w-full justify-start gap-2 ${clicked === 4 && ' bg-accent'}`}>
									<Settings size='24' strokeWidth='2' className='h-4 w-4' />
									Configuración
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
