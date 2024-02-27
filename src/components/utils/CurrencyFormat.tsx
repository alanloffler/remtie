// App
import { useEffect, useState } from 'react';
// React component
function CurrencyFormat(props: { value: number; locale: string; digits: number; className: string }) {
	const [symbol, setSymbol] = useState('');

	useEffect(() => {
		if (props.locale === 'es-AR') setSymbol('$');
		if (props.locale === 'en-US') setSymbol('U$D');
	}, [props.locale]);

	const formatted = new Intl.NumberFormat(props.locale, {
		style: 'decimal',
		minimumFractionDigits: props.digits
	}).format(props.value);

	return <div className={props.className}>{symbol + ' ' + formatted}</div>;
}
// Export React component
export default CurrencyFormat;
