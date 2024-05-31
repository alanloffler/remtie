/* Used for vite.js only
 * Function for images path generated dynamically (like in Carousel)
 */
async function getImageURL(name: string) {
	// return new URL(`../../../api-nest-mysql/uploads/${name}`, import.meta.url).href;
	// return new URL(`../assets/photos/${name}`, import.meta.url).href;
	// return new URL(`/public/assets/photos/${name}`, import.meta.url).href;
    return (await import('/photos/' + name)).default;
}

export { getImageURL };