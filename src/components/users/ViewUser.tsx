// Icons: Lucide (https://lucide.dev/)
import { CornerDownLeft, Mail, Pencil, Phone, Trash } from 'lucide-react';
// UI: Shadcn-ui (https://ui.shadcn.com/)
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Dialog, DialogHeader, DialogFooter, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
// App
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { emptyUser } from '@/lib/utils';
import { DeleteUserService, ReadUserService } from '@/services/users.services';
import { User } from '@/lib/types';
// .env constants
const appUrl: string = import.meta.env.VITE_APP_URL;
// React component
function ViewUser() {
	const { id } = useParams();
	const [user, setUser] = useState<User>(emptyUser);
	const [date, setDate] = useState<Date>();
	const [openDialog, setOpenDialog] = useState<boolean>(false);
	const navigate = useNavigate();

	useEffect(() => {
		ReadUserService(String(id)).then((response) => {
			if (response.type !== '') {
				setUser(response);
				const _date = new Date(response.created_at);
				setDate(_date);
			}
			if (response.status > 200) {
				toast({ title: 'Error', description: response.message, variant: 'destructive', duration: 5000 });
				if (response.status === 401) {
					navigate('/');
				}
			}
			if (response instanceof Error) {
				toast({ title: 'Error', description: '500 Internal Server Error | ' + response.message, variant: 'destructive', duration: 5000 });
			}
		});
	}, [id, navigate]);

	function deleteUser(id: string) {
		DeleteUserService(id).then((response) => {
			if (response.status === 200) {
				navigate(appUrl + '/usuarios');
				toast({ title: 'Usuario eliminado', description: response.message, variant: 'success', duration: 5000 });
			}
			if (response.status > 200) {
				setOpenDialog(false);
				toast({ title: 'Error', description: response.message, variant: 'destructive', duration: 5000 });
				if (response.status === 401) navigate('/');
			}
			if (response instanceof Error) {
				setOpenDialog(false);
				toast({ title: 'Error', description: '500 Internal Server Error | ' + response.message, variant: 'destructive', duration: 5000 });
			}
		});
	}

	return (
		<main className='flex-1 overflow-y-auto dark:bg-dark'>
			<div className='mx-6 mb-4 mt-6 flex flex-row items-center justify-between'>
				<Button variant='outline' size='sm' asChild>
					<Link to={appUrl + '/usuarios'}>
						<CornerDownLeft className='mr-2 h-4 w-4' />
						Volver
					</Link>
				</Button>
			</div>
			<div className='mt-6 flex min-w-80 flex-col items-center px-6'>
				<Card className='mb-8 min-w-[350px] dark:border-[#2e2e2e] dark:bg-[#292a2d] md:w-[500px]'>
					<CardContent className='mx-0 px-0'>
						<div className='flex flex-col items-center'>
							<div className='mt-12 text-3xl font-bold leading-none tracking-tight'>{user?.name}</div>
							<div className='text-sm text-neutral-400'>{user?.type === 'admin' ? 'Administrador' : 'Usuario'}</div>
							<div className='my-8 flex items-center gap-2 italic'>
								<Mail className='h-4 w-4' />
								{user?.email}
							</div>
							<div className='mb-12 flex items-center gap-2 italic'>
								<Phone className='h-4 w-4' />
								{user?.phone}
							</div>
							<div className='flex text-sm font-extralight text-neutral-500'>
								{user?.type === 'admin' ? 'Administrador desde el ' : 'Usuario desde el '}
								{date?.getDate() + ' '}
								{date?.toLocaleString('default', { month: 'long' })}
								{' de ' + date?.getFullYear()}
							</div>
						</div>
					</CardContent>
					<CardFooter></CardFooter>
				</Card>
                <div className='flex flex-row justify-end gap-4'>
                    <Button onClick={() => navigate(appUrl + '/usuario/modificar/' + user?.id)} variant='outline' size='sm' className='hover:text-emerald-500'>
                        <Pencil className='mr-2 h-4 w-4 text-emerald-500' />
                        Editar
                    </Button>
                    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                        <Button variant='outline' size='sm' className='hover:text-rose-500' asChild>
                            <DialogTrigger>
                                <Trash className='mr-2 h-4 w-4 text-rose-500' />
                                Eliminar
                            </DialogTrigger>
                        </Button>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>¿Estás realmente seguro?</DialogTitle>
                                <DialogDescription>Esta acción es imposible de revertir.</DialogDescription>
                            </DialogHeader>
                            <section>
                                La cuenta del usuario
                                <span className='text-md px-1 font-bold text-neutral-900'>{user?.name}</span>
                                se eliminará permanentemente de la base de datos.
                            </section>
                            <DialogFooter>
                                <div className='flex flex-row gap-4'>
                                    <Button variant='ghost' onClick={() => navigate(appUrl + '/usuarios')}>
                                        Cancelar
                                    </Button>
                                    <Button variant='default' onClick={() => deleteUser(`${user?.id}`)} className='bg-rose-400 hover:bg-rose-600'>
                                        Eliminar
                                    </Button>
                                </div>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
			</div>
		</main>
	);
}
// Export react component
export default ViewUser;
