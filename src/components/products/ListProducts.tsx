/* eslint-disable react-hooks/exhaustive-deps */
// Icons: Lucide (https://lucide.dev/)
import { ArrowUpDown, BadgeX, CheckCircle, CircleOff, Info, Pencil, Plus, Trash2 } from 'lucide-react';
// UI: Shadcn-ui (https://ui.shadcn.com/)
import { Button } from '@/components/ui/button';
import { Card } from '@/components//ui/card';
import { Dialog, DialogHeader, DialogFooter, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
// App
import CardView from '@/components/products/CardView';
import CurrencyFormat from '@/components/shared/CurrencyFormat';
import InfoCard from '@/components/shared/InfoCard';
import { BusinessServices } from '@/services/business.services';
import { CategoriesServices } from '@/services/categories.services';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table/DataTable';
import { IBusiness, ICategory } from '@/lib/interfaces/inputs.interface';
import { IDialog } from '@/lib/interfaces/dialog.interface';
import { IProperty } from '@/lib/interfaces/property.interface';
import { Link, useNavigate } from 'react-router-dom';
import { ProductsConfig } from '@/lib/config';
import { ProductsServices } from '@/services/products.services';
import { ReactElement, useEffect, useState } from 'react';
import { Roles } from '@/lib/constants';
import { store } from '@/services/store.services';
import { useCapitalize } from '@/hooks/useCapitalize';
// .env constants
const APP_URL: string = import.meta.env.VITE_APP_URL;
// React component
function ListProducts() {
	const [properties, setProperties] = useState<IProperty[]>([]);
	const [propertiesFiltered, setPropertiesFiltered] = useState<IProperty[]>([]);
	const [business, setBusiness] = useState<IBusiness[]>([]);
	const [businessKey, setBusinessKey] = useState<number>(0);
	const [businessSelected, setBusinessSelected] = useState<string>('');
	const [showSelects, setShowSelects] = useState(false);
	const [categories, setCategories] = useState<ICategory[]>([]);
	const [categoryKey, setCategoryKey] = useState<number>(0);
	const [categorySelected, setCategorySelected] = useState<string>('');
	const [searchFilter, setSearchFilter] = useState<string>('');
	const [openDialog, setOpenDialog] = useState(false);
	const [showInfoCard, setShowInfoCard] = useState<boolean>(false);
	const [showCard, setShowCard] = useState<boolean>(false);
	const [propertyDialog, setPropertyDialog] = useState<IDialog>({ id: 0, name: '', title: '', subtitle: '', message: <span></span> });
	const [dialogAction, setDialogAction] = useState<string>('');

	const tabActive: string = store.getState().tabActive;
	const setTabActive = store.getState().setTabActive;

	const navigate = useNavigate();
	const capitalize = useCapitalize();

	const content: ReactElement | false =
		store.getState().role === Roles.ADMIN ? (
			<div>Aún no hay propiedades creadas por los usuarios o por vos.</div>
		) : (
			<div>
				No hay propiedades creadas por vos <span className='pl-1 font-bold'>({store.getState().username})</span>.
			</div>
		);

	async function getBusiness() {
		const business = await BusinessServices.findAll();
		setBusiness(business);
	}

	async function getCategories() {
		const categories = await CategoriesServices.findAll();
		setCategories(categories);
	}

	async function getProducts() {
		ProductsServices.findAll().then((response) => {
			if (Array.isArray(response)) {
				if (response.length > 0) {
					setShowSelects(true);
					setProperties(response);
					setPropertiesFiltered(response);
					setShowCard(true);
				} else {
					setShowInfoCard(true);
				}
			}
			if (response.statusCode > 399) toast({ title: response.statusCode, description: response.message, variant: 'destructive', duration: 5000 });
			if (response instanceof Error) toast({ title: 'Error', description: '500 Internal Server Error | ' + response.message, variant: 'destructive', duration: 5000 });
		});
	}

	useEffect(() => {
		getBusiness();
		getCategories();
		getProducts();
	}, []);
	// #region Table columns
	const columns: ColumnDef<IProperty>[] = [
		// Id
		{
			accessorKey: 'id',
			header: () => {
				return <div className='text-center'>{ProductsConfig.headers[0]}</div>;
			},
			cell: ({ row }) => {
				return <div className='text-center'>{row.original.id}</div>;
			}
		},
		// Type
		{
			accessorKey: 'business_type',
			header: ProductsConfig.headers[1]
		},
		// Category
		{
			accessorKey: 'type',
			header: ({ column }) => {
				return (
					<div className=''>
						<Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
							{ProductsConfig.headers[2]}
							<ArrowUpDown className='ml-2 h-4 w-4' />
						</Button>
					</div>
				);
			}
		},
		// City
		{ accessorKey: 'city', header: ProductsConfig.headers[4] },
		{
			accessorKey: 'price',
			header: ({ column }) => {
				return (
					<div className=''>
						<Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
							{ProductsConfig.headers[5]}
							<ArrowUpDown className='ml-2 h-4 w-4' />
						</Button>
					</div>
				);
			},
			cell: ({ row }) => {
				return <CurrencyFormat value={row.original.price} locale='es-AR' digits={0} className='font-semibold italic tracking-tight' />;
			}
		},
		//#region Actions
		{
			header: ProductsConfig.headers[6],
			id: 'actions',
			cell: ({ row }) => {
				return (
					<div className='flex flex-row gap-2'>
						{row.original.deletedAt === null && (
							<>
								<Button onClick={() => navigate(APP_URL + '/productos/' + row.original.id)} variant='outline' size='miniIcon' className='hover:bg-white hover:text-sky-400'>
									<Info className='h-5 w-5' strokeWidth='1.5' />
								</Button>
								<Button onClick={() => navigate(`${APP_URL}/productos/modificar/${row.original.id}`)} variant='outline' size='miniIcon' className='hover:bg-white hover:text-emerald-400'>
									<Pencil className='h-5 w-5' strokeWidth='1.5' />
								</Button>
							</>
						)}
						{/* TODO RESTORE PROPERTY CONTINUE WITH DIALOG LIKE USERS */}
						{row.original.deletedAt === null ? (
							<Button onClick={() => handleDialog(row.original, 'removeSoft')} variant='outline' size='miniIcon' className='hover:bg-white hover:text-rose-400'>
								<Trash2 className='h-5 w-5' strokeWidth='1.5' />
							</Button>
						) : (
							<Button onClick={() => handleDialog(row.original, 'restore')} variant='outline' size='miniIcon' className='hover:bg-white hover:text-emerald-400'>
								<CheckCircle className='h-5 w-5' strokeWidth='1.5' />
							</Button>
						)}
						{/* TODO HARD REMOVE */}
						{store.getState().role === Roles.ADMIN && (
							<Button onClick={() => handleDialog(row.original, 'remove')} variant='outline' size='miniIcon' className='hover:bg-white hover:text-rose-400'>
								<BadgeX className='h-5 w-5' strokeWidth='1.5' />
							</Button>
						)}
						<div className='flex items-center'>
							{row.original.deletedAt ? <CircleOff className='h-4 w-4' /> : <div className={'flex h-4 w-4 items-center rounded-full border pl-1 ' + (row.original.is_active ? 'border-emerald-400 bg-emerald-300' : 'border-slate-300/50 bg-input')}></div>}
						</div>
					</div>
				);
			}
		}
	];
	// #region Filters
	function handleBusinessFilter(event: string) {
		if (event === 'reset') {
			setBusinessSelected('');
			setBusinessKey(+new Date());
		} else {
			setBusinessSelected(event);
		}
	}

	function handleCategoryFilter(event: string) {
		if (event === 'reset') {
			setCategorySelected('');
			setCategoryKey(+new Date());
		} else {
			setCategorySelected(event);
		}
	}

	function resetFilters() {
		setBusinessSelected('');
		setBusinessKey(+new Date());
		setCategorySelected('');
		setCategoryKey(+new Date());
		setSearchFilter('');
	}

	useEffect(() => {
		function applyFilters(prop: IProperty[], filterAttributes: string[], filterValues: string[], search: string) {
			// Selects filters
			const filteredProperties = prop.filter((property: IProperty) => {
				return filterAttributes.every((attribute, index) => {
					if (filterValues[index] !== '') {
						return property[attribute] === filterValues[index];
					} else {
						return prop;
					}
				});
			});
			// Input filter
			if (search === null) search = '';
			if (search !== '') {
				const searchProperties = filteredProperties.filter((item: { city: string }) => item.city.toLowerCase().includes(search.toLowerCase()));
				return searchProperties;
			} else {
				return filteredProperties;
			}
		}
		setPropertiesFiltered(applyFilters(properties, ['business_type', 'type'], [businessSelected, categorySelected], searchFilter));
	}, [businessSelected, categorySelected, searchFilter]);

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
			if (response.statusCode === 200) {
				toast({ title: response.statusCode, description: response.message, variant: 'success', duration: 5000 });
				getProducts();
			}
			if (response.statusCode > 399) toast({ title: response.statusCode, description: response.message, variant: 'destructive', duration: 5000 });
			if (response instanceof Error) toast({ title: 'Error', description: '500 Internal Server Error | ' + response.message, variant: 'destructive', duration: 5000 });
			setOpenDialog(false);
		});
	}

	async function removeSoft(id: number) {
		ProductsServices.removeSoft(id).then((response) => {
			if (response.statusCode === 200) {
				toast({ title: response.statusCode, description: response.message, variant: 'success', duration: 5000 });
				getProducts();
			}
			if (response.statusCode > 399) toast({ title: response.statusCode, description: response.message, variant: 'destructive', duration: 5000 });
			if (response instanceof Error) toast({ title: 'Error', description: '500 Internal Server Error | ' + response.message, variant: 'destructive', duration: 5000 });
		});
		setOpenDialog(false);
	}

	async function remove(id: number) {
		ProductsServices.remove(id).then((response) => {
			if (response.statusCode === 200) {
				toast({ title: response.statusCode, description: response.message, variant: 'success', duration: 5000 });
				getProducts();
			}
			if (response.statusCode > 399) toast({ title: response.statusCode, description: response.message, variant: 'destructive', duration: 5000 });
			if (response instanceof Error) toast({ title: 'Error', description: '500 Internal Server Error | ' + response.message, variant: 'destructive', duration: 5000 });
		});
		setOpenDialog(false);
	}

	return (
		<main className='flex-1 overflow-y-auto'>
			<div className='mx-8 mb-8 mt-8 flex flex-row items-center justify-between'>
				<h1 className='text-2xl font-normal text-slate-600'>Productos</h1>
				<div>
					<Button variant='default' size='default' asChild>
						<Link to={`${APP_URL}/productos/crear`}>
							<Plus className='mr-2 h-4 w-4' />
							Nuevo
						</Link>
					</Button>
				</div>
			</div>
			<div className='container'>
				<Tabs defaultValue={tabActive || 'card'} className='w-full'>
					<div className='flex flex-col rounded-md border border-slate-300 bg-slate-200 px-3 py-4 shadow-sm md:flex-row md:gap-4 md:p-2 md:pr-4'>
						<div className='flex flex-row'>
							<TabsList className='flex bg-inherit p-0 pl-1'>
								<TabsTrigger value='card' className='font-normal' onClick={() => setTabActive('card')}>
									Tarjeta
								</TabsTrigger>
								<TabsTrigger value='list' className='font-normal' onClick={() => setTabActive('list')}>
									Lista
								</TabsTrigger>
							</TabsList>
						</div>
						<div className='flex'>
							<Separator orientation='vertical' className='mx-2 h-full bg-slate-400/50' />
						</div>
						<div className='mt-3 flex flex-row gap-4 md:mt-1'>
							<div className='flex h-8 w-[50%] md:w-[100px]'>
								<Select key={businessKey} onValueChange={(event) => handleBusinessFilter(event)}>
									<SelectTrigger className='h-full w-full'>
										<SelectValue placeholder='Tipo' className='text-sm' />
									</SelectTrigger>
									<SelectContent>
										{showSelects &&
											business?.map((el) => (
												<SelectItem key={el.id} value={el.name} className='text-sm'>
													{capitalize(el.name)}
												</SelectItem>
											))}
										<Separator orientation='horizontal' className=' bg-slate-200' />
										<SelectItem key='0' value='reset' className='text-sm focus:text-emerald-600'>
											Todos
										</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className='flex h-8 w-[50%] md:w-[120px] lg:w-[160px]'>
								<Select key={categoryKey} onValueChange={(event) => handleCategoryFilter(event)}>
									<SelectTrigger className='h-full w-full'>
										<SelectValue placeholder='Categoría' className='text-sm' />
									</SelectTrigger>
									<SelectContent>
										{showSelects &&
											categories?.map((el) => (
												<SelectItem key={el.id} value={el.name} className='text-sm'>
													{capitalize(el.name)}
												</SelectItem>
											))}
										<Separator orientation='horizontal' className=' bg-slate-200' />
										<SelectItem key='0' value='reset' className='text-sm focus:text-emerald-600'>
											Todas
										</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
						<div className='mt-4 flex flex-row gap-4 md:mt-1'>
							<div className='flex h-8 w-[50%] md:w-auto lg:w-auto'>
								<Input placeholder={ProductsConfig.search} onChange={(event) => setSearchFilter(event?.target.value)} value={searchFilter} className='h-full w-full' />
							</div>
							<div className='flew-row flex h-8 w-[50%] md:w-[90px]'>
								<Button onClick={resetFilters} variant='slate' className='h-8 w-full'>
									Borrar
								</Button>
							</div>
						</div>
					</div>
					<TabsContent value='card' className='py-6 pb-8'>
						{showCard && <CardView getProducts={getProducts} properties={propertiesFiltered} />}
					</TabsContent>
					<TabsContent value='list' className='py-6 pb-8'>
						{showCard && (
							<Card className='p-6'>
								<DataTable columns={columns} data={propertiesFiltered} searchBy='city' />
							</Card>
						)}
					</TabsContent>
				</Tabs>
				{showInfoCard && (
					<div className='flex justify-center'>
						<InfoCard content={content} />
					</div>
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
export default ListProducts;
