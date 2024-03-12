// Icons: Lucide (https://lucide.dev/)
import { ArrowLeft, Trash } from 'lucide-react';
// UI: Shadcn-ui (https://ui.shadcn.com/)
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
// App
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FieldValues, FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { ProductsServices } from '@/services/products.services';
import { ImageServices } from '@/services/image.services';
import { getImageURL } from '@/lib/image-util';
import { IImage, Property } from '@/lib/interfaces';
import { BusinessServices } from '@/services/business.services';
import { CategoriesServices } from '@/services/categories.services';
import { IBusiness, ICategory } from '@/lib/inputs.interfaces';
// import { store } from '@/services/store.services';
// Zod schema
const propertySchema = z.object({
	type: z.string().min(1, {
		message: 'Debes seleccionar un tipo'
	}),
	business_type: z.string().min(1, {
		message: 'Debes seleccionar un tipo'
	}),
	title: z.string().min(3, {
		message: 'El título debe poseer al menos 3 caracteres'
	}),
	short_description: z.string().min(3, {
		message: 'La descripción breve debe poseer al menos 3 caracteres'
	}),
	long_description: z.string().min(3, {
		message: 'La descripción extendida debe poseer al menos 3 caracteres'
	}),
	street: z.string().min(3, {
		message: 'La calle debe poseer al menos 3 caracteres'
	}),
	city: z.string().min(3, {
		message: 'La ciudad debe poseer al menos 3 caracteres'
	}),
	state: z.string().min(3, {
		message: 'La provincia debe poseer al menos 3 caracteres'
	}),
	zip: z.string().min(4, {
		message: 'El código postal debe poseer 4 cifras'
	}),
	is_active: z.boolean().default(true),
	price: z.coerce
        .number({ invalid_type_error: 'El precio debe ser un número' })
        .positive({ message: 'El precio debe ser positivo'})
        .gte(1000, { message: 'El precio debe ser un número de 4 dígitos'})
});
// React component
function UpdateProduct() {
	const { id } = useParams();
	const propertyId = Number(id);
	const [property, setProperty] = useState<Property>({} as Property);
	const [images, setImages] = useState<IImage[]>([]);
	const [business, setBusiness] = useState<IBusiness[]>([]);
	const [businessKey, setBusinessKey] = useState<number>(0);
	const [categories, setCategories] = useState<ICategory[]>([]);
	const [categoriesKey, setCategoriesKey] = useState<number>(0);
	const navigate = useNavigate();

	const IMAGE_TYPES: string[] = ['image/jpg', 'image/jpeg', 'image/png'];
	// react-hook-form schema SACAR AFUERA DEL COMPONENTE
	const propertyForm = useForm<z.infer<typeof propertySchema>>({
		resolver: zodResolver(propertySchema),
        values: {
            type:'',
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

	useEffect(() => {
		ProductsServices.getProduct(propertyId).then((response) => {
			if (response.status > 400) console.log('error', response); //manage toast
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
		});
		ImageServices.getByProperty(propertyId).then((response) => {
			setImages(response);
		});
		BusinessServices.getBusiness().then((response) => {
			setBusiness(response);
			setBusinessKey(+new Date());
		});
		CategoriesServices.getCategories().then((response) => {
			setCategories(response);
			setCategoriesKey(+new Date());
		});
	}, [propertyId, propertyForm]);

	function handleDeleteImage(id: number) {
		ImageServices.delete(id).then((response) => {
			console.log(response);
			if (response.status === 200) setImages(images.filter((img) => img.id !== id));
		});
	}

	const userFormSchema = z.object({
		file: z.custom<FileList>().refine(
			(file) => {
				return IMAGE_TYPES.includes(file[0].type);
			},
			{ message: 'Imágenes de tipo .jpg, .jpeg o .png solamente.' }
		)
	});

	const form = useForm<z.infer<typeof userFormSchema>>({
		resolver: zodResolver(userFormSchema),
		defaultValues: {
			file: undefined
		}
	});

	function onSubmit(data: FieldValues) {
		ImageServices.create(propertyId, data.file[0]).then((response) => {
			if (response instanceof Error) toast({ title: 'Error', description: '500 Internal Server Error | ' + response.message, variant: 'destructive', duration: 5000 });
			if (response.status > 200) {
				toast({ title: 'Error', description: response.message, variant: 'destructive', duration: 5000 });
				if (response.status === 401) navigate('/');
			}
			if (response.status === 200) {
				ImageServices.getByProperty(propertyId).then((response) => {
					setImages(response);
				});
				toast({ title: 'Imágen guardada', description: response.message, variant: 'success', duration: 5000 });
			}
		});
	}

	function handleSubmitProduct(values: z.infer<typeof propertySchema>) {
		const color = categories.find((cat) => cat.value === values.type)?.color;
		const propertyData = { ...values, color: color ? color : '', created_by: property.created_by };
		ProductsServices.update(propertyId, propertyData).then(response => {
            console.log(response);
            if(response.status === 200) toast({ title: 'Propiedad modificada', description: response.message, variant: 'success', duration: 5000 });
            if(response instanceof Error) toast({ title: 'Error', description: '500 Internal Server Error | ' + response.message, variant: 'destructive', duration: 5000 });
            if(response.status === 400) toast({ title: 'Error', description: response.message, variant: 'destructive', duration: 5000 });
            if(response.status === 401) navigate('/');
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
			<div className='mt-6 flex flex-col items-center justify-center'>
				<Card className='mb-8 flex w-full flex-row py-8 md:w-[500px] lg:w-[650px]'>
					<CardContent className='mx-0 w-full p-0'>
						<FormProvider {...propertyForm}>
							<form onSubmit={propertyForm.handleSubmit(handleSubmitProduct)} className='space-y-8'>
								<div className='container mx-auto space-y-4'>
									<div className='mb-4 flex text-xs font-bold uppercase text-slate-500'>
										<div className='flex w-auto flex-row items-center rounded-sm bg-slate-200/70 px-2 py-1 text-sm leading-tight'>{property?.id < 10 ? 'Cod/0' + property?.id : 'Cod/' + property?.id}</div>
									</div>
									<div className='flex flex-col gap-4 md:flex-row md:gap-6'>
										<FormField
											control={propertyForm.control}
											name='business_type'
											render={({ field }) => (
												<FormItem className='md:w-1/3 lg:w-1/3'>
													<FormLabel>Tipo</FormLabel>
													<Select key={businessKey} value={field.value} onValueChange={(event) => field.onChange(event)}>
														<FormControl>
															<SelectTrigger>
																<SelectValue placeholder='' />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															{business?.map((el) => (
																<SelectItem key={el.id} value={el.value} className='text-sm'>
																	{el.name}
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
												<FormItem className='md:w-1/3 lg:w-1/3'>
													<FormLabel>Categoría</FormLabel>
													<Select key={categoriesKey} value={field.value} onValueChange={(event) => field.onChange(event)}>
														<FormControl>
															<SelectTrigger>
																<SelectValue placeholder='' />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															{categories?.map((el) => (
																<SelectItem key={el.id} value={el.value} className='text-sm'>
																	{el.name}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									{/* all */}
									<div className='flex flex-col gap-4 md:flex-row md:gap-6'>
										{/* row 1 */}
										<div className='flex flex-row md:w-1/2 md:flex-col'>
											<FormField
												control={propertyForm.control}
												name='title'
												render={({ field }) => (
													<FormItem className='w-full'>
														<FormLabel>Título</FormLabel>
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
													<FormItem className='w-full'>
														<FormLabel>Descripción breve</FormLabel>
														<FormControl>
															<Input placeholder='' {...field} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
									</div>
									{/* long description */}
									<div className='mt-4 flex flex-col'>
										<FormField
											control={propertyForm.control}
											name='long_description'
											render={({ field }) => (
												<FormItem className='mb-4 w-full'>
													<FormLabel>Descripción extendida</FormLabel>
													<FormControl>
														<Textarea {...field} className='h-28'></Textarea>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									{/* Address */}
									<div className='flex w-full flex-col py-4 font-normal text-slate-600'>Dirección</div>
									<div className='flex flex-row gap-4 md:flex-row md:gap-6'>
										<div className='flex w-1/2 flex-row md:w-1/2 md:flex-col'>
											<FormField
												control={propertyForm.control}
												name='street'
												render={({ field }) => (
													<FormItem className='w-full'>
														<FormLabel>Calle</FormLabel>
														<FormControl>
															<Input placeholder='' {...field} value={field.value} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
										<div className='flex w-1/2 flex-row md:w-1/2 md:flex-col'>
											<FormField
												control={propertyForm.control}
												name='city'
												render={({ field }) => (
													<FormItem className='w-full'>
														<FormLabel>Ciudad</FormLabel>
														<FormControl>
															<Input placeholder='' {...field} value={field.value} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
									</div>
									<div className='mt-4 flex flex-row gap-4 md:flex-row md:gap-6'>
										<div className='flex w-1/2 flex-row md:w-1/2 md:flex-col'>
											<FormField
												control={propertyForm.control}
												name='state'
												render={({ field }) => (
													<FormItem className='w-full'>
														<FormLabel>Provincia</FormLabel>
														<FormControl>
															<Input placeholder='' {...field} value={field.value} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
										<div className='flex w-1/2 flex-row md:w-1/2 md:flex-col'>
											<FormField
												control={propertyForm.control}
												name='zip'
												render={({ field }) => (
													<FormItem className='w-full'>
														<FormLabel>Código Postal</FormLabel>
														<FormControl>
															<Input type='text' {...field} value={field.value} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
									</div>
									{/* Price and active */}
									<div className='mt-4 flex flex-row place-items-center gap-4 md:flex-row md:gap-6'>
										<div className='flex w-1/2 flex-row md:w-1/2 md:flex-col'>
											<FormField
												control={propertyForm.control}
												name='price'
												render={({ field }) => (
													<FormItem className='w-full'>
														<FormLabel>Precio</FormLabel>
														<FormControl>
															<Input type='text' inputMode='numeric' {...field} value={field.value} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
										<div className='mt-8 flex w-1/2 flex-row md:w-1/2 md:flex-col'>
											<div className='flex items-center justify-center space-x-2'>
												<FormField
													control={propertyForm.control}
													name='is_active'
													render={({ field }) => (
														<FormItem className='w-full'>
															<FormControl>
																<div className='flex items-center space-x-2'>
																	<Switch id='is_active' checked={field.value} onCheckedChange={field.onChange} className='data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-input' />
																	<Label htmlFor='is_active'>Activo</Label>
																</div>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
											</div>
										</div>
									</div>
									<div className='mt-8 flex flex-row justify-end space-x-4'>
										<Button variant='ghost' onClick={() => navigate(-1)}>
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
				<div className='flex w-full flex-col md:w-[550px] lg:w-[550px]'>
					<h1 className='text-base font-normal text-slate-500'>Gestión de imágenes {id}</h1>
					<Separator orientation='horizontal' className='mt-2 bg-slate-200' />
					<div className='mt-6 grid gap-4'>
						{images.map((img, i) => {
							return (
								<Card key={img.id} className='px-3 py-1'>
									<div className='flex flex-row place-items-center justify-between'>
										<div className='flex h-5 flex-row'>
											<img src={getImageURL(img.name)} />
											<h2 className='flex flex-row place-items-center pl-3 text-xs font-medium text-slate-900'># {i + 1}</h2>
										</div>
										<div className='hidden flex-row text-xs font-light text-slate-400 xs:block md:block lg:block'>{img.name}</div>
										<TooltipProvider>
											<Tooltip>
												<Button asChild onClick={() => handleDeleteImage(img.id)} variant='ghost' size='miniIcon' className='flex flex-row bg-white text-slate-400/70 hover:bg-white hover:text-rose-500'>
													<TooltipTrigger>
														<Trash className='h-4 w-4' />
													</TooltipTrigger>
												</Button>
												<TooltipContent className='mt-0 bg-slate-600 zoom-in-95' side='right'>
													<p className='text-xs font-normal text-white'>Eliminar</p>
												</TooltipContent>
											</Tooltip>
										</TooltipProvider>
									</div>
								</Card>
							);
						})}
					</div>

					<FormProvider {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<div className='mt-8 grid w-full max-w-sm items-center gap-1.5'>
								<FormField
									control={form.control}
									name='file'
									render={() => (
										<FormItem className='mb-4'>
											<FormLabel>Agregar imágen</FormLabel>
											<FormControl>
												<Input {...form.register('file')} name='file' type='file' accept='image/*' className='w-full hover:cursor-pointer' />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<div className='mt-4'>
								<Button variant='default' size='sm' className='w-auto' type='submit'>
									Guardar
								</Button>
							</div>
						</form>
					</FormProvider>
				</div>
			</div>
		</main>

		// <div className='mx-auto mt-10 flex flex-col md:w-[400px]'>
		// 	<h1 className='text-base font-normal text-slate-500'>Gestión de imágenes {id}</h1>
		// 	<Separator orientation='horizontal' className='mt-2 bg-slate-200' />
		// 	<div className='mt-6 grid gap-4'>
		// 		{images.map((img, i) => {
		// 			return (
		// 				<Card key={img.id} className='px-3 py-1'>
		// 					<div className='flex flex-row place-items-center justify-between'>
		// 						<h2 className='flex flex-row text-xs font-medium text-slate-900'>Imágen {i + 1}</h2>
		// 						<div className='flex flex-row text-xs font-light text-slate-400'>{img.name}</div>
		// 						<Button className='flex flex-row' variant='ghost' size='miniIcon' onClick={() => handleDeleteImage(img.id)}>
		// 							<Trash className='h-4 w-4' />
		// 						</Button>
		// 					</div>
		// 				</Card>
		// 			);
		// 		})}
		// 	</div>
		//     {/* <form onSubmit={handleSubmit(onSubmit)}>
		//         <input {...register('file')} type="file" name='file' />
		//         <button type='submit'>Submit</button>
		//     </form> */}
		// 	<FormProvider {...form}>
		// 		<form onSubmit={form.handleSubmit(onSubmit)}>
		// 			<div className='mt-8 grid w-full max-w-sm items-center gap-1.5'>
		// 				<FormField
		// 					control={form.control}
		// 					name='file'
		// 					render={() => (
		// 						<FormItem className='mb-4'>
		// 							<FormLabel>Agregar imágen</FormLabel>
		// 							<FormControl>
		// 								<Input {...form.register('file')} name='file' type='file' accept='image/*' className='w-full hover:cursor-pointer' />
		// 							</FormControl>
		// 							<FormMessage />
		// 						</FormItem>
		// 					)}
		// 				/>
		// 			</div>
		// 			<div className='mt-4'>
		// 				<Button variant='default' size='sm' className='w-auto' type='submit'>
		// 					Guardar
		// 				</Button>
		// 			</div>
		// 		</form>
		// 	</FormProvider>
		// </div>
	);
}
// Export React component
export default UpdateProduct;
