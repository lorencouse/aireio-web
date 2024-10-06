import React, { useCallback, useEffect, useRef, useState } from 'react';
import useUpdateUrlQuery from '@/utils/hook/useUpdateUrlQuery';
import { City } from '@/utils/types';
import { getParamValue } from '@/utils/functions/getParamValue';
import { ReadonlyURLSearchParams } from 'next/navigation';

// import { useSearchParams } from 'next/navigation';

interface MapWithDraggableMarkerProps {
  searchParams: ReadonlyURLSearchParams;

  lat: string;
  lng: string;
}

const GoogleMap: React.FC<MapWithDraggableMarkerProps> = ({
  searchParams,
  lat,
  lng
}) => {
  const { updateUrlQueries } = useUpdateUrlQuery();
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(
    null
  );
  const circleRef = useRef<google.maps.Circle | null>(null);
  // const searchParams = useSearchParams();
  const initialLat = parseFloat(searchParams?.get('lat') ?? lat ?? '0');
  const initialLng = parseFloat(searchParams?.get('lng') ?? lng ?? '0');
  const initialRadius = parseInt(searchParams?.get('radius') ?? '1000');

  const [center, setCenter] = useState({ lat: initialLat, lng: initialLng });
  const [zoom, setZoom] = useState(14);
  const [radius, setRadius] = useState(initialRadius);
  const initialCenter = useRef({ lat: initialLat, lng: initialLng });

  const calculateZoom = useCallback((radius: number) => {
    return Math.round(14 - Math.log(radius / 1000) / Math.log(2));
  }, []);

  const constrainPosition = useCallback(
    (position: google.maps.LatLngLiteral) => {
      const R = 6371; // Earth's radius in km
      const lat1 = (initialCenter.current.lat * Math.PI) / 180;
      const lon1 = (initialCenter.current.lng * Math.PI) / 180;
      const lat2 = (position.lat * Math.PI) / 180;
      const lon2 = (position.lng * Math.PI) / 180;

      const dlat = lat2 - lat1;
      const dlon = lon2 - lon1;

      const a =
        Math.sin(dlat / 2) ** 2 +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;

      if (distance <= 15) {
        return position;
      } else {
        const ratio = 15 / distance;
        const newLat =
          initialCenter.current.lat +
          (position.lat - initialCenter.current.lat) * ratio;
        const newLng =
          initialCenter.current.lng +
          (position.lng - initialCenter.current.lng) * ratio;
        return { lat: newLat, lng: newLng };
      }
    },
    []
  );

  const updateMapElements = useCallback(() => {
    if (mapInstanceRef.current && markerRef.current && circleRef.current) {
      const newZoom = calculateZoom(radius);
      mapInstanceRef.current.panTo(center);
      mapInstanceRef.current.setZoom(newZoom);
      markerRef.current.position = center;
      circleRef.current.setCenter(center);
      circleRef.current.setRadius(radius);
      setZoom(newZoom);
      setCenter(center);
    }
  }, [center, radius, calculateZoom, setCenter]);

  const loadGoogleMapsAPI = () => {
    return new Promise<void>((resolve) => {
      if (typeof window.google === 'undefined') {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}&libraries=places`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
        script.onload = () => resolve();
      } else {
        resolve();
      }
    });
  };

  useEffect(() => {
    const initMap = async () => {
      await loadGoogleMapsAPI();

      const { Map } = (await google.maps.importLibrary(
        'maps'
      )) as google.maps.MapsLibrary;
      const { AdvancedMarkerElement } = (await google.maps.importLibrary(
        'marker'
      )) as google.maps.MarkerLibrary;

      if (!mapInstanceRef.current && mapRef.current) {
        mapInstanceRef.current = new Map(mapRef.current, {
          center,
          zoom: zoom,
          mapId: process.env.NEXT_PUBLIC_GOOGLE_PLACES_MAP_ID as string,
          gestureHandling: 'greedy',
          zoomControl: false
        });

        markerRef.current = new AdvancedMarkerElement({
          map: mapInstanceRef.current,
          position: center,
          gmpDraggable: true,
          title: 'This marker is draggable.'
        });

        circleRef.current = new google.maps.Circle({
          map: mapInstanceRef.current,
          center,
          radius,
          fillColor: '#FF0000',
          fillOpacity: 0.2,
          strokeColor: '#FF0000',
          strokeOpacity: 0.5,
          strokeWeight: 2
        });

        markerRef.current.addListener('dragend', () => {
          const position = markerRef.current!.position as google.maps.LatLng;
          const constrainedPosition = constrainPosition(position.toJSON());
          setCenter(constrainedPosition);
          markerRef.current!.position = constrainedPosition;
          setCenter(constrainedPosition);
        });
      }

      updateMapElements();
      updateUrlQueries([
        { name: 'lat', value: center.lat.toString() },
        { name: 'lng', value: center.lng.toString() },
        { name: 'radius', value: radius.toString() }
      ]);
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        google.maps.event.clearInstanceListeners(mapInstanceRef.current);
      }
    };
  }, [updateMapElements, zoom, constrainPosition, setCenter, center, radius]);

  const handleRadiusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRadius = parseInt(event.target.value, 10);
    setRadius(newRadius);
    updateMapElements();
  };

  return (
    <div>
      <div ref={mapRef} style={{ height: '400px', width: '100%' }} />
      {/* radius slider */}
      <div className="flex items-center mt-4 mx-4">
        <label htmlFor="radius" className="mr-2">
          Radius:
        </label>
        <input
          type="range"
          id="radius"
          min="500"
          max="4000"
          step="500"
          value={radius}
          onChange={handleRadiusChange}
          className="w-full"
        />
        <span className="ml-2">{radius / 1000} km</span>
      </div>
    </div>
  );
};

export default GoogleMap;
