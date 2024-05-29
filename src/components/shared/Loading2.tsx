// App
import { GeneralConfig } from '@/lib/config/general.config';
import { SVGProps } from 'react';
// React component
function Loading2({ width = 24, height = 24, dur = '0.75', color }: SVGProps<SVGElement>): JSX.Element {
	return (
		<div className='mx-auto flex flex-col items-center place-content-center'>
			<div className='flex'>
				<svg width={width} height={height} viewBox='0 0 24 24'>
					<path fill={color} d='M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z'>
						<animateTransform attributeName='transform' type='rotate' dur={dur} values='0 12 12;360 12 12' repeatCount='indefinite' />
					</path>
				</svg>
			</div>
			<div className='flex mt-4 text-slate-400'>{GeneralConfig.loading}</div>
		</div>
	);
}
// Export React component
export default Loading2;
