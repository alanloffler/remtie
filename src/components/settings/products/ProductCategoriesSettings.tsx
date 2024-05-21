// Icons: Lucide (https://lucide.dev/)
import { Check, CheckCircle, CircleX, Plus, Trash2 } from 'lucide-react';
// UI: Shadcn-ui (https://ui.shadcn.com/)
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
// App
import { CategoriesServices } from '@/services/categories.services';
import { ICategory, ICategoryForm } from '@/lib/interfaces/inputs.interface';
import { SettingsConfig } from '@/lib/config/settings.config';
import { categoriesSchema } from '@/lib/schemas/categories.schema';
import { useCapitalize } from '@/hooks/useCapitalize';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
// React component
function ProductBusinessSettings() {
	const [categories, setCategories] = useState<ICategory[]>([]);
	const capitalize = useCapitalize();

	useEffect(() => {
		getCategories();
	}, []);

	function getCategories() {
		CategoriesServices.findAll().then((response) => {
			if (response.length > 0) {
				if (response.statusCode < 399) toast({ title: response.statusCode, description: response.message, variant: 'success', duration: 5000 });
				setCategories(response);
			}
			if (response instanceof Error) toast({ title: 'Error', description: '500 Internal Server Error | ' + response.message, variant: 'destructive', duration: 5000 });
		});
	}

	function restoreBusiness(id: number) {
		CategoriesServices.restore(id).then((response) => {
			if (response.statusCode === 200) {
				toast({ title: response.statusCode, description: response.message, variant: 'success', duration: 5000 });
				getCategories();
			}
			if (response.statusCode > 399) toast({ title: response.statusCode, description: response.message, variant: 'destructive', duration: 5000 });
			if (response instanceof Error) toast({ title: 'Error', description: '500 Internal Server Error | ' + response.message, variant: 'destructive', duration: 5000 });
		});
	}

	function removeSoftBusiness(id: number) {
		CategoriesServices.removeSoft(id).then((response) => {
			if (response.statusCode === 200) {
				toast({ title: response.statusCode, description: response.message, variant: 'success', duration: 5000 });
				getCategories();
			}
			if (response.statusCode > 399) toast({ title: response.statusCode, description: response.message, variant: 'destructive', duration: 5000 });
			if (response instanceof Error) toast({ title: 'Error', description: '500 Internal Server Error | ' + response.message, variant: 'destructive', duration: 5000 });
		});
	}

	function removeBusiness(id: number) {
		CategoriesServices.remove(id).then((response) => {
			if (response.statusCode === 200) {
				toast({ title: response.statusCode, description: response.message, variant: 'success', duration: 5000 });
				getCategories();
			}
			if (response.statusCode > 399) toast({ title: response.statusCode, description: response.message, variant: 'destructive', duration: 5000 });
			if (response instanceof Error) toast({ title: 'Error', description: '500 Internal Server Error | ' + response.message, variant: 'destructive', duration: 5000 });
		});
	}
	// #region Form actions
	const categoriesForm = useForm<z.infer<typeof categoriesSchema>>({
		resolver: zodResolver(categoriesSchema),
		defaultValues: {
			name: '',
			plural: '',
			color: ''
		}
	});

	function handleBusinessSubmit(data: ICategoryForm) {
		const formattedData = {
			name: data.name.trim().toLowerCase(),
			plural: data.plural.trim().toLowerCase(),
			color: data.color.trim().toLowerCase()
		};
		CategoriesServices.create(formattedData).then((response) => {
			if (response.statusCode === 200) {
				toast({ title: response.statusCode, description: response.message, variant: 'success', duration: 5000 });
				getCategories();
				categoriesForm.reset();
			}
			if (response.statusCode > 399) toast({ title: response.statusCode, description: response.message, variant: 'destructive', duration: 5000 });
			if (response instanceof Error) toast({ title: 'Error', description: '500 Internal Server Error | ' + response.message, variant: 'destructive', duration: 5000 });
		});
	}
	// #endregion
	return (
		<div className='space-y-2'>
            <Separator className='mb-2' />
			<span className='text-base font-medium text-slate-500'>{SettingsConfig.sections.categoriesType}</span>
			<Card className='px-4 overflow-x-auto'>
				<ul className='space-y-1 py-4 text-sm text-slate-700'>
					{categories.map((category, index) => (
						<li key={category.id} className={`flex items-center justify-between rounded-md p-1 ${index % 2 === 0 ? 'bg-slate-100/60' : ''}`}>
							<div className='flex items-center space-x-2 text-sm'>
								<div className={`h-3 w-3 rounded-full`} style={{ backgroundColor: category.color }}></div>
								<span className={`font-medium text-slate-800 ${category.deletedAt !== null ? 'line-through' : ''}`}>{capitalize(category.name)}</span>
								<span className={`text-xs font-medium text-slate-500 ${category.deletedAt !== null ? 'line-through' : ''}`}>{`(${capitalize(category.plural)})`}</span>
							</div>
							<div className='flex flex-row space-x-2'>
								{category.deletedAt !== null && (
									<button onClick={() => restoreBusiness(category.id)} className='flex h-7 w-7 items-center justify-center rounded-md border border-slate-300 bg-slate-300/50 p-1 text-slate-400 transition-all hover:border-slate-400/50 hover:bg-slate-200/50 hover:text-green-500'>
										<CheckCircle className='h-4 w-4' />
									</button>
								)}
								{category.deletedAt === null && (
									<button onClick={() => removeSoftBusiness(category.id)} className='flex h-7 w-7 items-center justify-center rounded-md border border-slate-300 bg-slate-300/50 p-1 text-slate-400 transition-all hover:border-slate-400/50 hover:bg-slate-200/50 hover:text-red-500'>
										<Trash2 className='h-4 w-4' />
									</button>
								)}
								<button onClick={() => removeBusiness(category.id)} className='flex h-7 w-7 items-center justify-center rounded-md border border-slate-300 bg-slate-300/50 p-1 text-slate-400 transition-all hover:border-slate-400/50 hover:bg-slate-200/50 hover:text-red-500'>
									<CircleX className='h-4 w-4' />
								</button>
							</div>
						</li>
					))}
				</ul>
			</Card>
			<Form {...categoriesForm}>
				<form onSubmit={categoriesForm.handleSubmit(handleBusinessSubmit)} className='grid items-center space-y-4 py-2'>
					<div className='flex flex-row items-center space-x-4'>
						<Plus className='rounded-full border bg-white p-1' />
						<FormField
							control={categoriesForm.control}
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
						<FormField
							control={categoriesForm.control}
							name='plural'
							render={({ field }) => (
								<FormItem className='w-1/2'>
									<FormControl>
										<Input {...field} type='text' placeholder={SettingsConfig.common.plural} className='h-8' />
									</FormControl>
									<FormMessage className='text-xs font-light' />
								</FormItem>
							)}
						/>
					</div>
					<div className='flex flex-row items-center justify-between space-x-4'>
						<span className='w-6 p-1'></span>
						<FormField
							control={categoriesForm.control}
							name='color'
							render={({ field }) => (
								<FormItem className='w-1/2'>
									<FormControl>
										<Input {...field} type='text' placeholder={SettingsConfig.common.color} className='h-8' />
									</FormControl>
									<FormMessage className='text-xs font-light' />
								</FormItem>
							)}
						/>
						<div className='flex w-1/2 justify-end'>
							<Button type='submit' variant='ghost' size='sm' className='h-8 gap-2 border border-slate-300 bg-slate-300/50 p-2 text-slate-400 hover:border-slate-400/50 hover:bg-slate-300 hover:text-slate-500'>
								<Check className='h-3 w-3' strokeWidth='2' />
								<span className='text-xs'>{SettingsConfig.buttons.save}</span>
							</Button>
						</div>
					</div>
				</form>
			</Form>
		</div>
	);
}
// Export React component
export default ProductBusinessSettings;
