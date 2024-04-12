// UI: Shadcn-ui (https://ui.shadcn.com/)
import { Card, CardContent } from '@/components/ui/card';
// App
import { useCapitalize } from '@/hooks/useCapitalize';
import { IDashboardData } from '@/lib/interfaces/dashboard.interface';
import { useNavigate } from 'react-router-dom';
// .env constants
const APP_URL: string = import.meta.env.VITE_APP_URL;
// React component
function DashboardHeader({ data }: { data: IDashboardData[] }) {
	const navigate = useNavigate();
	const capitalize = useCapitalize();

	return (
		<div className='w-full'>
			<ul className='flex items-center justify-between gap-8 md:gap-8'>
				{data.map((d) => {
					return (
						<Card key={d.category} className='w-full cursor-pointer transition-all hover:scale-105 md:w-full' onClick={() => navigate(`${APP_URL}/productos`)}>
							<CardContent className='p-3 md:p-6'>
								<div className='flex flex-row items-center'>
									<li>
										<h1 className='text-3xl font-bold'>{d.total}</h1>
										<h3 className='text-xs font-semibold text-slate-600 md:text-sm'>{d.total === 1 ? capitalize(d.category) : capitalize(d.plural)}</h3>
										<h3 className='text-xs font-medium text-slate-400 md:text-sm'>{`${d.owner} de tu autoría`}</h3>
									</li>
								</div>
							</CardContent>
						</Card>
					);
				})}
			</ul>
		</div>
	);
}
// Export React component
export default DashboardHeader;
