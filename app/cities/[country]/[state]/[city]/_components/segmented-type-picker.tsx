'use client';

import React, { useState } from 'react';

import { Briefcase, Coffee, Library } from 'lucide-react';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import useUpdateUrlQuery from '@/utils/hook/useUpdateUrlQuery';

interface SegmentedTypePickerProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function SegmentedTypePicker({
  searchParams
}: SegmentedTypePickerProps) {
  const placeTypes = [
    { value: 'cafe', icon: Coffee, label: 'Cafe' },
    { value: 'library', icon: Library, label: 'Library' },
    { value: 'coworking', icon: Briefcase, label: 'Coworking' }
  ];
  const placeTypeParams = (searchParams.place_type as string) || 'cafe';
  const [placeType, setPlaceType] = useState(placeTypeParams);

  const { updateUrlQuery } = useUpdateUrlQuery();

  const handlePlaceTypeChange = (value: string) => {
    setPlaceType(value);
    updateUrlQuery('place_type', value, searchParams);
  };

  return (
    <Tabs value={placeType} className="w-full my-6">
      <TabsList className="grid w-full grid-cols-3">
        {placeTypes.map(({ value, icon: Icon, label }) => (
          <TabsTrigger
            value={value}
            className="flex items-center justify-center"
            onClick={() => handlePlaceTypeChange(value)}
          >
            <Icon className="mr-2 h-4 w-4" />
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
