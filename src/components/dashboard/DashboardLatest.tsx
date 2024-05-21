// Icons: Lucide (https://lucide.dev/)
import { CalendarPlus, Hourglass } from 'lucide-react';
// UI: Shadcn-ui (https://ui.shadcn.com/)
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
// App
import { DashboardConfig } from '@/lib/config/dashboard.config';
import { DashboardServices } from '@/services/dashboard.services';
import { IProperty } from '@/lib/interfaces/property.interface';
import { Link, useNavigate } from 'react-router-dom';
import { useCapitalize } from '@/hooks/useCapitalize';
import { useEffect, useState } from 'react';
import { useLocaleDate } from '@/hooks/useLocaleDate';
import { useTruncateText } from '@/hooks/useTruncateText';
// .env constants
const APP_URL: string = import.meta.env.VITE_APP_URL;
// React component
function DashboardLatest({ limit }: { limit: number }) {
	const [latestProperties, setLatestProperties] = useState<IProperty[]>([]);
	const [message, setMessage] = useState<string>(DashboardConfig.noProducts);
	const [propertiesUrl, setPropertiesUrl] = useState<string>('0');
	const capitalize = useCapitalize();
	const localeDate = useLocaleDate();
	const truncateText = useTruncateText();

	const navigate = useNavigate();

	useEffect(() => {
		getLatestProperties(5, '0');
	}, [limit]);

	function getLatestProperties(limit: number, owner: string) {
		DashboardServices.getLatestProperties(limit, owner).then((response) => {
			if (response.length > 0) {
				setLatestProperties(response);
				owner === '0' ? setPropertiesUrl('/') : setPropertiesUrl('/productos');
			}
			if (response.statusCode > 399) setMessage(DashboardConfig.noProducts);
			if (response instanceof Error) setMessage('500 Internal Server Error | ' + response.message);
		});
	}

	function handleSelectChange(event: string) {
		getLatestProperties(5, event);
	}

	return (
		<Card className='w-full'>
			<CardHeader className='gap-2 p-4 pb-0'>
				<div className='flex items-center justify-between text-slate-700'>
					<CardTitle>
						<div className='flex items-center space-x-2 text-base'>
							<Hourglass className='h-4 w-4' />
							<span>{DashboardConfig.components.latest.title}</span>
						</div>
					</CardTitle>
					<Select defaultValue='0' onValueChange={(event) => handleSelectChange(event)}>
						<SelectTrigger className='h-8 w-[100px] '>
							<SelectValue className='text-xs font-medium' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='0'>{DashboardConfig.dropdown.allProducts}</SelectItem>
							<SelectItem value='1'>{DashboardConfig.dropdown.ownerProducts}</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<Separator orientation='horizontal' />
			</CardHeader>
			<CardContent className='flex flex-row p-4'>
				{latestProperties.length < 1 ? (
					<p className='text-sm text-slate-500'>{message}</p>
				) : (
					<div className='w-full'>
						<ul className='flex flex-col gap-2'>
							{latestProperties.map((property: IProperty, index: number) => {
								return (
									<li key={property.id} className={`${index % 2 === 0 ? 'bg-gray-100/60' : ''} rounded-md bg-slate-100/20 px-2 py-2 text-slate-700 transition-all hover:cursor-pointer hover:bg-slate-200/30 hover:text-black`}>
										<Link to={`${APP_URL}/${property.id}`} className='flex w-full items-center'>
											<span className='rounded-sm bg-slate-200/70 px-1.5 py-1 text-xs font-bold uppercase leading-tight'>{`COD-${property.id < 10 ? '0' + property.id : property.id}`}</span>
											<span className='px-2 text-xs font-semibold'>{`${capitalize(property.type)} - ${capitalize(property.business_type)}`}</span>
											<span className='hidden text-xs md:inline-flex lg:inline-flex'>{truncateText(property.title, 40 - property.type.length - property.business_type.length)}</span>
											<span className='ml-auto flex items-center gap-1 px-2 text-xs'>
												<CalendarPlus className='h-4 w-4 text-emerald-500' />
												{localeDate(property.created_at)}
											</span>
										</Link>
									</li>
								);
							})}
						</ul>
						<div className='mt-4 flex flex-row justify-end'>
							<Button onClick={() => navigate(`${APP_URL + propertiesUrl}`)} variant='link' size='sm' className='h-8 text-xs font-semibold text-slate-500'>
								{DashboardConfig.seeMore}
							</Button>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
// Export React component
export default DashboardLatest;
