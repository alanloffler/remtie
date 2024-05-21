// Icons: Lucide (https://lucide.dev/)
import { Check } from 'lucide-react';
// UI: Shadcn-ui (https://ui.shadcn.com/)
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
// App
import { ISetting } from '@/lib/interfaces/setting.interface';
import { SettingsConfig } from '@/lib/config/settings.config';
import { SettingsServices } from '@/services/settings.services';
import { useEffect, useState } from 'react';
// React component
function ProductViewSettings() {
	const [defaultView, setDefaultView] = useState<ISetting>({} as ISetting);
	const [defaultViewChanged, setDefaultViewChanged] = useState<string>('');
	const [displayView, setDisplayView] = useState<string>('');

	useEffect(() => {
		SettingsServices.findOne('defaultView').then((response) => {
			if (response.id) {
				setDefaultView(response);
				setDisplayView(response.value);
			}
			if (response.statusCode > 399) toast({ title: response.statusCode, description: response.message, variant: 'destructive', duration: 5000 });
			if (response instanceof Error) toast({ title: 'Error', description: '500 Internal Server Error | ' + response.message, variant: 'destructive', duration: 5000 });
		});
	}, []);

	function handleChange(event: string) {
		setDefaultViewChanged(event);
	}

	function handleDefaultView() {
		SettingsServices.update(defaultView.id, defaultViewChanged).then((response) => {
			if (response.statusCode === 200) {
				setDisplayView(defaultViewChanged);
				toast({ title: response.statusCode, description: response.message, variant: 'success', duration: 5000 });
			}
			if (response.statusCode > 399) toast({ title: response.statusCode, description: response.message, variant: 'destructive', duration: 5000 });
			if (response instanceof Error) toast({ title: 'Error', description: '500 Internal Server Error | ' + response.message, variant: 'destructive', duration: 5000 });
		});
	}

	return (
		<div className='space-y-2 pb-2'>
            <Separator className='mb-2' />
			<span className='text-base font-medium text-slate-500'>{SettingsConfig.sections.defaultView.title}</span>
			<Card className='p-4 overflow-x-auto space-y-2'>
				<div className='flex flex-row text-sm text-slate-500'>
					{SettingsConfig.sections.defaultView.subtitle}
					<span className='pl-1 font-semibold'>{displayView === 'card' ? SettingsConfig.common.views.card : SettingsConfig.common.views.list}</span>
				</div>
				<div className='flex flex-row gap-4'>
					<Select defaultValue={defaultView.value} onValueChange={handleChange}>
						<SelectTrigger className='h-8 w-[150px]'>
							<SelectValue placeholder={defaultView.value === 'card' ? SettingsConfig.common.views.card : SettingsConfig.common.views.list} />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='card'>{SettingsConfig.common.views.card}</SelectItem>
							<SelectItem value='list'>{SettingsConfig.common.views.list}</SelectItem>
						</SelectContent>
					</Select>
					<Button onClick={handleDefaultView} variant='outline' size='sm' className='h-8 gap-2 border border-slate-300 bg-slate-300/50 p-2 text-xs text-slate-400 hover:border-slate-400/50 hover:bg-slate-300 hover:text-slate-500'>
						<Check className='h-3 w-3' strokeWidth='2' />
						{SettingsConfig.buttons.save}
					</Button>
				</div>
			</Card>
		</div>
	);
}
// Export React component
export default ProductViewSettings;
