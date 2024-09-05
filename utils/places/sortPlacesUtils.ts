import calcDistance from '@/utils/places/calcDistance';
import { Place } from '@/utils/types';

export const filterAndSortPlaces = (
  places: Place[],
  sortMethod: string,
  lat: string, 
  lng: string,
  radius: string,
  sortOrder: 'asc' | 'desc',
) => {
  const descending = sortOrder === 'desc';
  const coordinates = { lat: parseFloat(lat), lng: parseFloat(lng) };


  return sortPlaces(
    filterByRadius(places, coordinates, parseInt(radius)),
    sortMethod,
    coordinates,
    descending,
  );
};

export const filterByRadius = (
  places: Place[],
  coordinates: { lat: number; lng: number },
  radius: number,
) => {
  const radiusVal = radius / 1000;
  return places.filter((place) => {
    const distance = calcDistance(coordinates, {
      lat: place.lat,
      lng: place.lng,
    });
    return distance <= radiusVal;
  });
};

export const sortPlaces = (
  places: Place[],
  sortMethod: string,
  coordinates: { lat: number; lng: number } | null,
  descending: boolean,
) => {
  return [...places].sort((a, b) => {
    let comparison = 0;
    if (sortMethod === 'distance' && coordinates) {
      const distanceA = calcDistance(coordinates, { lat: a.lat, lng: a.lng });
      const distanceB = calcDistance(coordinates, { lat: b.lat, lng: b.lng });
      comparison = distanceA - distanceB;
    } else if (sortMethod === 'rating-count') {
      comparison = (b.google_rating.count || 0) - (a.google_rating.count || 0);
    } else if (sortMethod === 'price') {
      comparison = (b.tags.cost || 0) - (a.tags.cost || 0);
    } else {
      comparison = (b.google_rating.score || 0) - (a.google_rating.score || 0);
    }
    return descending ? comparison : -comparison;
  });
};
