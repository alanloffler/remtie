// Icons: Lucide (https://lucide.dev/)
import { ArrowLeft, BadgeX, CheckCircle, Mail, Pencil, Phone, Trash2 } from 'lucide-react';
// UI: Shadcn-ui (https://ui.shadcn.com/)
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Dialog, DialogHeader, DialogFooter, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
// App
import Dot from '@/components/shared/Dot';
import { ButtonsConfig } from '@/lib/config/buttons.config';
import { IDialog } from '@/lib/interfaces/dialog.interface';
import { IUser } from '@/lib/interfaces/user.interface';
import { ReactElement, useEffect, useState } from 'react';
import { Roles } from '@/lib/constants';
import { UsersConfig } from '@/lib/config/users.config';
import { UsersServices } from '@/services/users.services';
import { emptyUser } from '@/lib/utils';
import { handleServerResponse } from '@/lib/handleServerResponse';
import { store } from '@/services/store.services';
import { useNavigate, useParams } from 'react-router-dom';
import { useUserSince } from '@/hooks/useUserSince';
// .env constants
const APP_URL: string = import.meta.env.VITE_APP_URL;
// React component
function ViewUser() {
	const id = Number(useParams().id);
	const [dialogAction, setDialogAction] = useState<string>('');
	const [openDialog, setOpenDialog] = useState<boolean>(false);
	const [updateUI, setUpdateUI] = useState<number>(0);
	const [user, setUser] = useState<IUser>(emptyUser);
	const [userDialog, setUserDialog] = useState<IDialog>({ id: 0, name: '', title: '', subtitle: '', message: <span></span> });
	const navigate = useNavigate();
	// #region Load data
	useEffect(() => {
		UsersServices.findOne(id).then((response) => {
			if (!response.statusCode) setUser(response);
            handleServerResponse(response);
		});
	}, [id, navigate, updateUI]);
	// #endregion
	// #region Button actions
	async function removeSoft(id: number) {
		UsersServices.removeSoft(id).then((response) => {
			if (response.statusCode === 200) setUpdateUI(Math.random());
			setOpenDialog(false);
            handleServerResponse(response);
		});
	}

	function remove(id: number): void {
		UsersServices.remove(id).then((response) => {
			if (response.statusCode === 200) navigate(-1);
			setOpenDialog(false);
            handleServerResponse(response);
		});
	}

	async function restore(id: number) {
		UsersServices.restore(id).then((response) => {
			if (response.statusCode === 200) setUpdateUI(Math.random());
			setOpenDialog(false);
            handleServerResponse(response);
		});
	}
	// #endregion
	// #region Dialog
	function handleDialog(user: IUser, action: string) {
		let message: ReactElement | false = false;
		let subtitle: string = '';

		if (action === 'removeSoft') {
			subtitle = UsersConfig.dialog.possibleRevertion;
			message = (
				<div className='flex flex-col'>
					{UsersConfig.dialog.userSoftDelete}
					<span className='text-md font-bold text-slate-900'>{user.name}</span>
				</div>
			);
		}
		if (action === 'remove') {
			subtitle = UsersConfig.dialog.impossibleRevertion;
			message = (
				<div className='flex flex-col'>
					{UsersConfig.dialog.userDelete}
					<span className='text-md font-bold text-slate-900'>{user.name}</span>
				</div>
			);
		}
		if (action === 'restore') {
			subtitle = UsersConfig.dialog.possibleRevertion;
			message = (
				<div className='flex flex-col'>
					{UsersConfig.dialog.userRestore}
					<span className='text-md font-bold text-slate-900'>{user.name}</span>
				</div>
			);
		}

		setOpenDialog(true);
		setUserDialog({
			id: Number(user.id),
			name: user.name,
			title: UsersConfig.dialog.title,
			subtitle: subtitle,
			message: message
		});
		setDialogAction(action);
	}
	// #endregion
	return (
		<main className='flex-1 animate-fadeIn overflow-y-auto'>
			<div className='mx-6 mb-4 mt-6 flex flex-row items-center justify-end'>
				<Button onClick={() => navigate(-1)} variant='ghost' size='sm'>
					<ArrowLeft className='mr-2 h-4 w-4' />
					{ButtonsConfig.actions.back}
				</Button>
			</div>
			<div className='mt-8 flex min-w-80 flex-col items-center px-6'>
				<Card className='mb-8 min-w-[350px] dark:border-[#2e2e2e] dark:bg-[#292a2d] md:w-[500px]'>
					<CardContent className='mx-0 px-0'>
						<div className='flex flex-col items-center'>
							<Dot role={user.role} text={user.role?.charAt(0).toUpperCase()} width='90px' fontSize='60px' margin='-20px' />
							<div className='mt-12 text-3xl font-bold'>{user.name}</div>
							<div className='mt-2 text-sm text-neutral-400'>{user?.role === 'admin' ? 'Administrador' : 'Usuario'}</div>
							<div className='my-8 flex items-center gap-2 italic'>
								<Mail className='h-4 w-4' />
								{user.email}
							</div>
							{user.phone && (
								<div className='mb-12 flex items-center gap-2 italic'>
									<Phone className='h-4 w-4' />
									{user.phone}
								</div>
							)}
							<div className='flex text-sm font-extralight text-neutral-500'>
								{/* TODO?: use navigator.language, maybe another implementation? */}
								{useUserSince(user.role, user.createdAt)}
							</div>
						</div>
					</CardContent>
					{(store.getState().role === Roles.ADMIN || store.getState().userId === user.id) && (
						<CardFooter className='justify-end gap-2 bg-slate-200/50 p-2'>
							{user.deletedAt === null && (
								<Button onClick={() => navigate(`${APP_URL}/usuario/modificar/${user.id}`)} variant='ghost' size='miniIcon' className='rounded-full border bg-white text-slate-400/70 shadow-sm hover:bg-white hover:text-emerald-500'>
									<Pencil className='h-4 w-4' />
								</Button>
							)}
							{user.deletedAt === null ? (
								<Button onClick={() => handleDialog(user, 'removeSoft')} variant='outline' size='miniIcon' className='rounded-full border bg-white text-slate-400/70 shadow-sm hover:bg-white hover:text-rose-400'>
									<Trash2 className='h-4 w-4' />
								</Button>
							) : (
								<Button onClick={() => handleDialog(user, 'restore')} variant='outline' size='miniIcon' className='rounded-full border bg-white text-slate-400/70 shadow-sm hover:bg-white hover:text-emerald-400'>
									<CheckCircle className='h-4 w-4' />
								</Button>
							)}
							{store.getState().role === Roles.ADMIN && store.getState().userId !== user.id && (
								<Button onClick={() => handleDialog(user, 'remove')} variant='outline' size='miniIcon' className='rounded-full border bg-white text-slate-400/70 shadow-sm hover:bg-white hover:text-rose-400'>
									<BadgeX className='h-5 w-5' strokeWidth='1.5' />
								</Button>
							)}
						</CardFooter>
					)}
				</Card>
			</div>
			{/* SECTION: Dialog */}
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
// Export react component
export default ViewUser;
