// Icons: Lucide (https://lucide.dev/)
import { ArrowLeft, Bookmark } from 'lucide-react';
// UI: Shadcn-ui (https://ui.shadcn.com/)
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// App
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ProductsServices from '@/services/products.services';
import { Property } from '@/lib/types';
import CurrencyFormat from '../shared/CurrencyFormat';
import Carousel from '@/components/shared/Carousel';
// .env constants
const appUrl: string = import.meta.env.VITE_APP_URL;
// React component
function ViewProduct() {
	const { id } = useParams();
	const propertyId: number = Number(id);
	const [property, setProperty] = useState<Property>();
    const [images, setImages] = useState<string[]>([]);

	useEffect(() => {
		async function getProperty() {
			const property: Property = await ProductsServices.getProduct(propertyId);
			setProperty(property);
            const img: string[] = property.images.split(',');
            setImages(img);
		}
		getProperty();
	}, [propertyId]);

	return (
		<main className='flex-1 overflow-y-auto'>
			<div className='mx-6 mb-4 mt-6 flex flex-row items-center justify-end'>
				<Button variant='ghost' size='sm' asChild>
					<Link to={appUrl + '/productos'}>
						<ArrowLeft className='mr-2 h-4 w-4' />
						Volver
					</Link>
				</Button>
			</div>
			<div className='mt-8 flex min-w-80 flex-col items-center px-6'>
				<Card className='mb-8 min-w-[350px] border-t-[4px] md:w-[500px]' style={{ borderTopColor: property?.color }}>
					<CardHeader className='flex-grow rounded-sm p-4'>
						<div className='flex items-center gap-2'>
							<Bookmark strokeWidth='2' className='h-5 w-5' style={{ color: property?.color }} />
							<div className='text-[12px] font-bold uppercase text-slate-500'>{property?.type}</div>
						</div>
						<CardTitle className='text-md text-slate-800'>{property?.title}</CardTitle>
						<CardDescription className='text-sm'>{property?.short_description}</CardDescription>
					</CardHeader>
					<CardContent className='mt-auto px-4 py-2'>
						<div className='mb-4 flex w-auto flex-row text-sm'>{property?.long_description}</div>
						<div className='flex mb-4'>
							<Carousel images={images} />
						</div>
						<div className='flex text-xs font-bold uppercase text-slate-500'>
							<div className='flex w-auto flex-row items-center rounded-sm bg-slate-200/70 p-1 leading-tight'>{propertyId < 10 ? 'Cod/0' + propertyId : 'Cod/' + propertyId}</div>
						</div>
					</CardContent>
					<CardFooter className='mt-auto justify-around bg-slate-100 p-2'>
						<div className='text-sm font-semibold uppercase tracking-tighter text-slate-500'>{property?.business_type}</div>
						<CurrencyFormat value={property?.price} locale='es-AR' digits={0} className='text-l font-semibold italic tracking-tight text-slate-700' />
					</CardFooter>
				</Card>
			</div>
		</main>
	);
}
// Export React component
export default ViewProduct;
