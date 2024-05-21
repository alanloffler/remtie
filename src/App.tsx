// Styles
import '@/index.css';
// App
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
// Routes
import Layout from '@/components/layout/Layout';
import ProtectedRoutes from './components/login/ProtectedRoutes';
import Loading2 from '@/components/shared/Loading2';
const Login = React.lazy(() => import('./components/login/Login'));
const Dashboard = React.lazy(() => import('./components/dashboard/Dashboard'));
const ListUsers = React.lazy(() => import('./components/users/ListUsers'));
const CreateUser = React.lazy(() => import('./components/users/CreateUser'));
const UpdateUser = React.lazy(() => import('./components/users/UpdateUser'));
const ViewUser = React.lazy(() => import('./components/users/ViewUser'));
const ListProducts = React.lazy(() => import('./components/products/ListProducts'));
const ListAllProducts = React.lazy(() => import('./components/products/ListAllProducts'));
const ViewProduct = React.lazy(() => import('./components/products/ViewProduct'));
const CreateProduct = React.lazy(() => import('./components/products/CreateProduct'));
const UpdateProduct = React.lazy(() => import('./components/products/UpdateProduct'));
const NotFound = React.lazy(() => import('./components/shared/NotFound'));
const Settings = React.lazy(() => import('./components/settings/Settings'));
const SettingsProducts = React.lazy(() => import('./components/settings/SettingsProducts'));
const SettingsUsers = React.lazy(() => import('./components/settings/SettingsUsers'));
const SettingsDashboard = React.lazy(() => import('./components/settings/SettingsDashboard'));
// .env constants
const APP_URL: string = import.meta.env.VITE_APP_URL;
// React component
function App() {
	const routes = [
		{ id: 0, path: `${APP_URL}/`, element: <ListAllProducts type={'client'} /> },
		{ id: 1, path: `${APP_URL}/usuarios`, element: <ListUsers /> },
		{ id: 2, path: `${APP_URL}/usuario/:id`, element: <ViewUser /> },
		{ id: 3, path: `${APP_URL}/usuario/crear`, element: <CreateUser /> },
		{ id: 4, path: `${APP_URL}/usuario/modificar/:id`, element: <UpdateUser /> },
		{ id: 5, path: `${APP_URL}/productos`, element: <ListProducts /> },
		{ id: 6, path: `${APP_URL}/productos/:id`, element: <ViewProduct /> },
		{ id: 7, path: `${APP_URL}/productos/crear`, element: <CreateProduct /> },
		{ id: 8, path: `${APP_URL}/productos/modificar/:id`, element: <UpdateProduct /> },
		{ id: 9, path: `${APP_URL}/config`, element: <Settings /> },
		{ id: 10, path: `${APP_URL}/tablero`, element: <Dashboard /> }
	];

	const settingsRoutes = [
		{ id: 101, path: `${APP_URL}/config/productos`, element: <SettingsProducts /> },
		{ id: 102, path: `${APP_URL}/config/usuarios`, element: <SettingsUsers /> },
		{ id: 103, path: `${APP_URL}/config/tablero`, element: <SettingsDashboard /> }
	];

	return (
		<>
			<Routes>
				<Route path='/' element={<Login />} />
				<Route path={APP_URL} element={<ProtectedRoutes />}>
					<Route
						path={`${APP_URL}/`}
						element={
							<React.Suspense fallback={<Loading2 width='60' height='60' color='#0ea5e9' dur={0.75} />}>
								<Layout />
							</React.Suspense>
						}>
						{routes.map((route) =>
							route.path === `${APP_URL}/config` ? (
								<Route
									key={route.id}
									path={route.path}
									element={
										<React.Suspense fallback={<Loading2 width='60' height='60' color='#0ea5e9' dur={0.75} />}>
											<Settings />
										</React.Suspense>
									}>
									{settingsRoutes.map((r) => (
										<Route key={r.id} path={r.path} element={<React.Suspense fallback={<Loading2 width='60' height='60' color='#0ea5e9' dur={0.75} />}>{r.element}</React.Suspense>} />
									))}
								</Route>
							) : (
								<Route key={route.id} path={route.path} element={<React.Suspense fallback={<Loading2 width='60' height='60' color='#0ea5e9' dur={0.75} />}>{route.element}</React.Suspense>} />
							)
						)}
					</Route>
					<Route
						path='*'
						element={
							<React.Suspense fallback={<Loading2 width='60' height='60' color='#0ea5e9' dur={0.75} />}>
								<NotFound />
							</React.Suspense>
						}
					/>
				</Route>
			</Routes>
			<Toaster />
		</>
	);
}
// Export React component
export default App;
