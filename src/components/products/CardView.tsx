// Icons: Lucide (https://lucide.dev/)
import { Bookmark, FileText, Pencil } from 'lucide-react';
// UI: Shadcn-ui (https://ui.shadcn.com/)
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
// App
import CurrencyFormat from '@/components/shared/CurrencyFormat';
import { IProperty } from '@/lib/interfaces/property.interface';
import { useNavigate } from 'react-router-dom';
// .env constants
const appUrl: string = import.meta.env.VITE_APP_URL;
// React component
function CardView({ properties }: { properties: IProperty[] }) {
	const navigate = useNavigate();

	return (
		<div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
			{properties.map((property: IProperty) => (
				<div className='' key={property.id}>
					<Card className='flex h-full flex-col rounded-md border-t-[4px]' style={{ borderTopColor: property.color }}>
						<div onClick={() => navigate(`${appUrl}/productos/${property.id}`)} className='hover:cursor-default'>
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
								<div className='mt-4 flex flex-row items-center justify-around'>
									<div className='text-sm font-semibold uppercase tracking-tighter text-slate-500'>{property.business_type}</div>
									<CurrencyFormat value={property.price} locale='es-AR' digits={0} className='text-l font-semibold italic tracking-tight text-slate-700' />
								</div>
							</CardContent>
						</div>
						<CardFooter className='mt-auto justify-between gap-2 bg-slate-100 p-2'>
							<div className='flex items-center'>
								<div className={'flex h-4 w-4 items-center rounded-full border pl-1 ' + (property.is_active ? 'border-emerald-400 bg-emerald-300' : 'border-slate-300/50 bg-input')}>
									<span className='flex items-center pl-5 text-xs font-normal text-slate-400/70'>{property.is_active ? 'Activo' : 'Inactivo'}</span>
								</div>
							</div>
							<div className='flex items-center space-x-2'>
								<Button onClick={() => navigate(`${appUrl}/productos/${property.id}`)} variant='ghost' size='miniIcon' className='rounded-full border bg-white text-slate-400/70 shadow-sm hover:bg-white hover:text-sky-400'>
									<FileText className='h-4 w-4' />
								</Button>
								<Button onClick={() => navigate(`${appUrl}/productos/modificar/${property?.id}`)} variant='ghost' size='miniIcon' className='rounded-full border bg-white text-slate-400/70 shadow-sm hover:bg-white hover:text-emerald-500'>
									<Pencil className='h-4 w-4' />
								</Button>
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
