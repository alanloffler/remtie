// Icons: Lucide (https://lucide.dev/)
import { ArrowLeft, BadgeX, Mail, Pencil, Phone, Trash2 } from 'lucide-react';
// UI: Shadcn-ui (https://ui.shadcn.com/)
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Dialog, DialogHeader, DialogFooter, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
// App
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { emptyUser } from '@/lib/utils';
import { UsersServices } from '@/services/users.services';
import { IUser } from '@/lib/interfaces/user.interface';
import Dot from '@/components/shared/Dot';
import { Roles } from '@/lib/constants';
import { store } from '@/services/store.services';
// .env constants
const APP_URL: string = import.meta.env.VITE_APP_URL;
// React component
function ViewUser() {
	const id = Number(useParams().id);
	const [user, setUser] = useState<IUser>(emptyUser);
	const [date, setDate] = useState<Date>();
	const [openDialog, setOpenDialog] = useState<boolean>(false);
	const navigate = useNavigate();

	useEffect(() => {
        UsersServices
        .findOne(id)
        .then((response) => {
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

	function removeSoft(id: number) {
		UsersServices
        .removeSoft(id)
        .then((response) => {
			if (response.status === 200) {
				navigate(`${APP_URL}/usuarios`);
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

    function remove(id: number): void {
        console.log(id);
    }

	return (
		<main className='flex-1 overflow-y-auto'>
			<div className='mx-6 mb-4 mt-6 flex flex-row items-center justify-end'>
				<Button onClick={() => navigate(-1)} variant='ghost' size='sm'>
					<ArrowLeft className='mr-2 h-4 w-4' />
					Volver
				</Button>
			</div>
			<div className='mt-8 flex min-w-80 flex-col items-center px-6'>
				<Card className='mb-8 min-w-[350px] dark:border-[#2e2e2e] dark:bg-[#292a2d] md:w-[500px]'>
					<CardContent className='mx-0 px-0'>
						<div className='flex flex-col items-center'>
							<Dot role={user.role} text={user.role?.charAt(0).toUpperCase()} width='90px' fontSize='60px' margin='-20px' />
							<div className='mt-12 text-3xl font-bold'>{user?.name}</div>
							<div className='mt-2 text-sm text-neutral-400'>{user?.role === 'admin' ? 'Administrador' : 'Usuario'}</div>
							<div className='my-8 flex items-center gap-2 italic'>
								<Mail className='h-4 w-4' />
								{user?.email}
							</div>
							<div className='mb-12 flex items-center gap-2 italic'>
								<Phone className='h-4 w-4' />
								{user?.phone}
							</div>
							<div className='flex text-sm font-extralight text-neutral-500'>
								{user?.role === 'admin' ? 'Administrador desde el ' : 'Usuario desde el '}
								{date?.getDate() + ' '}
								{date?.toLocaleString('default', { month: 'long' })}
								{' de ' + date?.getFullYear()}
							</div>
						</div>
					</CardContent>
                    {(store.getState().role === Roles.ADMIN || store.getState().userId === Number(user?.id)) && (
                        <CardFooter className='justify-end gap-2 bg-slate-200/50 p-2'>
                            <Button onClick={() => navigate(`${APP_URL}/usuario/modificar/${user.id}`)} variant='ghost' size='miniIcon' className='rounded-full border bg-white text-slate-400/70 shadow-sm hover:bg-white hover:text-emerald-500'>
                                <Pencil className='h-4 w-4' />
                            </Button>
                            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                                <Button variant='ghost' size='miniIcon' className='rounded-full border bg-white text-slate-400/70 shadow-sm hover:bg-white hover:text-rose-500' asChild>
                                    <DialogTrigger>
                                        <Trash2 className='h-4 w-4' />
                                    </DialogTrigger>
                                </Button>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>¿Estás realmente seguro?</DialogTitle>
                                        <DialogDescription>Esta acción es imposible de revertir.</DialogDescription>
                                    </DialogHeader>
                                    <div>
                                        <section className='text-sm font-normal'>
                                            La cuenta del usuario
                                            <span className='text-md px-1 font-bold text-slate-900'>{user?.name}</span>
                                            se eliminará permanentemente de la base de datos.
                                        </section>
                                        <DialogFooter>
                                            <div className='mt-6 flex flex-row gap-4'>
                                                <Button variant='ghost' onClick={() => setOpenDialog(false)}>
                                                    Cancelar
                                                </Button>
                                                <Button variant='delete' onClick={() => removeSoft(user.id)}>
                                                    Eliminar
                                                </Button>
                                            </div>
                                        </DialogFooter>
                                    </div>
                                </DialogContent>
                            </Dialog>
                            {(store.getState().role === Roles.ADMIN && store.getState().userId !== Number(user?.id)) && (
                            <Button onClick={() => remove(user.id)} variant='ghost' size='miniIcon' className='rounded-full border bg-white text-slate-400/70 shadow-sm hover:bg-white hover:text-emerald-500'>
                                <BadgeX className='h-5 w-5' strokeWidth='1.5' />
                            </Button>
                            )}
                        </CardFooter>
                    )}
				</Card>
			</div>
		</main>
	);
}
// Export react component
export default ViewUser;
