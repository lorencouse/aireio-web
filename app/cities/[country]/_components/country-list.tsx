import Link from 'next/link';
import formatPlaceName from '@/utils/functions/formatPlaceName';

const CountryList = ({
  countries,
  currentCountry,
  heading
}: {
  countries: { country: string; country_code: string }[];
  currentCountry: string;
  heading?: string;
}) => {
  const CountryList = countries.filter(
    (country) => country.country !== currentCountry
  );

  const title = heading ? heading : 'Explore More Countries';

  return (
    <div className="countries">
      <div className="flex flex-row flex-wrap gap-4 mx-4">
        <h3 className="md:text-2xl text-xl w-full font-bold select-none md:py-8 py-6 mt-6 text-center border-y">
          {title}
        </h3>
        {CountryList.map((c) => (
          <Link
            key={c.country_code}
            href={`/cities/${encodeURIComponent(c.country_code)}`}
            className="block"
          >
            <div className="country bg-background text-foreground shadow-md rounded-lg p-2 hover:shadow-lg hover:scale-105 transition-shadow duration-300 cursor-pointer">
              <span className="text-2xl mr-2">
                {getCountryFlagEmoji(c.country_code)}
              </span>
              <span className="font-semibold">
                {formatPlaceName(c.country) || c.country}
              </span>
            </div>
          </Link>
        ))}
        {currentCountry !== '' && (
          <Link key="all" href={'/'} className="block">
            <div className="country bg-background text-foreground shadow-md rounded-lg p-2 hover:shadow-lg hover:scale-105 transition-shadow duration-300 cursor-pointer">
              <span className="text-2xl mr-2">🌐</span>
              <span className="font-semibold">World</span>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};

export const getCountryFlagEmoji = (countryCode: string) => {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

export default CountryList;
