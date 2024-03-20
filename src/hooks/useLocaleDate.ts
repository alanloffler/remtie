function useLocaleDate() {
	return (date: string | undefined) => {
		if (date) {
			const newDate = new Date(date);
			const day: string = String(newDate.getDate()).padStart(2, '0');
			const month: string = String(newDate.getMonth() + 1).padStart(2, '0');
			const year: string = String(newDate.getFullYear()).slice(-2);
			return `${day}/${month}/${year}`;
		} else {
			return 'No date provided';
		}
	};
}

export { useLocaleDate };
