// Icons: Lucide (https://lucide.dev/)
import { Check, Pencil, Plus, X } from 'lucide-react';
// UI: Shadcn-ui (https://ui.shadcn.com/)
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
// App
import { IRole } from '@/lib/interfaces/role.interface';
import { RolesServices } from '@/services/roles.services';
import { SettingsConfig } from '@/lib/config/settings.config';
import { handleServerResponse } from '@/lib/handleServerResponse';
import { rolesSchema } from '@/lib/schemas/roles.schema';
import { useCapitalize } from '@/hooks/useCapitalize';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
// React component
function UsersRoles() {
	const [roles, setRoles] = useState<IRole[]>([]);
	const [showForm, setShowForm] = useState<boolean>(false);
	const capitalize = useCapitalize();

	useEffect(() => {
		getRoles();
	}, []);

	async function getRoles() {
		RolesServices.findAll().then((response) => {
			if (!response.statusCode) setRoles(response);
            handleServerResponse(response);
		});
	}
	// #region Form
	const rolesForm = useForm<z.infer<typeof rolesSchema>>({
		resolver: zodResolver(rolesSchema),
		defaultValues: {
			id: 0,
			name: '',
			title: '',
			value: ''
		}
	});

	function fillForm(data: IRole) {
		rolesForm.setValue('id', data.id);
		rolesForm.setValue('name', data.name);
		rolesForm.setValue('title', data.title);
		rolesForm.setValue('value', data.value);
		setShowForm(true);
	}

	function handleRolesSubmit(data: IRole) {
		const formattedData = {
			name: data.name.trim().toUpperCase(),
			title: data.title.trim().toLowerCase(),
			value: data.value.trim().toLowerCase()
		};
		RolesServices.update(data.id, formattedData).then((response) => {
			if (response.statusCode === 200) {
				getRoles();
				rolesForm.reset();
				setShowForm(false);
			}
            handleServerResponse(response);
		});
	}

	function cancelForm() {
		rolesForm.reset();
		setShowForm(false);
	}
	// #endregion
	return (
		<div className='space-y-2'>
			<Separator className='mb-2' />
			<span className='text-base font-medium text-slate-500'>{SettingsConfig.sections.roles.title}</span>
			<Card className='px-4'>
				<ul className='space-y-1 py-4 text-sm text-slate-700'>
					{roles.map((role, index) => (
						<li key={role.id} className={`flex items-center justify-between rounded-md p-1 ${index % 2 === 0 ? 'bg-slate-100/60' : ''}`}>
							<div className='space-x-2 font-medium'>
								<span className={`text-sm text-slate-800`}>{capitalize(role.title)}</span>
								<span className='text-xs text-slate-500'>{`(${role.value} - ${role.name})`}</span>
							</div>
							<button onClick={() => fillForm(role)} className='flex h-7 w-7 items-center justify-center rounded-md border border-slate-300 bg-slate-300/50 p-1 text-slate-400 transition-all hover:border-slate-400/50 hover:bg-slate-200/50 hover:text-green-500'>
								<Pencil className='h-4 w-4' />
							</button>
						</li>
					))}
				</ul>
			</Card>
			{showForm && (
				<Form {...rolesForm}>
					<form onSubmit={rolesForm.handleSubmit(handleRolesSubmit)} className='grid items-center space-y-4 py-2'>
						<div className='flex flex-row items-center space-x-4'>
							<Plus className='rounded-full border bg-white p-1' />
							<FormField
								control={rolesForm.control}
								name='title'
								render={({ field }) => (
									<FormItem className='w-1/2'>
										<FormControl>
											<Input {...field} type='text' placeholder={SettingsConfig.common.title} className='h-8' />
										</FormControl>
										<FormMessage className='text-xs font-light' />
									</FormItem>
								)}
							/>
							<FormField
								control={rolesForm.control}
								name='value'
								render={({ field }) => (
									<FormItem className='w-1/2'>
										<FormControl>
											<Input {...field} type='text' placeholder={SettingsConfig.common.value} className='h-8' />
										</FormControl>
										<FormMessage className='text-xs font-light' />
									</FormItem>
								)}
							/>
						</div>
						<div className='flex flex-row items-center justify-between space-x-4'>
							<span className='w-6 p-1'></span>
							<FormField
								control={rolesForm.control}
								name='name'
								render={({ field }) => (
									<FormItem className='w-1/2'>
										<FormControl>
											<Input {...field} type='text' placeholder={SettingsConfig.common.name} className='h-8' />
										</FormControl>
										<FormMessage className='text-xs font-light' />
									</FormItem>
								)}
							/>
							<div className='flex w-1/2 justify-end space-x-2'>
								<Button onClick={cancelForm} variant='ghost' size='sm' className='h-8 gap-2 border border-slate-300 bg-slate-300/50 p-2 text-slate-400 hover:border-slate-400/50 hover:bg-slate-300 hover:text-slate-500'>
									<X className='h-4 w-4' />
								</Button>
								<Button type='submit' variant='ghost' size='sm' className='h-8 gap-2 border border-slate-300 bg-slate-300/50 p-2 text-slate-400 hover:border-slate-400/50 hover:bg-slate-300 hover:text-slate-500'>
									<Check className='h-3 w-3' strokeWidth='2' />
									<span className='text-xs'>{SettingsConfig.buttons.save}</span>
								</Button>
							</div>
						</div>
					</form>
				</Form>
			)}
		</div>
	);
}
// Export React component
export default UsersRoles;
