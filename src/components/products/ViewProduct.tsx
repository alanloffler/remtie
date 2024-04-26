// Icons: Lucide (https://lucide.dev/)
import { ArrowLeft, BadgeX, CalendarPlus, CheckCircle, Mailbox, MapPin, Pencil, Trash2 } from 'lucide-react';
// UI: Shadcn-ui (https://ui.shadcn.com/)
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
// App
import Carousel from '@/components/shared/Carousel';
import CurrencyFormat from '@/components/shared/CurrencyFormat';
import { IDialog } from '@/lib/interfaces/dialog.interface';
import { IImage } from '@/lib/interfaces/image.interface';
import { IProperty } from '@/lib/interfaces/property.interface';
import { ImageServices } from '@/services/image.services';
import { ProductsServices } from '@/services/products.services';
import { ReactElement, useEffect, useState } from 'react';
import { Roles } from '@/lib/constants';
import { store } from '@/services/store.services';
import { useCapitalize } from '@/hooks/useCapitalize';
import { useLocaleDate } from '@/hooks/useLocaleDate';
import { useNavigate, useParams } from 'react-router-dom';
// .env constants
const APP_URL: string = import.meta.env.VITE_APP_URL;
// React component
function ViewProduct() {
	const propertyId = Number(useParams().id);
	const [active, setActive] = useState<boolean>(false);
	const [dialogAction, setDialogAction] = useState<string>('');
	const [images, setImages] = useState<IImage[]>([]);
	const [openDialog, setOpenDialog] = useState<boolean>(false);
	const [property, setProperty] = useState<IProperty>({} as IProperty);
	const [propertyDialog, setPropertyDialog] = useState<IDialog>({ id: 0, name: '', title: '', subtitle: '', message: <span></span> });
	const [showCard, setShowCard] = useState<boolean>(false);
	const [updateUI, setUpdateUI] = useState<number>(0);
	const capitalize = useCapitalize();
	const localeDate = useLocaleDate();
	const navigate = useNavigate();

	useEffect(() => {
		async function getProperty(id: number) {
			ProductsServices.findOne(id).then((response) => {
				if (response.id) {
					setProperty(response);
					setActive(response.is_active);
					setShowCard(true);
				}
				if (response.statusCode > 399) toast({ title: response.statusCode, description: response.message, variant: 'destructive', duration: 5000 });
				if (response instanceof Error) toast({ title: '1 Error', description: '500 Internal Server Error | ' + response.message, variant: 'destructive', duration: 5000 });
			});
		}

		async function getImages(id: number) {
			ImageServices.findByProperty(id).then((response) => {
				if (response.length > 0) setImages(response);
				if (response.statusCode > 399) toast({ title: response.statusCode, description: response.message, variant: 'destructive', duration: 5000 });
				if (response instanceof Error) toast({ title: 'Error', description: '500 Internal Server Error | ' + response.message, variant: 'destructive', duration: 5000 });
			});
		}

		getProperty(propertyId);
		getImages(propertyId);
	}, [propertyId, updateUI]);

	// #region Dialog
	function handleDialog(property: IProperty, action: string) {
		let message: ReactElement | false = false;
		let subtitle: string = '';

		if (action === 'removeSoft') {
			subtitle = 'Esta acción es posible de revertir por el administrador';
			message = (
				<>
					La propiedad <span className='text-md font-bold text-slate-900'>{property.id < 10 ? `COD/0${property.id}` : `COD/${property.id}`}</span> va a ser eliminada de la base de datos.
				</>
			);
		}
		if (action === 'remove') {
			subtitle = 'Esta acción es imposible de revertir.';
			message = (
				<>
					La propiedad <span className='text-md font-bold text-slate-900'>{property.id < 10 ? `COD/0${property.id}` : `COD/${property.id}`}</span> va a ser eliminada permanentemente de la base de datos.
				</>
			);
		}
		if (action === 'restore') {
			subtitle = 'Esta acción es posible de revertir por el administrador';
			message = (
				<>
					La propiedad <span className='text-md font-bold text-slate-900'>{property.id < 10 ? `COD/0${property.id}` : `COD/${property.id}`}</span> va a ser restaurada de la base de datos.
				</>
			);
		}
		setOpenDialog(true);
		setPropertyDialog({
			id: Number(property.id),
			name: property.title,
			title: '¿Estás realmente seguro?',
			subtitle: subtitle,
			message: message
		});
		setDialogAction(action);
	}
	// #region Button actions
	async function restore(id: number) {
		ProductsServices.restore(id).then((response) => {
			if (response.statusCode === 200) toast({ title: response.statusCode, description: response.message, variant: 'success', duration: 5000 });
			if (response.statusCode > 399) toast({ title: response.statusCode, description: response.message, variant: 'destructive', duration: 5000 });
			if (response instanceof Error) toast({ title: 'Error', description: '500 Internal Server Error | ' + response.message, variant: 'destructive', duration: 5000 });
			setOpenDialog(false);
			setUpdateUI(Math.random());
		});
	}

	async function removeSoft(id: number) {
		ProductsServices.removeSoft(id).then((response) => {
			if (response.statusCode === 200) {
                navigate(-1);
                toast({ title: response.statusCode, description: response.message, variant: 'success', duration: 5000 });
            }
			if (response.statusCode > 399) toast({ title: response.statusCode, description: response.message, variant: 'destructive', duration: 5000 });
			if (response instanceof Error) toast({ title: '2 Error', description: '500 Internal Server Error | ' + response.message, variant: 'destructive', duration: 5000 });
			setOpenDialog(false);
		});
	}

	async function remove(id: number) {
		ProductsServices.remove(id).then((response) => {
			if (response.statusCode === 200) {
				navigate(-1);
				toast({ title: response.statusCode, description: response.message, variant: 'success', duration: 5000 });
			}
			if (response.statusCode > 399) toast({ title: response.statusCode, description: response.message, variant: 'destructive', duration: 5000 });
			if (response instanceof Error) toast({ title: 'Error', description: '500 Internal Server Error | ' + response.message, variant: 'destructive', duration: 5000 });
			setOpenDialog(false);
		});
	}

	function switchActive(check: boolean) {
		ProductsServices.switchActive(propertyId, check).then((response) => {
			if (response.statusCode === 200) toast({ title: response.statusCode, description: response.message, variant: 'success', duration: 5000 });
			if (response.statusCode > 399) toast({ title: response.statusCode, description: response.message, variant: 'destructive', duration: 5000 });
			if (response instanceof Error) toast({ title: 'Error', description: '500 Internal Server Error | ' + response.message, variant: 'destructive', duration: 5000 });
		});
	}

	return (
		<main className='flex-1 overflow-y-auto'>
			<div className='mx-6 mb-4 mt-6 flex flex-row items-center justify-end'>
				<Button variant='ghost' size='sm' onClick={() => navigate(-1)}>
					<ArrowLeft className='mr-2 h-4 w-4' />
					Volver
				</Button>
			</div>
			<div className='mt-6 flex min-w-80 flex-col items-center'>
				{showCard && (
					<Card className='relative mb-12 min-w-[350px] overflow-hidden border-t-[4px] md:w-[500px]' style={{ borderTopColor: property.color }}>
						{property.deletedAt !== null && <div className='absolute right-[-35px] top-[32px] w-[170px] rotate-45 transform bg-red-500 py-1 text-center font-semibold text-white'>Eliminado</div>}
						<CardHeader className='flex-grow rounded-sm p-6'>
							<div className='flex items-center gap-4 text-sm font-bold uppercase text-slate-500'>
								<div className='flex w-auto flex-row items-center rounded-sm border bg-slate-200/70 px-2 py-1 leading-tight'>{propertyId < 10 ? 'Cod/0' + propertyId : 'Cod/' + propertyId}</div>
								<div>{property.type}</div>
							</div>
							<CardTitle className='pt-4 text-xl text-slate-800'>{property.title}</CardTitle>
							<CardDescription className='text-sm'>{property.short_description}</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='text-sm'>{property.long_description}</div>
							<div className='pt-4'>
								<div className='flex items-center space-x-2 py-1 text-sm'>
									<MapPin className='h-4 w-4' />
									<span>{`Ubicado en ${property.street}, ${property.city}, ${property.state}`}</span>
								</div>
								<div className='flex items-center space-x-2 py-1 text-sm'>
									<CalendarPlus className='h-4 w-4' />
									<span>{`Creado por ${property.user?.name}, el ${localeDate(property.created_at)}`}</span>
								</div>
								<div className='flex items-center space-x-2 py-1 text-sm'>
									<Mailbox className='h-4 w-4' />
									<span>{`${property.zip}`}</span>
								</div>
							</div>
							<div className='flex flex-row items-center justify-end space-x-4 py-4 text-lg font-semibold text-slate-700'>
								<div className='tracking-tight'>{capitalize(property.business_type)}</div>
								<CurrencyFormat value={property.price} locale='es-AR' digits={0} className='' />
							</div>
							{images.length > 0 && (
								<div className='mb-4 flex'>
									<Carousel images={images} />
								</div>
							)}
                            <div className='flex flex-row items-center pt-2 text-sm text-slate-400'>Última actualización realizada el {localeDate(property.updated_at)}</div>
						</CardContent>
						<CardFooter className='mt-auto justify-between bg-slate-200/50 p-2'>
							<div className='flex items-center space-x-2'>
								<Switch
									key={+new Date()}
									id='is_active'
									defaultChecked={active}
									onCheckedChange={(check: boolean) => switchActive(check)}
									className='h-5 w-11 data-[state=checked]:bg-emerald-300 data-[state=unchecked]:bg-input [&_*]:h-4 [&_*]:w-4 [&_*]:data-[state=checked]:translate-x-6'
								/>
								<Label className='text-slate-400/70'>Activo</Label>
							</div>
							<div className='flex gap-2'>
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild>
											<Button onClick={() => navigate(`${APP_URL}/productos/modificar/${property.id}`)} variant='ghost' size='miniIcon' className='rounded-full border bg-white text-slate-400/70 shadow-sm hover:bg-white hover:text-emerald-500'>
												<Pencil className='h-4 w-4' />
											</Button>
										</TooltipTrigger>
										<TooltipContent>
											<p>Editar</p>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
								{property.deletedAt === null ? (
									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger asChild>
												<Button onClick={() => handleDialog(property, 'removeSoft')} variant='outline' size='miniIcon' className='rounded-full border bg-white text-slate-400/70 shadow-sm hover:bg-white hover:text-rose-400'>
													<Trash2 className='h-4 w-4' />
												</Button>
											</TooltipTrigger>
											<TooltipContent>
												<p>Eliminar</p>
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								) : (
									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger asChild>
												<Button onClick={() => handleDialog(property, 'restore')} variant='outline' size='miniIcon' className='rounded-full border bg-white text-slate-400/70 shadow-sm hover:bg-white hover:text-emerald-400'>
													<CheckCircle className='h-4 w-4' />
												</Button>
											</TooltipTrigger>
											<TooltipContent>
												<p>Restaurar</p>
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								)}
								{store.getState().role === Roles.ADMIN && (
									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger asChild>
												<Button onClick={() => handleDialog(property, 'remove')} variant='outline' size='miniIcon' className='rounded-full border bg-white text-slate-400/70 shadow-sm hover:bg-white hover:text-rose-400'>
													<BadgeX className='h-5 w-5' strokeWidth='1.5' />
												</Button>
											</TooltipTrigger>
											<TooltipContent>
												<p>Eliminar permanente</p>
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								)}
							</div>
						</CardFooter>
					</Card>
				)}
			</div>
			{/* Dialog */}
			<Dialog open={openDialog} onOpenChange={setOpenDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{propertyDialog.title}</DialogTitle>
						<DialogDescription>{propertyDialog.subtitle}</DialogDescription>
					</DialogHeader>
					<section className='text-sm font-normal'>{propertyDialog.message}</section>
					<DialogFooter>
						<div className='mt-6 flex flex-row gap-4'>
							<Button variant='ghost' onClick={() => setOpenDialog(false)}>
								Cancelar
							</Button>
							{dialogAction === 'removeSoft' && (
								<Button variant='delete' onClick={() => removeSoft(propertyDialog.id)}>
									Eliminar
								</Button>
							)}
							{dialogAction === 'restore' && (
								<Button variant='default' onClick={() => restore(propertyDialog.id)}>
									Restaurar
								</Button>
							)}
							{dialogAction === 'remove' && (
								<Button variant='delete' onClick={() => remove(propertyDialog.id)}>
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
export default ViewProduct;
