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
						<Route
							path={`${appUrl}/`}
							element={
								<React.Suspense fallback={<Loading2 width='60' height='60' color='#0ea5e9' dur={0.75} />}>
									<ListProducts />
								</React.Suspense>
							}
						/>
						<Route
							path={`${appUrl}/usuarios`}
							element={
								<React.Suspense fallback={<Loading2 width='60' height='60' color='#0ea5e9' dur={0.75} />}>
									<ListUsers />
								</React.Suspense>
							}
						/>
						<Route
							path={`${appUrl}/usuario/:id`}
							element={
								<React.Suspense fallback={<Loading2 width='60' height='60' color='#0ea5e9' dur={0.75} />}>
									<ViewUser />
								</React.Suspense>
							}
						/>
						<Route
							path={`${appUrl}/usuario/crear`}
							element={
								<React.Suspense fallback={<Loading2 width='60' height='60' color='#0ea5e9' dur={0.75} />}>
									<CreateNewUser />
								</React.Suspense>
							}
						/>
						<Route
							path={`${appUrl}/usuario/modificar/:id`}
							element={
								<React.Suspense fallback={<Loading2 width='60' height='60' color='#0ea5e9' dur={0.75} />}>
									<UpdateUser />
								</React.Suspense>
							}
						/>
						<Route
							path={`${appUrl}/productos`}
							element={
								<React.Suspense fallback={<Loading2 width='60' height='60' color='#0ea5e9' dur={0.75} />}>
									<ListProducts />
								</React.Suspense>
							}
						/>
						<Route
							path={`${appUrl}/productos/:id`}
							element={
								<React.Suspense fallback={<Loading2 width='60' height='60' color='#0ea5e9' dur={0.75} />}>
									<ViewProduct />
								</React.Suspense>
							}
						/>
						<Route
							path={`${appUrl}/productos/crear`}
							element={
								<React.Suspense fallback={<Loading2 width='60' height='60' color='#0ea5e9' dur={0.75} />}>
									<CreateProduct />
								</React.Suspense>
							}
						/>
						<Route
							path={`${appUrl}/productos/modificar/:id`}
							element={
								<React.Suspense fallback={<Loading2 width='60' height='60' color='#0ea5e9' dur={0.75} />}>
									<UpdateProduct />
								</React.Suspense>
							}
						/>
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
