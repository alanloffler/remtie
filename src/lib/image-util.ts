/* Used for vite.js only
 * Function for images path generated dynamically (like in Carousel)
 */
function getImageURL(name: string) {
	// return new URL(`../../../api-nest-mysql/uploads/${name}`, import.meta.url).href;
	return new URL(`../assets/photos/${name}`, import.meta.url).href;
}

export { getImageURL };
