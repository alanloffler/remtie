/* eslint-disable react-hooks/exhaustive-deps */
// Icons: Lucide (https://lucide.dev/)
import { ArrowUpDown, Info, Pencil, Plus, Trash } from 'lucide-react';
// UI: Shadcn-ui (https://ui.shadcn.com/)
import { Button } from '@/components/ui/button';
import { Dialog, DialogHeader, DialogFooter, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
// App
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CardView from '@/components/products/CardView';
import { DataTable } from '@/components/data-table/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import CurrencyFormat from '@/components/utils/CurrencyFormat';
import { Property } from '@/lib/types';
import { Business, Category } from '@/components/products/inputs.types';
import { ProductsConfig } from '@/lib/config';
import ProductsServices from '@/services/products.services';
import BusinessServices from '@/services/business.services';
import CategoriesServices from '@/services/categories.services';
// .env constants
const appUrl: string = import.meta.env.VITE_APP_URL;
// React component
function ListProducts() {
	const [properties, setProperties] = useState<Property[]>([]);
	const [propertiesFiltered, setPropertiesFiltered] = useState<Property[]>([]);

	const [business, setBusiness] = useState<Business[]>([]);
	const [businessKey, setBusinessKey] = useState<number>(0);
	const [businessSelected, setBusinessSelected] = useState<string>('');
	const [showSelects, setShowSelects] = useState(false);

	const [categories, setCategories] = useState<Category[]>([]);
	const [categoryKey, setCategoryKey] = useState<number>(0);
	const [categorySelected, setCategorySelected] = useState<string>('');
	const [searchFilter, setSearchFilter] = useState<string>('');

	const navigate = useNavigate();
	const { toast } = useToast();

	useMemo(() => {
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
			if (productsService.status >= 400) toast({ variant: 'destructive', title: 'Error', description: productsService.message, duration: 5000 });
			if (productsService.length > 1) {
				getBusiness();
				getCategories();
                setShowSelects(true);
				setProperties(productsService);
				setPropertiesFiltered(productsService);
			}
		}

		getProducts();
	}, []);

	const columns: ColumnDef<Property>[] = [
		// Id
		{
			accessorKey: 'id',
			header: ProductsConfig.headers[0],
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
					<div className='text-center'>
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
					<div className='text-center'>
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
						<Button onClick={() => navigate(appUrl + '/productos')} variant='outline' size='miniIcon' className='hover:bg-white hover:text-sky-400'>
							<Info className='h-5 w-5' strokeWidth='1.5' />
						</Button>
						<Button onClick={() => navigate(appUrl + '/productos')} variant='outline' size='miniIcon' className='hover:bg-white hover:text-emerald-400'>
							<Pencil className='h-5 w-5' strokeWidth='1.5' />
						</Button>

						<Dialog>
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
									<span className='text-md px-1 font-bold text-neutral-900'>{row.original.name}</span>
									se eliminará permanentemente de la base de datos.
								</section>
								<DialogFooter>
									<div className='flex flex-row gap-4'>
										<Button variant='ghost' onClick={() => navigate(appUrl + '/productos')}>
											Cancelar
										</Button>
										<Button variant='default' onClick={() => navigate(appUrl + '/productos')} className='bg-rose-400 hover:bg-rose-600'>
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

	return (
		<main className='flex-1 overflow-y-auto dark:bg-dark'>
			<div className='mx-8 mb-8 mt-8 flex flex-row items-center justify-between'>
				<h1 className='text-2xl font-bold'>Productos</h1>
				<div>
					<Button variant='default' size='sm' className='bg-sky-400 font-semibold uppercase shadow-md hover:bg-sky-500' asChild>
						<Link to={appUrl + '/productos'}>
							<Plus className='mr-2 h-4 w-4' />
							Nuevo Producto
						</Link>
					</Button>
				</div>
			</div>
			<div className='container'>
				<Tabs defaultValue='list' className='w-full'>
					<TabsList className='h-14 px-3 py-4'>
						<TabsTrigger value='card'>Tarjeta</TabsTrigger>
						<TabsTrigger value='list'>Lista</TabsTrigger>
						<Separator orientation='vertical' className='mx-4 h-full bg-slate-300' />
						<div className='flex gap-4'>
							<div className='flex h-8 w-[120px]'>
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
							<div className='flex h-8 w-[150px]'>
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
							<div className='flex h-8 w-[150px]'>
								<Input placeholder={ProductsConfig.search} onChange={(event) => setSearchFilter(event?.target.value)} value={searchFilter} className='h-full w-full' />
							</div>
							<Button onClick={resetFilters} variant='default' size='sm' className='h-8 bg-slate-400 text-xs font-semibold uppercase tracking-wider hover:bg-slate-500'>
								Borrar
							</Button>
						</div>
					</TabsList>
					<TabsContent value='card' className='py-6'>
						<CardView properties={propertiesFiltered} />
					</TabsContent>
					<TabsContent value='list'>
						<DataTable columns={columns} data={propertiesFiltered} searchBy='city' />
					</TabsContent>
				</Tabs>
			</div>
		</main>
	);
}
// Export React component
export default ListProducts;
