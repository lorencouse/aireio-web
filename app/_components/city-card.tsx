import Image from 'next/image';
import { Avatar, AvatarFallback } from '@/components/ui/avatar'; // Adjust this import based on your project structure
import Link from 'next/link';
import { getSupabaseCityPhotoUrl } from '@/utils/functions/cities/getSupabaseCityPhotoUrl';

interface CityCardProps {
  city: City;
}

const CityCard: React.FC<CityCardProps> = ({ city }) => {
  const imageUrl = getSupabaseCityPhotoUrl(
    city.name,
    city.state,
    city.country_code
  );
  const cityName = city.name.replace(/-/g, ' ');
  return (
    <Link href={`/cities/${city.country_code}/${city.state}/${city.name}`}>
      <div className="relative w-96 h-64 cursor-pointer rounded-lg overflow-hidden shadow-md m-4 hover:scale-105 duration-200">
        {imageUrl ? (
          <Image
            src={imageUrl || '/images/logo.png'}
            alt={`${cityName} cityscape`}
            fill
            sizes="(max-width: 768px) 100vw, 384px"
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <Avatar className="w-24 h-24">
            <AvatarFallback>{cityName[0]}</AvatarFallback>
          </Avatar>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center flex-col">
          <h3 className="text-white text-4xl font-bold text-center text-shadow select-none mb-1">
            {cityName}
          </h3>
          <h4 className="text-white text-lg font-bold text-center text-shadow select-none">
            {city.country}
          </h4>
        </div>
      </div>
    </Link>
  );
};

export default CityCard;
