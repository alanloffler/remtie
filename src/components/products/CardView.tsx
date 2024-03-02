// Icons: Lucide (https://lucide.dev/)
import { Bookmark } from 'lucide-react';
// UI: Shadcn-ui (https://ui.shadcn.com/)
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
// App
import CurrencyFormat from '@/components/shared/CurrencyFormat';
import { Property } from '@/lib/types';
import { useNavigate } from 'react-router-dom';
// .env constants
const appUrl: string = import.meta.env.VITE_APP_URL;
// React component
function CardView({ properties }: { properties: Property[] }) {
    const navigate = useNavigate();
	
    return (
		<div className='grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4'>
			{properties.map((property: Property) => (
				<div className='' key={property.id}>
					<Card className='flex h-full flex-col rounded-md border-t-[4px] hover:cursor-default' style={{ borderTopColor: property.color }} onClick={() => navigate(`${appUrl}/productos/${property.id}`)}>
						<CardHeader className='flex-grow rounded-sm p-4'>
							<div className='flex items-center gap-2'>
								<Bookmark strokeWidth='2' className='h-5 w-5' style={{ color: property.color }} />
								<div className='text-[12px] font-bold uppercase text-slate-500'>{property.type}</div>
							</div>
							<CardTitle className='text-md text-slate-800'>{property.title}</CardTitle>
							<CardDescription className='text-sm'>{property.short_description}</CardDescription>
						</CardHeader>
						<CardContent className='mt-auto px-4 py-2'>
							<div className='flex gap-2 text-xs font-bold uppercase text-slate-500'>
								<div className='flex w-auto flex-row items-center rounded-sm bg-slate-200/70 p-1 leading-tight'>{property.id < 10 ? 'Cod/0' + property.id : 'Cod/' + property.id}</div>
							</div>
						</CardContent>
						<CardFooter className='mt-auto justify-around bg-slate-100 p-2'>
							<div className='text-sm font-semibold uppercase tracking-tighter text-slate-500'>{property.business_type}</div>
							<CurrencyFormat value={property.price} locale='es-AR' digits={0} className='text-l font-semibold italic tracking-tight text-slate-700' />
						</CardFooter>
					</Card>
				</div>
			))}
		</div>
	);
}
// Export React component
export default CardView;
