// UI: Shadcn-ui (https://ui.shadcn.com/)
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
// App
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import PieChart from '@/components/dashboard/PieChart';
import { useEffect, useState } from 'react';
import { DashboardServices } from '@/services/dashboard.services';
import { IDashboardHeader, Property } from '@/lib/interfaces';
import { Hourglass } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTruncateText } from '@/hooks/useTruncateText';
// .env constants
const appUrl: string = import.meta.env.VITE_APP_URL;

// React component
function Dashboard() {
	const [data, setData] = useState<IDashboardHeader[]>([]);
	const [latestProperties, setLatestProperties] = useState<Property[]>([]);
    const truncateText = useTruncateText();

	useEffect(() => {
		DashboardServices.getPropertiesByCategory().then((res) => {
			setData(res);
		});
		DashboardServices.getLatestProperties(5).then((res) => {
			console.log(res);
			setLatestProperties(res);
		});
	}, []);

	return (
		<main className='flex-1 overflow-y-auto'>
			<div className='mx-8 mb-8 mt-8 flex flex-col gap-8'>
				<div className='flex flex-row'>
					<DashboardHeader data={data} />
				</div>
				<div className='grid-col grid gap-8 md:flex md:flex-row'>
					<div className='md:w-fit'>
						<Card className=''>
							<CardHeader className='p-4 pb-0'>
								<CardTitle className='flex items-center gap-2 text-base text-slate-700'>
									<svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className='lucide lucide-pie-chart h-4 w-4'>
										<path d='M21.21 15.89A10 10 0 1 1 8 2.83' />
										<path d='M22 12A10 10 0 0 0 12 2v10z' />
									</svg>
									Propiedades
								</CardTitle>
								<CardDescription className='text-xs'>Por categorías</CardDescription>
							</CardHeader>
							<CardContent className='flex w-full flex-row p-4'>
								<PieChart data={data} outerRadius={70} innerRadius={30} margins={10} />
								<div className='ml-4 flex flex-row items-center gap-2 text-xs'>
									<ul className=''>
										{data.map((d) => {
											return (
												<li key={d.category} className='flex items-center gap-2 p-1'>
													<div style={{ background: d.color }} className='h-3 w-3 rounded-full shadow-sm'></div>
													{d.category}
												</li>
											);
										})}
									</ul>
								</div>
							</CardContent>
						</Card>
					</div>
					<div className='md:w-full'>
						<Card className=''>
							<CardHeader className='gap-2 p-4 pb-0'>
								<CardTitle className='flex items-center gap-2 text-base text-slate-700'>
									<Hourglass className='h-4 w-4' />
									Propiedades recientes
								</CardTitle>
								<Separator orientation='horizontal' />
							</CardHeader>
							<CardContent className='flex flex-row p-4'>
								<ul className='flex w-full flex-col gap-2'>
									{latestProperties.map((property: Property) => {
										return (
											<li key={property.id} className='rounded-md border bg-slate-100/20 px-2 py-2 text-slate-700 transition-all hover:cursor-pointer hover:bg-slate-200/30 hover:text-black'>
												<Link to={`${appUrl}/productos/${property.id}`}>
													<span className='rounded-sm bg-slate-200/70 px-1.5 py-1 text-xs font-bold uppercase leading-tight'>{`COD-${property.id < 10 ? '0' + property.id : property.id}`}</span>
													<span className='px-2 text-xs font-semibold'>{`${property.type} - ${property.business_type}`}</span>
													<span className='text-xs'>{truncateText(property.title, 35 - property.type.length - property.business_type.length)}</span>
												</Link>
											</li>
										);
									})}
								</ul>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</main>
	);
}
// Export React component
export default Dashboard;
