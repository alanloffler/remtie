function useCapitalize() {
	return (word: string | undefined) => {
		if (word) {
			return word.charAt(0).toUpperCase() + word.slice(1);
		} else {
			return 'No date provided';
		}
	};
}

export { useCapitalize };
