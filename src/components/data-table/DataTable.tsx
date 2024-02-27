// Icons: Lucide (https://lucide.dev/)
import { ArrowLeftIcon, ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
// UI: Shadcn-ui (https://ui.shadcn.com/)
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// Tanstack table
import { ColumnDef, ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable } from '@tanstack/react-table';
// App
import { useState } from 'react';
import { UsersConfig } from '@/lib/config';
// Interfaces
interface DataTableProps<TData, TValue> {
	searchBy: string;
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}
// React component
export function DataTable<TData, TValue>({
	// searchBy,
	columns,
	data
}: DataTableProps<TData, TValue>) {
	const itemsPerPage = UsersConfig.pagination.itemsPerPage;
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			sorting,
			columnFilters
		},
		initialState: {
			pagination: {
				pageSize: 5
			}
		}
	});

	return (
		<div>
			<div className='rounded-md border'>
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id} className='bg-muted/80'>
											{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id} className='px-4 py-2'>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className='h-24 text-center'>
									{UsersConfig.noResults}
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className='flex items-center justify-between space-x-6 py-6 lg:space-x-8'>
				<div className='flex items-center space-x-2'>
					<p className='text-sm font-normal text-gray-400'>{UsersConfig.pagination.rowsPerPage}</p>
					<Select
						value={`${table.getState().pagination.pageSize}`}
						onValueChange={(value) => {
							table.setPageSize(Number(value));
						}}>
						<SelectTrigger className='h-8 w-[65px] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/40 focus-visible:ring-offset-0'>
							<SelectValue placeholder={table.getState().pagination.pageSize} />
						</SelectTrigger>
						<SelectContent side='top' className='min-w-[4rem]'>
							{itemsPerPage.map((pageSize) => (
								<SelectItem key={pageSize} value={`${pageSize}`}>
									{pageSize}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className='flex w-[100px] items-center justify-center text-sm font-normal text-neutral-400'>
					{UsersConfig.pagination.page} {table.getState().pagination.pageIndex + 1} {UsersConfig.pagination.of} {table.getPageCount()}
				</div>
				<div className='flex items-center space-x-2'>
					<Button variant='outline' className='hidden h-8 w-8 bg-neutral-100 p-0 hover:bg-neutral-200 dark:bg-neutral-950 dark:hover:bg-neutral-800 lg:flex' onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
						<span className='sr-only'>Go to first page</span>
						<ArrowLeftIcon className='h-4 w-4' />
					</Button>
					<Button variant='outline' className='h-8 w-8 bg-neutral-100 p-0 hover:bg-neutral-200 dark:bg-neutral-950 dark:hover:bg-neutral-800' onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
						<span className='sr-only'>Go to previous page</span>
						<ChevronLeftIcon className='h-4 w-4' />
					</Button>
					<Button variant='outline' className='h-8 w-8 bg-neutral-100 p-0 hover:bg-neutral-200 dark:bg-neutral-950 dark:hover:bg-neutral-800' onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
						<span className='sr-only'>Go to next page</span>
						<ChevronRightIcon className='h-4 w-4' />
					</Button>
					<Button variant='outline' className='hidden h-8 w-8 bg-neutral-100 p-0 hover:bg-neutral-200 dark:bg-neutral-950 dark:hover:bg-neutral-800 lg:flex' onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
						<span className='sr-only'>Go to last page</span>
						<ArrowRightIcon className='h-4 w-4' />
					</Button>
				</div>
			</div>
		</div>
	);
}
