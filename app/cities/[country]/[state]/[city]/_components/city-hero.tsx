// app/places/_components/CityHero.tsx
import Image from 'next/image';
import { getCityPhoto } from '@/utils/functions/cities/getCityPhoto';

interface CityHeroProps {
  cityId: string;
}

export default async function CityHero({ cityId }: CityHeroProps) {
  const { imageUrl, cityName, countryCode } = await getCityPhoto(cityId);

  return (
    <div className="relative w-full h-[50vh] min-h-[400px]">
      <Image
        src={imageUrl || '/images/logo.png'}
        alt={`${cityName || 'City'} cityscape`}
        fill
        style={{ objectFit: 'cover' }}
        priority
      />
      <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center gap-6">
        <h1 className="text-white text-4xl md:text-6xl font-bold text-center px-4 text-shadow-lg select-none">
          {cityName || 'City Name Not Available'}
        </h1>
        <span className="text-white text-xl md:text-2xl font-bold text-center px-4 text-shadow-lg select-none">
          {countryCode || 'Country Code Not Available'}
        </span>
      </div>
    </div>
  );
}
