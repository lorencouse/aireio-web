import Image from 'next/image';
import GooglePlacesAutocomplete from './google-places-search-autocomplete';

const HomeHero = ({ heading }: { heading: string }) => {
  return (
    <div className="relative w-full md:h-[500px] h-[300px] md:rounded-t-2xl">
      <Image
        src="/images/aireio-find-new-cities.jpg"
        alt="Aireio - Find new cities"
        fill
        style={{ objectFit: 'cover' }}
        quality={100}
        className="md:rounded-2xl"
      />
      <div className="absolute inset-0" />
      <div className="relative z-2 flex flex-col justify-center items-center w-full h-full ">
        <h1 className="md:text-4xl text-2xl font-bold mb-8 text-white select-none drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
          {heading}
        </h1>
        <div className="w-full max-w-md px-4">
          <GooglePlacesAutocomplete />
        </div>
      </div>
    </div>
  );
};

export default HomeHero;
