// Icons: Lucide (https://lucide.dev/)
import { ArrowLeft, Check } from 'lucide-react';
// UI: Shadcn-ui (https://ui.shadcn.com/)
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
// App
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { IUser } from '@/lib/interfaces/user.interface';
import { ReadUserService, UpdateUserService } from '@/services/users.services';
// .env constants
const appUrl: string = import.meta.env.VITE_APP_URL;
// React component
function UpdateUser() {
	const { id } = useParams();
	const [user, setUser] = useState<IUser>();
	const navigate = useNavigate();

	const userFormSchema = z.object({
		name: z.string().min(3, {
			message: 'El nombre debe poseer al menos 3 caracteres'
		}),
		email: z.string().email({ message: 'Formato de e-mail inválido' }),
		password: z.string(),
		phone: z.string().min(10, {
			message: 'El teléfono debe poseer al menos 10 números'
		}),
		type: z.string().min(1, {
			message: 'Debes seleccionar un tipo'
		})
	});

	const form = useForm<IUser>({
		resolver: zodResolver(userFormSchema),
		values: {
			name: '',
			email: '',
			password: '',
			phone: '',
			type: ''
		}
	});

	useEffect(() => {
		ReadUserService(`${id}`).then((response) => {
			if (response.status > 200) {
				toast({ title: 'Error', description: response.message, variant: 'destructive', duration: 5000 });
				if (response.status === 401) navigate('/');
			}
			if (response instanceof Error) toast({ title: 'Error', description: '500 Internal Server Error | ' + response.message, variant: 'destructive', duration: 5000 });
			if (!response.status) {
				setUser(response);
				form.setValue('name', response.name);
				form.setValue('email', response.email);
				form.setValue('phone', response.phone);
				form.setValue('type', response.type);
			}
		});
	}, [form, id, navigate]);

	function onSubmit(values: IUser) {
		if (values.password === '') values.password = user?.password;
		UpdateUserService(`${id}`, values).then((response) => {
			if (response instanceof Error) toast({ title: 'Error', description: '500 Internal Server Error | ' + response.message, variant: 'destructive', duration: 5000 });
			if (response.status > 200) {
				toast({ title: 'Error', description: response.message, variant: 'destructive', duration: 5000 });
				if (response.status === 401) navigate('/');
			}
			if (response.status === 200) {
				navigate(appUrl + '/usuarios');
				toast({ title: 'Usuario modificado', description: response.message, variant: 'success', duration: 5000 });
			}
		});
	}

	return (
		<main className='flex-1 overflow-y-auto'>
			<div className='flex flex-row items-center justify-between px-8 pt-8'>
				<h1 className='text-2xl font-normal text-slate-600'>Modificar Usuario</h1>
				<Button variant='ghost' size='sm' asChild>
					<Link to={appUrl + '/usuarios'}>
						<ArrowLeft className='mr-2 h-4 w-4' />
						Volver
					</Link>
				</Button>
			</div>
			<div className='flex flex-row items-center justify-center px-6 pt-8'>
				<Card className='mb-8 w-full pt-6 md:w-[550px] lg:w-[550px]'>
					<CardContent className='mx-0 px-0'>
						<FormProvider {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
								<div className='container mx-auto'>
									<div className='flex flex-col justify-between md:flex-row md:gap-10 lg:flex-row lg:gap-10'>
										<div className='flex w-full flex-col md:w-1/2 lg:w-1/2'>
											<FormField
												control={form.control}
												name='name'
												render={({ field }) => (
													<FormItem className='mb-4'>
														<FormLabel>Nombre</FormLabel>
														<FormControl>
															<Input className='minput' placeholder='Mínimo 3 caracteres' {...field} value={field.value} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name='email'
												render={({ field }) => (
													<FormItem className='mb-4'>
														<FormLabel>E-mail</FormLabel>
														<FormControl>
															<Input placeholder='Formato de e-mail' {...field} value={field.value} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name='password'
												render={({ field }) => (
													<FormItem className='mb-4'>
														<FormLabel>Password</FormLabel>
														<FormControl>
															<Input placeholder='Mínimo 6 caracteres' {...field} value={field.value} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
										<div className='flex w-full flex-col md:w-1/2 lg:w-1/2'>
											<FormField
												control={form.control}
												name='phone'
												render={({ field }) => (
													<FormItem className='mb-4'>
														<FormLabel>Teléfono</FormLabel>
														<FormControl>
															<Input placeholder='Mínimo 10 números' {...field} value={field.value} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name='type'
												render={({ field }) => (
													<FormItem>
														<FormLabel>Tipo</FormLabel>
														<Select value={field.value} onValueChange={(event) => field.onChange(event)}>
															<FormControl>
																<SelectTrigger>
																	<SelectValue placeholder='' />
																</SelectTrigger>
															</FormControl>
															<SelectContent>
																<SelectItem value='admin'>Administrador</SelectItem>
																<SelectItem value='user'>Usuario</SelectItem>
															</SelectContent>
														</Select>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
									</div>
								</div>
								<div className='flex flex-row items-center justify-end pr-6'>
									<div className='flex'>
										<Button variant='ghost' className='mr-4' onClick={() => navigate(appUrl + '/usuarios')}>
											Cancelar
										</Button>
										<Button type='submit' variant='default' size='default'>
											<Check className='mr-2 h-4 w-4' />
											Guardar
										</Button>
									</div>
								</div>
							</form>
						</FormProvider>
					</CardContent>
				</Card>
			</div>
		</main>
	);
}
// Export React component
export default UpdateUser;
