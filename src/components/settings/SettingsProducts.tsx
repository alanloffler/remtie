import ProductBusinessSettings from '@/components/settings/products/ProductBusinessSettings';
import ProductCategoriesSettings from '@/components/settings/products/ProductCategoriesSettings';
import ProductRowsPerPage from '@/components/settings/products/ProductRowsPerPage';
import ProductViewSettings from '@/components/settings/products/ProductViewSettings';

function SettingsProducts() {
	return (
		<div className='mb-8 flex flex-col md:gap-6 md:flex-row'>
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
	);
}

export default SettingsProducts;
