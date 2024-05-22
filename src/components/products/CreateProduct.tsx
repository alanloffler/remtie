// Icons: Lucide (https://lucide.dev/)
import { ArrowLeft, Trash2 } from 'lucide-react';
// UI: Shadcn-ui (https://ui.shadcn.com/)
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
// App
import z from 'zod';
import { BusinessServices } from '@/services/business.services';
import { ButtonsConfig } from '@/lib/config/buttons.config';
import { CategoriesServices } from '@/services/categories.services';
import { FieldValues, FormProvider, useForm } from 'react-hook-form';
import { FormEvent, useEffect, useState } from 'react';
import { IBusiness, ICategory } from '@/lib/interfaces/inputs.interface';
import { IImage } from '@/lib/interfaces/image.interface';
import { ImageServices } from '@/services/image.services';
import { ProductsConfig } from '@/lib/config/products.config';
import { ProductsServices } from '@/services/products.services';
import { getImageURL } from '@/lib/image-util';
import { imageFormSchema } from '@/lib/schemas/image.schema';
import { propertySchema } from '@/lib/schemas/property.schema';
import { useCapitalize } from '@/hooks/useCapitalize';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
// .env constants
const APP_URL: string = import.meta.env.VITE_APP_URL;
// React component
function CreateProduct() {
	const [business, setBusiness] = useState<IBusiness[]>([]);
	const [businessKey, setBusinessKey] = useState<number>(0);
	const [categories, setCategories] = useState<ICategory[]>([]);
	const [categoriesKey, setCategoriesKey] = useState<number>(0);
	const [chosenImage, setChosenImage] = useState<string>('');
	const [imageDialog, setImageDialog] = useState<IImage>({ id: 0, name: '', propertyId: 0, deletedAt: '' });
	const [openDialog, setOpenDialog] = useState<boolean>(false);
	const [propertyCreated, setPropertyCreated] = useState<boolean>(false);
	const [propertyId, setPropertyId] = useState<number>(0);
	const [images, setImages] = useState<IImage[]>([]);
	const capitalize = useCapitalize();
	const navigate = useNavigate();

	const propertyForm = useForm<z.infer<typeof propertySchema>>({
		resolver: zodResolver(propertySchema),
		values: {
			type: '',
			business_type: '',
			title: '',
			short_description: '',
			long_description: '',
			street: '',
			city: '',
			state: '',
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
	// #region Load data
	useEffect(() => {
		BusinessServices.findAllUI().then((response) => {
			setBusiness(response);
			setBusinessKey(Math.random());
		});
		CategoriesServices.findAllUI().then((response) => {
			setCategories(response);
			setCategoriesKey(Math.random());
		});
	}, [propertyId, propertyForm]);
	// #endregion
	// #region Form actions
	function handleSubmitProduct(values: z.infer<typeof propertySchema>) {
		const color = categories.find((cat) => cat.name === values.type)?.color;
		let isActive: number;
		values.is_active === true ? (isActive = 1) : (isActive = 0);
		const propertyData = { ...values, color: color ? color : '', is_active: isActive };

		ProductsServices.create(propertyData).then((response) => {
			if (response.id) {
				toast({ title: '200', description: 'Propiedad creada', variant: 'success', duration: 5000 });
				setPropertyCreated(true);
				setPropertyId(response.id);
			}
			if (response.statusCode > 399) toast({ title: response.statusCode, description: response.message, variant: 'destructive', duration: 5000 });
			if (response instanceof Error) toast({ title: 'Error', description: '500 Internal Server Error | ' + response.message, variant: 'destructive', duration: 5000 });
		});
	}

	function handleSubmitImage(data: FieldValues) {
		ImageServices.create(propertyId, data.file[0]).then((response) => {
			if (response.statusCode === 200) {
				ImageServices.findByProperty(propertyId).then((response) => {
					if (!response.statusCode) setImages(response);
					if (response.statusCode > 399) toast({ title: response.statusCode, description: response.message, variant: 'destructive', duration: 5000 });
					if (response instanceof Error) toast({ title: 'Error', description: '500 Internal Server Error | ' + response.message, variant: 'destructive', duration: 5000 });
				});
				toast({ title: response.statusCode, description: response.message, variant: 'success', duration: 5000 });
				imageForm.reset();
				setChosenImage('');
			}
			if (response.statusCode > 399) toast({ title: response.statusCode, description: response.message, variant: 'destructive', duration: 5000 });
			if (response instanceof Error) toast({ title: 'Error', description: '500 Internal Server Error | ' + response.message, variant: 'destructive', duration: 5000 });
		});
	}

	function handleDeleteImage(id: number) {
		ImageServices.remove(id).then((response) => {
			if (response.statusCode === 200) {
				setImages(images.filter((img) => img.id !== id));
				toast({ title: response.statusCode, description: response.message, variant: 'success', duration: 5000 });
			}
			if (response.statusCode > 399) toast({ title: response.statusCode, description: response.message, variant: 'destructive', duration: 5000 });
			if (response instanceof Error) toast({ title: 'Error', description: '500 Internal Server Error | ' + response.message, variant: 'destructive', duration: 5000 });
		});
		setOpenDialog(false);
	}

	function handleInputChange(event: FormEvent<HTMLInputElement>) {
		setChosenImage(event.currentTarget.value.split('\\')[2]);
	}
	// #endregion
	return (
		<main className='flex-1 animate-fadeIn overflow-y-auto'>
			<div className='flex flex-row items-center justify-between px-8 pt-8'>
				<h1 className='text-2xl font-normal text-slate-600'>{ProductsConfig.pages.create.title}</h1>
				<Button variant='ghost' size='sm' onClick={() => navigate(-1)}>
					<ArrowLeft className='mr-2 h-4 w-4' />
					{ButtonsConfig.actions.back}
				</Button>
			</div>
			<div className='mt-6 flex flex-col items-center justify-center px-8'>
				<Card className='flex w-full flex-row py-8 md:w-[500px] lg:w-[650px]'>
					<CardContent className='mx-0 w-full p-0'>
						<FormProvider {...propertyForm}>
							<form onSubmit={propertyForm.handleSubmit(handleSubmitProduct)} className='space-y-8'>
								<div className='container mx-auto space-y-4'>
									<div className='flex w-full flex-col font-semibold text-slate-800'>
										{ProductsConfig.pages.create.subtitle}
										<Separator className='mt-2' />
									</div>
									<div className='flex w-1/2 flex-col gap-4 py-4 md:w-2/3 md:flex-row md:gap-6'>
										<FormField
											control={propertyForm.control}
											name='business_type'
											render={({ field }) => (
												<FormItem className='w-full space-y-1'>
													<FormLabel className='font-semibold text-slate-500'>{ProductsConfig.form.type}</FormLabel>
													<Select key={businessKey} onValueChange={(event) => field.onChange(event)}>
														<FormControl>
															<SelectTrigger>
																<SelectValue placeholder='' />
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
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={propertyForm.control}
											name='type'
											render={({ field }) => (
												<FormItem className='w-full space-y-1'>
													<FormLabel className='font-semibold text-slate-500'>{ProductsConfig.form.category}</FormLabel>
													<Select key={categoriesKey} onValueChange={(event) => field.onChange(event)}>
														<FormControl>
															<SelectTrigger>
																<SelectValue placeholder='' />
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
													<FormMessage />
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
															<Input placeholder='' {...field} />
														</FormControl>
														<FormMessage />
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
															<Input placeholder='' {...field} />
														</FormControl>
														<FormMessage />
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
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									<div className='flex w-full flex-col pt-4 font-semibold text-slate-800'>
										{ProductsConfig.form.address}
										<Separator className='mt-2' />
									</div>
									<div className='flex flex-row gap-6 md:flex-row md:gap-6'>
										<div className='flex w-2/3 flex-row md:w-2/3 md:flex-col'>
											<FormField
												control={propertyForm.control}
												name='street'
												render={({ field }) => (
													<FormItem className='w-full space-y-1'>
														<FormLabel className='font-semibold text-slate-500'>{ProductsConfig.form.street}</FormLabel>
														<FormControl>
															<Input placeholder='' {...field} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
										<div className='flex w-auto flex-row md:w-1/3 md:flex-col'>
											<FormField
												control={propertyForm.control}
												name='city'
												render={({ field }) => (
													<FormItem className='w-full space-y-1'>
														<FormLabel className='font-semibold text-slate-500'>{ProductsConfig.form.city}</FormLabel>
														<FormControl>
															<Input placeholder='' {...field} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
									</div>
									<div className='flex flex-row gap-6 md:flex-row md:gap-6'>
										<div className='flex w-2/3 flex-row md:w-2/3 md:flex-col'>
											<FormField
												control={propertyForm.control}
												name='state'
												render={({ field }) => (
													<FormItem className='w-full space-y-1'>
														<FormLabel className='font-semibold text-slate-500'>{ProductsConfig.form.state}</FormLabel>
														<FormControl>
															<Input placeholder='' {...field} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
										<div className='flex w-auto flex-row md:w-1/3 md:flex-col'>
											<FormField
												control={propertyForm.control}
												name='zip'
												render={({ field }) => (
													<FormItem className='w-full space-y-1'>
														<FormLabel className='font-semibold text-slate-500'>{ProductsConfig.form.zip}</FormLabel>
														<FormControl>
															<Input type='text' {...field} />
														</FormControl>
														<FormMessage />
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
														<FormMessage />
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
																<Switch id='is_active' onCheckedChange={field.onChange} className='data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-input' />
																<Label htmlFor='is_active'>{ProductsConfig.form.active}</Label>
															</div>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
									</div>
									<div className='flex flex-row justify-end space-x-4 pt-6'>
										<Button
											variant='ghost'
											onClick={(e) => {
												e.preventDefault();
												imageForm.reset();
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
						</FormProvider>
						{/* SECTION: Images */}
						{propertyCreated && (
							<div className='px-8'>
								<Accordion type='single' collapsible>
									<AccordionItem value='item-1' className='border-none'>
										<AccordionTrigger className='justify-start gap-2 pb-0 pt-4'>{ProductsConfig.form.addImages}</AccordionTrigger>
										<AccordionContent className='py-0'>
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
																	<Button
																		onClick={() => {
																			setOpenDialog(true);
																			setImageDialog({ id: img.id, name: img.name, propertyId: img.propertyId, deletedAt: img.deletedAt });
																		}}
																		variant='ghost'
																		size='miniIcon'
																		className='h-7 w-7 rounded-full border bg-white text-slate-400/70 shadow-sm hover:bg-white hover:text-rose-500'>
																		<Trash2 className='h-4 w-4' />
																	</Button>
																</div>
															</div>
														</Card>
													);
												})}
												<Dialog open={openDialog} onOpenChange={setOpenDialog}>
													<DialogContent>
														<DialogHeader>
															<DialogTitle>{ProductsConfig.pages.create.dialog.title}</DialogTitle>
															<DialogDescription>{ProductsConfig.pages.create.dialog.subtitle}</DialogDescription>
														</DialogHeader>
														<div>
															<section className='text-sm font-normal'>
																<span className='flex flex-row'>{ProductsConfig.pages.create.dialog.message}</span>
																<span className='text-md px-1 font-bold text-slate-900'>{imageDialog.name}</span>
															</section>
															<DialogFooter>
																<div className='mt-6 flex flex-row gap-4'>
																	<Button variant='ghost' onClick={() => setOpenDialog(false)}>
																		{ButtonsConfig.actions.cancel}
																	</Button>
																	<Button variant='delete' onClick={() => handleDeleteImage(imageDialog.id)}>
																		{ButtonsConfig.actions.delete}
																	</Button>
																</div>
															</DialogFooter>
														</div>
													</DialogContent>
												</Dialog>
											</div>
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
																			variant='outline'
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
																	<FormMessage />
																</FormItem>
															)}
														/>
													</div>
												</form>
											</FormProvider>
										</AccordionContent>
									</AccordionItem>
								</Accordion>
							</div>
						)}
					</CardContent>
				</Card>
				<section className='py-6'>
					{propertyCreated && (
						<Button onClick={() => navigate(`${APP_URL}/productos/${propertyId}`)} variant='secondary' size='sm' className='w-auto border bg-slate-200 hover:bg-slate-200/70'>
							{ProductsConfig.form.goToProperty}
						</Button>
					)}
				</section>
			</div>
		</main>
	);
}
// Export React component
export default CreateProduct;
