import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SettingsConfig } from '@/lib/config/settings.config';
import { ISetting } from '@/lib/interfaces/setting.interface';
import { settingsSchema } from '@/lib/schemas/settings.schema';
import { SettingsServices } from '@/services/settings.services';
import { zodResolver } from '@hookform/resolvers/zod';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { Check, Pencil } from 'lucide-react';
import { MouseEvent, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

function MapId() {
	const [disabledInput, setDisabledInput] = useState<boolean>(true);
	const [mapIdSetting, setMapIdSetting] = useState<ISetting>({} as ISetting);

	const mapIdForm = useForm<z.infer<typeof settingsSchema>>({
		resolver: zodResolver(settingsSchema),
		defaultValues: {
			value: ''
		}
	});
	useEffect(() => {
		SettingsServices.findOne('mapId').then((response) => {
			setMapIdSetting(response);
			mapIdForm.setValue('value', response.value);
		});
	}, [mapIdForm]);

	function handleDisabledInput(event: MouseEvent) {
		event.preventDefault();
		setDisabledInput(!disabledInput);
	}

	function handleMapIdSubmit(data: z.infer<typeof settingsSchema>) {
		SettingsServices.update(mapIdSetting.id, data.value).then((response) => {
			console.log(response);
            setDisabledInput(!disabledInput);
		});
	}

	return (
		<div className='space-y-4'>
			<Separator className='mb-4' />
			<span className='flex text-base font-medium text-slate-500'>{SettingsConfig.sections.mapId.title}</span>
			<span className='flex text-sm font-normal text-slate-500'>{SettingsConfig.sections.mapId.subtitle}</span>
			<Card className='p-6'>
				{/* SECTION: Map Identificator */}
				<FormProvider {...mapIdForm}>
					<form onSubmit={mapIdForm.handleSubmit(handleMapIdSubmit)} className='flex flex-col items-center space-y-4'>
						<div className='flex w-full flex-row items-center space-x-4'>
							<div className='w-1/3 space-y-7 text-end'>
								<div className='text-sm font-medium text-slate-600'>{SettingsConfig.sections.formMaps.form.label.mapId}</div>
							</div>
							<div className='flex w-2/3 items-center space-x-4'>
								<FormField
									control={mapIdForm.control}
									name='value'
									render={({ field }) => (
										<FormItem className='flex w-full flex-row items-center'>
											<FormControl className='flex w-full'>
												<div className='flex items-center space-x-4'>
													<Input disabled={disabledInput} {...field} type='text' placeholder={SettingsConfig.sections.formMaps.form.placeholder.mapId} className='h-8' />
												</div>
											</FormControl>
											<FormMessage className='text-xs font-light' />
										</FormItem>
									)}
								/>
							</div>
							<Button onClick={(event) => handleDisabledInput(event)} variant='outline' size='miniIcon' className='px-2'>
								<Pencil className='h-4 w-4' strokeWidth='1.5' />
							</Button>
							<Button disabled={disabledInput} type='submit' variant='outline' size='miniIcon' className='px-2'>
								<Check className='h-4 w-4' strokeWidth='1.5' />
							</Button>
						</div>
					</form>
				</FormProvider>
			</Card>
		</div>
	);
}
export default MapId;
