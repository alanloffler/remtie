// UI: Shadcn-ui (https://ui.shadcn.com/)
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';
// App
import { ThemeProvider } from '@/context/ThemeProvider';
import { Outlet } from 'react-router-dom';
// React component
function Layout() {
	return (
		<ThemeProvider defaultTheme='light' storageKey='vite-ui-theme'>
			<div className='flex h-full min-h-screen flex-col bg-slate-50'>
				<Header />
				<div className='flex flex-1 flex-col overflow-y-hidden sm:flex-row'>
					<Sidebar />
					<Outlet />
				</div>
				<Footer />
			</div>
		</ThemeProvider>
	);
}
// Export React component
export default Layout;
