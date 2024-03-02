// Icons: Lucide (https://lucide.dev/)
import { ArrowUpDown, Info, Pencil, Plus, Trash } from 'lucide-react';
// UI: Shadcn-ui (https://ui.shadcn.com/)
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
// App
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table/DataTable';
import { UsersConfig } from '@/lib/config';
import { User } from '@/lib/types';
import { DeleteUserService, GetAllUsers } from '@/services/users.services';
import Dot from '@/components/shared/Dot';
// .env constants
const appUrl: string = import.meta.env.VITE_APP_URL;
// React component
function ListUsers() {
	const navigate = useNavigate();
	const [users, setUsers] = useState<User[]>([]);
	const [openDialog, setOpenDialog] = useState(false);

	const columns: ColumnDef<User>[] = [
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
				return <Dot type={item.type} width='14px' />;
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
						<Button onClick={() => navigate(appUrl + '/usuario/' + Number(row.original.id))} variant='outline' size='miniIcon' className='hover:bg-white hover:text-sky-400'>
							<Info className='h-5 w-5' strokeWidth='1.5' />
						</Button>
						<Button onClick={() => navigate(appUrl + '/usuario/modificar/' + Number(row.original.id))} variant='outline' size='miniIcon' className='hover:bg-white hover:text-emerald-400'>
							<Pencil className='h-5 w-5' strokeWidth='1.5' />
						</Button>

						<Dialog open={openDialog} onOpenChange={setOpenDialog}>
							<Button variant='outline' size='miniIcon' className='hover:bg-white hover:text-rose-400' asChild>
								<DialogTrigger>
									<Trash className='h-5 w-5' strokeWidth='1.5' />
								</DialogTrigger>
							</Button>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>¿Estás realmente seguro?</DialogTitle>
									<DialogDescription>Esta acción es imposible de revertir.</DialogDescription>
								</DialogHeader>
								<section>
									La cuenta del usuario
									<span className='text-md px-1 font-bold text-slate-900'>{row.original.name}</span>
									se eliminará permanentemente de la base de datos.
								</section>
								<DialogFooter>
									<div className='flex flex-row gap-4'>
										<Button variant='ghost' onClick={() => setOpenDialog(false)}>
											Cancelar
										</Button>
										<Button variant='delete' onClick={() => deleteUser(`${row.original.id}`)}>
											Eliminar
										</Button>
									</div>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</div>
				);
			}
		}
	];

	async function getAllUsers() {
		GetAllUsers().then((response) => {
			if (response.status > 400) {
				toast({ title: 'Error', description: response.message, variant: 'destructive', duration: 5000 });
				if (response.status === 401) navigate('/');
			}
			if (response instanceof Error) toast({ title: 'Error', description: '500 Internal Server Error | ' + response.message, variant: 'destructive', duration: 5000 });
			if (response.length > 0) setUsers(response);
		});
	}

	useEffect(() => {
		getAllUsers();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	function deleteUser(id: string) {
		DeleteUserService(id).then((response) => {
			if (response.status === 200) {
				setOpenDialog(false);
				getAllUsers();
				toast({ title: 'Usuario eliminado', description: response.message, variant: 'success', duration: 5000 });
			}
			if (response.status > 200) toast({ title: 'Error', description: response.message, variant: 'destructive', duration: 5000 });
			if (response instanceof Error) toast({ title: 'Error', description: '500 Internal Server Error | ' + response.message, variant: 'destructive', duration: 5000 });
			setOpenDialog(false);
		});
	}

	return (
		<main className='flex-1 overflow-y-auto'>
			<div className='flex flex-row items-center justify-between px-8 pt-8'>
				<h1 className='text-2xl font-normal text-slate-600'>Usuarios</h1>
				<Button variant='default' size='default' asChild>
					<Link to={appUrl + '/usuario/crear'}>
						<Plus className='mr-2 h-4 w-4' />
						Nuevo
					</Link>
				</Button>
			</div>
			<div className='container mx-auto pt-8'>
				<Card className='p-6'>
					<DataTable columns={columns} data={users} searchBy={''} />
				</Card>
			</div>
			<div className='mt-6 flex flex-row justify-start px-8'>
				<div className='mr-6 flex flex-row items-center space-x-2 text-sm font-light text-slate-500'>
					<Dot type='admin' width='14px' />
					<span>Administrador</span>
				</div>
				<div className='mr-6 flex flex-row items-center space-x-2 text-sm font-light text-slate-500'>
					<Dot type='user' width='14px' />
					<span>Usuario</span>
				</div>
			</div>
		</main>
	);
}
// Export React component
export default ListUsers;
