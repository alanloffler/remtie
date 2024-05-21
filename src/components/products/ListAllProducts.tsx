/* eslint-disable react-hooks/exhaustive-deps */
// Icons: Lucide (https://lucide.dev/)
import { ArrowUpDown, CircleOff, Heart, Info, Pencil, Plus } from 'lucide-react';
// UI: Shadcn-ui (https://ui.shadcn.com/)
import { Button } from '@/components/ui/button';
import { Card } from '@/components//ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Toggle } from '@/components/ui/toggle';
import { toast } from '@/components/ui/use-toast';
// App
import CardView from '@/components/products/CardView';
import CurrencyFormat from '@/components/shared/CurrencyFormat';
import FavButton from '@/components/shared/FavButton';
import InfoCard from '@/components/shared/InfoCard';
import { BusinessServices } from '@/services/business.services';
import { ButtonsConfig } from '@/lib/config/buttons.config';
import { CategoriesServices } from '@/services/categories.services';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table/DataTable';
import { FavoritesServices } from '@/services/favorite.services';
import { IBusiness, ICategory } from '@/lib/interfaces/inputs.interface';
import { IFavorite } from '@/lib/interfaces/favorite.interface';
import { IProperty } from '@/lib/interfaces/property.interface';
import { LayoutConfig } from '@/lib/config/layout.config';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ProductsConfig } from '@/lib/config/products.config';
import { ProductsServices } from '@/services/products.services';
import { ReactElement, useEffect, useState } from 'react';
import { Roles } from '@/lib/constants';
import { SettingsConfig } from '@/lib/config/settings.config';
import { SettingsServices } from '@/services/settings.services';
import { store } from '@/services/store.services';
import { useCapitalize } from '@/hooks/useCapitalize';
// .env constants
const APP_URL: string = import.meta.env.VITE_APP_URL;
// React component
function ListAllProducts({ type }: { type: string }) {
	const [searchParams, setSearchParams] = useSearchParams();
	const [business, setBusiness] = useState<IBusiness[]>([]);
	const [businessKey, setBusinessKey] = useState<number>(0);
	const [businessSelected, setBusinessSelected] = useState<string>(searchParams.get('t') || '');
	const [categories, setCategories] = useState<ICategory[]>([]);
	const [categoryKey, setCategoryKey] = useState<number>(0);
	const [categorySelected, setCategorySelected] = useState<string>(searchParams.get('c') || '');
	const [createdSelected, setCreatedSelected] = useState<string | number>('');
	const [properties, setProperties] = useState<IProperty[]>([]);
	const [propertiesFiltered, setPropertiesFiltered] = useState<IProperty[]>([]);
	const [searchFilter, setSearchFilter] = useState<string>('');
	const [showCard, setShowCard] = useState<boolean>(false);
	const [showInfoCard, setShowInfoCard] = useState<boolean>(false);
	const [showSelects, setShowSelects] = useState(false);
	const [isFavsToggled, setIsFavsToggled] = useState(false);
	const rowsPerPage = store((state) => state.rowsPerPageProducts);
	const setRowsPerPageProducts = store((state) => state.setRowsPerPageProducts);
	const setTabActive = store.getState().setTabActive;
	const tabActive: string = store.getState().tabActive;
	const capitalize = useCapitalize();
	const navigate = useNavigate();
    const isClicked = store((state) => state.isClicked);

	const content: ReactElement | false =
		store.getState().role === Roles.ADMIN ? (
			<div>{ProductsConfig.contentStatus.admin}</div>
		) : (
			<div>
				{ProductsConfig.contentStatus.user}
				<span className='pl-1 font-bold'>({store.getState().username})</span>.
			</div>
		);
	// #region Load data (UI, Favs, Settings and Properties)
	async function getBusiness() {
		BusinessServices.findAllUI().then((response) => {
			if (response.length > 0) setBusiness(response);
			if (response.statusCode > 399) toast({ title: response.statusCode, description: response.message, variant: 'destructive', duration: 5000 });
			if (response instanceof Error) toast({ title: 'Error', description: '500 Internal Server Error | ' + response.message, variant: 'destructive', duration: 5000 });
		});
	}

	async function getCategories() {
		CategoriesServices.findAllUI().then((response) => {
			if (response.length > 0) setCategories(response);
			if (response.statusCode > 399) toast({ title: response.statusCode, description: response.message, variant: 'destructive', duration: 5000 });
			if (response instanceof Error) toast({ title: 'Error', description: '500 Internal Server Error | ' + response.message, variant: 'destructive', duration: 5000 });
		});
	}

	async function getProducts() {
		ProductsServices.findAllClient().then((response) => {
			if (Array.isArray(response)) {
				if (response.length > 0) {
					setShowSelects(true);
					setFavorites(response);
					// setShowCard(true);
				} else {
					setShowInfoCard(true);
				}
			}
			if (response.statusCode > 399) toast({ title: response.statusCode, description: response.message, variant: 'destructive', duration: 5000 });
			if (response instanceof Error) toast({ title: 'Error', description: '500 Internal Server Error | ' + response.message, variant: 'destructive', duration: 5000 });
		});
	}

	async function setFavorites(props: IProperty[]) {
		FavoritesServices.findAll().then((response) => {
			if (response.length > 0) {
				const properties = props.map((property) => ({
					...property,
					isFavorite: response.map((favorite: IFavorite) => favorite.propertyId).includes(property.id)
				}));
				setPropertiesFiltered(properties);
				setProperties(properties);
			} else if (response.length === 0) {
				setPropertiesFiltered(props);
				setProperties(props);
			}
            setShowCard(true);
			if (response.statusCode > 399) toast({ title: response.statusCode, description: response.message, variant: 'destructive', duration: 5000 });
			if (response instanceof Error) toast({ title: 'Error', description: '500 Internal Server Error | ' + response.message, variant: 'destructive', duration: 5000 });
		});
	}

	async function getRowsPerPage() {
		SettingsServices.findOne('rowsPerPageProducts').then((response) => {
			setRowsPerPageProducts(Number(response.value));
		});
	}

	useEffect(() => {
		getRowsPerPage();
		getBusiness();
		getCategories();
		getProducts();
        isClicked(0);
	}, []);
	// #endregion
	// #region Table columns
	const columns: ColumnDef<IProperty>[] = [
		// Id
		{
			accessorKey: 'id',
			header: () => {
				return <div className='text-center'>{ProductsConfig.headers[0]}</div>;
			},
			cell: ({ row }) => {
				return (
					<div className='flex flex-row items-center justify-center space-x-4'>
						<FavButton property={row.original} height={18} />
						<div> {row.original.deletedAt ? <CircleOff className='h-4 w-4' /> : <div className={'flex h-4 w-4 items-center rounded-full border pl-1 ' + (row.original.is_active ? 'border-emerald-400 bg-emerald-300' : 'border-slate-300/50 bg-input')}></div>}</div>
						<div className='rounded-sm border bg-slate-200/70 p-1 text-xs font-bold uppercase text-slate-500'>{row.original.id < 10 ? `COD/0${row.original.id}` : `COD/${row.original.id}`}</div>
					</div>
				);
			}
		},
		// Type
		{
			accessorKey: 'business_type',
			header: ProductsConfig.headers[1],
			cell: ({ row }) => {
				return <div className='text-left'>{capitalize(row.original.business_type)}</div>;
			}
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
			},
			cell: ({ row }) => {
				return <div className='text-left'>{capitalize(row.original.type)}</div>;
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
		// #region Actions
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
								{type !== 'client' && (
									<Button onClick={() => navigate(`${APP_URL}/productos/modificar/${row.original.id}`)} variant='outline' size='miniIcon' className='hover:bg-white hover:text-emerald-400'>
										<Pencil className='h-5 w-5' strokeWidth='1.5' />
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
	// #region Filters
	function handleBusinessFilter(event: string) {
		if (event === 'reset') {
			setBusinessSelected('');
			setBusinessKey(+new Date());
            setSearchParams(updateDeletedParams(searchParams, 't'));
		} else {
			setBusinessSelected(event);
			categorySelected !== '' ? setSearchParams({ c: categorySelected, t: event }) : setSearchParams({ t: event });
		}
	}

	function handleCategoryFilter(event: string) {
		if (event === 'reset') {
			setCategorySelected('');
			setCategoryKey(+new Date());
			setSearchParams(updateDeletedParams(searchParams, 'c'));
		} else {
			setCategorySelected(event);
			businessSelected !== '' ? setSearchParams({ c: event, t: businessSelected }) : setSearchParams({ c: event });
		}
	}

	function resetFilters() {
		setBusinessSelected('');
		setBusinessKey(+new Date());
		setCategorySelected('');
		setCategoryKey(+new Date());
		setSearchFilter('');
		setSearchParams([]);
	}

    function updateDeletedParams(paramsArray: URLSearchParams, param: string) {
        const searchParamsArray = [...paramsArray.entries()];
        const filteredParamsArray = searchParamsArray.filter(([key]) => key !== param);
        const filteredSearchParams = filteredParamsArray.reduce((obj, [key, value]) => {
            return { ...obj, [key]: value };
        }, {});
        return filteredSearchParams;
    }

	useEffect(() => {
		function applyFilters(prop: IProperty[], filterAttributes: string[], filterValues: (string | number)[], search: string) {
			// Selects filters
			const filteredProperties = prop.filter((property: IProperty) => {
				return filterAttributes.every((attribute, index) => {
					if (filterValues[index] !== '') {
						if (filterValues[index] === 'others') return property[attribute] !== store.getState().userId;
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
		setPropertiesFiltered(applyFilters(properties, ['business_type', 'type', 'created_by'], [businessSelected, categorySelected, createdSelected], searchFilter));
	}, [businessSelected, categorySelected, createdSelected, searchFilter, searchParams, properties]);
	// #endregion
	// #region Favorites
	function getFavorites() {
		const favorites = properties.filter((fav) => fav.isFavorite);
		setPropertiesFiltered(favorites);
		setProperties(favorites);
	}

	function handleFavorites() {
		setIsFavsToggled(!isFavsToggled);
		setCreatedSelected('');
		resetFilters();
		if (!isFavsToggled) getFavorites();
		if (isFavsToggled) getProducts();
	}
	// #endregion
	return (
		<main className='flex-1 overflow-y-auto animate-fadeIn'>
			<div className='mx-8 mb-8 mt-8 flex flex-row items-center justify-between'>
				<h1 className='text-2xl font-normal text-slate-600'>{LayoutConfig.sidebar.menu.allProducts}</h1>
				<div>
					<Button variant='default' size='default' asChild>
						<Link to={`${APP_URL}/productos/crear`}>
							<Plus className='mr-2 h-4 w-4' />
							{ButtonsConfig.actions.create}
						</Link>
					</Button>
				</div>
			</div>
			<div className='container'>
				<Tabs defaultValue={tabActive} className='w-full'>
					{/* SECTION: Filters (header) */}
					<div className='flex flex-col rounded-md border border-slate-300 bg-slate-200 px-3 py-4 shadow-sm md:flex-row md:gap-4 md:p-2 md:pr-4'>
						<div className='flex flex-row'>
							<TabsList className='flex bg-inherit p-0 pl-1'>
								<TabsTrigger value='card' className='font-normal' onClick={() => setTabActive('card')}>
									{SettingsConfig.common.views.card}
								</TabsTrigger>
								<TabsTrigger value='list' className='font-normal' onClick={() => setTabActive('list')}>
									{SettingsConfig.common.views.list}
								</TabsTrigger>
							</TabsList>
						</div>
						<div className='flex'>
							<Separator orientation='vertical' className='mx-2 h-full bg-slate-400/50' />
						</div>
						<div className='mt-3 flex flex-row gap-4 md:mt-1'>
							<div className='flex h-8 w-[50%] md:w-[100px]'>
								<Select key={businessKey} defaultValue={searchParams.get('t') || ''} onValueChange={(event) => handleBusinessFilter(event)}>
									<SelectTrigger className='h-full w-full'>
										<SelectValue placeholder={ButtonsConfig.type} className='text-sm' />
									</SelectTrigger>
									<SelectContent>
										{showSelects &&
											business.map((el) => (
												<SelectItem key={el.id} value={el.name} className='text-sm'>
													{capitalize(el.name)}
												</SelectItem>
											))}
										<Separator orientation='horizontal' className=' bg-slate-200' />
										<SelectItem key='0' value='reset' className='text-sm focus:text-emerald-600'>
											{ButtonsConfig.filters.all}
										</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className='flex h-8 w-[50%] md:w-[120px] lg:w-[160px]'>
								<Select key={categoryKey} defaultValue={searchParams.get('c') || ''} onValueChange={(event) => handleCategoryFilter(event)}>
									<SelectTrigger className='h-full w-full'>
										<SelectValue placeholder={ButtonsConfig.category} className='text-sm' />
									</SelectTrigger>
									<SelectContent>
										{showSelects &&
											categories.map((el) => (
												<SelectItem key={el.id} value={el.name} className='text-sm'>
													{capitalize(el.name)}
												</SelectItem>
											))}
										<Separator orientation='horizontal' className=' bg-slate-200' />
										<SelectItem key='0' value='reset' className='text-sm focus:text-emerald-600'>
											{ButtonsConfig.filters.all}
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
									{ButtonsConfig.actions.delete}
								</Button>
							</div>
						</div>
					</div>
					{/* SECTION: Filter (favorites) */}
					<div className='flex flex-row pb-0 pt-4'>
						<div>
							<Toggle variant='default' size={'sm'} className='gap-2 bg-transparent text-sm font-normal text-slate-600 hover:bg-slate-200 hover:text-slate-600 data-[state=on]:bg-slate-200 data-[state=on]:font-medium data-[state=on]:text-slate-600' onClick={handleFavorites}>
								<Heart className={`h-4 w-4 ${isFavsToggled ? 'fill-red-500 stroke-red-500' : 'fill-none stroke-current'}`} strokeWidth={2} />
								<span>{ButtonsConfig.filters.favorites}</span>
							</Toggle>
						</div>
					</div>
					{/* SECTION: Content (Card or Table) */}
					<TabsContent value='card' className='pb-8 pt-2'>
						{showCard && <CardView type={'client'} getProducts={getProducts} properties={propertiesFiltered} />}
					</TabsContent>
					<TabsContent value='list' className={`${store.getState().role === Roles.ADMIN ? 'pb-8 pt-2' : 'py-6 pb-8'}`}>
						{showCard && (
							<Card className='p-6'>
								<DataTable tableFor={'products'} columns={columns} data={propertiesFiltered} rowsPerPage={rowsPerPage} />
							</Card>
						)}
					</TabsContent>
				</Tabs>
				{/* SECTION: Info Card (content is empty) */}
				{showInfoCard && (
					<div className='flex justify-center'>
						<InfoCard content={content} />
					</div>
				)}
			</div>
		</main>
	);
}
// Export React component
export default ListAllProducts;
