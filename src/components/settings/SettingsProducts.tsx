// App
import ProductBusinessSettings from '@/components/settings/products/ProductBusinessSettings';
import ProductCategoriesSettings from '@/components/settings/products/ProductCategoriesSettings';
import ProductCities from '@/components/settings/products/ProductCities';
import ProductRowsPerPage from '@/components/settings/products/ProductRowsPerPage';
import ProductViewSettings from '@/components/settings/products/ProductViewSettings';
// React component
function SettingsProducts() {
	return (
		<>
			<div className='mb-8 flex animate-fadeIn flex-col md:flex-row md:gap-6'>
				<div className='w-full p-2 md:w-1/2'>
					<div className='space-y-4'>
						<ProductBusinessSettings />
						<ProductCategoriesSettings />
					</div>
				</div>
				<div className='w-full p-2 md:w-1/2'>
					<div className='space-y-4'>
						<ProductViewSettings />
						<ProductRowsPerPage />
					</div>
				</div>
			</div>
			<div className='flex flex-col w-full pb-8'>
				<ProductCities />
			</div>
		</>
	);
}
// Export React component
export default SettingsProducts;
