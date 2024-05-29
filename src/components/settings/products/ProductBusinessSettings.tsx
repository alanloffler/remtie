// Icons: Lucide (https://lucide.dev/)
import { Check, CheckCircle, CircleX, Plus, Trash2 } from 'lucide-react';
// UI: Shadcn-ui (https://ui.shadcn.com/)
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
// App
import { BusinessServices } from '@/services/business.services';
import { IBusiness, IBusinessForm } from '@/lib/interfaces/inputs.interface';
import { SettingsConfig } from '@/lib/config/settings.config';
import { businessSchema } from '@/lib/schemas/business.schema';
import { handleServerResponse } from '@/lib/handleServerResponse';
import { useCapitalize } from '@/hooks/useCapitalize';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
// React component
function ProductBusinessSettings() {
	const [business, setBusiness] = useState<IBusiness[]>([]);
	const capitalize = useCapitalize();

	useEffect(() => {
		getBusiness();
	}, []);

	function getBusiness() {
		BusinessServices.findAll().then((response) => {
            if (!response.statusCode) setBusiness(response)
            handleServerResponse(response);
		});
	}

	function restoreBusiness(id: number) {
		BusinessServices.restore(id).then((response) => {
			if (response.statusCode === 200) getBusiness();
            handleServerResponse(response);
		});
	}

	function removeSoftBusiness(id: number) {
		BusinessServices.removeSoft(id).then((response) => {
			if (response.statusCode === 200) getBusiness();
			handleServerResponse(response);
		});
	}

	function removeBusiness(id: number) {
		BusinessServices.remove(id).then((response) => {
			if (response.statusCode === 200) getBusiness();
			handleServerResponse(response);
		});
	}
	// #region Form actions
	const businessForm = useForm<z.infer<typeof businessSchema>>({
		resolver: zodResolver(businessSchema),
		defaultValues: {
			name: '',
			plural: ''
		}
	});

	function handleBusinessSubmit(data: IBusinessForm) {
		const formattedData = { name: data.name.trim().toLowerCase(), plural: data.plural.trim().toLowerCase() };
		BusinessServices.create(formattedData).then((response) => {
			if (response.statusCode === 200) {
				getBusiness();
				businessForm.reset();
			}
            handleServerResponse(response);
		});
	}
	// #endregion
	return (
		<div className='space-y-2'>
            <Separator className='mb-2' />
			<span className='text-base font-medium text-slate-500'>{SettingsConfig.sections.businessType}</span>
			<Card className='px-4'>
				<ul className='space-y-1 py-4 text-sm text-slate-700'>
					{business.map((business, index) => (
						<li key={business.id} className={`flex items-center justify-between p-1 rounded-md ${index % 2 === 0 ? 'bg-slate-100/60' : '' }`}>
							<div className='space-x-2 text-sm font-medium'>
								<span className={`text-slate-800 ${business.deletedAt !== null ? 'line-through' : ''}`}>{capitalize(business.name)}</span>
								<span className={`text-xs text-slate-500 ${business.deletedAt !== null ? 'line-through' : ''}`}>{`(${capitalize(business.plural)})`}</span>
							</div>
							<div className='flex flex-row space-x-2'>
								{business.deletedAt !== null && (
									<button onClick={() => restoreBusiness(business.id)} className='flex h-7 w-7 items-center justify-center rounded-md border border-slate-300 bg-slate-300/50 p-1 text-slate-400 transition-all hover:border-slate-400/50 hover:bg-slate-200/50 hover:text-green-500'>
										<CheckCircle className='h-4 w-4' />
									</button>
								)}
								{business.deletedAt === null && (
									<button onClick={() => removeSoftBusiness(business.id)} className='flex h-7 w-7 items-center justify-center rounded-md border border-slate-300 bg-slate-300/50 p-1 text-slate-400 transition-all hover:border-slate-400/50 hover:bg-slate-200/50 hover:text-red-500'>
										<Trash2 className='h-4 w-4' />
									</button>
								)}
								<button onClick={() => removeBusiness(business.id)} className='flex h-7 w-7 items-center justify-center rounded-md border border-slate-300 bg-slate-300/50 p-1 text-slate-400 transition-all hover:border-slate-400/50 hover:bg-slate-200/50 hover:text-red-500'>
									<CircleX className='h-4 w-4' />
								</button>
							</div>
						</li>
					))}
				</ul>
			</Card>
			<Form {...businessForm}>
				<form onSubmit={businessForm.handleSubmit(handleBusinessSubmit)} className='flex flex-row space-x-4 items-center py-2'>
                    <Plus className='bg-white rounded-full border p-1' />
					<FormField
						control={businessForm.control}
						name='name'
						render={({ field }) => (
							<FormItem className='w-1/3'>
								<FormControl>
									<Input {...field} type='text' placeholder={SettingsConfig.common.name} className='h-8' />
								</FormControl>
								<FormMessage className='text-xs font-light' />
							</FormItem>
						)}
					/>
					<FormField
						control={businessForm.control}
						name='plural'
						render={({ field }) => (
							<FormItem className='w-1/3'>
								<FormControl>
									<Input {...field} type='text' placeholder={SettingsConfig.common.plural} className='h-8' />
								</FormControl>
								<FormMessage className='text-xs font-light' />
							</FormItem>
						)}
					/>
					<Button type='submit' variant='ghost' size='sm' className='h-8 gap-2 border border-slate-300 bg-slate-300/50 p-2 text-slate-400 hover:border-slate-400/50 hover:bg-slate-300 hover:text-slate-500'>
						<Check className='h-3 w-3' strokeWidth='2' />
						<span className='text-xs'>{SettingsConfig.buttons.save}</span>
					</Button>
				</form>
			</Form>
		</div>
	);
}
// Export React component
export default ProductBusinessSettings;
