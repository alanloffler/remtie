// Imports
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

// Types
interface Dot {
	margin?: string;
	text?: string;
	type?: string;
	width: string;
	fontSize?: string;
}

interface Colors {
	admin: RoleColors;
	user: RoleColors;
}

interface RoleColors {
	dot: string;
	text: string;
}

const colors: Colors = {
	admin: {
		dot: 'border-rose-400 bg-rose-300',
		text: 'text-rose-500/50'
	},
	user: {
		dot: 'border-sky-400 bg-sky-300',
		text: 'text-sky-500/50'
	}
};
// React component
function Dot(props: Dot) {
	const [text, setText] = useState<string | undefined>('');
	const [type, setType] = useState<string | undefined>('');
	const [dotColor, setDotColor] = useState<string>('');
	const [textColor, setTextColor] = useState<string>('');

	const styles = {
		width: props.width,
		height: props.width,
		margin: props.margin,
		fontSize: props.fontSize
	};

	useEffect(() => {
		setText(props.text);
		setType(props.type);

		if (type === 'admin') {
			setDotColor(colors.admin.dot);
			setTextColor(colors.admin.text);
		}
		if (type === 'user') {
			setDotColor(colors.user.dot);
			setTextColor(colors.user.text);
		}
	}, [props.text, props.type, type]);

	return (
		<div className={cn('flex justify-center rounded-[50%] border', dotColor)} style={styles}>
			<div className={cn('flex items-center font-light', textColor)}>{text}</div>
		</div>
	);
}
// Export React component
export default Dot;
