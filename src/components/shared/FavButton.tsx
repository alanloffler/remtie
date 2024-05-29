// Icons: Lucide (https://lucide.dev/)
import { Heart } from 'lucide-react';
// UI: Shadcn-ui (https://ui.shadcn.com/)
import { Button } from '@/components/ui/button';
// App
import { FavoritesServices } from '@/services/favorite.services';
import { IProperty } from '@/lib/interfaces/property.interface';
import { handleServerResponse } from '@/lib/handleServerResponse';
import { useEffect, useState } from 'react';
// React component
function FavButton({ property, height }: { property: IProperty; height: number }) {
	const [isFavorite, setIsFavorite] = useState<boolean>(false);

	useEffect(() => {
		FavoritesServices.findOne(property.id).then((response) => {
			if (!response.statusCode) {
				if (response.propertyId === property.id) setIsFavorite(true);
			}
		});
	}, [property]);

	function handleFavorite() {
		if (isFavorite === false) {
			FavoritesServices.createFavorite(property).then((response) => {
				if (response.statusCode === 200) setIsFavorite(true);
				handleServerResponse(response);
			});
		}
		if (isFavorite === true) {
			FavoritesServices.removeFavorite(property).then((response) => {
				if (response.statusCode === 200) setIsFavorite(false);
				handleServerResponse(response);
			});
		}
	}
	return (
		<Button variant='ghost' className='flex items-center p-0 hover:cursor-pointer hover:bg-transparent' onClick={handleFavorite} asChild>
			<Heart
				size={height}
				className={`transition-all
                     hover:stroke-red-500
                     ${isFavorite ? 'fill-red-500 stroke-red-500' : 'fill-none stroke-slate-500'}`}
			/>
		</Button>
	);
}
// Export React component
export default FavButton;
