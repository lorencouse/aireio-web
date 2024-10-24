import LoadingGrid from '@/components/general/loading-grid';
import CityList from '@/app/_components/city-list';
import { City } from '@/utils/types';
import HomeHero from '@/app/_components/home-hero';
import CountryList from './_components/country-list';
import formatPlaceName from '@/utils/functions/formatPlaceName';
import DynamicBreadcrumb from '@/components/general/dynamic-breadcrumb';

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
      <DynamicBreadcrumb />
      <HomeHero heading={`Find Work Spaces in ${countryName}`} />
      <div className="flex flex-col items-center ">
        {cities.length === 0 ? (
          <LoadingGrid />
        ) : (
          <CityList cities={cities} heading={`Top Cities in ${countryName}`} />
        )}
      </div>

      <CountryList countries={countries} currentCountry={currentCountry} />
    </div>
  );
}
