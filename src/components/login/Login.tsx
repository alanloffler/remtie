// UI: Shadcn-ui (https://ui.shadcn.com/)
import { Button } from '@/components/ui/button';
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
// App
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { store } from '@/services/store.services';
// .env constants
const apiUrl: string = import.meta.env.VITE_REACT_BACKEND_API;
// Form schema
const formSchema = z.object({
	email: z.string().email({ message: 'Formato de e-mail inválido' }),
	password: z.string().min(6, { message: 'La contraseña debe poseer al menos 6 caracteres' })
});
// Interfaces
interface ILogin {
	token: string;
	userId: string;
	message: string;
	status: number;
}
// React component
function Login() {
	const setAuthorized = store.getState().setAuthorized;
	const setAuthToken = store.getState().setAuthToken;
	const setUserId = store.getState().setUserId;
	const [statusMessage, setStatusMessage] = useState<string>();
	const navigate = useNavigate();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: '',
			password: ''
		}
	});

	useEffect(() => {
		store.setState({ authorized: false });
	}, []);

	async function onSubmit(values: z.infer<typeof formSchema>) {
		SendData(values).then((response: ILogin) => {
			if (response instanceof Error) setStatusMessage('500 Internal Server Error | ' + response.message);
			if (response.status === 400) setStatusMessage(response.message);
			if (response.token && response.userId) {
				setAuthToken(response.token);
				setUserId(Number(response.userId));
				setAuthorized(true);
				navigate(import.meta.env.VITE_APP_URL);
			}
		});
	}

	async function SendData(values: z.infer<typeof formSchema>) {
		try {
			const query = await fetch(apiUrl + '/auth/signin', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(values)
			});
			return await query.json();
		} catch (e) {
			return e;
		}
	}

	return (
		<div className='mt-8'>
			<Card className='mx-8 md:mx-auto md:w-[400px] lg:mx-auto'>
				<CardHeader className='space-y-1'>
					<CardTitle className='text-2xl font-bold'>Room202</CardTitle>
					<CardDescription>Ingresá tus datos para acceder a la aplicación</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<div className='mt-4 flex flex-col gap-6'>
								<div className='w-full'>
									<FormField
										control={form.control}
										name='email'
										render={({ field }) => (
											<FormItem>
												<FormLabel>E-mail</FormLabel>
												<FormControl>
													<Input id='email' {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<div className='w-full'>
									<FormField
										control={form.control}
										name='password'
										render={({ field }) => (
											<FormItem className=''>
												<FormLabel>Contraseña</FormLabel>
												<FormControl>
													<Input id='password' type='password' {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</div>
							<div className='mt-12'>
								<Button className='w-full' type='submit'>
									Ingresar
								</Button>
							</div>
						</form>
					</Form>
					<div className='pt-6 text-center text-sm text-rose-400'>{statusMessage && <p>{statusMessage}</p>}</div>
					{/* Use if registration is public */}
					{/* <div className='mt-8 text-center text-sm'>
						<a className='underline' href='#'>
							Registráte
						</a>
					</div> */}
				</CardContent>
			</Card>
		</div>
	);
}
// Export React component
export default Login;
