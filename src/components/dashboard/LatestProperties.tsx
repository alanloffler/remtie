// App
import { useTruncateText } from '@/hooks/useTruncateText';
import { IProperty } from '@/lib/interfaces/property.interface';
import { DashboardServices } from '@/services/dashboard.services';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// React component
function LatestProperties({ limit, baseUrl }: { limit: number, baseUrl: string }) {
	const [latestProperties, setLatestProperties] = useState<IProperty[]>([]);
	const truncateText = useTruncateText();

	useEffect(() => {
		DashboardServices.getLatestProperties(limit).then((response) => {
			console.log(response);
			setLatestProperties(response);
		});
	}, [limit]);

	return (
		<section className='w-full'>
			<ul className='flex w-full flex-col gap-2'>
				{latestProperties?.map((property: IProperty) => {
					return (
						<li key={property.id} className='rounded-md border bg-slate-100/20 px-2 py-2 text-slate-700 transition-all hover:cursor-pointer hover:bg-slate-200/30 hover:text-black'>
							<Link to={`${baseUrl}/${property.id}`}>
								<span className='rounded-sm bg-slate-200/70 px-1.5 py-1 text-xs font-bold uppercase leading-tight'>{`COD-${property.id < 10 ? '0' + property.id : property.id}`}</span>
								<span className='px-2 text-xs font-semibold'>{`${property.type} - ${property.business_type}`}</span>
								<span className='text-xs'>{truncateText(property.title, 35 - property.type.length - property.business_type.length)}</span>
							</Link>
						</li>
					);
				})}
			</ul>
		</section>
	);
}
// Export React component
export default LatestProperties;
