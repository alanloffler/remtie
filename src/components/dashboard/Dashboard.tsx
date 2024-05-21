
// UI: Shadcn-ui (https://ui.shadcn.com/)
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { toast } from '@/components/ui/use-toast';
// App
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import InfoCard from '@/components/shared/InfoCard';

import PieChart from '@/components/dashboard/PieChart';
import { DashboardConfig } from '@/lib/config/dashboard.config';
import { DashboardServices } from '@/services/dashboard.services';
import { IDashboardData } from '@/lib/interfaces/dashboard.interface';
import { ReactElement, useEffect, useState } from 'react';
import { useCapitalize } from '@/hooks/useCapitalize';
import DashboardLatest from './DashboardLatest';

// React component
function Dashboard() {
	const [data, setData] = useState<IDashboardData[]>([]);
	const [showDashboardHeader, setShowDashboardHeader] = useState<boolean>(false);
	const capitalize = useCapitalize();
	const content: ReactElement = <p>{DashboardConfig.noProducts}</p>;

	useEffect(() => {
		DashboardServices.getHeaderData().then((response) => {
			if (!response.statusCode) {
				setData(response as IDashboardData[]);
				setShowDashboardHeader(true);
			}
			if (response.statusCode > 399) toast({ title: String(response.statusCode), description: response.message, variant: 'destructive', duration: 5000 });
			if (response instanceof Error) toast({ title: 'Error', description: '500 Internal Server Error | ' + response.message, variant: 'destructive', duration: 5000 });
		});
	}, []);

	return (
		<main className='animate-fadeIn flex-1 overflow-y-auto'>
			{data.length < 1 ? (
				<div className='mt-12 flex justify-center'>
					<InfoCard content={content} />
				</div>
			) : (
				<div className='mx-8 mb-8 mt-8 flex flex-col gap-8'>
					<div className='flex flex-row'>{showDashboardHeader && <DashboardHeader data={data as IDashboardData[]} />}</div>
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
									{data?.length < 1 ? <p className='text-sm text-slate-500'>No hay propiedades.</p> : <PieChart data={data} outerRadius={70} innerRadius={30} margins={10} />}
									<div className='ml-4 flex flex-row items-center gap-2 text-xs'>
										<ul className=''>
											{data?.map((d) => {
												return (
													<li key={d.category} className='flex items-center gap-2 p-1'>
														<div style={{ background: d.color }} className='h-3 w-3 rounded-full shadow-sm'></div>
														{capitalize(d.category)}
													</li>
												);
											})}
										</ul>
									</div>
								</CardContent>
							</Card>
						</div>
                        <DashboardLatest />
					</div>
				</div>
			)}
		</main>
	);
}
// Export React component
export default Dashboard;
