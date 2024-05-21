// Icons: Lucide (https://lucide.dev/)
import { EllipsisVertical, FilePenIcon, Home } from 'lucide-react';
// UI: Shadcn-ui (https://ui.shadcn.com/)
import { Card, CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
// App
import { DashboardConfig } from '@/lib/config/dashboard.config';
import { IDashboardData } from '@/lib/interfaces/dashboard.interface';
import { useCapitalize } from '@/hooks/useCapitalize';
import { useNavigate } from 'react-router-dom';
// .env constants
const APP_URL: string = import.meta.env.VITE_APP_URL;
// React component
function DashboardHeader({ data }: { data: IDashboardData[] }) {
	const navigate = useNavigate();
	const capitalize = useCapitalize();

	return (
		<Card className='w-full'>
			<CardContent className='p-3 md:p-3'>
				<ul className='grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-2'>
					{data.map((d, index) => (
						<li key={index} className='flex flex-row items-center justify-start space-x-3'>
							<h1 className='text-normal flex h-8 w-8 items-center justify-center rounded-full font-bold bg-slate-400 text-white'>
								{d.total}
							</h1>
							<h3 className='flex text-xs font-semibold text-slate-600 md:text-sm'>{d.total === 1 ? capitalize(d.category) : capitalize(d.plural)}</h3>
							<h3 className='flex text-xs font-medium text-slate-400 md:text-sm'>{`${d.owner} ${DashboardConfig.owner}`}</h3>
							<div className='flex pl-2'>
								<DropdownMenu>
									<DropdownMenuTrigger className='flex h-6 w-6 items-center justify-center rounded-full bg-slate-200/50 hover:bg-slate-200 focus-visible:ring-transparent focus-visible:ring-offset-0'>
										<EllipsisVertical strokeWidth='2' className='h-4 w-4 text-slate-500' />
									</DropdownMenuTrigger>
									<DropdownMenuContent align='start'>
										<DropdownMenuItem className='gap-2 text-sm' onClick={() => navigate(`${APP_URL}/?c=${d.category}`)}>
											<Home strokeWidth='2' className='h-4 w-4' />
											{DashboardConfig.dropdown.allProducts}
										</DropdownMenuItem>
										<DropdownMenuItem className='gap-2 text-sm' onClick={() => navigate(`${APP_URL}/productos?c=${d.category}`)}>
											<FilePenIcon strokeWidth='2' className='h-4 w-4' />
											{DashboardConfig.dropdown.ownerProducts}
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						</li>
					))}
				</ul>
			</CardContent>
		</Card>
	);
}
// Export React component
export default DashboardHeader;
