import { Briefcase, Coffee, Library } from 'lucide-react';
import React from 'react';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import Link from 'next/link';
import updateUrlQuery  from '@/utils/updateUrlQuery';


interface SegmentedTypePickerProps {
  searchParams: { [key: string]: string | string[] | undefined };

}

export default function SegmentedTypePicker({
  searchParams

}: SegmentedTypePickerProps) {
  const placeTypes = [
    { value: 'cafe', icon: Coffee, label: 'Cafe' },
    { value: 'library', icon: Library, label: 'Library' },
    { value: 'coworking', icon: Briefcase, label: 'Coworking' },
  ];
  const placeType = (searchParams.place_type as string) || 'cafe';


  return (
    <Tabs value={placeType} className="w-full my-6">
      <TabsList className="grid w-full grid-cols-3">
        {placeTypes.map(({ value, icon: Icon, label }) => (
          <Link
            key={value}
            href={`?${updateUrlQuery('place_type', value, searchParams)}`}
            passHref
            replace
          >
            <TabsTrigger
              value={value}
              className="flex items-center justify-center"
            >
              <Icon className="mr-2 h-4 w-4" />
              {label}
            </TabsTrigger>
          </Link>
        ))}
      </TabsList>
    </Tabs>
  );
}
