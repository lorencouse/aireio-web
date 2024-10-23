// CityHero.tsx
import Image from 'next/image';
import { placeholderImage } from '@/utils/constants';
import { getSupabaseCityPhotoUrl } from '@/utils/functions/cities/getSupabaseCityPhotoUrl';
import { City } from '@/utils/types';
import formatPlaceName from '@/utils/functions/formatePlaceName';
import { uploadCityPhoto } from '@/app/_components/actions';
import { useEffect, useState } from 'react';

export default function CityHero({ city }: { city: City }) {
  const [photoUrl, setPhotoUrl] = useState<string>(placeholderImage);

  async function fetchCityPhoto() {
    if (city.photo_ref === null) {
      console.log('No photo found for', city.name, 'Uploading...');
      const result = await uploadCityPhoto(city);
      if (!result.success) {
        console.error('Failed to upload city photo:', result.message);
        return;
      } else {
        console.log('Successfully uploaded city photo:', result.message);
      }
    }

    const imageUrl = getSupabaseCityPhotoUrl(
      city.name ? city.name : '',
      city.state ? city.state : '',
      city.country_code ? city.country_code : ''
    );

    setPhotoUrl(imageUrl);
  }

  useEffect(() => {
    fetchCityPhoto();
  }, []);

  const formattedCountry = formatPlaceName(city.country) || 'Country';
  const formattedCity = formatPlaceName(city.name) || 'City';

  return (
    <div className="relative w-full h-full min-h-[250px]">
      <Image
        src={photoUrl}
        alt={`${city.name || 'City'}, ${city.country || 'Country'} cityscape`}
        fill
        style={{ objectFit: 'cover' }}
        loading="lazy"
        placeholder="blur"
        blurDataURL="/images/logo.png"
      />
      <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center gap-6">
        <h1 className="text-white text-4xl md:text-6xl font-bold capitalize text-center px-4 text-shadow-lg select-none">
          {formattedCity}
        </h1>
        <span className="text-white text-xl md:text-2xl font-bold capitalize text-center px-4 text-shadow-lg select-none">
          {formattedCountry}
        </span>
      </div>
    </div>
  );
}
