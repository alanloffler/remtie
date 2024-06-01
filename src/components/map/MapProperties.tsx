// Icons: Lucide (https://lucide.dev/)
import { ArrowLeft, CalendarPlus, Mailbox, MapPin } from 'lucide-react';
// UI: Shadcn-ui (https://ui.shadcn.com/)
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// App
import CurrencyFormat from '@/components/shared/CurrencyFormat';
import InfoCard from '@/components/shared/InfoCard';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import { ButtonsConfig } from '@/lib/config/buttons.config';
import { IMapOptions, IMarkerProp } from '@/lib/interfaces/google-map.interface';
import { IProperty } from '@/lib/interfaces/property.interface';
import { Link, useNavigate } from 'react-router-dom';
import { MapPropertiesConfig } from '@/lib/config/map-properties.config';
import { ProductsConfig } from '@/lib/config/products.config';
import { ProductsServices } from '@/services/products.services';
import { ReactElement, useEffect, useState } from 'react';
import { SettingsServices } from '@/services/settings.services';
import { handleServerResponse } from '@/lib/handleServerResponse';
import { useCapitalize } from '@/hooks/useCapitalize';
import { useLocaleDate } from '@/hooks/useLocaleDate';
// .env constants
const API_KEY: string = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const APP_URL: string = import.meta.env.VITE_APP_URL;
const IMAGES_URL: string = import.meta.env.VITE_IMAGES_URL;
// React component
function MapProperties() {
	const [properties, setProperties] = useState<IProperty[]>([]);
	const [selectedProperty, setSelectedProperty] = useState<IProperty>({} as IProperty);
	const [showUI, setShowUI] = useState<boolean>(false);
	const capitalize = useCapitalize();
	const content: ReactElement | false = <div>{ProductsConfig.contentStatus.admin}</div>;
	const localeDate = useLocaleDate();
	const navigate = useNavigate();
	// Google Map
	const [mapOptions, setMapOptions] = useState<IMapOptions>({} as IMapOptions);
	const [markers, setMarkers] = useState<IMarkerProp[]>([]);
	const [showMap, setShowMap] = useState<boolean>(false);
	const [showMapId, setShowMapId] = useState<boolean>(false);
	const [showMarkers, setShowMarkers] = useState<boolean>(false);
	const [mapId, setMapId] = useState<string>('');
	const [showMapOptions, setShowMapOptions] = useState<boolean>(false);
	// #region Load data
	useEffect(() => {
		SettingsServices.findOne('mapId').then((response) => {
			if (!response.statusCode) {
				setMapId(response.value);
				setShowMapId(true);
			}
			handleServerResponse(response);
		});
		SettingsServices.findOne('mapSPOptions').then((response) => {
			if (!response.statusCode) {
				setMapOptions(JSON.parse(response.value));
				setShowMapOptions(true);
			}
			handleServerResponse(response);
		});
		ProductsServices.findAllClient().then((response) => {
			if (!response.statusCode && response.length > 0) {
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
				setShowUI(true);
				setShowMap(true);
			} else {
				handleServerResponse(response);
				setShowUI(false);
				setShowMap(false);
			}
		});
	}, []);

	function filterPropertiesWithMap(properties: IProperty[]) {
		const withMarkers = properties.filter((property) => property.key);
		return withMarkers;
	}
	// #endregion
	// #region Marker events
	function handleMarkerClicked(propertyId: number) {
		if (propertyId) {
			const property = properties.find((property) => property.id === propertyId);
			property?.id ? setSelectedProperty(property) : setSelectedProperty(properties[0]);
		}
		return;
	}
	// #endregion
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
			<div className='flex flex-col items-center px-8 pb-8 pt-4'>
				{showUI && (
					<div className='w-full space-y-2'>
						<div className=''>
							<div className='text-sm font-semibold text-slate-600'>{`${MapPropertiesConfig.showing[0]} ${markers.length} ${MapPropertiesConfig.showing[1]} ${properties.length} ${MapPropertiesConfig.showing[2]}`}</div>
							{properties.length > filterPropertiesWithMap(properties).length && <div className='text-sm text-slate-600'>{`${properties.length - markers.length} ${MapPropertiesConfig.noLocation}`}</div>}
						</div>
						{showMap && showMapId && showMapOptions && (
							<div className='flex flex-col gap-8 md:flex-col lg:flex-row'>
								<div className='flex w-full md:w-full lg:w-2/3'>
									<APIProvider apiKey={API_KEY}>
										{/* prettier-ignore */}
										<Map 
                                        className='h-80 w-full md:h-[470px] lg:h-[470px]' 
                                        mapId={mapId} 
                                        defaultCenter={{ lat: Number(mapOptions.lat) || 0, lng: Number(mapOptions.lng) || 0 }} 
                                        defaultZoom={mapOptions.zoom || 10}
                                        mapTypeId={mapOptions.mapType || 'roadmap'}
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
								<div className='flex w-full md:mx-auto md:w-2/3 lg:w-1/3'>
									<Card className='h-fit w-full overflow-hidden'>
										<CardHeader className='pb-4'>
											<div className='flex justify-between text-xs font-bold uppercase text-slate-500'>
												<div className='flex items-center gap-4'>
													<div className='flex w-auto flex-row items-center rounded-sm border bg-slate-200/70 px-2 py-1 leading-tight'>{selectedProperty.id < 10 ? 'Cod/0' + selectedProperty.id : 'Cod/' + selectedProperty.id}</div>
													<div>{selectedProperty.type}</div>
												</div>
											</div>
											<CardTitle className='pt-2 text-lg text-slate-800'>{selectedProperty.title}</CardTitle>
											<CardDescription className='text-sm'>{selectedProperty.short_description}</CardDescription>
										</CardHeader>
										<CardContent>
											{/* <div className='text-sm'>{selectedProperty.long_description}</div> */}
											<div className='pt-2'>
												<div className='flex items-center space-x-2 py-1 text-sm'>
													<MapPin className='h-4 w-4' />
													<span>{`${ProductsConfig.pages.view.sentence.location[0]}${selectedProperty.street}${ProductsConfig.pages.view.sentence.location[1]}${capitalize(selectedProperty.city.city)}${ProductsConfig.pages.view.sentence.location[1]}${capitalize(selectedProperty.state.state)}`}</span>
												</div>
												<div className='flex items-center space-x-2 py-1 text-sm'>
													<CalendarPlus className='h-4 w-4' />
													<span>{`${ProductsConfig.pages.view.sentence.creation[0]}${selectedProperty.user?.name}${ProductsConfig.pages.view.sentence.creation[1]}${localeDate(selectedProperty.created_at)}`}</span>
												</div>
												<div className='flex items-center space-x-2 py-1 text-sm'>
													<Mailbox className='h-4 w-4' />
													<span>{`${selectedProperty.zip}`}</span>
												</div>
											</div>
											<div className='flex flex-row items-center justify-end space-x-4 py-2 text-base font-semibold text-slate-700'>
												<div className='tracking-tight'>{capitalize(selectedProperty.business_type)}</div>
												<CurrencyFormat value={selectedProperty.price} locale='es-AR' digits={0} className='' />
											</div>
											{selectedProperty.images.length > 0 && (
												<div className='grid w-auto grid-cols-5 justify-center gap-2 py-2'>
													{selectedProperty.images.map((image) => {
														return (
															<div key={image.id} className='flex'>
																<img src={`${IMAGES_URL}/${image.name}`} alt={image.name} width={50} height={25} />
															</div>
														);
													})}
												</div>
											)}
											<div className='flex flex-row items-center pt-4 text-sm text-slate-400'>
												<Button variant='secondary' size='sm' onClick={() => navigate(`${APP_URL}/productos/${selectedProperty.id}`)}>
													{ButtonsConfig.actions.details}
												</Button>
											</div>
										</CardContent>
									</Card>
								</div>
							</div>
						)}
					</div>
				)}
				{!showUI && markers.length > 0 && (
					// Info card
					<div className='mt-12 flex justify-center'>
						<InfoCard content={content} />
					</div>
				)}
			</div>
		</main>
	);
}
// Export React component
export default MapProperties;
