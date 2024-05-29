// Icons: Lucide (https://lucide.dev/)
import { ArrowLeft, Check } from 'lucide-react';
// UI: Shadcn-ui (https://ui.shadcn.com/)
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// App
import { ButtonsConfig } from '@/lib/config/buttons.config';
import { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UsersConfig } from '@/lib/config/users.config';
import { UsersServices } from '@/services/users.services';
import { handleServerResponse } from '@/lib/handleServerResponse';
import { useForm } from 'react-hook-form';
import { userSchema } from '@/lib/schemas/user.schema';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
// .env constants
const APP_URL: string = import.meta.env.VITE_APP_URL;
// React component
function CreateUser() {
	const navigate = useNavigate();
	const form = useForm<z.infer<typeof userSchema>>({
		resolver: zodResolver(userSchema),
		defaultValues: {
			name: '',
			email: '',
			password: '',
			phone: '',
			role: ''
		}
	});

	function onSubmit(values: z.infer<typeof userSchema>) {
		UsersServices.create(values).then((response) => {
			if (response.statusCode === 200) navigate(`${APP_URL}/usuarios`);
			handleServerResponse(response);
		});
	}

	function handleCancel(event: FormEvent<HTMLButtonElement>) {
		event.preventDefault();
		navigate(`${APP_URL}/usuarios`);
	}

	return (
		<main className='flex-1 animate-fadeIn overflow-y-auto'>
			<div className='flex flex-row items-center justify-between px-8 pt-8'>
				<h1 className='text-2xl font-normal text-slate-600'>{UsersConfig.pages.createUserTitle}</h1>
				<Button variant='ghost' size='sm' asChild>
					<Link to={`${APP_URL}/usuarios`}>
						<ArrowLeft strokeWidth='2' className='mr-2 h-4 w-4' />
						{ButtonsConfig.actions.back}
					</Link>
				</Button>
			</div>
			<div className='flex flex-row items-center justify-center px-6 pt-8'>
				<Card className='mb-8 w-full pt-6 md:w-[550px] lg:w-[550px]'>
					<CardContent className='mx-0 px-0'>
						<Form {...form}>
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
														<Select onValueChange={field.onChange} defaultValue={field.value}>
															<FormControl>
																<SelectTrigger>
																	<SelectValue placeholder={<span className='text-muted-foreground'>{UsersConfig.form.role.placeholder}</span>} />
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
						</Form>
					</CardContent>
				</Card>
			</div>
		</main>
	);
}
// Export React component
export default CreateUser;
