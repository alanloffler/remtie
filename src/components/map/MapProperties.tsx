// Icons: Lucide (https://lucide.dev/)
import { ArrowLeft } from 'lucide-react';
// UI: Shadcn-ui (https://ui.shadcn.com/)
import { Button } from '@/components/ui/button';
// App
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import { ButtonsConfig } from '@/lib/config/buttons.config';
import { IMarker } from '@/lib/interfaces/google-map.interface';
import { Link } from 'react-router-dom';
import { MapPropertiesConfig } from '@/lib/config/map-properties.config';
import { ProductsServices } from '@/services/products.services';
import { useEffect, useState } from 'react';
import { IProperty } from '@/lib/interfaces/property.interface';
import { Card } from '../ui/card';
// .env constants
const APP_URL: string = import.meta.env.VITE_APP_URL;
const API_KEY: string = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
// React component
function MapProperties() {
	const [markers, setMarkers] = useState<IMarker[]>([]);
	const [properties, setProperties] = useState<IProperty[]>([]);
	const [selectedProperty, setSelectedProperty] = useState<IProperty>({} as IProperty);
	const [showMarkers, setShowMarkers] = useState<boolean>(false);

	useEffect(() => {
		ProductsServices.findAllClient().then((response) => {
			if (!response.statusCode) {
				setShowMarkers(true);
				setProperties(response);
				setSelectedProperty(response[0]);

				const withMarkers: IProperty[] = filterPropertiesWithMap(response);
				const markers = withMarkers.map((property) => {
					return {
						propertyId: property.id,
						key: property.key,
						lat: Number(property.lat),
						lng: Number(property.lng),
						zoom: Number(property.zoom)
					};
				});
				setMarkers(markers);
			}
		});
	}, []);

	function filterPropertiesWithMap(properties: IProperty[]) {
		const withMarkers = properties.filter((property) => property.key);
		return withMarkers;
	}

	function handleMarkerClicked(propertyId: number) {
		const property = properties.find((property) => property.id === propertyId);
		if (property) {
			setSelectedProperty(property);
		}
	}

	return (
		<main className='flex-1 animate-fadeIn overflow-y-auto'>
			<div className='flex flex-row items-center justify-between px-8 pt-8'>
				<h1 className='text-2xl font-normal text-slate-600'>{MapPropertiesConfig.title}</h1>
				<Button variant='ghost' size='sm' asChild>
					<Link to={`${APP_URL}/`}>
						<ArrowLeft strokeWidth='2' className='mr-2 h-4 w-4' />
						{ButtonsConfig.actions.back}
					</Link>
				</Button>
			</div>
			{/* SECTION: Google Map */}
			<div className='flex flex-col gap-4 px-8 py-8 md:flex-row'>
				<div className='flex flex-row w-full items-center justify-between'>
					<span className='text-sm text-slate-600'>{`${MapPropertiesConfig.showing[0]} ${markers.length} ${MapPropertiesConfig.showing[1]} ${properties.length} ${MapPropertiesConfig.showing[2]}`}</span>
					<span className='text-sm text-slate-600'>{`${properties.length - markers.length} ${MapPropertiesConfig.noLocation}`}</span>
				</div>
                <div className='flex w-full flex-row'>
                    <div className='flex w-full flex-col space-y-2 md:w-2/3 lg:w-2/3'>
                        <APIProvider apiKey={API_KEY}>
                            {/* prettier-ignore */}
                            <Map 
                            className='h-80 w-full md:h-[470px] lg:h-[470px]' 
                            mapId='1c6903a9111fa3c3' 
                            defaultCenter={{ lat: -26.000694, lng: -54.57684 }} 
                            defaultZoom={11} 
                            mapTypeId={'roadmap'} 
                            gestureHandling={'greedy'} 
                            disableDefaultUI={false} 
                            disableDoubleClickZoom={true} 
                            controlSize={25}
                        >
                            {showMarkers && (
                                <>
                                    {markers.map((marker) => {
                                        return <AdvancedMarker
                                                    key={marker.key} 
                                                    position={marker} 
                                                    onClick={() => handleMarkerClicked(marker.propertyId)} 
                                                />;
                                    })}
                                </>
                            )}
                        </Map>
                        </APIProvider>
                    </div>
                    <div className='flex w-full flex-col md:w-1/3 lg:w-1/3'>
                        <Card>
                            <span>{selectedProperty.title}</span>
                        </Card>
                    </div>
                </div>
			</div>
		</main>
	);
}
// Export React component
export default MapProperties;
