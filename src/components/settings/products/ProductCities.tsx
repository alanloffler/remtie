// Icons: Lucide (https://lucide.dev/)
import { ArrowUpDown, BadgeX, CheckCircle, Pencil, Trash2 } from 'lucide-react';
// UI: Shadcn-ui (https://ui.shadcn.com/)
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DataTable } from '@/components/data-table/DataTable';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
// App
import { ButtonsConfig } from '@/lib/config/buttons.config';
import { CitiesServices } from '@/services/cities.services';
import { ColumnDef } from '@tanstack/react-table';
import { FormEvent, useEffect, useState } from 'react';
import { ICity } from '@/lib/interfaces/city.interface';
import { IDialog } from '@/lib/interfaces/dialog.interface';
import { IState } from '@/lib/interfaces/state.interface';
import { SettingsConfig } from '@/lib/config/settings.config';
import { StatesServices } from '@/services/states.services';
import { citiesSchema } from '@/lib/schemas/cities.schema';
import { useCapitalize } from '@/hooks/useCapitalize';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
// React component
function ProductCities() {
	const [cities, setCities] = useState<ICity[]>([]);
	const [cityDialog, setCityDialog] = useState<IDialog>({ id: 0, name: '', title: '', subtitle: '', message: <span></span> });
	const [citySelected, setCitySelected] = useState<ICity>({} as ICity);
	const [dialogAction, setDialogAction] = useState<string>('');
	const [openDialog, setOpenDialog] = useState<boolean>(false);
	const [showCityEditForm, setShowCityEditForm] = useState<boolean>(false);
	const [states, setStates] = useState<IState[]>([]);
	const [updateCities, setUpdateCities] = useState<number>(0);
	const capitalize = useCapitalize();

	// #region Load data
	useEffect(() => {
		function getCities() {
			console.log('rendering cities');
			CitiesServices.findAllAdmin().then((response) => {
				if (!response.statusCode) {
					setCities(response);
				}
				// TODO MANAGE ERROR
			});
		}

		getCities();
	}, [updateCities]);

	useEffect(() => {
		function getStates() {
			StatesServices.findAllAdmin().then((response) => {
				if (!response.statusCode) {
					setStates(response);
					// TODO MANAGE ERROR
				}
			});
		}

		getStates();
	}, []);
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
				return <div className={'h-3 w-3 items-center justify-center rounded-full border pl-1 ' + (row.original.deletedAt === null ? 'border-emerald-400 bg-emerald-300' : 'border-red-400 bg-red-300')}></div>;
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
			header: SettingsConfig.sections.cities.tableHeaders[4],
			id: 'actions',
			cell: ({ row }) => {
				return (
					<div className='space-x-2'>
						{/* Update button */}
						<Button onClick={() => handleCityFormEdit(row.original)} variant='outline' size='miniIcon' className='hover:bg-white hover:text-emerald-400'>
							<Pencil className='h-5 w-5' strokeWidth='1.5' />
						</Button>
						{/* Remove soft and restore */}
						{row.original.deletedAt === null ? (
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
									setDialogAction('restore');
								}}
								variant='outline'
								size='miniIcon'
								className='hover:bg-white hover:text-emerald-400'>
								<CheckCircle className='h-5 w-5' strokeWidth='1.5' />
							</Button>
						)}
						{/* Remove button */}
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
								setDialogAction('remove');
							}}
							variant='outline'
							size='miniIcon'
							className='hover:bg-white hover:text-rose-400'>
							<BadgeX className='h-5 w-5' strokeWidth='1.5' />
						</Button>
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
						<div className={'flex h-3 w-3 items-center rounded-full border pl-1 ' + (row.original.deletedAt !== null ? 'border-emerald-400 bg-emerald-300' : 'border-slate-300/50 bg-input')}></div>
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
			header: SettingsConfig.sections.cities.tableHeaders[4],
			id: 'actions',
			cell: ({ row }) => {
				return (
					<div>
						{/* Update button */}
						<Button onClick={() => handleCityFormEdit(row.original)} variant='outline' size='miniIcon' className='hover:bg-white hover:text-emerald-400'>
							<Pencil className='h-5 w-5' strokeWidth='1.5' />
						</Button>
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
			zip: ''
		}
	});

	const cityEditForm = useForm<z.infer<typeof citiesSchema>>({
		resolver: zodResolver(citiesSchema),
		defaultValues: {
			city: '',
			zip: ''
		}
	});

	function handleCityCreate(values: z.infer<typeof citiesSchema>) {
		console.log(values);
		CitiesServices.create(values).then((response) => {
			if (response.statusCode === 200) {
				setUpdateCities(Math.random());
				cityForm.reset();
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
		cityEditForm.setValue('city', city.city);
		cityEditForm.setValue('zip', city.zip);
		setShowCityEditForm(true);
	}

	function handleCityCancel(event: FormEvent<HTMLButtonElement>, task: 'create' | 'update') {
		event.preventDefault();
		if (task === 'create') cityForm.reset();
		if (task === 'update') {
			cityEditForm.reset();
			setShowCityEditForm(false);
		}
	}
	// #endregion
	// #region Dialog actions
	function remove(id: number) {
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

	function removeSoft(id: number) {
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

    function restore(id: number) {
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
	// #endregion
	return (
		<div className='space-y-2'>
			<Separator className='mb-2' />
			{/* SECTION: Page title */}
			<span className='text-base font-medium text-slate-500'>{SettingsConfig.sections.cities.title}</span>
			{/* SECTION: Table and forms */}
			<div className='flex flex-col space-y-8 pt-4'>
				<div className='flex flex-row gap-8'>
					{/* SECTION: City list */}
					<Card className='space-y-2 overflow-x-auto px-4 py-4 lg:w-2/3'>
						<span className='text-base font-medium text-slate-700'>{SettingsConfig.sections.cities.list.cities}</span>
						<DataTable columns={cityColumns} data={cities} rowsPerPage={10} tableFor='users' />
					</Card>
					{/* SECTION: City form */}
					<div className='flex w-1/3 flex-col space-y-6'>
						{/* Create city */}
						<div className='flex flex-col space-y-4 pb-2'>
							<div className='flex flex-row text-base font-medium text-slate-500'>{SettingsConfig.sections.cities.form.cityTitle}</div>
							<div className='flex flex-row'>
								<Form {...cityForm}>
									<form onSubmit={cityForm.handleSubmit(handleCityCreate)} className='flex w-full flex-col space-y-6'>
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
											<Button type='submit' variant='default' size='sm'>
												{ButtonsConfig.actions.save}
											</Button>
											<Button onClick={(event) => handleCityCancel(event, 'create')} variant='ghost' size='sm'>
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
													<Button type='submit' variant='default' size='sm'>
														{ButtonsConfig.actions.save}
													</Button>
													<Button onClick={(event) => handleCityCancel(event, 'update')} variant='ghost' size='sm'>
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
				<div className='flex flex-col'>
					<Card className='space-y-2 overflow-x-auto px-4 py-4 lg:w-2/3'>
						<span className='text-base font-medium text-slate-700'>{SettingsConfig.sections.cities.list.states}</span>
						<DataTable columns={stateColumns} data={states} rowsPerPage={10} tableFor='users' />
					</Card>
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
							{dialogAction === 'removeSoft' && (
								<Button variant='delete' onClick={() => removeSoft(cityDialog.id)}>
									{ButtonsConfig.actions.delete}
								</Button>
							)}
							{dialogAction === 'restore' && (
								<Button variant='default' onClick={() => restore(cityDialog.id)}>
									{ButtonsConfig.actions.restore}
								</Button>
							)}
							{dialogAction === 'remove' && (
								<Button variant='delete' onClick={() => remove(cityDialog.id)}>
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
