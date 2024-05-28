export interface IMarker {
	propertyId: number;
	key: string;
	lat: number;
	lng: number;
	zoom: number;
}

export interface IMapOptions {
	lat: string;
	lng: string;
	mapType: string;
	zoom: number;
}
