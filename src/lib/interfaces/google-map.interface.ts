export interface IMarker {
	key: string;
	lat: number;
	lng: number;
	zoom: number;
}

export interface IMarkerProp extends IMarker {
	propertyId: number;
}

export interface IMapOptions {
	lat: string;
	lng: string;
	mapType: string;
	zoom: number;
}
