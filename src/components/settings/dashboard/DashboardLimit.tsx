// Icons: Lucide (https://lucide.dev/)
import { Check, Plus } from 'lucide-react';
// UI: Shadcn-ui (https://ui.shadcn.com/)
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
// App
import { ISetting } from '@/lib/interfaces/setting.interface';
import { SettingsConfig } from '@/lib/config/settings.config';
import { SettingsServices } from '@/services/settings.services';
import { handleServerResponse } from '@/lib/handleServerResponse';
import { settingsSchema } from '@/lib/schemas/settings.schema';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
// React component
function DashboardLimit() {
	const [setting, setSetting] = useState<ISetting>({} as ISetting);

	const form = useForm<z.infer<typeof settingsSchema>>({
		resolver: zodResolver(settingsSchema),
		values: {
			value: ''
		}
	});
	// #region Load data
	useEffect(() => {
		function findOneSettings(setting: string) {
			SettingsServices.findOne(setting).then((response) => {
				if (!response.statusCode) {
					setSetting(response);
					form.setValue('value', response.value);
				}
                handleServerResponse(response);
			});
		}
		findOneSettings('dashboardLimit');
	}, [form]);
	// #endregion
	// #region Form
	function handleSettingSubmit(event: z.infer<typeof settingsSchema>) {
		SettingsServices.update(setting.id, event.value).then((response) => {
			if (response.statusCode === 200) setSetting({ ...setting, value: event.value });
            handleServerResponse(response);
		});
	}
	// #endregion
	return (
		<div className='space-y-4'>
			<Separator className='mb-2' />
			<span className='flex flex-row text-base font-medium text-slate-500'>{SettingsConfig.sections.dashboardLimit.title}</span>
			<span className='flex flex-row items-center text-sm text-slate-500'>
				{SettingsConfig.showing[0]}
				<span className='px-1 font-semibold'>{setting.value}</span>
				{SettingsConfig.showing[1]}
			</span>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSettingSubmit)} className='flex flex-row items-center space-x-4 py-2'>
					<Plus className='rounded-full border bg-white p-1' />
					<FormField
						control={form.control}
						name='value'
						render={({ field }) => (
							<FormItem className='w-1/3'>
								<FormControl>
									<Input {...field} type='number' className='h-8' />
								</FormControl>
								<FormMessage className='text-xs font-light' />
							</FormItem>
						)}
					/>
					<div className='flex w-1/2'>
						<Button type='submit' variant='ghost' size='sm' className='h-8 gap-2 border border-slate-300 bg-slate-300/50 p-2 text-slate-400 hover:border-slate-400/50 hover:bg-slate-300 hover:text-slate-500'>
							<Check className='h-3 w-3' strokeWidth='2' />
							<span className='text-xs'>{SettingsConfig.buttons.save}</span>
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}
// Export component
export default DashboardLimit;
