import { useRouter } from 'next/navigation';
import { PlaceResult } from '@/utils/types';
import createNewCity from '../functions/places/createNewCity';
import { Autocomplete } from '@react-google-maps/api';

const useGetCity = () => {
  const router = useRouter();

  const onPlaceSelected = async (city: google.maps.places.Autocomplete) => {
    try {
      // First, check if the city exists
      const checkResponse = await fetch('/api/cities/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ google_id: city.place_id })
      });

      if (!checkResponse.ok) {
        throw new Error('Failed to check city existence');
      }

      const { exists, id, lat, lng, name, country_code, state } =
        await checkResponse.json();

      if (exists) {
        console.log('City already exists:', id, lat, lng);
        router.push(`/cities/${country_code}/${state}/${name}`);
        return;
      }

      // Extract the necessary data from the Autocomplete object
      const cityData = {
        google_id: city.place_id,
        name: city.address_components
          ? city.address_components[0].long_name
              .replace(/\s/g, '-')
              .replace(/[^a-zA-Z0-9-]/g, '')
          : '',
        full_name: city.address_components
          ? city.address_components.map((comp) => comp.long_name).join(', ')
          : '',
        lat: city.geometry?.location?.lat() || 0,
        lng: city.geometry?.location?.lng() || 0,
        state: city.address_components
          ? city.address_components[
              city.address_components.length - 2
            ]?.long_name.replace(/\s/g, '-') || ''
          : '',
        state_code: city.address_components
          ? city.address_components[city.address_components.length - 2]
              ?.short_name || ''
          : '',
        country: city.address_components
          ? city.address_components[city.address_components.length - 1]
              ?.long_name || ''
          : '',
        country_code: city.address_components
          ? city.address_components[city.address_components.length - 1]
              ?.short_name || ''
          : '',
        photos: city.photos?.map((photo) => photo.getUrl({ maxWidth: 800 }))
      };

      // If the city doesn't exist, create it
      const newCity = await createNewCity(cityData);

      router.push(
        `/cities/${newCity.country_code}/${newCity.state}/${newCity.name}`
      );
    } catch (error) {
      console.error('Detailed error in onPlaceSelected:', error);
      alert(`An error occurred while processing the city: ${error.message}`);
    }
  };

  return { onPlaceSelected };
};

export default useGetCity;
