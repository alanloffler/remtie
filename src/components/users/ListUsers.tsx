// Icons: Lucide (https://lucide.dev/)
import { ArrowUpDown, BadgeX, CheckCircle, CircleOff, Info, Pencil, Plus, Trash2 } from 'lucide-react';
// UI: Shadcn-ui (https://ui.shadcn.com/)
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
// App
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table/DataTable';
import { UsersConfig } from '@/lib/config';
import { IUser, IUserDialog } from '@/lib/interfaces/user.interface';
import { UsersServices } from '@/services/users.services';
import Dot from '@/components/shared/Dot';
import { store } from '@/services/store.services';
import { Roles } from '@/lib/constants';
// .env constants
const APP_URL: string = import.meta.env.VITE_APP_URL;
// React component
function ListUsers() {
	const navigate = useNavigate();
	const [users, setUsers] = useState<IUser[]>([]);
	const [openDialog, setOpenDialog] = useState(false);
	const [userDialog, setUserDialog] = useState<IUserDialog>({ id: 0, name: '', title: '', subtitle: '', message: <span></span> });
	const [isAdmin, setIsAdmin] = useState<boolean>(false);
	const [dialogAction, setDialogAction] = useState<string>('');

	const columns: ColumnDef<IUser>[] = [
		{
			accessorKey: 'id',
			header: ({ column }) => {
				return (
					<div className='text-center'>
						<Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
							{UsersConfig.headers[0]}
							<ArrowUpDown className='ml-2 h-4 w-4' />
						</Button>
					</div>
				);
			},
			cell: ({ row }) => {
				return <div className='text-center'>{row.original.id}</div>;
			}
		},
		{
			accessorKey: 'type',
			header: '',
			cell: ({ row }) => {
				const item = row.original;
				return <>{item.deletedAt !== null ? <CircleOff className='h-4 w-4' /> : <Dot role={item.role} width='14px' />}</>;
			}
		},
		{
			accessorKey: 'name',
			header: ({ column }) => {
				return (
					<div className='text-left'>
						<Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
							{UsersConfig.headers[1]}
							<ArrowUpDown className='ml-2 h-4 w-4' />
						</Button>
					</div>
				);
			}
		},
		{
			accessorKey: 'email',
			header: ({ column }) => {
				return (
					<div className='text-left'>
						<Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
							{UsersConfig.headers[2]}
							<ArrowUpDown className='ml-2 h-4 w-4' />
						</Button>
					</div>
				);
			}
		},
		{ accessorKey: 'phone', header: UsersConfig.headers[3] },
		{
			header: UsersConfig.headers[4],
			id: 'actions',
			cell: ({ row }) => {
				return (
					<div className='flex flex-row gap-2'>
						<Button onClick={() => navigate(`${APP_URL}/usuario/${Number(row.original.id)}`)} variant='outline' size='miniIcon' className='hover:bg-white hover:text-sky-400'>
							<Info className='h-5 w-5' strokeWidth='1.5' />
						</Button>
						{(isAdmin || (store.getState().userId === Number(row.original.id) && !isAdmin)) && (
							<>
								{/* Edit */}
								<Button onClick={() => navigate(`${APP_URL}/usuario/modificar/${Number(row.original.id)}`)} variant='outline' size='miniIcon' className='hover:bg-white hover:text-emerald-400'>
									<Pencil className='h-5 w-5' strokeWidth='1.5' />
								</Button>
								{/* Soft Delete or Restore */}
								{row.original.deletedAt === null ? (
									<Button
										onClick={() => {
											setOpenDialog(true);
											setUserDialog({
												id: Number(row.original.id),
												name: row.original.name,
												title: '¿Estás realmente seguro?',
												subtitle: 'Esta acción es imposible de revertir.',
												message: (
													<>
														La cuenta del usuario <span className='text-md font-bold text-slate-900'>{row.original.name}</span> va a ser eliminada en la base de datos, y ya no estará activa.
													</>
												)
											});
											setDialogAction('removeSoft');
										}}
										variant='outline'
										size='miniIcon'
										className='hover:bg-white hover:text-rose-400'>
										<Trash2 className='h-5 w-5' strokeWidth='1.5' />
									</Button>
								) : (
									<Button
										onClick={() => {
											setOpenDialog(true);
											setUserDialog({
												id: Number(row.original.id),
												name: row.original.name,
												title: '¿Estás realmente seguro?',
												subtitle: 'Esta acción es posible de revertir luego.',
												message: (
													<>
														La cuenta del usuario <span className='text-md font-bold text-slate-900'>{row.original.name}</span> va a ser restaurada de la base de datos, y volverá a estar activa.
													</>
												)
											});
											setDialogAction('restore');
										}}
										variant='outline'
										size='miniIcon'
										className='hover:bg-white hover:text-emerald-400'>
										<CheckCircle className='h-5 w-5' strokeWidth='1.5' />
									</Button>
								)}
								{store.getState().userId !== Number(row.original.id) && (
									<Button
										onClick={() => {
											setOpenDialog(true);
											setUserDialog({
												id: Number(row.original.id),
												name: row.original.name,
												title: '¿Estás realmente seguro?',
												subtitle: 'Esta acción es imposible de revertir.',
												message: (
													<>
														La cuenta del usuario <span className='text-md font-bold text-slate-900'>{row.original.name}</span> va a ser eliminada permanentemente de la base de datos.
													</>
												)
											});
                                            setDialogAction('remove');
										}}
										variant='outline'
										size='miniIcon'
										className='hover:bg-white hover:text-rose-400'>
										<BadgeX className='h-5 w-5' strokeWidth='1.5' />
									</Button>
								)}
							</>
						)}
					</div>
				);
			}
		}
	];

	async function getAllUsers() {
		UsersServices.getAll().then((response) => {
			if (response.status > 400) {
				toast({ title: 'Error', description: response.message, variant: 'destructive', duration: 5000 });
				if (response.status === 401) navigate('/');
			}
			if (response instanceof Error) toast({ title: 'Error', description: '500 Internal Server Error | ' + response.message, variant: 'destructive', duration: 5000 });
			if (response.length > 0) setUsers(response);
		});
	}

	useEffect(() => {
		setIsAdmin(store.getState().role === Roles.ADMIN);
		getAllUsers();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
    // ACTIONS
	function removeSoft(id: number) {
		if (!id) return;

        UsersServices
        .removeSoft(id)
        .then((response) => {
            console.log(response);
            if (response.status === 200) {
                toast({ title: response.status, description: response.message, variant: 'success', duration: 5000 });
                getAllUsers();
            }
			if (response.statusCode > 399) toast({ title: response.statusCode, description: response.message, variant: 'destructive', duration: 5000 });
			if (response instanceof Error) toast({ title: 'Error', description: '500 Internal Server Error | ' + response.message, variant: 'destructive', duration: 5000 });
			setOpenDialog(false);
		});
	}

    function restore(id: number) {
        UsersServices
        .restore(id)
        .then(response => {
            console.log(response);
            if (response.status === 200) {
                toast({ title: response.status, description: response.message, variant: 'success', duration: 5000 });
                getAllUsers();
            }
            if (response.statusCode > 399) toast({ title: response.statusCode, description: response.message, variant: 'destructive', duration: 5000 });
            if (response instanceof Error) toast({ title: 'Error', description: '500 Internal Server Error | ' + response.message, variant: 'destructive', duration: 5000 });
            setOpenDialog(false);
        });
    }

    function remove(id: number) {
        UsersServices
        .remove(id)
        .then(response => {
            console.log(response);
            if (response.status === 200) {
                toast({ title: response.status, description: response.message, variant: 'success', duration: 5000 });
                getAllUsers();
            }
            if (response.statusCode > 399) toast({ title: response.statusCode, description: response.message, variant: 'destructive', duration: 5000 });
            if (response instanceof Error) toast({ title: 'Error', description: '500 Internal Server Error | ' + response.message, variant: 'destructive', duration: 5000 });
            setOpenDialog(false);
        });
    }

	return (
		<main className='flex-1 overflow-y-auto'>
			<div className='flex flex-row items-center justify-between px-8 pt-8'>
				<h1 className='text-2xl font-normal text-slate-600'>Usuarios</h1>
				{isAdmin && (
					<Button variant='default' size='default' asChild>
						<Link to={`${APP_URL}/usuario/crear`}>
							<Plus className='mr-2 h-4 w-4' />
							Nuevo
						</Link>
					</Button>
				)}
				{!isAdmin && (
					<Button variant='default' size='default' asChild>
						<Link to={`${APP_URL}/usuario/modificar/${store.getState().userId}`}>
							<Pencil className='mr-2 h-4 w-4' />
							Editá tus datos
						</Link>
					</Button>
				)}
			</div>
			<div className='container mx-auto pt-8'>
				<Card className='p-6'>
					<DataTable columns={columns} data={users} searchBy={''} />
				</Card>
			</div>
			<div className='mt-6 flex flex-row justify-start px-8'>
				<div className='mr-6 flex flex-row items-center space-x-2 text-sm font-light text-slate-500'>
					<Dot role='admin' width='14px' />
					<span>Administrador</span>
				</div>
				<div className='mr-6 flex flex-row items-center space-x-2 text-sm font-light text-slate-500'>
					<Dot role='user' width='14px' />
					<span>Usuario</span>
				</div>
			</div>
			<Dialog open={openDialog} onOpenChange={setOpenDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{userDialog.title}</DialogTitle>
						<DialogDescription>{userDialog.subtitle}</DialogDescription>
					</DialogHeader>
					<section className='text-sm font-normal'>{userDialog.message}</section>
					<DialogFooter>
						<div className='mt-6 flex flex-row gap-4'>
							<Button variant='ghost' onClick={() => setOpenDialog(false)}>
								Cancelar
							</Button>
							{dialogAction === 'removeSoft' && (
								<Button variant='delete' onClick={() => removeSoft(userDialog.id)}>
									Eliminar
								</Button>
							)}
							{dialogAction === 'restore' && (
								<Button variant='default' onClick={() => restore(userDialog.id)}>
									Restaurar
								</Button>
							)}
							{dialogAction === 'remove' && (
								<Button variant='delete' onClick={() => remove(userDialog.id)}>
									Eliminar
								</Button>
							)}
						</div>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</main>
	);
}
// Export React component
export default ListUsers;
