// Icons: Lucide (https://lucide.dev/)
import { AlertCircle } from 'lucide-react';
// App
import { ReactElement } from 'react';
// React component
function InfoCard({ content }: { content: ReactElement | false }) {
	return (
		<div className='flex flex-row items-center justify-center rounded-md border bg-white px-8 py-6 text-slate-900 shadow-sm'>
			<AlertCircle className='mr-8 h-7 w-7 text-amber-300' />
			<div className='flex flex-col md:flex-row'>{content}</div>
		</div>
	);
}
// Export React component
export default InfoCard;
