// App
import { LayoutConfig } from '@/lib/config/layout.config';
import { Link } from 'react-router-dom';
import { useState } from 'react';
// .env constants
const APP_URL: string = import.meta.env.VITE_APP_URL;
// React component
function StickyMenu({ className }: { className?: string }) {
	const [selectedItem, setSelectedItem] = useState<number>();

	const handleClick = (item: number) => {
		setSelectedItem(item);
        sessionStorage.setItem('sticky-menu', String(item));
	};

	return (
		<div className={`relative mx-auto flex items-center rounded-md bg-slate-200/50 ${className}` }>
			<Link to={`${APP_URL}/config/productos`} onClick={() => handleClick(1)} className='flex-1 py-2 text-center text-slate-500'>
				<div className={`flex-1 py-2 text-center ${selectedItem === 1 ? 'text-slate-900' : 'text-slate-500'}`}>
					{LayoutConfig.sidebar.menu.products}
				</div>
			</Link>
			<Link to={`${APP_URL}/config/mapa`} onClick={() => handleClick(2)} className='flex-1 py-2 text-center text-slate-500'>
				<div className={`flex-1 py-2 text-center ${selectedItem === 2 ? 'text-slate-900' : 'text-slate-500'}`}>
					{LayoutConfig.sidebar.menu.map}
				</div>
			</Link>
			<Link to={`${APP_URL}/config/tablero`} onClick={() => handleClick(3)} className='flex-1 py-2 text-center text-slate-500'>
				<div className={`flex-1 py-2 text-center ${selectedItem === 3 ? 'text-slate-900' : 'text-slate-500'}`}>
					{LayoutConfig.sidebar.menu.dashboard}
				</div>
			</Link>
            <Link to={`${APP_URL}/config/usuarios`} onClick={() => handleClick(4)} className='flex-1 py-2 text-center text-slate-500'>
				<div className={`flex-1 py-2 text-center ${selectedItem === 4 ? 'text-slate-900' : 'text-slate-500'}`}>
					{LayoutConfig.sidebar.menu.users}
				</div>
			</Link>
			<div className='absolute bottom-0 left-0 h-[2px] bg-blue-500 transition-transform duration-300' style={{ width: '25%', transform: `translateX(calc(${Number(sessionStorage.getItem('sticky-menu')) - 1} * 100%))` }}></div>
		</div>
	);
}
// Export React component
export default StickyMenu;
