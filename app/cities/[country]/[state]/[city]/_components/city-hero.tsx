import Image from 'next/image';
import { placeholderImage } from '@/utils/constants';
import { getSupabaseCityPhotoUrl } from '@/utils/functions/cities/getSupabaseCityPhotoUrl';
import { City } from '@/utils/types';

interface CityHeroProps {
  city: City;
  // state: string;
  // country: string;
  // countryCode: string;
}

export default function CityHero({
  city
  // state,
  // country,
  // countryCode
}: CityHeroProps) {
  const imageUrl = getSupabaseCityPhotoUrl(
    city.name ? city.name : '',
    city.state ? city.state : '',
    city.country_code ? city.country_code : ''
  );
  return (
    <div className="relative w-full h-full min-h-[250px]">
      <Image
        src={imageUrl || placeholderImage}
        alt={`${city.name || 'City'}, ${city.country || 'Country'} cityscape`}
        fill
        style={{ objectFit: 'cover' }}
        loading="lazy"
        placeholder="blur"
        blurDataURL="/images/logo.png"
      />
      <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center gap-6">
        <h1 className="text-white text-4xl md:text-6xl font-bold capitalize text-center px-4 text-shadow-lg select-none">
          {city.name.replace('-', ' ') || 'City Name Not Available'}
        </h1>
        <span className="text-white text-xl md:text-2xl font-bold capitalize text-center px-4 text-shadow-lg select-none">
          {city.country || 'Country Code Not Available'}
        </span>
      </div>
    </div>
  );
}
