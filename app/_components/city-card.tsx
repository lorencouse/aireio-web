import Image from 'next/image';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';
import { getSupabaseCityPhotoUrl } from '@/utils/functions/cities/getSupabaseCityPhotoUrl';
import { City } from '@/utils/types';

interface CityCardProps {
  city: City;
}

const CityCard: React.FC<CityCardProps> = ({ city }) => {
  const imageUrl = getSupabaseCityPhotoUrl(
    city.name ?? '',
    city.state ?? '',
    city.country_code ?? ''
  );
  const cityName = city.name?.replace(/-/g, ' ') ?? '';
  const countryName = city.country?.replace(/-/g, ' ') ?? '';

  return (
    <Link href={`/cities/${city.country_code}/${city.state}/${city.name}`}>
      <div className="relative md:w-72 sm:w-64 xs:w-52 w-44 md:h-52 sm:h-44 h-36 cursor-pointer rounded-lg overflow-hidden shadow-md md:m-4 hover:scale-105 duration-200">
        {imageUrl ? (
          <Image
            src={imageUrl || '/images/logo.png'}
            alt={`${cityName} cityscape`}
            fill
            sizes="(max-width: 768px) 100vw, 384px"
            style={{ objectFit: 'cover' }}
            loading="lazy"
            placeholder="blur"
            blurDataURL="/images/logo.png"
          />
        ) : (
          <Avatar className="w-24 h-24">
            <AvatarFallback>{cityName[0]}</AvatarFallback>
          </Avatar>
        )}
        <div className="absolute inset-0 flex items-center justify-center flex-col p-2">
          <h3 className="text-white capitalize font-bold text-center select-none mb-1 whitespace-nowrap overflow-hidden text-ellipsis w-full text-responsive drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
            {cityName}
          </h3>
          <h4 className="text-white capitalize font-bold text-center select-none whitespace-nowrap overflow-hidden text-ellipsis w-full text-responsive-small drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
            {countryName}
          </h4>
        </div>
      </div>
    </Link>
  );
};

export default CityCard;
