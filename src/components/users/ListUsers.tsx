// Icons: Lucide (https://lucide.dev/)
import { ArrowUpDown, BadgeX, CheckCircle, CircleOff, Info, Pencil, Plus, Trash2 } from 'lucide-react';
// UI: Shadcn-ui (https://ui.shadcn.com/)
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
// App
import Dot from '@/components/shared/Dot';
import { ButtonsConfig } from '@/lib/config/buttons.config';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table/DataTable';
import { IDialog } from '@/lib/interfaces/dialog.interface';
import { IRole } from '@/lib/interfaces/role.interface';
import { IUser } from '@/lib/interfaces/user.interface';
import { LayoutConfig } from '@/lib/config/layout.config';
import { Link, useNavigate } from 'react-router-dom';
import { Roles } from '@/lib/constants';
import { RolesServices } from '@/services/roles.services';
import { UsersConfig } from '@/lib/config/users.config';
import { UsersServices } from '@/services/users.services';
import { store } from '@/services/store.services';
import { useCapitalize } from '@/hooks/useCapitalize';
import { useEffect, useState } from 'react';
// .env constants
const APP_URL: string = import.meta.env.VITE_APP_URL;
// React component
function ListUsers() {
	const [dialogAction, setDialogAction] = useState<string>('');
	const [isAdmin, setIsAdmin] = useState<boolean>(false);
	const [openDialog, setOpenDialog] = useState<boolean>(false);
	const [roles, setRoles] = useState<IRole[]>([]);
	const [updateUI, setUpdateUI] = useState<number>(0);
	const [userDialog, setUserDialog] = useState<IDialog>({ id: 0, name: '', title: '', subtitle: '', message: <span></span> });
	const [users, setUsers] = useState<IUser[]>([]);
	const capitalize = useCapitalize();
	const rowsPerPage = store((state) => state.rowsPerPageUsers);
	const navigate = useNavigate();
	// #region Table columns
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
								{row.original.deletedAt === null && (
									<Button onClick={() => navigate(`${APP_URL}/usuario/modificar/${Number(row.original.id)}`)} variant='outline' size='miniIcon' className='hover:bg-white hover:text-emerald-400'>
										<Pencil className='h-5 w-5' strokeWidth='1.5' />
									</Button>
								)}
								{/* Soft Delete or Restore */}
								{row.original.deletedAt === null ? (
									<Button
										onClick={() => {
											setOpenDialog(true);
											setUserDialog({
												id: Number(row.original.id),
												name: row.original.name,
												title: UsersConfig.dialog.title,
												subtitle: UsersConfig.dialog.impossibleRevertion,
												message: (
													<div className='flex flex-col'>
														<span className='text-md font-bold text-slate-900'>{row.original.name}</span>
														{UsersConfig.dialog.userSoftDelete}
													</div>
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
												title: UsersConfig.dialog.title,
												subtitle: UsersConfig.dialog.possibleRevertion,
												message: (
													<div className='flex flex-col'>
														<span className='text-md font-bold text-slate-900'>{row.original.name}</span>
														{UsersConfig.dialog.userRestore}
													</div>
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
												title: UsersConfig.dialog.title,
												subtitle: UsersConfig.dialog.impossibleRevertion,
												message: (
													<div className='flex flex-col'>
														<span className='text-md font-bold text-slate-900'>{row.original.name}</span>
														{UsersConfig.dialog.userDelete}
													</div>
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
	// #endregion
	// #region Load data
	async function getAllUsers() {
		UsersServices.getAll().then((response) => {
			if (response.length > 0) {
				setUsers(response);
			}
			if (response.statusCode > 399) toast({ title: response.statusCode, description: response.message, variant: 'destructive', duration: 5000 });
			if (response instanceof Error) toast({ title: 'Error', description: '500 Internal Server Error | ' + response.message, variant: 'destructive', duration: 5000 });
		});
	}

	async function getRoles() {
		RolesServices.findAll().then((response) => {
			if (response.length > 0) setRoles(response);
			if (response.statusCode > 399) toast({ title: response.statusCode, description: response.message, variant: 'destructive', duration: 5000 });
			if (response instanceof Error) toast({ title: 'Error', description: '500 Internal Server Error | ' + response.message, variant: 'destructive', duration: 5000 });
		});
	}

	useEffect(() => {
		setIsAdmin(store.getState().role === Roles.ADMIN);
		getAllUsers();
		getRoles();
	}, [updateUI]);
	// #endregion
	// #region Button actions
	function removeSoft(id: number) {
		UsersServices.removeSoft(id).then((response) => {
			if (response.statusCode === 200) {
				toast({ title: response.statusCode, description: response.message, variant: 'success', duration: 5000 });
				getAllUsers();
				setUpdateUI(Math.random());
			}
			if (response.statusCode > 399) toast({ title: response.statusCode, description: response.message, variant: 'destructive', duration: 5000 });
			if (response instanceof Error) toast({ title: 'Error', description: '500 Internal Server Error | ' + response.message, variant: 'destructive', duration: 5000 });
			setOpenDialog(false);
		});
	}

	function restore(id: number) {
		UsersServices.restore(id).then((response) => {
			if (response.statusCode === 200) {
				toast({ title: response.statusCode, description: response.message, variant: 'success', duration: 5000 });
				getAllUsers();
				setUpdateUI(Math.random());
			}
			if (response.statusCode > 399) toast({ title: response.statusCode, description: response.message, variant: 'destructive', duration: 5000 });
			if (response instanceof Error) toast({ title: 'Error', description: '500 Internal Server Error | ' + response.message, variant: 'destructive', duration: 5000 });
			setOpenDialog(false);
		});
	}

	function remove(id: number) {
		UsersServices.remove(id).then((response) => {
			if (response.statusCode === 200) {
				toast({ title: response.statusCode, description: response.message, variant: 'success', duration: 5000 });
				getAllUsers();
			}
			if (response.statusCode > 399) toast({ title: response.statusCode, description: response.message, variant: 'destructive', duration: 5000 });
			if (response instanceof Error) toast({ title: 'Error', description: '500 Internal Server Error | ' + response.message, variant: 'destructive', duration: 5000 });
			setOpenDialog(false);
		});
	}
	// #endregion
	return (
		<main className='flex-1 overflow-y-auto'>
			<div className='flex flex-row items-center justify-between px-8 pt-8'>
				<h1 className='text-2xl font-normal text-slate-600'>{LayoutConfig.sidebar.menu.users}</h1>
				{isAdmin && (
					<Button variant='default' size='default' asChild>
						<Link to={`${APP_URL}/usuario/crear`}>
							<Plus className='mr-2 h-4 w-4' />
							{ButtonsConfig.actions.create}
						</Link>
					</Button>
				)}
				{!isAdmin && (
					<Button variant='default' size='default' asChild>
						<Link to={`${APP_URL}/usuario/modificar/${store.getState().userId}`}>
							<Pencil className='mr-2 h-4 w-4' />
							{UsersConfig.buttons.editYourData}
						</Link>
					</Button>
				)}
			</div>
			<div className='container mx-auto pt-8'>
				<Card className='p-6'>
					<DataTable tableFor={'users'} columns={columns} data={users} rowsPerPage={rowsPerPage} />
				</Card>
			</div>
			<div className='mt-6 flex flex-row justify-start px-8'>
				{roles.map((role) => (
					<div key={role.id} className='mr-6 flex flex-row items-center space-x-2 text-sm font-light text-slate-500'>
						<Dot role={role.value} width='14px' />
						<span>{capitalize(role.title)}</span>
					</div>
				))}
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
								{ButtonsConfig.actions.cancel}
							</Button>
							{dialogAction === 'removeSoft' && (
								<Button variant='delete' onClick={() => removeSoft(userDialog.id)}>
									{ButtonsConfig.actions.delete}
								</Button>
							)}
							{dialogAction === 'restore' && (
								<Button variant='default' onClick={() => restore(userDialog.id)}>
									{ButtonsConfig.actions.restore}
								</Button>
							)}
							{dialogAction === 'remove' && (
								<Button variant='delete' onClick={() => remove(userDialog.id)}>
									{ButtonsConfig.actions.delete}
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
