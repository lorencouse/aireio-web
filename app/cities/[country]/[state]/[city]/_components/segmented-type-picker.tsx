'use client';

import React, { useState } from 'react';

import { Briefcase, Coffee, Library } from 'lucide-react';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import useUpdateUrlQuery from '@/utils/hook/useUpdateUrlQuery';
import { ReadonlyURLSearchParams } from 'next/navigation';

interface SegmentedTypePickerProps {
  searchParams: ReadonlyURLSearchParams | null;
}

export default function SegmentedTypePicker({
  searchParams
}: SegmentedTypePickerProps) {
  const placeTypes = [
    { value: 'cafe', icon: Coffee, label: 'Cafe' },
    { value: 'library', icon: Library, label: 'Library' },
    { value: 'coworking', icon: Briefcase, label: 'Cowork' }
  ];
  const placeTypeParams = searchParams?.get('place_type') || 'cafe';
  const [placeType, setPlaceType] = useState(placeTypeParams);

  const { updateUrlQuery } = useUpdateUrlQuery();

  const handlePlaceTypeChange = (value: string) => {
    setPlaceType(value);
    updateUrlQuery('place_type', value);
  };

  return (
    <Tabs value={placeType} className="min-w-96 my-6">
      <TabsList className="grid w-full grid-cols-3 items-center">
        {placeTypes.map(({ value, icon: Icon, label }) => (
          <TabsTrigger
            value={value}
            className="flex items-center justify-center"
            onClick={() => handlePlaceTypeChange(value)}
            key={value}
          >
            <Icon className="mr-2 h-4 w-4" />
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
