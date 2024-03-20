// Icons: Lucide (https://lucide.dev/)
import { ArrowLeft, Bookmark, Pencil, Trash2 } from 'lucide-react';
// UI: Shadcn-ui (https://ui.shadcn.com/)
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';
// App
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ProductsServices } from '@/services/products.services';
import { ImageServices } from '@/services/image.services';
import { IImage, Property } from '@/lib/interfaces';
import CurrencyFormat from '@/components/shared/CurrencyFormat';
import Carousel from '@/components/shared/Carousel';
// .env constants
const appUrl: string = import.meta.env.VITE_APP_URL;
// React component
function ViewProduct() {
	const { id } = useParams();
	const navigate = useNavigate();
	const propertyId: number = Number(id);
	const [property, setProperty] = useState<Property>();
	const [images, setImages] = useState<IImage[]>([]);
	const [openDialog, setOpenDialog] = useState<boolean>(false);
	const [hideImages, setHideImages] = useState<boolean>(false);

	useEffect(() => {
		async function getProperty() {
			const property: Property = await ProductsServices.getProduct(propertyId);
			setProperty(property);
		}

		async function getImages(id: number) {
			const images: IImage[] = await ImageServices.getByProperty(id);
			setImages(images);
			if (images.length > 0) setHideImages(true);
		}

		getProperty();
		getImages(propertyId);
	}, [propertyId]);

	function handleDeleteProduct(id: number) {
		Promise.all(images.map((image) => ImageServices.delete(image.id))).then((response) => {
			const allOk = response.every((response) => response.status === 200);
			if (allOk) {
				ProductsServices.deleteProduct(id)
					.then((response) => {
						if (response instanceof Error) toast({ title: 'Error', description: '500 Internal Server Error | ' + response.message, variant: 'destructive', duration: 5000 });
						if (response.status > 200) {
							if (response.status === 401) navigate('/');
							toast({ title: 'Error', description: response.message, variant: 'destructive', duration: 5000 });
						}
						if (response.status === 200) {
							toast({ title: 'Propiedad eliminada', description: response.message, variant: 'success', duration: 5000 });
							navigate(`${appUrl}/productos`);
						}
					})
					.catch((error) => {
						toast({ title: 'Error', description: '500 Internal Server Error | ' + error.message, variant: 'destructive', duration: 5000 });
					});
			} else {
				toast({ title: 'Error', description: '400 Bad Request | Images not deleted', variant: 'destructive', duration: 5000 });
			}
		});
		setOpenDialog(false);
	}

	function switchActive(check: boolean) {
		ProductsServices.switchActive(propertyId, check).then((response) => {
			if (response instanceof Error) toast({ title: 'Error', description: '500 Internal Server Error | ' + response.message, variant: 'destructive', duration: 5000 });
			if (response.status > 200) {
				if (response.status === 401) navigate('/');
				toast({ title: 'Error', description: response.message, variant: 'destructive', duration: 5000 });
			}
			if (response.status === 200) toast({ title: 'Propiedad actualizada', description: response.message, variant: 'success', duration: 5000 });
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
			<div className='mt-6 flex min-w-80 flex-col items-center px-6'>
				<Card className='mb-12 min-w-[350px] border-t-[4px] md:w-[500px]' style={{ borderTopColor: property?.color }}>
					<CardHeader className='flex-grow rounded-sm p-4'>
						<div className='flex items-center gap-2'>
							<Bookmark strokeWidth='2' className='h-5 w-5' style={{ color: property?.color }} />
							<div className='text-[12px] font-bold uppercase text-slate-500'>{property?.type}</div>
						</div>
						<CardTitle className='text-md text-slate-800'>{property?.title}</CardTitle>
						<CardDescription className='text-sm'>{property?.short_description}</CardDescription>
						<div className='flex pt-2 text-xs font-bold uppercase text-slate-500'>
							<div className='flex w-auto flex-row items-center rounded-sm bg-slate-200/70 p-1 leading-tight'>{propertyId < 10 ? 'Cod/0' + propertyId : 'Cod/' + propertyId}</div>
						</div>
					</CardHeader>
					<CardContent className='mt-auto px-4 py-2'>
						<div className='mb-4 flex w-auto flex-row text-sm'>{property?.long_description}</div>
						<div className='mb-4 flex justify-around'>
							<div className='text-sm font-semibold uppercase tracking-tighter text-slate-500'>{property?.business_type}</div>
							<CurrencyFormat value={property?.price} locale='es-AR' digits={0} className='text-l font-semibold italic tracking-tight text-slate-700' />
						</div>
						{hideImages && (
							<div className='mb-4 flex'>
								<Carousel images={images} />
							</div>
						)}
					</CardContent>
					<CardFooter className='mt-auto justify-between bg-slate-200/50 p-2'>
						<div className='flex items-center space-x-2'>
							<Switch
								key={+new Date()}
								id='is_active'
								defaultChecked={property?.is_active}
								onCheckedChange={(check: boolean) => switchActive(check)}
								className='h-5 w-11 data-[state=checked]:bg-emerald-300 data-[state=unchecked]:bg-input [&_*]:h-4 [&_*]:w-4 [&_*]:data-[state=checked]:translate-x-6'
							/>
							<Label className='text-slate-400/70'>Activo</Label>
						</div>
						<div className='flex gap-2'>
							<Button onClick={() => navigate(`${appUrl}/productos/modificar/${property?.id}`)} variant='ghost' size='miniIcon' className='rounded-full border bg-white text-slate-400/70 shadow-sm hover:bg-white hover:text-emerald-500'>
								<Pencil className='h-4 w-4' />
							</Button>
							<Dialog open={openDialog} onOpenChange={setOpenDialog}>
								<DialogTrigger asChild>
									<Button variant='ghost' size='miniIcon' className='rounded-full border bg-white text-slate-400/70 shadow-sm hover:bg-white hover:text-rose-500'>
										<Trash2 className='h-4 w-4' />
									</Button>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>¿Estás realmente seguro?</DialogTitle>
										<DialogDescription>Esta acción es imposible de revertir.</DialogDescription>
									</DialogHeader>
									<div>
										<section className='text-sm font-normal'>
											La propiedad
											<span className='text-md px-1 font-bold text-slate-900'>{property?.title}</span>
											con el código<span className='text-md px-1 font-bold text-slate-900'>{propertyId < 10 ? 'Cod/0' + propertyId : 'Cod/' + propertyId}</span>
											se eliminará permanentemente de la base de datos.
										</section>
										<DialogFooter>
											<div className='mt-6 flex flex-row gap-4'>
												<Button
													variant='ghost'
													onClick={(e) => {
														e.preventDefault();
														setOpenDialog(false);
													}}>
													Cancelar
												</Button>
												<Button variant='delete' onClick={() => handleDeleteProduct(propertyId)}>
													Eliminar
												</Button>
											</div>
										</DialogFooter>
									</div>
								</DialogContent>
							</Dialog>
						</div>
					</CardFooter>
				</Card>
			</div>
		</main>
	);
}
// Export React component
export default ViewProduct;
