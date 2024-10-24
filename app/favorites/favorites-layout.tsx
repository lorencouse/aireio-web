'use client';

import LoadingGrid from '@/components/general/loading-grid';
import { Place, City } from '@/utils/types';
import CountryList from '@/app/cities/[country]/_components/country-list';
import PlacesList from '@/app/cities/[country]/[state]/[city]/_components/places-list';
import CityList from '../_components/city-list';
import { useEffect, useState } from 'react';
import CountryDropdownSelector from './_components/country-dropdown';
import CityDropdownSelector from './_components/city-drowdown';
import LoadingPlace from '../cities/[country]/[state]/[city]/[id]/_components/loading-place';

export type CityDropdownObject = {
  city: string;
  country: string;
};

export default function FavoritesLayout({
  places,
  cities,
  countries
}: {
  places: Place[];
  cities: City[];
  countries: { country: string; country_code: string }[];
}) {
  const initialCityNames: CityDropdownObject[] = cities
    ? cities.map((city) => ({
        city: city.name ? city.name : '',
        country: city.country ? city.country : ''
      }))
    : [];

  const [filteredPlaces, setFilteredPlaces] = useState(places);
  const [country, setCountry] = useState('');
  const [cityNames, setCityNames] =
    useState<CityDropdownObject[]>(initialCityNames);
  const [selectedCity, setSelectedCity] = useState<CityDropdownObject>({
    city: '',
    country: ''
  });
  const [isLoadingPlace, setIsLoadingPlace] = useState(false);

  // Update available cities when country changes
  useEffect(() => {
    if (country === 'all' || !country) {
      // If no country is selected, show all cities
      setCityNames(initialCityNames);
    } else {
      // Filter cities for selected country
      setCityNames(initialCityNames.filter((city) => city.country === country));
    }

    // Reset city selection when country changes manually
    // Only reset if the country change wasn't triggered by city selection
    if (country !== selectedCity.country) {
      setSelectedCity({ city: '', country: '' });
    }
  }, [country]);

  // Update filtered places when either country or city changes
  useEffect(() => {
    let filtered = places;

    // First filter by country if selected
    if (country && country !== 'all') {
      filtered = filtered.filter((place) => place.country === country);
    }

    // Then filter by city if selected
    if (selectedCity.city && selectedCity.city !== 'all') {
      filtered = filtered.filter((place) => place.city === selectedCity.city);
    }

    setFilteredPlaces(filtered);
  }, [country, selectedCity]);

  // Handle country selection
  const handleCountryChange = (newCountry: string) => {
    setCountry(newCountry);
  };

  // Handle city selection
  const handleCityChange = (newCity: CityDropdownObject) => {
    setSelectedCity(newCity);
    setCountry(newCity.country);
  };

  if (isLoadingPlace) return <LoadingPlace />;

  return (
    <div id="favorites">
      <h1 className="pt-4">Your Favorites</h1>
      <div className="flex flex-col items-center">
        <h3 className="text-2xl w-full font-bold select-none pl-8 mb-4 border-t-2 mt-6 pt-6 text-center">
          Favorite Places
        </h3>
        <div className="filters flex flex-row flex-wrap gap-3 items-center">
          <span className="text-bold">Show places in:</span>
          <CityDropdownSelector
            cities={cityNames}
            selectedCity={selectedCity}
            handleCityChange={handleCityChange}
          />
          <CountryDropdownSelector
            countries={countries}
            selectedCountry={country}
            setCountry={handleCountryChange}
          />
        </div>
        {places.length === 0 ? (
          <LoadingGrid />
        ) : (
          <PlacesList
            filteredPlaces={filteredPlaces}
            setIsLoadingPlace={setIsLoadingPlace}
          />
        )}
      </div>
      <CityList cities={cities} heading="Your Cities" />

      <CountryList
        countries={countries}
        currentCountry={country}
        heading="Your Countries"
      />
    </div>
  );
}
