// Icons: Lucide (https://lucide.dev/)
import { ArrowUpDown, BadgeX, Check, CheckCircle, Pencil, Trash2 } from 'lucide-react';
// UI: Shadcn-ui (https://ui.shadcn.com/)
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DataTable } from '@/components/data-table/DataTable';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from '@/components/ui/use-toast';
// App
import { ButtonsConfig } from '@/lib/config/buttons.config';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { CitiesServices } from '@/services/cities.services';
import { ColumnDef } from '@tanstack/react-table';
import { ICity } from '@/lib/interfaces/city.interface';
import { IDialog } from '@/lib/interfaces/dialog.interface';
import { IState } from '@/lib/interfaces/state.interface';
import { SettingsConfig } from '@/lib/config/settings.config';
import { StatesServices } from '@/services/states.services';
import { citiesSchema } from '@/lib/schemas/cities.schema';
import { statesSchema } from '@/lib/schemas/states.schema';
import { useCapitalize } from '@/hooks/useCapitalize';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
// React component
function ProductCities() {
	const [cities, setCities] = useState<ICity[]>([]);
	const [citiesSearch, setCitiesSearch] = useState<ICity[]>([]);
	const [cityDialog, setCityDialog] = useState<IDialog>({ id: 0, name: '', title: '', subtitle: '', message: <span></span> });
	const [citySelected, setCitySelected] = useState<ICity>({} as ICity);
	const [dialogAction, setDialogAction] = useState<{ action: string; content: string }>({ action: '', content: '' });
	const [openDialog, setOpenDialog] = useState<boolean>(false);
	const [showCityEditForm, setShowCityEditForm] = useState<boolean>(false);
	const [showStateEditForm, setShowStateEditForm] = useState<boolean>(false);
	const [stateSelected, setStateSelected] = useState<IState>({} as IState);
	const [states, setStates] = useState<IState[]>([]);
	const [statesForSelect, setStatesForSelect] = useState<IState[]>([]);
	const [statesSearch, setStatesSearch] = useState<IState[]>([]);
	const [statesSelectKey, setStatesSelectKey] = useState<number>(0);
	const [updateCities, setUpdateCities] = useState<number>(0);
	const [updateStates, setUpdateStates] = useState<number>(0);
	const capitalize = useCapitalize();

	// #region Load data
	useEffect(() => {
		function getCities() {
			CitiesServices.findAllAdmin().then((response) => {
				if (!response.statusCode) {
					setCities(response);
					setCitiesSearch(response);
				}
				if (response.statusCode > 399) toast({ title: response.statusCode, description: response.message, variant: 'destructive', duration: 5000 });
				if (response instanceof Error) toast({ title: 'Error', description: '500 Internal Server Error | ' + response.message, variant: 'destructive', duration: 5000 });
			});
		}

		getCities();
	}, [updateCities]);

	useEffect(() => {
		function getStates() {
			StatesServices.findAllAdmin().then((response) => {
				if (!response.statusCode) {
					setStates(response);
					setStatesSearch(response);
				}
				if (response.statusCode > 399) toast({ title: response.statusCode, description: response.message, variant: 'destructive', duration: 5000 });
				if (response instanceof Error) toast({ title: 'Error', description: '500 Internal Server Error | ' + response.message, variant: 'destructive', duration: 5000 });
			});
		}

		function getStatesForSelect() {
			StatesServices.findAll().then((response) => {
				if (!response.statusCode) {
					setStatesForSelect(response);
					setStatesSelectKey(Math.random());
				}
				if (response.statusCode > 399) toast({ title: response.statusCode, description: response.message, variant: 'destructive', duration: 5000 });
				if (response instanceof Error) toast({ title: 'Error', description: '500 Internal Server Error | ' + response.message, variant: 'destructive', duration: 5000 });
			});
		}

		getStates();
		getStatesForSelect();
	}, [updateStates]);
	// #endregion
	// #region Table
	const cityColumns: ColumnDef<ICity>[] = [
		{
			accessorKey: 'id',
			header: ({ column }) => {
				return (
					<div className='w-10 text-center'>
						<Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
							{SettingsConfig.sections.cities.tableHeaders[0]}
							<ArrowUpDown className='ml-2 h-3 w-3' />
						</Button>
					</div>
				);
			},
			cell: ({ row }) => {
				return <div className='w-10 text-center'>{row.original.id}</div>;
			}
		},
		{
			accessorKey: 'status',
			header: ({ column }) => {
				return (
					<div className='flex w-10 justify-center text-center'>
						<Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
							{SettingsConfig.sections.cities.tableHeaders[4]}
							<ArrowUpDown className='ml-2 h-3 w-3' />
						</Button>
					</div>
				);
			},
			cell: ({ row }) => {
				return <div className={`h-3 w-3 items-center justify-center rounded-full border pl-1 ${row.original.deletedAt === null ? 'border-emerald-400 bg-emerald-300' : 'border-red-400 bg-red-300'}`}></div>;
			}
		},
		{
			accessorKey: 'city',
			header: ({ column }) => {
				return (
					<div className='text-center'>
						<Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
							{SettingsConfig.sections.cities.tableHeaders[1]}
							<ArrowUpDown className='ml-2 h-3 w-3' />
						</Button>
					</div>
				);
			},
			cell: ({ row }) => {
				return <>{capitalize(row.original.city)}</>;
			}
		},
		{
			accessorKey: 'state',
			header: ({ column }) => {
				return (
					<div className='w-20 text-center'>
						<Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
							{SettingsConfig.sections.cities.tableHeaders[2]}
							<ArrowUpDown className='ml-2 h-3 w-3' />
						</Button>
					</div>
				);
			},
			cell: ({ row }) => {
				return <div className='w-20'>{capitalize(row.original.state)}</div>;
			}
		},
		{
			accessorKey: 'zip',
			header: ({ column }) => {
				return (
					<div className='text-center'>
						<Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
							{SettingsConfig.sections.cities.tableHeaders[3]}
							<ArrowUpDown className='ml-2 h-3 w-3' />
						</Button>
					</div>
				);
			},
			cell: ({ row }) => {
				return <div className='text-center'>{row.original.zip}</div>;
			}
		},
		{
			header: SettingsConfig.sections.cities.tableHeaders[5],
			id: 'actions',
			cell: ({ row }) => {
				return (
					<div className='w-36 space-x-2'>
						{/* Update button */}
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button onClick={() => handleCityFormEdit(row.original)} variant='outline' size='miniIcon' className='hover:bg-white hover:text-emerald-400'>
										<Pencil className='h-5 w-5' strokeWidth='1.5' />
									</Button>
								</TooltipTrigger>
								<TooltipContent>{ButtonsConfig.actions.edit}</TooltipContent>
							</Tooltip>
						</TooltipProvider>
						{/* Remove soft and restore */}
						{row.original.deletedAt === null ? (
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											onClick={() => {
												setOpenDialog(true);
												setCityDialog({
													id: Number(row.original.id),
													name: row.original.city,
													title: SettingsConfig.dialog.title,
													subtitle: SettingsConfig.dialog.possibleRevertion,
													message: (
														<div className='flex flex-col space-y-2'>
															<div className='text-md flex flex-row font-bold text-slate-900'>{row.original.city}</div>
															<div className='flex flex-row'>{SettingsConfig.dialog.city.citySoftDelete}</div>
														</div>
													)
												});
												setDialogAction({ action: 'removeSoft', content: 'city' });
											}}
											variant='outline'
											size='miniIcon'
											className='hover:bg-white hover:text-rose-400'>
											<Trash2 className='h-5 w-5' strokeWidth='1.5' />
										</Button>
									</TooltipTrigger>
									<TooltipContent>{ButtonsConfig.actions.delete}</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						) : (
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											onClick={() => {
												setOpenDialog(true);
												setCityDialog({
													id: Number(row.original.id),
													name: row.original.city,
													title: SettingsConfig.dialog.title,
													subtitle: SettingsConfig.dialog.possibleRevertion,
													message: (
														<div className='flex flex-col space-y-2'>
															<div className='text-md flex flex-row font-bold text-slate-900'>{row.original.city}</div>
															<div className='flex flex-row'>{SettingsConfig.dialog.city.cityRestore}</div>
														</div>
													)
												});
												setDialogAction({ action: 'restore', content: 'city' });
											}}
											variant='outline'
											size='miniIcon'
											className='hover:bg-white hover:text-emerald-400'>
											<CheckCircle className='h-5 w-5' strokeWidth='1.5' />
										</Button>
									</TooltipTrigger>
									<TooltipContent>{ButtonsConfig.actions.restore}</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						)}
						{/* Remove button */}
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										onClick={() => {
											setOpenDialog(true);
											setCityDialog({
												id: Number(row.original.id),
												name: row.original.city,
												title: SettingsConfig.dialog.title,
												subtitle: SettingsConfig.dialog.impossibleRevertion,
												message: (
													<div className='flex flex-col space-y-2'>
														<div className='text-md flex flex-row font-bold text-slate-900'>{row.original.city}</div>
														<div className='flex flex-row'>{SettingsConfig.dialog.city.cityDelete}</div>
													</div>
												)
											});
											setDialogAction({ action: 'remove', content: 'city' });
										}}
										variant='outline'
										size='miniIcon'
										className='hover:bg-white hover:text-rose-400'>
										<BadgeX className='h-5 w-5' strokeWidth='1.5' />
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>{ButtonsConfig.actions.deletePermanent}</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>
				);
			}
		}
	];

	const stateColumns: ColumnDef<IState>[] = [
		{
			accessorKey: 'id',
			header: ({ column }) => {
				return (
					<div className='w-10 text-center'>
						<Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
							{SettingsConfig.sections.cities.tableHeaders[0]}
							<ArrowUpDown className='ml-2 h-3 w-3' />
						</Button>
					</div>
				);
			},
			cell: ({ row }) => {
				return <div className='w-10 text-center'>{row.original.id}</div>;
			}
		},
		{
			accessorKey: 'status',
			header: ({ column }) => {
				return (
					<div className='flex w-10 justify-center text-center'>
						<Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
							{SettingsConfig.sections.cities.tableHeaders[4]}
							<ArrowUpDown className='ml-2 h-3 w-3' />
						</Button>
					</div>
				);
			},
			cell: ({ row }) => {
				return (
					<div className=''>
						<div className={`flex h-3 w-3 items-center rounded-full border pl-1 ${row.original.deletedAt === null ? 'border-emerald-400 bg-emerald-300' : 'border-red-400 bg-red-300'}`}></div>
					</div>
				);
			}
		},
		{
			accessorKey: 'state',
			header: ({ column }) => {
				return (
					<div className='text-center'>
						<Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
							{SettingsConfig.sections.cities.tableHeaders[2]}
							<ArrowUpDown className='ml-2 h-3 w-3' />
						</Button>
					</div>
				);
			},
			cell: ({ row }) => {
				return <>{capitalize(row.original.state)}</>;
			}
		},
		{
			header: SettingsConfig.sections.cities.tableHeaders[5],
			accessorKey: 'actions',
			cell: ({ row }) => {
				return (
					<div className='w-36 space-x-2'>
						{/* Update button */}
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button onClick={() => handleStateFormEdit(row.original)} variant='outline' size='miniIcon' className='hover:bg-white hover:text-emerald-400'>
										<Pencil className='h-5 w-5' strokeWidth='1.5' />
									</Button>
								</TooltipTrigger>
								<TooltipContent>{ButtonsConfig.actions.edit}</TooltipContent>
							</Tooltip>
						</TooltipProvider>
						{/* Remove soft and restore */}
						{row.original.deletedAt === null ? (
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											onClick={() => {
												setOpenDialog(true);
												setCityDialog({
													id: Number(row.original.id),
													name: row.original.state,
													title: SettingsConfig.dialog.title,
													subtitle: SettingsConfig.dialog.possibleRevertion,
													message: (
														<div className='flex flex-col space-y-2'>
															<div className='text-md flex flex-row font-bold text-slate-900'>{row.original.state}</div>
															<div className='flex flex-row'>{SettingsConfig.dialog.state.stateDelete}</div>
														</div>
													)
												});
												setDialogAction({ action: 'removeSoft', content: 'state' });
											}}
											variant='outline'
											size='miniIcon'
											className='hover:bg-white hover:text-rose-400'>
											<Trash2 className='h-5 w-5' strokeWidth='1.5' />
										</Button>
									</TooltipTrigger>
									<TooltipContent>{ButtonsConfig.actions.delete}</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						) : (
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											onClick={() => {
												setOpenDialog(true);
												setCityDialog({
													id: Number(row.original.id),
													name: row.original.state,
													title: SettingsConfig.dialog.title,
													subtitle: SettingsConfig.dialog.possibleRevertion,
													message: (
														<div className='flex flex-col space-y-2'>
															<div className='text-md flex flex-row font-bold text-slate-900'>{row.original.state}</div>
															<div className='flex flex-row'>{SettingsConfig.dialog.state.stateRestore}</div>
														</div>
													)
												});
												setDialogAction({ action: 'restore', content: 'state' });
											}}
											variant='outline'
											size='miniIcon'
											className='hover:bg-white hover:text-emerald-400'>
											<CheckCircle className='h-5 w-5' strokeWidth='1.5' />
										</Button>
									</TooltipTrigger>
									<TooltipContent>{ButtonsConfig.actions.restore}</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						)}
						{/* Remove button */}
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										onClick={() => {
											setOpenDialog(true);
											setCityDialog({
												id: Number(row.original.id),
												name: row.original.state,
												title: SettingsConfig.dialog.title,
												subtitle: SettingsConfig.dialog.impossibleRevertion,
												message: (
													<div className='flex flex-col space-y-2'>
														<div className='text-md flex flex-row font-bold text-slate-900'>{row.original.state}</div>
														<div className='flex flex-row'>{SettingsConfig.dialog.state.stateDelete}</div>
													</div>
												)
											});
											setDialogAction({ action: 'remove', content: 'state' });
										}}
										variant='outline'
										size='miniIcon'
										className='hover:bg-white hover:text-rose-400'>
										<BadgeX className='h-5 w-5' strokeWidth='1.5' />
									</Button>
								</TooltipTrigger>
								<TooltipContent>{ButtonsConfig.actions.deletePermanent}</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>
				);
			}
		}
	];
	// #endregion
	// #region Forms
	const cityForm = useForm<z.infer<typeof citiesSchema>>({
		resolver: zodResolver(citiesSchema),
		defaultValues: {
			city: '',
			state: '',
			zip: ''
		}
	});

	const cityEditForm = useForm<z.infer<typeof citiesSchema>>({
		resolver: zodResolver(citiesSchema),
		defaultValues: {
			city: '',
			state: '',
			zip: ''
		}
	});

	const stateForm = useForm<z.infer<typeof statesSchema>>({
		resolver: zodResolver(statesSchema),
		defaultValues: {
			state: ''
		}
	});

	const stateEditForm = useForm<z.infer<typeof statesSchema>>({
		resolver: zodResolver(statesSchema),
		defaultValues: {
			state: ''
		}
	});
	// Cities
	function handleCityCreate(values: z.infer<typeof citiesSchema>) {
		CitiesServices.create(values).then((response) => {
			if (response.statusCode === 200) {
				setUpdateCities(Math.random());
				cityForm.reset();
				setStatesSelectKey(Math.random());
				toast({ title: response.statusCode, description: response.message, variant: 'success', duration: 5000 });
			}
			if (response.statusCode > 399) toast({ title: response.statusCode, description: response.message, variant: 'destructive', duration: 5000 });
			if (response instanceof Error) toast({ title: 'Error', description: '500 Internal Server Error | ' + response.message, variant: 'destructive', duration: 5000 });
		});
	}

	function handleCityUpdate(values: z.infer<typeof citiesSchema>) {
		CitiesServices.update(citySelected.id, values).then((response) => {
			if (response.statusCode === 200) {
				setUpdateCities(Math.random());
				cityEditForm.reset();
				setShowCityEditForm(false);
				toast({ title: response.statusCode, description: response.message, variant: 'success', duration: 5000 });
			}
			if (response.statusCode > 399) toast({ title: response.statusCode, description: response.message, variant: 'destructive', duration: 5000 });
			if (response instanceof Error) toast({ title: 'Error', description: '500 Internal Server Error | ' + response.message, variant: 'destructive', duration: 5000 });
		});
	}

	function handleCityFormEdit(city: ICity) {
		setCitySelected(city);
		cityEditForm.reset();
		cityEditForm.setValue('state', city.state);
		cityEditForm.setValue('city', city.city);
		cityEditForm.setValue('zip', city.zip);
		setShowCityEditForm(true);
	}

	function handleCityCancel(event: FormEvent<HTMLButtonElement>, task: 'create' | 'update') {
		event.preventDefault();
		if (task === 'create') {
			cityForm.reset();
			cityForm.setValue('state', '');
		}
		if (task === 'update') {
			cityEditForm.reset();
			setShowCityEditForm(false);
		}
	}
	// States
	function handleStateCreate(values: z.infer<typeof statesSchema>) {
		StatesServices.create(values).then((response) => {
			if (response.statusCode === 200) {
				setUpdateStates(Math.random());
				stateForm.reset();
				toast({ title: response.statusCode, description: response.message, variant: 'success', duration: 5000 });
			}
			if (response.statusCode > 399) toast({ title: response.statusCode, description: response.message, variant: 'destructive', duration: 5000 });
			if (response instanceof Error) toast({ title: 'Error', description: '500 Internal Server Error | ' + response.message, variant: 'destructive', duration: 5000 });
		});
	}

	function handleStateUpdate(values: z.infer<typeof statesSchema>) {
		StatesServices.update(stateSelected.id, values).then((response) => {
			if (response.statusCode === 200) {
				setUpdateStates(Math.random());
				stateEditForm.reset();
				setShowStateEditForm(false);
				toast({ title: response.statusCode, description: response.message, variant: 'success', duration: 5000 });
			}
			if (response.statusCode > 399) toast({ title: response.statusCode, description: response.message, variant: 'destructive', duration: 5000 });
			if (response instanceof Error) toast({ title: 'Error', description: '500 Internal Server Error | ' + response.message, variant: 'destructive', duration: 5000 });
		});
	}

	function handleStateFormEdit(state: IState) {
		setStateSelected(state);
		stateEditForm.reset();
		stateEditForm.setValue('state', state.state);
		setShowStateEditForm(true);
	}

	function handleStateCancel(event: FormEvent<HTMLButtonElement>, task: 'create' | 'update') {
		event.preventDefault();
		if (task === 'create') {
			stateForm.reset();
			stateForm.setValue('state', '');
		}
		if (task === 'update') {
			stateEditForm.reset();
			setShowStateEditForm(false);
		}
	}
	// Search
	function citySearch(event: ChangeEvent<HTMLInputElement>) {
		const value = event.target.value;
		if (value === '') {
			setCitiesSearch(cities);
			return;
		} else {
			const citiesSearch: ICity[] = cities.filter((city) => city.city.toLowerCase().includes(value.toLowerCase()));
			setCitiesSearch(citiesSearch);
			return;
		}
	}

	function stateSearch(event: ChangeEvent<HTMLInputElement>) {
		const value = event.target.value;
		if (value === '') {
			setStatesSearch(states);
			return;
		} else {
			const statesSearch: IState[] = states.filter((state) => state.state.toLowerCase().includes(value.toLowerCase()));
			setStatesSearch(statesSearch);
			return;
		}
	}
	// #endregion
	// #region Dialog actions
	// City
	function removeCity(id: number) {
		CitiesServices.remove(id).then((response) => {
			if (response.statusCode === 200) {
				toast({ title: response.statusCode, description: response.message, variant: 'success', duration: 5000 });
				setUpdateCities(Math.random());
				setOpenDialog(false);
			}
			if (response.statusCode > 399) toast({ title: response.statusCode, description: response.message, variant: 'destructive', duration: 5000 });
			if (response instanceof Error) toast({ title: 'Error', description: '500 Internal Server Error | ' + response.message, variant: 'destructive', duration: 5000 });
		});
	}

	function removeSoftCity(id: number) {
		CitiesServices.removeSoft(id).then((response) => {
			if (response.statusCode === 200) {
				toast({ title: response.statusCode, description: response.message, variant: 'success', duration: 5000 });
				setUpdateCities(Math.random());
				setOpenDialog(false);
			}
			if (response.statusCode > 399) toast({ title: response.statusCode, description: response.message, variant: 'destructive', duration: 5000 });
			if (response instanceof Error) toast({ title: 'Error', description: '500 Internal Server Error | ' + response.message, variant: 'destructive', duration: 5000 });
		});
	}

	function restoreCity(id: number) {
		CitiesServices.restore(id).then((response) => {
			if (response.statusCode === 200) {
				toast({ title: response.statusCode, description: response.message, variant: 'success', duration: 5000 });
				setUpdateCities(Math.random());
				setOpenDialog(false);
			}
			if (response.statusCode > 399) toast({ title: response.statusCode, description: response.message, variant: 'destructive', duration: 5000 });
			if (response instanceof Error) toast({ title: 'Error', description: '500 Internal Server Error | ' + response.message, variant: 'destructive', duration: 5000 });
		});
	}
	// State
	function removeState(id: number) {
		StatesServices.remove(id).then((response) => {
			if (response.statusCode === 200) {
				toast({ title: response.statusCode, description: response.message, variant: 'success', duration: 5000 });
				setUpdateStates(Math.random());
				setOpenDialog(false);
			}
			if (response.statusCode > 399) toast({ title: response.statusCode, description: response.message, variant: 'destructive', duration: 5000 });
			if (response instanceof Error) toast({ title: 'Error', description: '500 Internal Server Error | ' + response.message, variant: 'destructive', duration: 5000 });
		});
	}

	function removeSoftState(id: number) {
		StatesServices.removeSoft(id).then((response) => {
			if (response.statusCode === 200) {
				toast({ title: response.statusCode, description: response.message, variant: 'success', duration: 5000 });
				setUpdateStates(Math.random());
				setOpenDialog(false);
			}
			if (response.statusCode > 399) toast({ title: response.statusCode, description: response.message, variant: 'destructive', duration: 5000 });
			if (response instanceof Error) toast({ title: 'Error', description: '500 Internal Server Error | ' + response.message, variant: 'destructive', duration: 5000 });
		});
	}

	function restoreState(id: number) {
		StatesServices.restore(id).then((response) => {
			if (response.statusCode === 200) {
				toast({ title: response.statusCode, description: response.message, variant: 'success', duration: 5000 });
				setUpdateStates(Math.random());
				setOpenDialog(false);
			}
			if (response.statusCode > 399) toast({ title: response.statusCode, description: response.message, variant: 'destructive', duration: 5000 });
			if (response instanceof Error) toast({ title: 'Error', description: '500 Internal Server Error | ' + response.message, variant: 'destructive', duration: 5000 });
		});
	}
	// #endregion
	return (
		<div className='space-y-2'>
			<Separator className='mb-2' />
			{/* SECTION: Page title */}
			<span className='text-base font-medium text-slate-500'>{SettingsConfig.sections.cities.title}</span>
			{/* SECTION: Table and forms */}
			<div className='flex flex-col space-y-8 pt-4'>
				{/* SECTION: Cities */}
				<div className='flex flex-col gap-8 md:flex-row lg:flex-row'>
					{/* SECTION: City list */}
					<Card className='w-full space-y-4 overflow-x-auto px-4 py-4 md:w-2/3 lg:w-2/3'>
						<div className='flex flex-row items-center justify-between'>
							<span className='text-base font-medium text-slate-700'>{SettingsConfig.sections.cities.list.cities}</span>
							<Input onChange={(e) => citySearch(e)} type='search' placeholder={ButtonsConfig.search} className='h-8 w-[200px]' />
						</div>
						<DataTable columns={cityColumns} data={citiesSearch} rowsPerPage={10} tableFor='users' />
					</Card>
					{/* SECTION: City form */}
					<div className='flex w-full flex-col space-y-6 md:w-1/3 lg:w-1/3'>
						{/* Create city */}
						<div className='flex flex-col space-y-4 pb-2'>
							<div className='flex flex-row text-base font-medium text-slate-500'>{SettingsConfig.sections.cities.form.cityTitle}</div>
							<div className='flex flex-row'>
								<Form {...cityForm}>
									<form onSubmit={cityForm.handleSubmit(handleCityCreate)} className='flex w-full flex-col space-y-6'>
										<FormField
											control={cityForm.control}
											name='state'
											render={({ field }) => (
												<div className='flex flex-col'>
													<FormItem className='w-2/3 space-y-1'>
														<Select key={statesSelectKey} value={field.value} onValueChange={(event) => field.onChange(event)}>
															<FormControl>
																<SelectTrigger className='h-8 placeholder:text-muted-foreground'>
																	<SelectValue placeholder={SettingsConfig.sections.cities.form.statePlaceholder} />
																</SelectTrigger>
															</FormControl>
															<SelectContent>
																{statesForSelect.map((el) => (
																	<SelectItem key={el.id} value={el.state} className='text-sm'>
																		{capitalize(el.state)}
																	</SelectItem>
																))}
															</SelectContent>
														</Select>
													</FormItem>
													<FormMessage className='pt-2 text-xs font-light' />
												</div>
											)}
										/>
										<FormField
											control={cityForm.control}
											name='city'
											render={({ field }) => (
												<div className='flex flex-col'>
													<FormItem className='w-2/3'>
														<FormControl>
															<Input {...field} type='text' placeholder={SettingsConfig.sections.cities.form.cityPlaceholder} className='h-8' />
														</FormControl>
													</FormItem>
													<FormMessage className='pt-2 text-xs font-light' />
												</div>
											)}
										/>
										<FormField
											control={cityForm.control}
											name='zip'
											render={({ field }) => (
												<div className='flex flex-col'>
													<FormItem className='w-2/3'>
														<FormControl>
															<Input {...field} type='text' placeholder={SettingsConfig.sections.cities.form.zipPlaceholder} className='h-8' />
														</FormControl>
													</FormItem>
													<FormMessage className='pt-2 text-xs font-light' />
												</div>
											)}
										/>
										<div className='flex flex-row justify-start gap-6'>
											<Button type='submit' variant='ghost' size='sm' className='h-8 gap-2 border border-slate-300 bg-slate-300/50 p-2 text-xs text-slate-400 hover:border-slate-400/50 hover:bg-slate-300 hover:text-slate-500'>
												<Check className='h-3 w-3' strokeWidth='2' />
												{ButtonsConfig.actions.save}
											</Button>
											<Button onClick={(event) => handleCityCancel(event, 'create')} variant='ghost' size='sm' className='h-8 text-xs'>
												{ButtonsConfig.actions.cancel}
											</Button>
										</div>
									</form>
								</Form>
							</div>
						</div>
						{/* Update city */}
						{showCityEditForm && (
							<>
								<Separator />
								<div className='flex animate-fadeIn flex-col space-y-4'>
									<div className='flex flex-row text-base font-medium text-slate-500'>{SettingsConfig.sections.cities.form.editCityTitle}</div>
									<div className='flex flex-row'>
										<Form {...cityEditForm}>
											<form onSubmit={cityEditForm.handleSubmit(handleCityUpdate)} className='flex w-full flex-col space-y-6'>
												<FormField
													control={cityEditForm.control}
													name='state'
													render={({ field }) => (
														<div className='flex flex-col'>
															<FormItem className='w-2/3 space-y-1'>
																<Select key={statesSelectKey} value={field.value} onValueChange={(event) => field.onChange(event)}>
																	<FormControl>
																		<SelectTrigger className='h-8'>
																			<SelectValue placeholder={<span className='text-muted-foreground'>{SettingsConfig.sections.cities.form.statePlaceholder}</span>} />
																		</SelectTrigger>
																	</FormControl>
																	<SelectContent>
																		{states.map((el) => (
																			<SelectItem key={el.id} value={el.state} className='text-sm'>
																				{capitalize(el.state)}
																			</SelectItem>
																		))}
																	</SelectContent>
																</Select>
															</FormItem>
															<FormMessage className='pt-2 text-xs font-light' />
														</div>
													)}
												/>
												<FormField
													control={cityEditForm.control}
													name='city'
													render={({ field }) => (
														<div className='flex flex-col'>
															<FormItem className='w-2/3'>
																<FormControl>
																	<Input {...field} type='text' placeholder={SettingsConfig.sections.cities.form.cityPlaceholder} className='h-8' />
																</FormControl>
															</FormItem>
															<FormMessage className='pt-2 text-xs font-light' />
														</div>
													)}
												/>
												<FormField
													control={cityEditForm.control}
													name='zip'
													render={({ field }) => (
														<div className='flex flex-col'>
															<FormItem className='w-1/3'>
																<FormControl>
																	<Input {...field} type='text' placeholder={SettingsConfig.sections.cities.form.zipPlaceholder} className='h-8' />
																</FormControl>
															</FormItem>
															<FormMessage className='pt-2 text-xs font-light' />
														</div>
													)}
												/>
												<div className='flex flex-row justify-start gap-6'>
													<Button type='submit' variant='ghost' size='sm' className='h-8 gap-2 border border-slate-300 bg-slate-300/50 p-2 text-xs text-slate-400 hover:border-slate-400/50 hover:bg-slate-300 hover:text-slate-500'>
														<Check className='h-3 w-3' strokeWidth='2' />
														{ButtonsConfig.actions.save}
													</Button>
													<Button onClick={(event) => handleCityCancel(event, 'update')} variant='ghost' size='sm' className='h-8 text-xs'>
														{ButtonsConfig.actions.cancel}
													</Button>
												</div>
											</form>
										</Form>
									</div>
								</div>
							</>
						)}
					</div>
				</div>
				{/* SECTION: States */}
				<div className='flex flex-col gap-8 md:flex-row lg:flex-row'>
					{/* SECTION: States list */}
					<Card className='w-full space-y-4 overflow-x-auto px-4 py-4 md:w-2/3 lg:w-2/3'>
						<div className='flex flex-row items-center justify-between'>
							<span className='text-base font-medium text-slate-700'>{SettingsConfig.sections.cities.list.states}</span>
							<Input onChange={(e) => stateSearch(e)} type='search' placeholder={ButtonsConfig.search} className='h-8 w-[200px]' />
						</div>
						<DataTable columns={stateColumns} data={statesSearch} rowsPerPage={10} tableFor='users' />
					</Card>
					{/* SECTION: City form */}
					<div className='flex w-full flex-col space-y-6 md:w-1/3 lg:w-1/3'>
						{/* SECTION: Create State */}
						<div className='flex flex-col space-y-4 pb-2'>
							<div className='flex flex-row text-base font-medium text-slate-500'>{SettingsConfig.sections.cities.form.stateTitle}</div>
							<div className='flex flex-row'>
								<Form {...stateForm}>
									<form onSubmit={stateForm.handleSubmit(handleStateCreate)} className='flex w-full flex-col space-y-6'>
										<FormField
											control={stateForm.control}
											name='state'
											render={({ field }) => (
												<div className='flex flex-col'>
													<FormItem className='w-2/3'>
														<FormControl>
															<Input {...field} type='text' placeholder={SettingsConfig.sections.cities.form.cityPlaceholder} className='h-8' />
														</FormControl>
													</FormItem>
													<FormMessage className='pt-2 text-xs font-light' />
												</div>
											)}
										/>
										<div className='flex flex-row justify-start gap-6'>
											<Button type='submit' variant='ghost' size='sm' className='h-8 gap-2 border border-slate-300 bg-slate-300/50 p-2 text-xs text-slate-400 hover:border-slate-400/50 hover:bg-slate-300 hover:text-slate-500'>
												<Check className='h-3 w-3' strokeWidth='2' />
												{ButtonsConfig.actions.save}
											</Button>
											<Button onClick={(event) => handleStateCancel(event, 'create')} variant='ghost' size='sm' className='h-8 text-xs'>
												{ButtonsConfig.actions.cancel}
											</Button>
										</div>
									</form>
								</Form>
							</div>
						</div>
						{/* Update city */}
						{showStateEditForm && (
							<>
								<Separator />
								<div className='flex animate-fadeIn flex-col space-y-4'>
									<div className='flex flex-row text-base font-medium text-slate-500'>{SettingsConfig.sections.cities.form.editStateTitle}</div>
									<div className='flex flex-row'>
										<Form {...stateEditForm}>
											<form onSubmit={stateEditForm.handleSubmit(handleStateUpdate)} className='flex w-full flex-col space-y-6'>
												<FormField
													control={stateEditForm.control}
													name='state'
													render={({ field }) => (
														<div className='flex flex-col'>
															<FormItem className='w-2/3'>
																<FormControl>
																	<Input {...field} type='text' placeholder={SettingsConfig.sections.cities.form.statePlaceholder} className='h-8' />
																</FormControl>
															</FormItem>
															<FormMessage className='pt-2 text-xs font-light' />
														</div>
													)}
												/>
												<div className='flex flex-row justify-start gap-6'>
													<Button type='submit' variant='ghost' size='sm' className='h-8 gap-2 border border-slate-300 bg-slate-300/50 p-2 text-xs text-slate-400 hover:border-slate-400/50 hover:bg-slate-300 hover:text-slate-500'>
														<Check className='h-3 w-3' strokeWidth='2' />
														{ButtonsConfig.actions.save}
													</Button>
													<Button onClick={(event) => handleStateCancel(event, 'update')} variant='ghost' size='sm' className='h-8 text-xs'>
														{ButtonsConfig.actions.cancel}
													</Button>
												</div>
											</form>
										</Form>
									</div>
								</div>
							</>
						)}
					</div>
				</div>
			</div>
			{/* SECTION: Dialog */}
			<Dialog open={openDialog} onOpenChange={setOpenDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{cityDialog.title}</DialogTitle>
						<DialogDescription>{cityDialog.subtitle}</DialogDescription>
					</DialogHeader>
					<section className='text-sm font-normal'>{cityDialog.message}</section>
					<DialogFooter>
						<div className='mt-6 flex flex-row gap-4'>
							<Button variant='ghost' onClick={() => setOpenDialog(false)}>
								{ButtonsConfig.actions.cancel}
							</Button>
							{/* City */}
							{dialogAction.action === 'removeSoft' && dialogAction.content === 'city' && (
								<Button variant='delete' onClick={() => removeSoftCity(cityDialog.id)}>
									{ButtonsConfig.actions.delete}
								</Button>
							)}
							{dialogAction.action === 'restore' && dialogAction.content === 'city' && (
								<Button variant='default' onClick={() => restoreCity(cityDialog.id)}>
									{ButtonsConfig.actions.restore}
								</Button>
							)}
							{dialogAction.action === 'remove' && dialogAction.content === 'city' && (
								<Button variant='delete' onClick={() => removeCity(cityDialog.id)}>
									{ButtonsConfig.actions.delete}
								</Button>
							)}
							{/* State */}
							{dialogAction.action === 'removeSoft' && dialogAction.content === 'state' && (
								<Button variant='delete' onClick={() => removeSoftState(cityDialog.id)}>
									{ButtonsConfig.actions.delete}
								</Button>
							)}
							{dialogAction.action === 'restore' && dialogAction.content === 'state' && (
								<Button variant='default' onClick={() => restoreState(cityDialog.id)}>
									{ButtonsConfig.actions.restore}
								</Button>
							)}
							{dialogAction.action === 'remove' && dialogAction.content === 'state' && (
								<Button variant='delete' onClick={() => removeState(cityDialog.id)}>
									{ButtonsConfig.actions.delete}
								</Button>
							)}
						</div>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
// export React component
export default ProductCities;
