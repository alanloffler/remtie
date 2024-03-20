// UI: Shadcn-ui (https://ui.shadcn.com/)
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

interface IData {
	category: string;
	total: number;
	percentage: number;
	color: string;
}
// .env constants
const appUrl: string = import.meta.env.VITE_APP_URL;
// React component
function DashboardHeader({ data }: { data: IData[] }) {
	const navigate = useNavigate();

	return (
		<div className='w-full'>
			<ul className='flex items-center justify-between gap-4 md:gap-8'>
				{data.map((d) => {
					return (
						<Card key={d.category} className='w-1/3 cursor-pointer transition-all hover:scale-105 md:w-full' onClick={() => navigate(`${appUrl}/productos`)}>
							<CardContent className='p-3 md:p-6'>
								<div className='flex flex-row items-center'>
									<li>
										<h1 className='text-3xl font-bold'>{d.total}</h1>
										<h3 className='text-xs font-semibold text-slate-400 md:text-sm'>{d.category}s</h3>
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
