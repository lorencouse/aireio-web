import React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { getCountryFlagEmoji } from '@/app/cities/[country]/_components/country-list';

const CountryDropdownSelector = ({
  countries,
  selectedCountry,
  setCountry
}: {
  countries: { country: string; country_code: string }[];
  selectedCountry: string;
  setCountry: (value: string) => void;
}) => {
  return (
    <Select value={selectedCountry} onValueChange={setCountry}>
      <SelectTrigger className="w-[180px] capitalize">
        <SelectValue placeholder="All countries" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem key="all" value="all" className="capitalize">
            All Countries
          </SelectItem>
          {countries.map((country) => (
            <SelectItem
              key={country.country_code}
              value={country.country}
              className="capitalize"
            >
              {getCountryFlagEmoji(country.country_code)} {country.country}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default CountryDropdownSelector;
