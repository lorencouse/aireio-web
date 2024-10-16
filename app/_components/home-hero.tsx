import Image from 'next/image';
import GooglePlacesAutocomplete from './google-places-search-autocomplete';

const HomeHero = () => {
  return (
    <div className="relative w-full h-[500px]">
      <Image
        src="/images/aireio-find-new-cities.jpg"
        alt="Aireio - Find new cities"
        fill
        style={{ objectFit: 'cover' }}
        quality={100}
      />
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      <div className="relative z-2 flex flex-col justify-center items-center w-full h-full">
        <h1 className="text-4xl font-bold mb-8 text-white select-none">
          Find Your Work Space
        </h1>
        <div className="w-full max-w-md px-4">
          <GooglePlacesAutocomplete />
        </div>
      </div>
    </div>
  );
};

export default HomeHero;
