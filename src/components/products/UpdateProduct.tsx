// Icons: Lucide (https://lucide.dev/)
import { ArrowLeft, Trash2, BadgeX, CheckCircle } from 'lucide-react';
// UI: Shadcn-ui (https://ui.shadcn.com/)
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
import { CategoriesServices } from '@/services/categories.services';
import { FieldValues, FormProvider, useForm } from 'react-hook-form';
import { IBusiness, ICategory } from '@/lib/interfaces/inputs.interface';
import { IImage } from '@/lib/interfaces/image.interface';
import { IProperty } from '@/lib/interfaces/property.interface';
import { ImageServices } from '@/services/image.services';
import { ProductsServices } from '@/services/products.services';
import { Roles } from '@/lib/constants';
import { getImageURL } from '@/lib/image-util';
import { imageFormSchema } from '@/lib/schemas/image.schema';
import { propertySchema } from '@/lib/schemas/property.schema';
import { store } from '@/services/store.services';
import { useCapitalize } from '@/hooks/useCapitalize';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
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
	const [action, setAction] = useState<string>('');
	const [imageDialog, setImageDialog] = useState<IImage>({ id: 0, name: '', propertyId: 0, deletedAt: '' });
	const [images, setImages] = useState<IImage[]>([]);
	const [openDialog, setOpenDialog] = useState<boolean>(false);
	const [property, setProperty] = useState<IProperty>({} as IProperty);
    const [updateUI, setUpdateUI] = useState<number>(0);

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
	// #region Find property
	useEffect(() => {
		ProductsServices.findOne(propertyId).then((response) => {
			if (response.id > 0) {
				setProperty(response);
				propertyForm.setValue('type', response.type);
				propertyForm.setValue('business_type', response.business_type);
				propertyForm.setValue('title', response.title);
				propertyForm.setValue('short_description', response.short_description);
				propertyForm.setValue('long_description', response.long_description);
				propertyForm.setValue('street', response.street);
				propertyForm.setValue('city', response.city);
				propertyForm.setValue('state', response.state);
				propertyForm.setValue('zip', response.zip);
				propertyForm.setValue('price', response.price);
				propertyForm.setValue('is_active', Boolean(response.is_active));
			}
			if (response.statusCode > 399) toast({ title: response.statusCode, description: response.message, variant: 'destructive', duration: 5000 });
			if (response instanceof Error) toast({ title: 'Error', description: '500 Internal Server Error | ' + response.message, variant: 'destructive', duration: 5000 });
		});

		BusinessServices.findAllUI().then((response) => {
			setBusiness(response);
			setBusinessKey(Math.random());
		});

		CategoriesServices.findAllUI().then((response) => {
			setCategories(response);
			setCategoriesKey(Math.random());
		});
	}, [propertyId, propertyForm]);

    useEffect(() => {
		ImageServices.findByProperty(propertyId).then((response) => {
			setImages(response);
		});
    }, [propertyId, updateUI]);
	// #endregion
	// #region Submit actions
	function handleSubmitProduct(values: z.infer<typeof propertySchema>) {
		const color: string | undefined = categories.find((cat) => cat.name === values.type)?.color;
		const isActive: number = values.is_active === true ? 1 : 0;
		const propertyData = { ...values, color: color ? color : '', is_active: isActive };
		ProductsServices.update(propertyId, propertyData).then((response) => {
			if (response.statusCode === 200) toast({ title: response.statusCode, description: response.message, variant: 'success', duration: 5000 });
			if (response.statusCode > 399) toast({ title: response.statusCode, description: response.message, variant: 'destructive', duration: 5000 });
			if (response instanceof Error) toast({ title: 'Error', description: '500 Internal Server Error | ' + response.message, variant: 'destructive', duration: 5000 });
		});
	}

	function handleSubmitImage(data: FieldValues) {
		ImageServices.create(propertyId, data.file[0])
			.then((response) => {
				if (response instanceof Error) toast({ title: 'Error', description: '500 Internal Server Error | ' + response.message, variant: 'destructive', duration: 5000 });
				console.log(response);
				if (response.status < 400) {
					ImageServices.findByProperty(propertyId).then((response) => {
						setImages(response);
					});
					toast({ title: response.status, description: response.message, variant: 'success', duration: 5000 });
					imageForm.reset();
				}
				if (response.status > 399) toast({ title: response.status, description: response.message, variant: 'destructive', duration: 5000 });
				// if (response.status === 401) navigate('/');
				// if (response.status > 200) {
				// 	toast({ title: 'Error', description: response.message, variant: 'destructive', duration: 5000 });
				// 	if (response.status === 401) navigate('/');
				// }
				// if (response.status === 200) {
				// 	ImageServices.getByProperty(propertyId).then((response) => {
				// 		setImages(response);
				// 	});
				// 	toast({ title: 'Imágen guardada', description: response.message, variant: 'success', duration: 5000 });
				// 	imageForm.reset();
				// }
			})
			.catch((error) => console.log(error)); // toast here
	}

	function handleDeleteImage(id: number, action: string) {
		if (action === 'removeSoft') {
			ImageServices.removeSoft(id).then((response) => {
				if (response.statusCode === 200) {
					setImages(images.filter((img) => img.id !== id));
                    setUpdateUI(Math.random());
				}
			});
		}
        if (action === 'restore') {
            console.log('restore');
            // ImageServices.restore(id).then((response) => {
            //     if (response.status === 200) {
            //         setImages(images.filter((img) => img.id !== id));
            //     }
            // });
        }
		if (action === 'remove') {
			ImageServices.remove(id).then((response) => {
				if (response.statusCode === 200) {
					setUpdateUI(Math.random());
				}
			});
		}
		setOpenDialog(false);
	}

	function switchActive(check: boolean) {
		ProductsServices.switchActive(propertyId, check).then((response) => {
			if (response.statusCode === 200) toast({ title: response.statusCode, description: response.message, variant: 'success', duration: 5000 });
			if (response.statusCode > 399) toast({ title: response.statusCode, description: response.message, variant: 'destructive', duration: 5000 });
			if (response instanceof Error) toast({ title: 'Error', description: '500 Internal Server Error | ' + response.message, variant: 'destructive', duration: 5000 });
		});
	}

	return (
		<main className='flex-1 overflow-y-auto'>
			<div className='flex flex-row items-center justify-between px-8 pt-8'>
				<h1 className='text-2xl font-normal text-slate-600'>Editar Propiedad</h1>
				<Button variant='ghost' size='sm' onClick={() => navigate(-1)}>
					<ArrowLeft className='mr-2 h-4 w-4' />
					Volver
				</Button>
			</div>
			<div className='mt-6 flex flex-col items-center justify-center px-8'>
				<Card className='flex w-full flex-row py-8 md:w-[500px] lg:w-[650px]'>
					<CardContent className='mx-0 w-full p-0'>
						<FormProvider {...propertyForm}>
							<form onSubmit={propertyForm.handleSubmit(handleSubmitProduct)} className='space-y-8'>
								<div className='container mx-auto space-y-4'>
									<div className='flex w-full flex-col font-semibold text-slate-800'>
										Descripción
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
													<FormLabel className='font-semibold text-slate-500'>Tipo</FormLabel>
													<Select key={businessKey} value={field.value} onValueChange={(event) => field.onChange(event)}>
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
													<FormLabel className='font-semibold text-slate-500'>Categoría</FormLabel>
													<Select key={categoriesKey} value={field.value} onValueChange={(event) => field.onChange(event)}>
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
														<FormLabel className='font-semibold text-slate-500'>Título</FormLabel>
														<FormControl>
															<Input placeholder='' {...field} value={field.value} />
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
														<FormLabel className='font-semibold text-slate-500'>Descripción breve</FormLabel>
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
													<FormLabel className='font-semibold text-slate-500'>Descripción extendida</FormLabel>
													<FormControl>
														<Textarea {...field} className='h-28'></Textarea>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									<div className='flex w-full flex-col pt-4 font-semibold text-slate-800'>
										Dirección
										<Separator className='mt-2' />
									</div>
									<div className='flex flex-row gap-6 md:flex-row md:gap-6'>
										<div className='flex w-2/3 flex-row md:w-2/3 md:flex-col'>
											<FormField
												control={propertyForm.control}
												name='street'
												render={({ field }) => (
													<FormItem className='w-full space-y-1'>
														<FormLabel className='font-semibold text-slate-500'>Calle</FormLabel>
														<FormControl>
															<Input placeholder='' {...field} value={field.value} />
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
														<FormLabel className='font-semibold text-slate-500'>Ciudad</FormLabel>
														<FormControl>
															<Input placeholder='' {...field} value={field.value} />
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
														<FormLabel className='font-semibold text-slate-500'>Provincia</FormLabel>
														<FormControl>
															<Input placeholder='' {...field} value={field.value} />
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
														<FormLabel className='font-semibold text-slate-500'>Código Postal</FormLabel>
														<FormControl>
															<Input type='text' {...field} value={field.value} />
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
														<FormLabel className='font-semibold text-slate-500'>Precio</FormLabel>
														<FormControl>
															<Input type='text' inputMode='numeric' {...field} value={field.value} />
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
																<Switch key={+new Date()} id='is_active' defaultChecked={field.value} onCheckedChange={(check: boolean) => switchActive(check)} className='data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-input' />
																<Label htmlFor='is_active'>Activo</Label>
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
												navigate(-1);
											}}>
											Cancelar
										</Button>
										<Button type='submit' variant='default'>
											Guardar
										</Button>
									</div>
								</div>
							</form>
						</FormProvider>
					</CardContent>
				</Card>
				<div className='my-8 flex w-full flex-col md:w-[500px] lg:w-[650px]'>
					<h1 className='font-semibold text-slate-800'>Gestión de imágenes</h1>
					<Separator className='mt-2' />
					<div className='mt-6 grid gap-4'>
						{images.map((img, i) => {
							return (
								<Card key={img.id} className='px-2 py-2'>
									<div className='flex flex-row place-items-center justify-between'>
										<div className='flex h-5 flex-row'>
											<img src={getImageURL(img.name)} />
											<h2 className='flex flex-row place-items-center pl-3 text-xs font-medium text-slate-900'># {i + 1}</h2>
										</div>
										<div className='hidden flex-row text-xs font-light text-slate-400 xs:block md:block lg:block'>{img.name}</div>
										<div className='flex flex-row gap-2'>
											{img.deletedAt === null ? (
												<Button
													onClick={() => {
														setOpenDialog(true);
														setImageDialog({ id: img.id, name: img.name, propertyId: img.propertyId, deletedAt: img.deletedAt });
														setAction('removeSoft');
													}}
													variant='ghost'
													size='miniIcon'
													className='rounded-full border bg-white text-slate-400/70 shadow-sm hover:bg-white hover:text-rose-500'>
													<Trash2 className='h-4 w-4' />
												</Button>
											) : (
												<Button
													onClick={() => {
														setOpenDialog(true);
														setImageDialog({ id: img.id, name: img.name, propertyId: img.propertyId, deletedAt: img.deletedAt });
														setAction('restore');
													}}
													variant='ghost'
													size='miniIcon'
													className='rounded-full border bg-white text-slate-400/70 shadow-sm hover:bg-white hover:text-emerald-400'>
													<CheckCircle className='h-4 w-4' />
												</Button>
											)}
											{store.getState().role === Roles.ADMIN && (
												<Button
													onClick={() => {
														setOpenDialog(true);
														setImageDialog({ id: img.id, name: img.name, propertyId: img.propertyId, deletedAt: img.deletedAt });
														setAction('remove');
													}}
													variant='ghost'
													size='miniIcon'
													className='rounded-full border bg-white text-slate-400/70 shadow-sm hover:bg-white hover:text-rose-500'>
													<BadgeX className='h-5 w-5' strokeWidth='1.5' />
												</Button>
											)}
										</div>
									</div>
								</Card>
							);
						})}
						<Dialog open={openDialog} onOpenChange={setOpenDialog}>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>¿Estás realmente seguro?</DialogTitle>
									<DialogDescription>Esta acción es imposible de revertir.</DialogDescription>
								</DialogHeader>
								<div>
									<section className='text-sm font-normal'>
										La imágen
										<span className='text-md px-1 font-bold text-slate-900'>{imageDialog.name}</span>
										de la propiedad
										<span className='text-md px-1 font-bold uppercase text-slate-900'>{property.id < 10 ? 'Cod/0' + property.id : 'Cod/' + property.id}</span>
										se eliminará permanentemente de la base de datos.
									</section>
									<DialogFooter>
										<div className='mt-6 flex flex-row gap-4'>
											<Button variant='ghost' onClick={() => setOpenDialog(false)}>
												Cancelar
											</Button>
											<Button variant='delete' onClick={() => handleDeleteImage(imageDialog.id, action)}>
												Eliminar
											</Button>
										</div>
									</DialogFooter>
								</div>
							</DialogContent>
						</Dialog>
					</div>
					{store.getState().userId === property.created_by && (
						<FormProvider {...imageForm}>
							<form onSubmit={imageForm.handleSubmit(handleSubmitImage)}>
								<div className='mt-8 grid w-full max-w-sm items-center gap-1.5'>
									<FormField
										control={imageForm.control}
										name='file'
										render={() => (
											<FormItem className='w-full space-y-1'>
												<FormLabel className='font-semibold text-slate-500'>Agregar imágen</FormLabel>
												<FormControl>
													<Input {...imageForm.register('file')} name='file' type='file' accept='image/*' className='w-full hover:cursor-pointer' />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<div className='mt-8 flex flex-row justify-end space-x-4'>
									<Button
										variant='ghost'
										onClick={(e) => {
											e.preventDefault();
											imageForm.reset();
										}}>
										Cancelar
									</Button>
									<Button variant='default' size='default' className='w-auto' type='submit'>
										Guardar
									</Button>
								</div>
							</form>
						</FormProvider>
					)}
				</div>
			</div>
		</main>
	);
}
// Export React component
export default UpdateProduct;
