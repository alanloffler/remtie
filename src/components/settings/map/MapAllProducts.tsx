// Shadcn-ui
import { Card } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
// App
import { Button } from '@/components/ui/button';
import { ButtonsConfig } from '@/lib/config/buttons.config';
import { Check } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { IMapOptions } from '@/lib/interfaces/google-map.interface';
import { ISetting } from '@/lib/interfaces/setting.interface';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { SettingsConfig } from '@/lib/config/settings.config';
import { SettingsServices } from '@/services/settings.services';
import { handleServerResponse } from '@/lib/handleServerResponse';
import { mapSettingsSchema } from '@/lib/schemas/settings.schema';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
// React component
function MapAllProducts() {
	const [mapOptions, setMapOptions] = useState<IMapOptions>({} as IMapOptions);
	const [setting, setSetting] = useState<ISetting>({} as ISetting);

	const mapForm = useForm<z.infer<typeof mapSettingsSchema>>({
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
			SettingsServices.findOne('mapSPOptions').then((response) => {
				if (!response.statusCode) {
					const options = JSON.parse(response.value);
					setSetting(response);
					setMapOptions(options);
					mapForm.setValue('lat', options.lat);
					mapForm.setValue('lng', options.lng);
					mapForm.setValue('zoom', options.zoom);
					mapForm.setValue('mapType', options.mapType);
				}
				handleServerResponse(response);
			});
		}
		getMapOptions();
	}, [mapForm]);
	// #endregion
	// #region Form actions
	function handleMapSubmit(data: z.infer<typeof mapSettingsSchema>) {
		const mapOptions: string = JSON.stringify(data);
		SettingsServices.update(setting.id, mapOptions).then((response) => handleServerResponse(response));
	}

	function handleCancel(event: FormEvent<HTMLButtonElement>) {
		event.preventDefault();
		mapForm.reset();
		mapForm.setValue('lat', mapOptions.lat);
		mapForm.setValue('lng', mapOptions.lng);
		mapForm.setValue('zoom', mapOptions.zoom);
		mapForm.setValue('mapType', mapOptions.mapType);
	}
	// #endregion
	return (
		<>
			<div className='space-y-4'>
				<Separator className='mb-4' />
				<span className='text-base font-medium text-slate-500'>{SettingsConfig.sections.formMaps.titleSection}</span>
				<Card className='w-full md:w-full lg:w-2/3 p-6'>
					{/* SECTION: Create Product Map */}
					<FormProvider {...mapForm}>
						<form onSubmit={mapForm.handleSubmit(handleMapSubmit)} className='flex flex-col items-center space-y-4'>
							<div className='flex w-full flex-row items-center space-x-4'>
								<div className='w-full space-y-4'>
									<FormField
										control={mapForm.control}
										name='lat'
										render={({ field }) => (
											<FormItem className='flex w-full flex-row items-center'>
												<FormControl className='flex w-full'>
													<div className='flex items-center space-x-4'>
														<div className='w-1/2 text-end text-sm font-medium text-slate-600'>{SettingsConfig.sections.formMaps.form.label.lat}</div>
														<Input {...field} type='text' placeholder={SettingsConfig.sections.formMaps.form.placeholder.lat} className='h-8 w-1/2' />
													</div>
												</FormControl>
												<FormMessage className='text-xs font-light' />
											</FormItem>
										)}
									/>
									<FormField
										control={mapForm.control}
										name='lng'
										render={({ field }) => (
											<FormItem className='flex w-full flex-row items-center'>
												<FormControl className='flex w-full'>
													<div className='flex items-center space-x-4'>
														<div className='w-1/2 text-end text-sm font-medium text-slate-600'>{SettingsConfig.sections.formMaps.form.label.lng}</div>
														<Input {...field} type='text' placeholder={SettingsConfig.sections.formMaps.form.placeholder.lng} className='h-8 w-1/2' />
													</div>
												</FormControl>
												<FormMessage className='text-xs font-light' />
											</FormItem>
										)}
									/>
									<FormField
										control={mapForm.control}
										name='zoom'
										render={({ field }) => (
											<FormItem className='flex w-full flex-row items-center'>
												<FormControl className='flex w-full'>
													<div className='flex items-center space-x-4'>
														<div className='w-1/2 text-end text-sm font-medium text-slate-600'>{SettingsConfig.sections.formMaps.form.label.zoom}</div>
														<Input {...field} type='number' placeholder={SettingsConfig.sections.formMaps.form.placeholder.zoom} className='h-8 w-1/2' />
													</div>
												</FormControl>
												<FormMessage className='text-xs font-light' />
											</FormItem>
										)}
									/>
									<FormField
										control={mapForm.control}
										name='mapType'
										render={({ field }) => (
											<FormItem className='w-full space-y-1'>
												<div className='flex items-center space-x-4'>
													<div className='w-1/2 text-end text-sm font-medium text-slate-600'>{SettingsConfig.sections.formMaps.form.label.mapType}</div>
													<Select onValueChange={(event) => field.onChange(event)} value={field.value}>
														<FormControl>
															<SelectTrigger className='h-8 w-1/2'>
																<SelectValue placeholder='' />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															{SettingsConfig.sections.formMaps.form.mapTypeOptions.map((option) => {
																return (
																	<SelectItem key={option.name} className='text-sm' value={option.value}>
																		{option.name}
																	</SelectItem>
																);
															})}
														</SelectContent>
													</Select>
												</div>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</div>
							<div className='flex w-full flex-row justify-end gap-6 pt-4'>
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
export default MapAllProducts;
