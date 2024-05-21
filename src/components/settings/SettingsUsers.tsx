// App
import UsersRoles from '@/components/settings/users/UsersRoles';
import UsersRowsPerPage from '@/components/settings/users/UsersRowsPerPage';
// React component
function SettingsUsers() {
	return (
		<div className='mb-8 flex animate-fadeIn flex-col md:flex-row md:gap-6'>
			<div className='w-full p-2 md:w-1/2'>
				<div className='space-y-4'>
                    <UsersRoles />
                </div>
			</div>
			<div className='w-full p-2 md:w-1/2'>
				<div className='space-y-4'>
					<UsersRowsPerPage />
				</div>
			</div>
		</div>
	);
}
// Export React component
export default SettingsUsers;
