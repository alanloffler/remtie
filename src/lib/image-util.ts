/* Used for vite.js only
* Function for images path generated dynamically (like in Carousel)
*/
function getImageURL(name: string) {
	return new URL(`../../images/${name}`, import.meta.url).href;
}

export { getImageURL };
