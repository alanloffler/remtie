// App
import DashboardLimit from '@/components/settings/dashboard/DashboardLimit';
// React component
function SettingsDashboard() {
	return (
		<div className='mb-8 flex animate-fadeIn flex-col md:flex-row md:gap-6'>
			<div className='w-full p-2 md:w-1/2'>
				<div className='space-y-4'>
					<DashboardLimit />
				</div>
			</div>
			<div className='w-full p-2 md:w-1/2'>
				<div className='space-y-4'></div>
			</div>
		</div>
	);
}
// Export React component
export default SettingsDashboard;
