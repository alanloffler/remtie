// App
import { Outlet, Navigate } from 'react-router-dom';
import { store } from '@/services/store.services';
// React component
function ProtectedRoutes() {
	const authorized: boolean = store.getState().authorized;
	return authorized ? <Outlet /> : <Navigate to='/' />;
}
// Export React component
export default ProtectedRoutes;
