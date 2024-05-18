// App
import { LayoutConfig } from '@/lib/config/layout.config';
import { Link } from 'react-router-dom';
import { useState } from 'react';
// .env constants
const APP_URL: string = import.meta.env.VITE_APP_URL;
// React component
function StickyMenu() {
	const [selectedItem, setSelectedItem] = useState<number>();

	const handleClick = (item: number) => {
		setSelectedItem(item);
        sessionStorage.setItem('sticky-menu', String(item));
	};

	return (
		<div className='relative flex items-center rounded-md bg-slate-200/50'>
			<Link to={`${APP_URL}/config/productos`} className='flex-1 py-2 text-center text-slate-500'>
				<button onClick={() => handleClick(1)} className={`flex-1 py-2 text-center ${selectedItem === 1 ? 'text-slate-900' : 'text-slate-500'}`}>
					{LayoutConfig.sidebar.menu.products}
				</button>
			</Link>
			<Link to={`${APP_URL}/config/usuarios`} className='flex-1 py-2 text-center text-slate-500'>
				<button onClick={() => handleClick(2)} className={`flex-1 py-2 text-center ${selectedItem === 2 ? 'text-slate-900' : 'text-slate-500'}`}>
					{LayoutConfig.sidebar.menu.users}
				</button>
			</Link>
			<Link to={`#`} className='flex-1 py-2 text-center text-slate-500'>
				<button onClick={() => handleClick(3)} className={`flex-1 py-2 text-center ${selectedItem === 3 ? 'text-slate-900' : 'text-slate-500'}`}>
					{LayoutConfig.sidebar.menu.dashboard}
				</button>
			</Link>
			<div className='absolute bottom-0 left-0 h-[2px] bg-blue-500 transition-transform duration-300' style={{ width: '33.33%', transform: `translateX(calc(${Number(sessionStorage.getItem('sticky-menu')) - 1} * 100%))` }}></div>
		</div>
	);
}
// Export React component
export default StickyMenu;
