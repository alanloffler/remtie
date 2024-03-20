
function useTruncateText() {
	const truncateText = (text: string, maxLength: number) => {
		if (text.length > maxLength) {
			return text.substring(0, maxLength) + '...';
		} else {
			return text;
		}
	};
	return truncateText;
}
export { useTruncateText };
