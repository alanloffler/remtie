// Shadcn-ui
import { Card } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
// App
import { SettingsConfig } from '@/lib/config/settings.config';
import { mapSettingsSchema } from '@/lib/schemas/settings.schema';
import { SettingsServices } from '@/services/settings.services';
import { zodResolver } from '@hookform/resolvers/zod';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { FormEvent, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { ButtonsConfig } from '@/lib/config/buttons.config';
import { Check } from 'lucide-react';
import { IMapOptions } from '@/lib/interfaces/google-map.interface';
import { ISetting } from '@/lib/interfaces/setting.interface';
// React component
function MapCreateProduct() {
    const [mapOptions, setMapOptions] = useState<IMapOptions>({} as IMapOptions);
    const [setting, setSetting] = useState<ISetting>({} as ISetting);

	const createMapForm = useForm<z.infer<typeof mapSettingsSchema>>({
		resolver: zodResolver(mapSettingsSchema),
		defaultValues: {
			lat: '',
			lng: '',
			zoom: 0,
			mapType: ''
		}
	});
	// #region Load Data
	useEffect(() => {
		function getMapOptions() {
			SettingsServices.findOne('mapCPOptions').then((response) => {
				const options = JSON.parse(response.value);
                setSetting(response);
                setMapOptions(options);
				createMapForm.setValue('lat', options.lat);
				createMapForm.setValue('lng', options.lng);
				createMapForm.setValue('zoom', options.zoom);
				createMapForm.setValue('mapType', options.mapType);
			});
		}
		getMapOptions();
	}, [createMapForm]);
	// #endregion

	function handleMapSubmit(data: z.infer<typeof mapSettingsSchema>) {
        console.log(JSON.stringify(data));
        const mapOptions: string = JSON.stringify(data);
        SettingsServices.update(setting.id, mapOptions).then((response) => {
            console.log(response);
        });
	}

    function handleCancel(event: FormEvent<HTMLButtonElement>) {
        event.preventDefault();
        createMapForm.reset();
        createMapForm.setValue('lat', mapOptions.lat);
        createMapForm.setValue('lng', mapOptions.lng);
        createMapForm.setValue('zoom', mapOptions.zoom);
        createMapForm.setValue('mapType', mapOptions.mapType);
    }

	return (
		<>
			<div className='space-y-4'>
				<Separator className='mb-4' />
				<span className='text-base font-medium text-slate-500'>{SettingsConfig.sections.createMap.title}</span>
				<Card className='p-6'>
					{/* SECTION: Create Product Map */}
					<FormProvider {...createMapForm}>
						<form onSubmit={createMapForm.handleSubmit(handleMapSubmit)} className='flex flex-col items-center space-y-4'>
							<div className='flex w-full flex-row items-center space-x-4'>
								<div className='w-1/3 space-y-7 text-end'>
									<div className='text-sm font-medium text-slate-600'>{SettingsConfig.sections.createMap.form.label.lat}</div>
									<div className='text-sm font-medium text-slate-600'>{SettingsConfig.sections.createMap.form.label.lng}</div>
									<div className='text-sm font-medium text-slate-600'>{SettingsConfig.sections.createMap.form.label.zoom}</div>
									<div className='text-sm font-medium text-slate-600'>{SettingsConfig.sections.createMap.form.label.mapType}</div>
								</div>
								<div className='w-2/3 space-y-4'>
									<FormField
										control={createMapForm.control}
										name='lat'
										render={({ field }) => (
											<FormItem className='flex w-full flex-row items-center'>
												<FormControl className='flex w-full'>
													<div className='flex items-center space-x-4'>
														<Input {...field} type='text' placeholder={SettingsConfig.sections.createMap.form.placeholder.lat} className='h-8' />
													</div>
												</FormControl>
												<FormMessage className='text-xs font-light' />
											</FormItem>
										)}
									/>
									<FormField
										control={createMapForm.control}
										name='lng'
										render={({ field }) => (
											<FormItem className='flex w-full flex-row items-center'>
												<FormControl className='flex w-full'>
													<div className='flex items-center space-x-4'>
														<Input {...field} type='text' placeholder={SettingsConfig.sections.createMap.form.placeholder.lng} className='h-8' />
													</div>
												</FormControl>
												<FormMessage className='text-xs font-light' />
											</FormItem>
										)}
									/>
									<FormField
										control={createMapForm.control}
										name='zoom'
										render={({ field }) => (
											<FormItem className='flex w-full flex-row items-center'>
												<FormControl className='flex w-full'>
													<div className='flex items-center space-x-4'>
														<Input {...field} type='number' placeholder={SettingsConfig.sections.createMap.form.placeholder.zoom} className='h-8 w-1/3' />
													</div>
												</FormControl>
												<FormMessage className='text-xs font-light' />
											</FormItem>
										)}
									/>
									<FormField
										control={createMapForm.control}
										name='mapType'
										render={({ field }) => (
											<FormItem className='w-full space-y-1'>
												<Select onValueChange={(event) => field.onChange(event)} value={field.value}>
													<FormControl>
														<SelectTrigger className='h-8'>
															<SelectValue placeholder='' />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{SettingsConfig.sections.createMap.form.mapTypeOptions.map((option) => {
															return (
																<SelectItem key={option.name} className='text-sm' value={option.value}>
																	{option.name}
																</SelectItem>
															);
														})}
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</div>
							<div className='flex flex-row justify-end gap-6 pt-4 w-full'>
								<Button onClick={(event) => handleCancel(event)} variant='ghost' size='sm' className='h-8 text-xs'>
									{ButtonsConfig.actions.cancel}
								</Button>
								<Button type='submit' variant='ghost' size='sm' className='h-8 gap-2 border border-slate-300 bg-slate-300/50 p-2 text-xs text-slate-400 hover:border-slate-400/50 hover:bg-slate-300 hover:text-slate-500'>
									<Check className='h-3 w-3' strokeWidth='2' />
									{ButtonsConfig.actions.save}
								</Button>
							</div>
						</form>
					</FormProvider>
				</Card>
			</div>
		</>
	);
}
// Export React component
export default MapCreateProduct;
