// Styles
import '@/index.css';
// App
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
// Routes
const Login = React.lazy(() => import('./components/login/Login'));
import Layout from '@/components/layout/Layout';
import ProtectedRoutes from './components/login/ProtectedRoutes';
import Loading2 from '@/components/shared/Loading2';
// If Layout is lazyloading
// const Layout = React.lazy(() => import("./components/layout/Layout"));
const Dashboard = React.lazy(() => import('./components/dashboard/Dashboard'));
const ListUsers = React.lazy(() => import('./components/users/ListUsers'));
const CreateNewUser = React.lazy(() => import('./components/users/CreateNewUser'));
const UpdateUser = React.lazy(() => import('./components/users/UpdateUser'));
const ViewUser = React.lazy(() => import('./components/users/ViewUser'));
const ListProducts = React.lazy(() => import('./components/products/ListProducts'));
const ViewProduct = React.lazy(() => import('./components/products/ViewProduct'));
const CreateProduct = React.lazy(() => import('./components/products/CreateProduct'));
const UpdateProduct = React.lazy(() => import('./components/products/UpdateProduct'));
const NotFound = React.lazy(() => import('./components/shared/NotFound'));
// .env constants
const appUrl: string = import.meta.env.VITE_APP_URL;
// React component
function App() {
	const routes = [
		{ path: `${appUrl}/`, element: <Dashboard /> },
		{ path: `${appUrl}/usuarios`, element: <ListUsers /> },
		{ path: `${appUrl}/usuario/:id`, element: <ViewUser /> },
		{ path: `${appUrl}/usuario/crear`, element: <CreateNewUser /> },
		{ path: `${appUrl}/usuario/modificar/:id`, element: <UpdateUser /> },
		{ path: `${appUrl}/productos`, element: <ListProducts /> },
		{ path: `${appUrl}/productos/:id`, element: <ViewProduct /> },
		{ path: `${appUrl}/productos/crear`, element: <CreateProduct /> },
		{ path: `${appUrl}/productos/modificar/:id`, element: <UpdateProduct /> }
	];

	return (
		<>
			<Routes>
				<Route path='/' element={<Login />} />
				<Route path={appUrl} element={<ProtectedRoutes />}>
					<Route
						path={`${appUrl}/`}
						element={
							<React.Suspense fallback={<Loading2 width='60' height='60' color='#0ea5e9' dur={0.75} />}>
								<Layout />
							</React.Suspense>
						}>
						{routes.map((route) => (
							<Route 
                                key={route.path}
                                path={route.path} 
                                element={
                                    <React.Suspense fallback={<Loading2 width='60' height='60' color='#0ea5e9' dur={0.75} />}>
                                        {route.element}
                                    </React.Suspense>} 
                            />))
                        }
					</Route>
				</Route>
				<Route
					path='*'
					element={
						<React.Suspense fallback={<Loading2 width='60' height='60' color='#0ea5e9' dur={0.75} />}>
							<NotFound />
						</React.Suspense>
					}
				/>
			</Routes>
			<Toaster />
		</>
	);
}
// Export React component
export default App;
