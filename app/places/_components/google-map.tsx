'use client';

import React, { useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import RadiusSlider from './radius-slider';
import updateUrlQuery from '@/utils/updateUrlQuery';

interface MapWithDraggableMarkerProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const GoogleMap: React.FC<MapWithDraggableMarkerProps> = ({ searchParams }) => {
  const router = useRouter();
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(
    null
  );
  const circleRef = useRef<google.maps.Circle | null>(null);

  const lat = parseFloat((searchParams.lat as string) || '0');
  const lng = parseFloat((searchParams.lng as string) || '0');
  const radius = parseFloat((searchParams.radius as string) || '1000');

  const initialCenter = useRef({ lat, lng });

  const calculateZoom = useCallback((radius: number) => {
    return Math.round(14 - Math.log(radius / 1000) / Math.log(2));
  }, []);

  const constrainPosition = useCallback(
    (position: google.maps.LatLngLiteral) => {
      const R = 6371; // Earth's radius in km
      const lat1 = (initialCenter.current.lat * Math.PI) / 180;
      const lng1 = (initialCenter.current.lng * Math.PI) / 180;
      const lat2 = (position.lat * Math.PI) / 180;
      const lng2 = (position.lng * Math.PI) / 180;

      const dlat = lat2 - lat1;
      const dlng = lng2 - lng1;

      const a =
        Math.sin(dlat / 2) ** 2 +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlng / 2) ** 2;
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
      const center = { lat, lng };
      const newZoom = calculateZoom(radius);
      mapInstanceRef.current.panTo(center);
      mapInstanceRef.current.setZoom(newZoom);
      markerRef.current.position = center;
      circleRef.current.setCenter(center);
      circleRef.current.setRadius(radius);
    }
  }, [lat, lng, radius, calculateZoom]);

  const updateUrlWithNewPosition = useCallback(
    (newLat: number, newLng: number) => {
      let newUrl = updateUrlQuery('lat', newLat.toString(), searchParams);
      newUrl = updateUrlQuery('lng', newLng.toString(), {
        ...searchParams,
        lat: newLat.toString()
      });
      router.replace(`?${newUrl}`, { scroll: false });
    },
    [router, searchParams]
  );

  const loadGoogleMapsAPI = useCallback(() => {
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
  }, []);

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
        const center = { lat, lng };
        mapInstanceRef.current = new Map(mapRef.current, {
          center,
          zoom: calculateZoom(radius),
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
          updateUrlWithNewPosition(
            constrainedPosition.lat,
            constrainedPosition.lng
          );
        });
      }

      updateMapElements();
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        google.maps.event.clearInstanceListeners(mapInstanceRef.current);
      }
    };
  }, [
    lat,
    lng,
    radius,
    calculateZoom,
    constrainPosition,
    updateMapElements,
    updateUrlWithNewPosition,
    loadGoogleMapsAPI
  ]);

  return (
    <div>
      <div ref={mapRef} style={{ height: '400px', width: '100%' }} />
      <RadiusSlider
        initialRadius={radius.toString()}
        searchParams={searchParams}
      />
    </div>
  );
};

export default GoogleMap;
