// Icons: Lucide (https://lucide.dev/)
import { Check, Plus, Trash2 } from 'lucide-react';
// UI: Shadcn-ui (https://ui.shadcn.com/)
import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { FormField, FormItem, FormControl, FormMessage, Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
// App
import { ISetting } from '@/lib/interfaces/setting.interface';
import { SettingsConfig } from '@/lib/config/settings.config';
import { SettingsServices } from '@/services/settings.services';
import { handleServerResponse } from '@/lib/handleServerResponse';
import { rowsOptionsSchema } from '@/lib/schemas/rowsOptions.schema';
import { rowsPerPageSchema } from '@/lib/schemas/rowsPerPage.schema';
import { store } from '@/services/store.services';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
// React component
function UsersRowsPerPage() {
	const [rowsPerPage, setRowsPerPage] = useState<ISetting>({} as ISetting);
	const [actualRowsPerPage, setActualRowsPerPage] = useState<string>('');
	const [rowsPerPageOptions, setRowsPerPageOptions] = useState<ISetting>({} as ISetting);
	const [options, setOptions] = useState<number[]>([]);
	const setRowsPerPageUsersStore = store((state) => state.setRowsPerPageUsers);

	const rowsPerPageForm = useForm<z.infer<typeof rowsPerPageSchema>>({
		resolver: zodResolver(rowsPerPageSchema),
		defaultValues: {
			value: 0
		}
	});
	// #region Load Data
	useEffect(() => {
		SettingsServices.findOne('rowsPerPageUsers').then((response) => {
			if (!response.statusCode) {
				rowsPerPageForm.setValue('value', response.value);
				setRowsPerPage(response);
				setActualRowsPerPage(response.value);
			}
			handleServerResponse(response);
		});
		getRowsPerPageOptions();
	}, [rowsPerPageForm]);

	function getRowsPerPageOptions() {
		SettingsServices.findOne('rowsPerPageOptionsUsers').then((response) => {
			if (!response.statusCode) {
				if (response.value) {
					response.value = response.value.split(',');
					response.value = response.value.map((item: string) => Number(item));
				} else {
					response.value = [];
				}
				setRowsPerPageOptions(response);
				setOptions(response.value);
			}
			handleServerResponse(response);
		});
	}
	// #endregion
	// #region Form actions
	function handleRowsPerPage(value: string) {
		SettingsServices.update(rowsPerPage.id, value).then((response) => {
			if (response.statusCode === 200) {
				setRowsPerPage({ ...rowsPerPage, value: value });
				setRowsPerPageUsersStore(Number(value));
			}
            handleServerResponse(response);
		});
	}

	function removeOption(item: number) {
		const tmpOptions = [...options];
		const index = tmpOptions.indexOf(item);
		if (index !== -1) tmpOptions.splice(index, 1);

		SettingsServices.update(rowsPerPageOptions.id, tmpOptions.join(',')).then((response) => {
			if (response.statusCode === 200) setOptions(tmpOptions);
            handleServerResponse(response);
		});
	}

	const rowsOptionsForm = useForm<z.infer<typeof rowsOptionsSchema>>({
		resolver: zodResolver(rowsOptionsSchema),
		defaultValues: {
			value: 0
		}
	});

	function handleRowsOptionsSubmit(data: z.infer<typeof rowsOptionsSchema>) {
		const tmpOptions = [...options, Number(data.value)];
		tmpOptions.sort(function (a, b) {
			return a - b;
		});

		SettingsServices.update(rowsPerPageOptions.id, tmpOptions.join(',')).then((response) => {
			if (response.statusCode === 200) {
				setOptions(tmpOptions);
				rowsOptionsForm.reset();
			}
            handleServerResponse(response);
		});
	}
	// #endregion
	return (
		<div className='space-y-2'>
			<Separator className='mb-2' />
			<span className='text-base font-medium text-slate-500'>{SettingsConfig.sections.rowsPerPage.title}</span>
			<Card className='p-4'>
				<div className='grid space-y-2'>
					<span className='flex flex-row items-center text-sm text-slate-500'>
						{SettingsConfig.sections.rowsPerPage.subtitle1}
						<span className='pl-2 text-base font-semibold'>{rowsPerPage.value}</span>
					</span>
					<div className='flex flex-row gap-4'>
						<Select value={actualRowsPerPage} onValueChange={(e) => setActualRowsPerPage(e)}>
							<SelectTrigger className='h-8 w-[100px]'>
								<SelectValue placeholder={actualRowsPerPage} />
							</SelectTrigger>
							<SelectContent>
								{options.length > 1 ? (
									options.map((option: number) => (
										<SelectItem key={option} value={String(option)}>
											{option}
										</SelectItem>
									))
								) : (
									<>{SettingsConfig.common.no_data}</>
								)}
							</SelectContent>
						</Select>
						<Button onClick={() => handleRowsPerPage(actualRowsPerPage)} variant='outline' size='sm' className='h-8 gap-2 border border-slate-300 bg-slate-300/50 p-2 text-xs text-slate-400 hover:border-slate-400/50 hover:bg-slate-300 hover:text-slate-500'>
							<Check className='h-3 w-3' strokeWidth='2' />
							{SettingsConfig.buttons.save}
						</Button>
					</div>
				</div>
			</Card>
			<div className='grid space-y-2 py-2'>
				<div className='text-base font-medium text-slate-500'>{SettingsConfig.sections.rowsPerPage.subtitle2}</div>
				<Card className='px-4'>
					<ul className='space-y-1 py-4 text-sm text-slate-700'>
						{options.length > 0 ? (
							options.map((option, index) => (
								<li key={option} className={`flex w-28 items-center justify-between rounded-md p-1 ${index % 2 === 0 ? 'bg-slate-100/60' : ''}`}>
									<div className='w-8 font-medium text-slate-800'>{option}</div>
									<button onClick={() => removeOption(option)} className='flex h-7 w-7 items-center justify-center rounded-md border border-slate-300 bg-slate-300/50 p-1 text-slate-400 transition-all hover:border-slate-400/50 hover:bg-slate-200/50 hover:text-red-500'>
										<Trash2 className='h-4 w-4' />
									</button>
								</li>
							))
						) : (
							<>{SettingsConfig.common.no_data}</>
						)}
					</ul>
				</Card>

				<div className='flex flex-row space-x-4 py-2'>
					<Form {...rowsOptionsForm}>
						<form onSubmit={rowsOptionsForm.handleSubmit(handleRowsOptionsSubmit)} className='flex flex-row items-center space-x-4'>
							<Plus className='rounded-full border bg-white p-1' />
							<FormField
								control={rowsOptionsForm.control}
								name='value'
								render={({ field }) => (
									<FormItem className=''>
										<FormControl>
											<Input {...field} type='number' className='h-8 w-20' />
										</FormControl>
										<FormMessage className='text-xs font-light' />
									</FormItem>
								)}
							/>
							<Button type='submit' variant='outline' size='sm' className='h-8 gap-2 border border-slate-300 bg-slate-300/50 p-2 text-xs text-slate-400 hover:border-slate-400/50 hover:bg-slate-300 hover:text-slate-500'>
								<Check className='h-3 w-3' strokeWidth='2' />
								{SettingsConfig.buttons.save}
							</Button>
						</form>
					</Form>
				</div>
			</div>
		</div>
	);
}
// Export React component
export default UsersRowsPerPage;
