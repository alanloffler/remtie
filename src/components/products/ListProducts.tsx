/* eslint-disable react-hooks/exhaustive-deps */
// Icons: Lucide (https://lucide.dev/)
import { ArrowUpDown, Info, Pencil, Plus, Trash2 } from 'lucide-react';
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
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CardView from '@/components/products/CardView';
import { DataTable } from '@/components/data-table/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import CurrencyFormat from '@/components/shared/CurrencyFormat';
import { IImage, Property } from '@/lib/interfaces';
import { IBusiness, ICategory } from '@/lib/inputs.interfaces';
import { ProductsConfig } from '@/lib/config';
import { BusinessServices } from '@/services/business.services';
import { CategoriesServices } from '@/services/categories.services';
import { ImageServices } from '@/services/image.services';
import { ProductsServices } from '@/services/products.services';
import { store } from '@/services/store.services';
// .env constants
const appUrl: string = import.meta.env.VITE_APP_URL;
// React component
function ListProducts() {
	const [properties, setProperties] = useState<Property[]>([]);
	const [propertiesFiltered, setPropertiesFiltered] = useState<Property[]>([]);
	const [business, setBusiness] = useState<IBusiness[]>([]);
	const [businessKey, setBusinessKey] = useState<number>(0);
	const [businessSelected, setBusinessSelected] = useState<string>('');
	const [showSelects, setShowSelects] = useState(false);
	const [categories, setCategories] = useState<ICategory[]>([]);
	const [categoryKey, setCategoryKey] = useState<number>(0);
	const [categorySelected, setCategorySelected] = useState<string>('');
	const [searchFilter, setSearchFilter] = useState<string>('');
	const [openDialog, setOpenDialog] = useState(false);
	const [propertyId, setPropertyId] = useState<number>(0);

	const tabActive: string = store.getState().tabActive;
	const setTabActive = store.getState().setTabActive;

	const navigate = useNavigate();

	useEffect(() => {
		async function getBusiness() {
			const business = await BusinessServices.getBusiness();
			setBusiness(business);
		}

		async function getCategories() {
			const categories = await CategoriesServices.getCategories();
			setCategories(categories);
		}

		async function getProducts() {
			const productsService = await ProductsServices.getProducts();
			if (productsService instanceof Error) toast({ variant: 'destructive', title: 'Error', description: '500 Internal Server Error | ' + productsService.message, duration: 5000 });
			if (productsService.status >= 400) {
                toast({ variant: 'destructive', title: 'Error', description: productsService.message, duration: 5000 });
            }
			if (productsService.length > 1) {
				setShowSelects(true);
				setProperties(productsService);
				setPropertiesFiltered(productsService);
			}
		}

		getBusiness();
		getCategories();
		getProducts();
	}, []);

	const columns: ColumnDef<Property>[] = [
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
		// Actions
		{
			header: ProductsConfig.headers[6],
			id: 'actions',
			cell: ({ row }) => {
				return (
					<div className='flex flex-row gap-2'>
						<Button onClick={() => navigate(appUrl + '/productos/' + row.original.id)} variant='outline' size='miniIcon' className='hover:bg-white hover:text-sky-400'>
							<Info className='h-5 w-5' strokeWidth='1.5' />
						</Button>
						<Button onClick={() => navigate(`${appUrl}/productos/modificar/${row.original.id}`)} variant='outline' size='miniIcon' className='hover:bg-white hover:text-emerald-400'>
							<Pencil className='h-5 w-5' strokeWidth='1.5' />
						</Button>
						<Button onClick={() => handleDeleteDialog(row.original.id)} variant='outline' size='miniIcon' className='hover:bg-white hover:text-rose-400'>
							<Trash2 className='h-5 w-5' strokeWidth='1.5' />
						</Button>
						<div className='flex items-center'>
							<div className={'flex h-4 w-4 items-center rounded-full border pl-1 ' + (row.original.is_active ? 'border-emerald-400 bg-emerald-300' : 'border-slate-300/50 bg-input')}></div>
						</div>
					</div>
				);
			}
		}
	];

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
		function applyFilters(prop: Property[], filterAttributes: string[], filterValues: string[], search: string) {
			// Selects filters
			const filteredProperties = prop.filter((property: Property) => {
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

	function handleDeleteDialog(id: number) {
		setOpenDialog(true);
		setPropertyId(id);
	}

	async function handleDeleteProduct(id: number) {
		setOpenDialog(false);
		const images: IImage[] = await ImageServices.getByProperty(id);

		Promise.all([ImageServices.deleteMany(images), ProductsServices.deleteProduct(id)])
        .then((response) => {
			// const [response1, response2] = response;
			// console.log(response1);
			// console.log(response2);
			const resultsAll = response.every((res) => res.status === 200);
			if (resultsAll) {
				toast({ title: 'Propiedad eliminada', description: 'La propiedad fue eliminada correctamente', variant: 'success', duration: 5000 });
                navigate(`${appUrl}/productos/`);
			} else {
				toast({ title: 'Error', description: '400 Bad Request | La propiedad no pudo ser eliminada', variant: 'destructive', duration: 5000 });
			}
		});
	}

	return (
		<main className='flex-1 overflow-y-auto'>
			<div className='mx-8 mb-8 mt-8 flex flex-row items-center justify-between'>
				<h1 className='text-2xl font-normal text-slate-600'>Productos</h1>
				<div>
					<Button variant='default' size='default' asChild>
						<Link to={`${appUrl}/producto/nuevo`}>
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
												<SelectItem key={el.id} value={el.value} className='text-sm'>
													{el.name}
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
												<SelectItem key={el.id} value={el.value} className='text-sm'>
													{el.name}
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
						<CardView properties={propertiesFiltered} />
					</TabsContent>
					<TabsContent value='list' className='py-6 pb-8'>
						<Card className='p-6'>
							<DataTable columns={columns} data={propertiesFiltered} searchBy='city' />
						</Card>
					</TabsContent>
				</Tabs>
			</div>
			{/* Dialog */}
			<Dialog open={openDialog} onOpenChange={setOpenDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>¿Estás realmente seguro?</DialogTitle>
						<DialogDescription>Esta acción es imposible de revertir.</DialogDescription>
					</DialogHeader>
					<section>
						La propiedad
						<span className='text-md px-1 font-bold text-neutral-900 uppercase'>{propertyId < 10 ? 'Cod/0' + propertyId : 'Cod/' + propertyId}</span>
						se eliminará permanentemente de la base de datos.
					</section>
					<DialogFooter>
						<div className='flex flex-row gap-4'>
							<Button variant='ghost' onClick={() => setOpenDialog(false)}>
								Cancelar
							</Button>
							<Button variant='delete' onClick={() => handleDeleteProduct(propertyId)}>
								Eliminar
							</Button>
						</div>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</main>
	);
}
// Export React component
export default ListProducts;
