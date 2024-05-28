// Icons: Lucide (https://lucide.dev/)
import { ArrowLeft, CalendarPlus, Mailbox, MapPin } from 'lucide-react';
// UI: Shadcn-ui (https://ui.shadcn.com/)
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// App
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import { ButtonsConfig } from '@/lib/config/buttons.config';
import { IMarker } from '@/lib/interfaces/google-map.interface';
import { Link, useNavigate } from 'react-router-dom';
import { MapPropertiesConfig } from '@/lib/config/map-properties.config';
import { ProductsServices } from '@/services/products.services';
import { useEffect, useState } from 'react';
import { IProperty } from '@/lib/interfaces/property.interface';
import { ProductsConfig } from '@/lib/config/products.config';
import CurrencyFormat from '@/components/shared/CurrencyFormat';
import { useCapitalize } from '@/hooks/useCapitalize';
import { useLocaleDate } from '@/hooks/useLocaleDate';
import { getImageURL } from '@/lib/image-util';
// .env constants
const API_KEY: string = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const APP_URL: string = import.meta.env.VITE_APP_URL;
// React component
function MapProperties() {
	const [markers, setMarkers] = useState<IMarker[]>([]);
	const [properties, setProperties] = useState<IProperty[]>([]);
	const [selectedProperty, setSelectedProperty] = useState<IProperty>({} as IProperty);
	const [showMarkers, setShowMarkers] = useState<boolean>(false);
	const capitalize = useCapitalize();
	const localeDate = useLocaleDate();
    const navigate = useNavigate();
    // #region Load data
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
    // #endregion
    // #region Marker events
	function handleMarkerClicked(propertyId: number) {
		const property = properties.find((property) => property.id === propertyId);
		if (property?.id) {
			setSelectedProperty(property);
		} else {
			setSelectedProperty(properties[0]);
		}
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
				<div className='w-full space-y-2'>
					<div className=''>
						<div className='text-sm font-semibold text-slate-600'>{`${MapPropertiesConfig.showing[0]} ${markers.length} ${MapPropertiesConfig.showing[1]} ${properties.length} ${MapPropertiesConfig.showing[2]}`}</div>
						<div className='text-sm text-slate-600'>{`${properties.length - markers.length} ${MapPropertiesConfig.noLocation}`}</div>
					</div>
					<div className='flex flex-col gap-8 md:flex-row lg:flex-row'>
						<div className='lg:2/3 flex w-full md:w-2/3'>
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
						<div className='flex w-full md:w-1/3 lg:w-1/3'>
							<Card className='w-full h-fit overflow-hidden'>
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
											<span>{`${ProductsConfig.pages.view.sentence.location[0]}${selectedProperty.street}${ProductsConfig.pages.view.sentence.location[1]}${capitalize(selectedProperty.city)}${ProductsConfig.pages.view.sentence.location[1]}${capitalize(selectedProperty.state)}`}</span>
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
									{selectedProperty.images && (
										<div className='w-auto grid grid-cols-5 justify-center gap-2 py-2'>
											{selectedProperty.images.map((image) => {
												return (
													<div key={image.id} className='flex'>
														<img src={getImageURL(image.name)} alt={image.name} width={50} height={25} />
													</div>
												);
											})}
										</div>
									)}
									<div className='flex flex-row items-center pt-4 text-sm text-slate-400'>
                                        <Button variant='secondary' size='sm' onClick={() => navigate(`${APP_URL}/productos/${selectedProperty.id}`)}>{ButtonsConfig.actions.details}</Button>
                                    </div>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
// Export React component
export default MapProperties;
