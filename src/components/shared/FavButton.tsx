// Icons: Lucide (https://lucide.dev/)
import { Heart } from 'lucide-react';
// UI: Shadcn-ui (https://ui.shadcn.com/)
import { Button } from '@/components/ui/button';
// App
import { IProperty } from '@/lib/interfaces/property.interface';
import { useEffect, useState } from 'react';
import { FavoritesServices } from '@/services/favorite.services';
// React component
function FavButton({ property, height }: { property: IProperty; height: number }) {
    const [isFavorite, setIsFavorite] = useState<boolean>(false);
    
    useEffect(() => {
        FavoritesServices.findOne(property.id).then(response => {
            console.log(response);
            if (response.propertyId === property.id) setIsFavorite(true);
        });
    }, [property]);
    
    function handleFavorite() {
        FavoritesServices.toggleFavorite(property).then((response) => {
            console.log(response);
            if (response.statusCode === 200) {
                setIsFavorite(!isFavorite);
            }
            if (response.statusCode > 399) console.log(response);
            if (response instanceof Error) console.log(response);
        });
    }

	return (
		<Button variant='ghost' className='flex items-center p-0 hover:bg-transparent' onClick={handleFavorite}>
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
