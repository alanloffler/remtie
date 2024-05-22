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
import { ButtonsConfig } from '@/lib/config/buttons.config';
import { FormEvent, useEffect, useState } from 'react';
import { IRole } from '@/lib/interfaces/role.interface';
import { IUser } from '@/lib/interfaces/user.interface';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { RolesServices } from '@/services/roles.services';
import { UsersConfig } from '@/lib/config/users.config';
import { UsersServices } from '@/services/users.services';
import { updateUserSchema } from '@/lib/schemas/user.schema';
import { useCapitalize } from '@/hooks/useCapitalize';
import { useForm, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
// .env constants
const APP_URL: string = import.meta.env.VITE_APP_URL;
// React component
function UpdateUser() {
	const [user, setUser] = useState<IUser>({} as IUser);
	const [roleKey, setRoleKey] = useState<number>(0);
	const [roles, setRoles] = useState<IRole[]>([] as IRole[]);
	const { id } = useParams();
	const navigate = useNavigate();
	const userId = Number(id);
	const capitalize = useCapitalize();

	const form = useForm<z.infer<typeof updateUserSchema>>({
		resolver: zodResolver(updateUserSchema),
		values: {
			name: '',
			email: '',
			password: '',
			phone: 'asd',
			role: ''
		}
	});
	// #region Load data
	useEffect(() => {
		function getRoles() {
			RolesServices.findAll().then((response) => {
				if (!response.statusCode) setRoles(response);
				if (response.statusCode > 399) toast({ title: response.statusCode, description: response.message, variant: 'destructive', duration: 5000 });
				if (response instanceof Error) toast({ title: 'Error', description: '500 Internal Server Error | ' + response.message, variant: 'destructive', duration: 5000 });
			});
		}

		function getUser(userId: number) {
			UsersServices.findOne(userId).then((response) => {
				if (!response.statusCode) {
					setUser(response);
                    setRoleKey(Math.random());
					form.setValue('name', response.name);
					form.setValue('email', response.email);
					form.setValue('phone', response.phone || '');
					form.setValue('role', response.role);
				}
				if (response.statusCode > 399) toast({ title: response.statusCode, description: response.message, variant: 'destructive', duration: 5000 });
				if (response instanceof Error) toast({ title: 'Error', description: '500 Internal Server Error | ' + response.message, variant: 'destructive', duration: 5000 });
			});
		}

		getRoles();
		getUser(userId);
	}, [form, userId]);
	// #endregion
	// #region Form
	function onSubmit(values: z.infer<typeof updateUserSchema>) {
		if (values.password === '') values.password = user.password;
		UsersServices.update(userId, values).then((response) => {
			if (response.statusCode === 200) {
				toast({ title: response.statusCode, description: response.message, variant: 'success', duration: 5000 });
				navigate(`${APP_URL}/usuarios`);
			}
			if (response.statusCode > 399) toast({ title: response.statusCode, description: response.message, variant: 'destructive', duration: 5000 });
			if (response instanceof Error) toast({ title: 'Error', description: '500 Internal Server Error | ' + response.message, variant: 'destructive', duration: 5000 });
		});
	}

	function handleCancel(event: FormEvent<HTMLButtonElement>) {
		event.preventDefault();
		navigate(`${APP_URL}/usuarios`);
	}
	// #endregion
	return (
		<main className='flex-1 animate-fadeIn overflow-y-auto'>
			<div className='flex flex-row items-center justify-between px-8 pt-8'>
				<h1 className='text-2xl font-normal text-slate-600'>{UsersConfig.pages.updateUserTitle}</h1>
				<Button variant='ghost' size='sm' asChild>
					<Link to={`${APP_URL}/usuarios`}>
						<ArrowLeft className='mr-2 h-4 w-4' />
						{ButtonsConfig.actions.back}
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
														<FormLabel>{UsersConfig.form.name.title}</FormLabel>
														<FormControl>
															<Input placeholder={UsersConfig.form.name.placeholder} {...field} />
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
														<FormLabel>{UsersConfig.form.email.title}</FormLabel>
														<FormControl>
															<Input placeholder={UsersConfig.form.email.placeholder} {...field} />
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
														<FormLabel>{UsersConfig.form.password.title}</FormLabel>
														<FormControl>
															<Input placeholder={UsersConfig.form.password.placeholder} {...field} />
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
														<FormLabel>{UsersConfig.form.phone.title}</FormLabel>
														<FormControl>
															<Input placeholder={UsersConfig.form.phone.placeholder} {...field} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name='role'
												render={({ field }) => (
													<FormItem>
														<FormLabel>{UsersConfig.form.role.title}</FormLabel>
														<Select key={roleKey} value={field.value} onValueChange={(event) => field.onChange(event)}>
															<FormControl>
																<SelectTrigger>
																	<SelectValue />
																</SelectTrigger>
															</FormControl>
															<SelectContent>
																{roles.map((role) => (
																	<SelectItem key={role.id} value={role.value}>
																		{capitalize(role.title)}
																	</SelectItem>
																))}
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
										<Button variant='ghost' className='mr-4' onClick={handleCancel}>
											{ButtonsConfig.actions.cancel}
										</Button>
										<Button type='submit' variant='default' size='default'>
											<Check className='mr-2 h-4 w-4' />
											{ButtonsConfig.actions.save}
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
