import calcDistance from '@/utils/places/calcDistance';
import { Place } from '@/utils/types';

export const filterAndSortPlaces = (
  places: Place[],
  type: string,
  sortMethod: string,
  lat: string,
  lng: string,
  radius: string,
  sortOrder: 'asc' | 'des'
) => {
  const descending = sortOrder === 'des';
  const coordinates = { lat: lat, lng: lng };

  console.log('filterAndSortPlaces:', coordinates, radius);

  const placesByType = filterByType(places, type);
  const filteredPlaces = filterByRadius(placesByType, coordinates, radius);

  return sortPlaces(filteredPlaces, sortMethod, coordinates, descending);
};

export const filterByRadius = (
  places: Place[],
  coordinates: { lat: string; lng: string },
  radius: string
) => {
  const radiusVal = radius / 1000;
  return places.filter((place) => {
    const distance = calcDistance(coordinates, {
      lat: place.lat,
      lng: place.lng
    });
    return distance <= radiusVal;
  });
};

export const filterByType = (places: Place[], type: string) => {
  return places.filter((place) => place.type === type);
};

export const sortPlaces = (
  places: Place[],
  sortMethod: string,
  coordinates: { lat: number; lng: number } | null,
  descending: boolean
) => {
  return [...places].sort((a, b) => {
    let comparison = 0;
    if (sortMethod === 'distance' && coordinates) {
      const distanceA = calcDistance(coordinates, { lat: a.lat, lng: a.lng });
      const distanceB = calcDistance(coordinates, { lat: b.lat, lng: b.lng });
      comparison = distanceA - distanceB;
    } else if (sortMethod === 'rating-count') {
      comparison = (b.rating_count || 0) - (a.rating_count || 0);
    } else if (sortMethod === 'price') {
      comparison = (b.price_level || 0) - (a.price_level || 0);
    } else {
      comparison = (b.rating_score || 0) - (a.rating_score || 0);
    }
    return descending ? comparison : -comparison;
  });
};
