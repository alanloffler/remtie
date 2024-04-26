function useTransformCurrency() {
	return (amount: number, type: string, digits: number) => {
        if (typeof amount !== 'number') throw new Error('Amount parameter must be a number');
        if (type !== ('es-AR' || 'en-US')) throw new Error('Type parameter must be es-AR or en-US');
        if (typeof digits !== 'number' && Number.isInteger(digits)) throw new Error('Digits parameter must be an integer number');
        if (type === 'es-AR') return `$ ${amount}`;
	};
}

export { useTransformCurrency };
