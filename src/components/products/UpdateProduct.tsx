// Icons: Lucide (https://lucide.dev/)
import { ArrowLeft, Trash2, BadgeX, CheckCircle } from 'lucide-react';
// UI: Shadcn-ui (https://ui.shadcn.com/)
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
// App
import z from 'zod';
import { BusinessServices } from '@/services/business.services';
import { ButtonsConfig } from '@/lib/config/buttons.config';
import { CategoriesServices } from '@/services/categories.services';
import { CitiesServices } from '@/services/cities.services';
import { FieldValues, FormProvider, useForm } from 'react-hook-form';
import { FormEvent, ReactElement, useEffect, useState } from 'react';
import { IBusiness, ICategory } from '@/lib/interfaces/inputs.interface';
import { ICity } from '@/lib/interfaces/city.interface';
import { IDialog } from '@/lib/interfaces/dialog.interface';
import { IImage } from '@/lib/interfaces/image.interface';
import { IProperty } from '@/lib/interfaces/property.interface';
import { IState } from '@/lib/interfaces/state.interface';
import { ImageServices } from '@/services/image.services';
import { ProductsConfig } from '@/lib/config/products.config';
import { ProductsServices } from '@/services/products.services';
import { Roles } from '@/lib/constants';
import { StatesServices } from '@/services/states.services';
import { getImageURL } from '@/lib/image-util';
import { handleServerResponse } from '@/lib/handleServerResponse';
import { imageFormSchema } from '@/lib/schemas/image.schema';
import { propertySchema } from '@/lib/schemas/property.schema';
import { store } from '@/services/store.services';
import { useCapitalize } from '@/hooks/useCapitalize';
import { useNavigate, useParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
// .env constants
const API_KEY: string = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const APP_URL: string = import.meta.env.VITE_APP_URL;
// Google Map
import { APIProvider, Map, AdvancedMarker, MapMouseEvent } from '@vis.gl/react-google-maps';
import { IMapOptions, IMarkerProp } from '@/lib/interfaces/google-map.interface';
import { SettingsServices } from '@/services/settings.services';
import { confirmMapExistence } from '@/lib/utils';
// React component
function UpdateProduct() {
	const { id } = useParams();
	const capitalize = useCapitalize();
	const navigate = useNavigate();
	const propertyId = Number(id);
	const [business, setBusiness] = useState<IBusiness[]>([]);
	const [businessKey, setBusinessKey] = useState<number>(0);
	const [categories, setCategories] = useState<ICategory[]>([]);
	const [categoriesKey, setCategoriesKey] = useState<number>(0);
	const [chosenImage, setChosenImage] = useState<string>('');
	const [cities, setCities] = useState<ICity[]>([]);
	const [citiesSelect, setCitiesSelect] = useState<ICity[]>([]);
	const [citiesSelectKey, setCitiesSelectKey] = useState<number>(0);
	const [citySelectDisabled, setCitySelectDisabled] = useState<boolean>(true);
	const [dialogAction, setDialogAction] = useState<string>('');
	const [imageDialog, setImageDialog] = useState<IDialog>({ id: 0, name: '', title: '', subtitle: '', message: <span></span> });
	const [images, setImages] = useState<IImage[]>([]);
	const [openDialog, setOpenDialog] = useState<boolean>(false);
	const [property, setProperty] = useState<IProperty>({} as IProperty);
	const [statesSelect, setStatesSelect] = useState<IState[]>([]);
	const [statesSelectKey, setStatesSelectKey] = useState<number>(0);
	const [updateUI, setUpdateUI] = useState<number>(0);
	// Google Map
	const [addMarker, setAddMarker] = useState<boolean>(false);
	const [mapId, setMapId] = useState<string>('');
	const [mapOptions, setMapOptions] = useState<IMapOptions>({} as IMapOptions);
	const [marker, setMarker] = useState<IMarkerProp>({} as IMarkerProp);
	const [showMap, setShowMap] = useState<boolean>(false);
	// #region Forms declaration
	const propertyForm = useForm<z.infer<typeof propertySchema>>({
		resolver: zodResolver(propertySchema),
		values: {
			type: '',
			business_type: '',
			title: '',
			short_description: '',
			long_description: '',
			street: '',
			city: 0,
			state: 0,
			zip: '',
			is_active: true,
			price: 0
		}
	});

	const imageForm = useForm<z.infer<typeof imageFormSchema>>({
		resolver: zodResolver(imageFormSchema),
		defaultValues: {
			file: undefined
		}
	});
	// #endregion
	// #region Load data
	useEffect(() => {
		ProductsServices.findOne(propertyId).then((response) => {
			if (!response.statusCode) {
				setProperty(response);
				propertyForm.setValue('type', response.type);
				propertyForm.setValue('business_type', response.business_type);
				propertyForm.setValue('title', response.title);
				propertyForm.setValue('short_description', response.short_description);
				propertyForm.setValue('long_description', response.long_description);
				propertyForm.setValue('street', response.street);
				propertyForm.setValue('city', response.city.id);
				propertyForm.setValue('state', response.state.id);
				propertyForm.setValue('zip', response.zip);
				propertyForm.setValue('price', response.price);
				propertyForm.setValue('is_active', Boolean(response.is_active));
				// Google Map
				const newMarker: IMarkerProp = { propertyId: response.id, lat: Number(response.lat), lng: Number(response.lng), key: response.key, zoom: Number(response.zoom) };
				const confirmedMapExistence = confirmMapExistence(newMarker);
				if (confirmedMapExistence) {
					setMarker(newMarker);
					setAddMarker(true);
					setShowMap(true);
				} else {
					setAddMarker(false);
					setShowMap(true);
					return;
				}
			}
			handleServerResponse(response);
		});

		BusinessServices.findAllUI().then((response) => {
			if (!response.statusCode) {
				setBusiness(response);
				setBusinessKey(Math.random());
			}
			handleServerResponse(response);
		});

		CategoriesServices.findAllUI().then((response) => {
			if (!response.statusCode) {
				setCategories(response);
				setCategoriesKey(Math.random());
			}
			handleServerResponse(response);
		});

		CitiesServices.findAll().then((response) => {
			if (!response.statusCode) {
				setCitiesSelect(response);
				setCities(response);
				setCitiesSelectKey(Math.random());
			}
			handleServerResponse(response);
		});

		StatesServices.findAll().then((response) => {
			if (!response.statusCode) {
				setStatesSelect(response);
				setStatesSelectKey(Math.random());
			}
			handleServerResponse(response);
		});

		SettingsServices.findOne('mapId').then((response) => {
			if (!response.statusCode) setMapId(response.value);
			handleServerResponse(response);
		});

		SettingsServices.findOne('mapCPOptions').then((response) => {
			if (!response.statusCode) {
				setMapOptions(JSON.parse(response.value));
				setShowMap(true);
			}
			handleServerResponse(response);
		});
	}, [propertyId, propertyForm]);

	useEffect(() => {
		ImageServices.findByProperty(propertyId).then((response) => {
			if (!response.statusCode) setImages(response);
			handleServerResponse(response);
		});
	}, [propertyId, updateUI]);
	// #endregion
	// #region Forms actions
	function handleSubmitProduct(values: z.infer<typeof propertySchema>) {
		const color: string | undefined = categories.find((cat) => cat.name === values.type)?.color;
		const isActive: number = values.is_active === true ? 1 : 0;
		const propertyData = { ...values, color: color ? color : '', is_active: isActive, lat: marker.lat, lng: marker.lng, key: marker.key, zoom: marker.zoom };
		ProductsServices.update(propertyId, propertyData).then((response) => handleServerResponse(response));
	}

	function handleSubmitImage(data: FieldValues) {
		ImageServices.create(propertyId, data.file[0]).then((response) => {
			if (!response.statusCode) {
				ImageServices.findByProperty(propertyId).then((resp) => {
					if (!resp.statusCode) setImages(resp);
					handleServerResponse(resp);
				});
				imageForm.reset();
			}
			handleServerResponse(response);
		});
	}

	function handleInputChange(event: FormEvent<HTMLInputElement>) {
		setChosenImage(event.currentTarget.value.split('\\')[2]);
	}
	// #endregion
	// #region Dialog
	function handleDialog(image: IImage, action: string) {
		let message: ReactElement | false = false;
		let subtitle: string = '';

		if (action === 'removeSoft') {
			subtitle = ProductsConfig.dialog.possibleRevertion;
			message = (
				<div className='flex flex-col'>
					<span>{ProductsConfig.imageDialog.imageSoftDelete}</span>
					<span className='text-md font-bold text-slate-900'>{image.id < 10 ? `COD/0${image.id}` : `COD/${image.id}`}</span>
				</div>
			);
		}
		if (action === 'remove') {
			subtitle = ProductsConfig.dialog.impossibleRevertion;
			message = (
				<div className='flex flex-col'>
					<span>{ProductsConfig.imageDialog.imageDelete}</span>
					<span className='text-md font-bold text-slate-900'>{image.id < 10 ? `COD/0${image.id}` : `COD/${image.id}`}</span>
				</div>
			);
		}
		if (action === 'restore') {
			subtitle = ProductsConfig.dialog.possibleRevertion;
			message = (
				<div className='flex flex-col'>
					<span>{ProductsConfig.imageDialog.imageRestore}</span>
					<span className='text-md font-bold text-slate-900'>{image.id < 10 ? `COD/0${image.id}` : `COD/${image.id}`}</span>
				</div>
			);
		}

		setOpenDialog(true);
		setImageDialog({
			id: Number(image.id),
			name: '',
			title: ProductsConfig.dialog.title,
			subtitle: subtitle,
			message: message
		});
		setDialogAction(action);
	}
	// #endregion
	// #region Buttons actions (Images)
	async function removeSoft(id: number) {
		ImageServices.removeSoft(id).then((response) => {
			if (response.statusCode === 200) setUpdateUI(Math.random());
			handleServerResponse(response);
		});
		setOpenDialog(false);
	}

	async function remove(id: number) {
		ImageServices.remove(id).then((response) => {
			if (response.statusCode === 200) setUpdateUI(Math.random());
			handleServerResponse(response);
		});
		setOpenDialog(false);
	}

	async function restore(id: number) {
		ImageServices.restore(id).then((response) => {
			if (response.statusCode === 200) setUpdateUI(Math.random());
			handleServerResponse(response);
		});
		setOpenDialog(false);
	}

	function switchActive(check: boolean) {
		ProductsServices.switchActive(propertyId, check).then((response) => handleServerResponse(response));
	}

	function fillZipCode(event: string) {
		propertyForm.setValue('zip', citiesSelect.find((city) => city.city === event)?.zip || '');
	}

	function filterCitiesByState(state: string) {
		setCitySelectDisabled(false);
		setCitiesSelectKey(Math.random());
		setCitiesSelect(cities.filter((city) => city.state?.id === Number(state)));
		propertyForm.setValue('city', 0);
		propertyForm.setValue('zip', '');
	}
	// #endregion
	// #region Google Maps
	function createMarker(event: MapMouseEvent) {
		const uuid: string = self.crypto.randomUUID();
		const newMarker: IMarkerProp = {
			propertyId: propertyId,
			lat: event.detail.latLng?.lat || 0,
			lng: event.detail.latLng?.lng || 0,
			key: `marker-${uuid}`,
			zoom: event.map.getZoom() || 0
		};
		setMarker(newMarker);
		setAddMarker(true);
	}
	// #endregion
	return (
		<main className='flex-1 animate-fadeIn overflow-y-auto'>
			<div className='flex flex-row items-center justify-between px-8 pt-8'>
				<h1 className='text-2xl font-normal text-slate-600'>{ProductsConfig.pages.update.title}</h1>
				<Button variant='ghost' size='sm' onClick={() => navigate(-1)}>
					<ArrowLeft className='mr-2 h-4 w-4' />
					{ButtonsConfig.actions.back}
				</Button>
			</div>
			<div className='mt-6 flex flex-col items-center justify-center px-8'>
				<Card className='flex w-full flex-row py-8 md:w-[500px] lg:w-[650px]'>
					<CardContent className='mx-0 w-full p-0'>
						{/* SECTION: Property form */}
						<Form {...propertyForm}>
							<form onSubmit={propertyForm.handleSubmit(handleSubmitProduct)} className='space-y-8'>
								<div className='container mx-auto space-y-4'>
									<div className='flex w-full flex-col font-semibold text-slate-800'>
										{ProductsConfig.pages.create.subtitle}
										<Separator className='mt-2' />
									</div>
									<div className='flex py-4 text-xs font-bold uppercase text-slate-500'>
										<div className='flex w-auto flex-row items-center rounded-sm bg-slate-200/70 px-2 py-1 text-sm leading-tight'>{property?.id < 10 ? 'Cod/0' + property?.id : 'Cod/' + property?.id}</div>
									</div>
									<div className='flex w-1/2 flex-col gap-4 md:w-2/3 md:flex-row md:gap-6'>
										<FormField
											control={propertyForm.control}
											name='business_type'
											render={({ field }) => (
												<FormItem className='w-full space-y-1'>
													<FormLabel className='font-semibold text-slate-500'>{ProductsConfig.form.type}</FormLabel>
													<Select key={businessKey} value={field.value} onValueChange={(event) => field.onChange(event)}>
														<FormControl>
															<SelectTrigger>
																<SelectValue />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															{business.map((el) => (
																<SelectItem key={el.id} value={el.name} className='text-sm'>
																	{capitalize(el.name)}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
													<FormMessage className='text-xs font-light' />
												</FormItem>
											)}
										/>
										<FormField
											control={propertyForm.control}
											name='type'
											render={({ field }) => (
												<FormItem className='w-full space-y-1'>
													<FormLabel className='font-semibold text-slate-500'>{ProductsConfig.form.category}</FormLabel>
													<Select key={categoriesKey} value={field.value} onValueChange={(event) => field.onChange(event)}>
														<FormControl>
															<SelectTrigger>
																<SelectValue />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															{categories.map((el) => (
																<SelectItem key={el.id} value={el.name} className='text-sm'>
																	{capitalize(el.name)}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
													<FormMessage className='text-xs font-light' />
												</FormItem>
											)}
										/>
									</div>
									<div className='flex flex-col gap-4 md:flex-row md:gap-6'>
										<div className='flex flex-row md:w-1/2 md:flex-col'>
											<FormField
												control={propertyForm.control}
												name='title'
												render={({ field }) => (
													<FormItem className='w-full space-y-1'>
														<FormLabel className='font-semibold text-slate-500'>{ProductsConfig.form.title}</FormLabel>
														<FormControl>
															<Input {...field} />
														</FormControl>
														<FormMessage className='text-xs font-light' />
													</FormItem>
												)}
											/>
										</div>
										<div className='flex flex-row md:w-1/2 md:flex-col'>
											<FormField
												control={propertyForm.control}
												name='short_description'
												render={({ field }) => (
													<FormItem className='w-full space-y-1'>
														<FormLabel className='font-semibold text-slate-500'>{ProductsConfig.form.shortDescription}</FormLabel>
														<FormControl>
															<Input {...field} />
														</FormControl>
														<FormMessage className='text-xs font-light' />
													</FormItem>
												)}
											/>
										</div>
									</div>
									<div className='mt-4 flex flex-col'>
										<FormField
											control={propertyForm.control}
											name='long_description'
											render={({ field }) => (
												<FormItem className='w-full space-y-1'>
													<FormLabel className='font-semibold text-slate-500'>{ProductsConfig.form.longDescription}</FormLabel>
													<FormControl>
														<Textarea {...field} className='h-28'></Textarea>
													</FormControl>
													<FormMessage className='text-xs font-light' />
												</FormItem>
											)}
										/>
									</div>
									<div className='flex w-full flex-col pt-4 font-semibold text-slate-800'>
										{ProductsConfig.form.address}
										<Separator className='mt-2' />
									</div>
									<div className='flex flex-row gap-6 md:flex-row md:gap-6'>
										<div className='flex w-full flex-row md:w-1/2 md:flex-col'>
											<FormField
												control={propertyForm.control}
												name='state'
												render={({ field }) => (
													<FormItem className='w-full space-y-1'>
														<FormLabel className='font-semibold text-slate-500'>{ProductsConfig.form.state}</FormLabel>
														<Select
															key={statesSelectKey}
															onValueChange={(event) => {
																field.onChange(event);
																filterCitiesByState(event);
															}}>
															<FormControl>
																<SelectTrigger>
																	<SelectValue placeholder='' />
																</SelectTrigger>
															</FormControl>
															<SelectContent>
																{statesSelect.map((el) => (
																	<SelectItem key={el.id} value={String(el.id)} className='text-sm'>
																		{capitalize(el.state)}
																	</SelectItem>
																))}
															</SelectContent>
														</Select>
														<FormMessage className='text-xs font-light' />
													</FormItem>
												)}
											/>
										</div>
										<div className='flex w-full flex-row md:w-1/2 md:flex-col'>
											<FormField
												control={propertyForm.control}
												name='city'
												render={({ field }) => (
													<FormItem className='w-full space-y-1'>
														<FormLabel className='font-semibold text-slate-500'>{ProductsConfig.form.city}</FormLabel>
														<Select
															disabled={citySelectDisabled}
															key={citiesSelectKey}
															onValueChange={(event) => {
																field.onChange(event);
																fillZipCode(event);
															}}
															value={String(field.value)}>
															<FormControl>
																<SelectTrigger>
																	<SelectValue placeholder='' />
																</SelectTrigger>
															</FormControl>
															<SelectContent>
																{citiesSelect.map((el) => (
																	<SelectItem key={el.id} value={String(el.city)} className='text-sm'>
																		{capitalize(el.city)}
																	</SelectItem>
																))}
															</SelectContent>
														</Select>
														<FormMessage className='text-xs font-light' />
													</FormItem>
												)}
											/>
										</div>
									</div>
									<div className='flex flex-row gap-6 md:flex-row md:gap-6'>
										<div className='flex w-full flex-row md:w-1/2 md:flex-col'>
											<FormField
												control={propertyForm.control}
												name='street'
												render={({ field }) => (
													<FormItem className='w-full space-y-1'>
														<FormLabel className='font-semibold text-slate-500'>{ProductsConfig.form.street}</FormLabel>
														<FormControl>
															<Input {...field} />
														</FormControl>
														<FormMessage className='text-xs font-light' />
													</FormItem>
												)}
											/>
										</div>
										<div className='flex w-full flex-row md:w-1/2 md:flex-col'>
											<FormField
												control={propertyForm.control}
												name='zip'
												render={({ field }) => (
													<FormItem className='w-full space-y-1'>
														<FormLabel className='font-semibold text-slate-500'>{ProductsConfig.form.zip}</FormLabel>
														<FormControl>
															<Input disabled type='text' {...field} />
														</FormControl>
														<FormMessage className='text-xs font-light' />
													</FormItem>
												)}
											/>
										</div>
									</div>
									<div className='flex flex-row place-items-center gap-6 md:flex-row md:gap-6'>
										<div className='flex w-2/3 flex-row md:w-1/3 md:flex-col'>
											<FormField
												control={propertyForm.control}
												name='price'
												render={({ field }) => (
													<FormItem className='w-full space-y-1'>
														<FormLabel className='font-semibold text-slate-500'>{ProductsConfig.form.price}</FormLabel>
														<FormControl>
															<Input type='text' inputMode='numeric' {...field} />
														</FormControl>
														<FormMessage className='text-xs font-light' />
													</FormItem>
												)}
											/>
										</div>
										<div className='mt-8 flex w-2/3 flex-row md:w-2/3 md:flex-col'>
											<FormField
												control={propertyForm.control}
												name='is_active'
												render={({ field }) => (
													<FormItem className='flex w-full justify-end'>
														<FormControl>
															<div className='flex items-center space-x-2'>
																<Switch key={+new Date()} id='is_active' defaultChecked={field.value} onCheckedChange={(check: boolean) => switchActive(check)} className='data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-input' />
																<Label htmlFor='is_active'>{ProductsConfig.form.active}</Label>
															</div>
														</FormControl>
														<FormMessage className='text-xs font-light' />
													</FormItem>
												)}
											/>
										</div>
									</div>
									{/* Google Maps */}
									{showMap && (
										<div className='flex flex-row pt-2'>
											<APIProvider apiKey={API_KEY}>
												{/* prettier-ignore */}
												<Map 
                                                    className='w-full h-80 md:h-96 lg:h-96'
                                                    mapId={mapId}
                                                    defaultCenter={{ lat: Number(property.lat), lng: Number(property.lng) }} 
                                                    defaultZoom={property.zoom || mapOptions.zoom}
                                                    mapTypeId={mapOptions.mapType}
                                                    gestureHandling={'greedy'} 
                                                    disableDefaultUI={false}
                                                    disableDoubleClickZoom={true}
                                                    controlSize={25} 
                                                    onDblclick={(event) => createMarker(event)} 
                                                    onZoomChanged={(event) => setMarker({ ...marker, zoom: event.map.getZoom() || 10 })}              
                                                >
                                                    {addMarker && <AdvancedMarker position={marker} />}
                                                </Map>
											</APIProvider>
										</div>
									)}
									<div className='flex flex-row justify-end space-x-4 pt-4'>
										<Button
											variant='ghost'
											onClick={(e) => {
												e.preventDefault();
												navigate(-1);
											}}>
											{ButtonsConfig.actions.cancel}
										</Button>
										<Button type='submit' variant='default'>
											{ButtonsConfig.actions.save}
										</Button>
									</div>
								</div>
							</form>
						</Form>
						<div className='px-8'>
							<Accordion type='single' collapsible>
								<AccordionItem value='item-1' className='border-none'>
									<AccordionTrigger className='justify-start gap-2 pb-0 pt-4'>{ProductsConfig.form.editImages}</AccordionTrigger>
									<AccordionContent className='py-0'>
										{/* SECTION: Images list */}
										<div className='grid gap-4 pt-6'>
											{images.map((img, i) => {
												return (
													<Card key={img.id} className='bg-slate-100/50 px-2 py-2'>
														<div className='flex flex-row place-items-center justify-between'>
															<div className='flex h-6 flex-row space-x-2'>
																<img src={getImageURL(img.name)} />
																<h2 className='flex flex-row place-items-center text-xs font-medium text-slate-900'># {i + 1}</h2>
															</div>
															<div className='hidden flex-row text-xs font-light text-slate-400 xs:block md:block lg:block'>{img.name}</div>
															<div className='flex flex-row items-center gap-2'>
																{img.deletedAt === null ? (
																	<Button
																		onClick={() => {
																			handleDialog(img, 'removeSoft');
																		}}
																		variant='ghost'
																		size='miniIcon'
																		className='h-7 w-7 rounded-full border bg-white text-slate-400/70 shadow-sm hover:bg-white hover:text-rose-500'>
																		<Trash2 className='h-4 w-4' />
																	</Button>
																) : (
																	<Button
																		onClick={() => {
																			handleDialog(img, 'restore');
																		}}
																		variant='ghost'
																		size='miniIcon'
																		className='h-7 w-7 rounded-full border bg-white text-slate-400/70 shadow-sm hover:bg-white hover:text-emerald-400'>
																		<CheckCircle className='h-4 w-4' />
																	</Button>
																)}
																{store.getState().role === Roles.ADMIN && (
																	<Button
																		onClick={() => {
																			handleDialog(img, 'remove');
																		}}
																		variant='ghost'
																		size='miniIcon'
																		className='h-7 w-7 rounded-full border bg-white text-slate-400/70 shadow-sm hover:bg-white hover:text-rose-500'>
																		<BadgeX className='h-5 w-5' strokeWidth='1.5' />
																	</Button>
																)}
															</div>
														</div>
													</Card>
												);
											})}
										</div>
										{/* SECTION: File input */}
										{store.getState().userId === property.created_by && (
											<FormProvider {...imageForm}>
												<form onSubmit={imageForm.handleSubmit(handleSubmitImage)}>
													<div className='mt-6 grid w-full grid-cols-1 items-center gap-1.5'>
														<FormField
															control={imageForm.control}
															name='file'
															render={() => (
																<FormItem className='grid grid-cols-1 items-center justify-between space-y-4 md:grid-cols-3 md:space-y-0'>
																	<div className='flex flex-row items-center gap-2 md:col-span-2'>
																		<FormLabel className='h-fit rounded-md border bg-slate-100/70 p-2 font-semibold text-slate-500 hover:cursor-pointer hover:bg-slate-100'>{ProductsConfig.form.chooseImage}</FormLabel>
																		<span className='text-md flex flex-row font-light text-slate-600'>{chosenImage}</span>
																		<FormControl>
																			<Input {...imageForm.register('file')} name='file' type='file' accept='image/*' className='m-0 h-0 w-0 p-0 opacity-0 hover:cursor-pointer' onChange={(e) => handleInputChange(e)} />
																		</FormControl>
																	</div>
																	<div className='flex flex-row place-content-end gap-4 md:col-span-1'>
																		<Button
																			variant='ghost'
																			size='sm'
																			onClick={(e) => {
																				e.preventDefault();
																				imageForm.reset();
																				setChosenImage('');
																			}}
																			className='w-auto px-2 text-xs'>
																			{ButtonsConfig.actions.cancel}
																		</Button>
																		<Button variant='default' size='sm' className='w-auto border-slate-400 bg-slate-400 px-2 text-xs hover:border-slate-500 hover:bg-slate-500' type='submit'>
																			{ButtonsConfig.actions.save}
																		</Button>
																	</div>
																	<FormMessage className='text-xs font-light' />
																</FormItem>
															)}
														/>
													</div>
												</form>
											</FormProvider>
										)}
									</AccordionContent>
								</AccordionItem>
							</Accordion>
						</div>
					</CardContent>
				</Card>
				<section className='py-6'>
					<Button onClick={() => navigate(`${APP_URL}/productos/${propertyId}`)} variant='secondary' size='sm' className='w-auto border bg-slate-200 hover:bg-slate-200/70'>
						{ProductsConfig.pages.view.sentence.goToProperty}
					</Button>
				</section>
				{/* SECTION: Dialog */}
				<Dialog open={openDialog} onOpenChange={setOpenDialog}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>{imageDialog.title}</DialogTitle>
							<DialogDescription>{imageDialog.subtitle}</DialogDescription>
						</DialogHeader>
						<section className='text-sm font-normal'>{imageDialog.message}</section>
						<DialogFooter>
							<div className='mt-6 flex flex-row gap-4'>
								<Button variant='ghost' onClick={() => setOpenDialog(false)}>
									{ButtonsConfig.actions.cancel}
								</Button>
								{dialogAction === 'removeSoft' && (
									<Button variant='delete' onClick={() => removeSoft(imageDialog.id)}>
										{ButtonsConfig.actions.delete}
									</Button>
								)}
								{dialogAction === 'restore' && (
									<Button variant='default' onClick={() => restore(imageDialog.id)}>
										{ButtonsConfig.actions.restore}
									</Button>
								)}
								{dialogAction === 'remove' && (
									<Button variant='delete' onClick={() => remove(imageDialog.id)}>
										{ButtonsConfig.actions.delete}
									</Button>
								)}
							</div>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>
		</main>
	);
}
// Export React component
export default UpdateProduct;
