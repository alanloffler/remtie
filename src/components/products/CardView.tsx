// UI: Shadcn-ui (https://ui.shadcn.com/)
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
// App
import CurrencyFormat from '@/components/utils/CurrencyFormat';
import { Property } from '@/lib/types';
// React component
function CardView({ properties }: { properties: Property[] }) {
	return (
		<div className='grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
			{properties?.map((property: Property) => (
				<div className='' key={property.id}>
					<Card className=''>
						<CardHeader className='rounded-sm border-t-[3px] border-emerald-300 p-3'>
							<CardTitle className='text-md'>{property.title}</CardTitle>
							<CardDescription className='text-sm'>{property.short_description}</CardDescription>
						</CardHeader>
						<CardContent className='flex p-3'>
							<div>{'(' + property.id + ')'}</div>
						</CardContent>
						<CardFooter className='flex items-center justify-around bg-slate-100 p-2'>
							<div className='text-sm font-semibold uppercase tracking-tight text-slate-500'>EN {property.business_type}</div>
							<div>
								<CurrencyFormat value={property.price} locale='es-AR' digits={0} className='text-l font-semibold italic tracking-tight text-slate-700' />
							</div>
						</CardFooter>
					</Card>
				</div>
			))}
		</div>
	);
}
// Export React component
export default CardView;
