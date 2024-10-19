import LoadingGrid from '@/components/general/loading-grid';
import CityList from '@/app/_components/city-list';
import { City } from '@/utils/types';
import HomeHero from '@/app/_components/home-hero';
import CountryList from './_country/country-list';
import formatPlaceName from '@/utils/functions/formatePlaceName';

type Country = {
  country: string;
  country_code: string;
};

export default function CountryPageLayout({
  cities,
  countries
}: {
  cities: City[];
  countries: Country[];
}) {
  const currentCountry = cities[0].country ? cities[0].country : '';
  const countryName = formatPlaceName(currentCountry) || 'the Country';

  return (
    <div className="state-page">
      <HomeHero heading={`Find Work Spaces in ${countryName}`} />
      <div className="flex flex-col items-center mt-4 ">
        <h2 className="md:text-3xl text-2xl">Top Cities in {countryName}</h2>
        {cities.length === 0 ? <LoadingGrid /> : <CityList cities={cities} />}
      </div>

      <CountryList countries={countries} currentCountry={currentCountry} />
    </div>
  );
}
