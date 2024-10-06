import { placeholderImage } from '../../constants';
import { Place } from '@/utils/types';

export const getPlacePhotoUrls = (place: Place): string[] => {
  if (!place.photo_names || place.photo_names.length === 0) {
    return [placeholderImage];
  }
  // console.log('Photo names:', place.photo_names);

  return place.photo_names.map(
    (photoName) =>
      `https://pbjjmfifdzbptzlotsej.supabase.co/storage/v1/object/public/images/places/${place.city_id}/${place.id}/${photoName}`
  );
};
