// CityDropdownSelector component
import React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { CityDropdownObject } from '../favorites-layout';

const CityDropdownSelector = ({
  cities,
  selectedCity,
  handleCityChange
}: {
  cities: CityDropdownObject[];
  selectedCity: CityDropdownObject;
  handleCityChange: (newCity: CityDropdownObject) => void;
}) => {
  return (
    <Select
      value={selectedCity.city}
      onValueChange={(value) => {
        if (value === 'all') {
          handleCityChange({ city: 'all', country: 'all' });
        } else {
          const selectedCityObj = cities.find((c) => c.city === value);
          if (selectedCityObj) {
            handleCityChange(selectedCityObj);
          }
        }
      }}
    >
      <SelectTrigger className="w-[180px] capitalize">
        <SelectValue placeholder="All cities" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem key="all" value="all" className="capitalize">
            All Cities
          </SelectItem>
          {cities.map((city) => (
            <SelectItem
              key={city.city}
              value={city.city}
              className="capitalize"
            >
              {city.city}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default CityDropdownSelector;
