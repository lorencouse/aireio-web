import Image from 'next/image';
import { placeholderImage } from '@/utils/constants';
import { getSupabaseCityPhotoUrl } from '@/utils/functions/cities/getSupabaseCityPhotoUrl';

interface CityHeroProps {
  city: string;
  state: string;
  country: string;
  countryCode: string;
}

export default function CityHero({
  city,
  state,
  country,
  countryCode
}: CityHeroProps) {
  const imageUrl = getSupabaseCityPhotoUrl(city, state, countryCode);
  return (
    <div className="relative w-full md:h-[50vh] min-h-[250px]">
      <Image
        src={imageUrl || placeholderImage}
        alt={`${city || 'City'}, ${country || 'Country'} cityscape`}
        fill
        style={{ objectFit: 'cover' }}
        loading="lazy"
        placeholder="blur"
        blurDataURL="/images/logo.png"
      />
      <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center gap-6">
        <h1 className="text-white text-4xl md:text-6xl font-bold text-center px-4 text-shadow-lg select-none">
          {city.replace('-', ' ') || 'City Name Not Available'}
        </h1>
        <span className="text-white text-xl md:text-2xl font-bold text-center px-4 text-shadow-lg select-none">
          {country || 'Country Code Not Available'}
        </span>
      </div>
    </div>
  );
}
