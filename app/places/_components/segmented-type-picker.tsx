import { Briefcase, Coffee, Library } from 'lucide-react';
import React from 'react';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SegmentedTypePickerProps {
  placeType: string;
  setPlaceType: (placeType: string) => void;
}

export default function SegmentedTypePicker({
  placeType,
  setPlaceType,
}: SegmentedTypePickerProps) {
  const types = [
    { value: 'cafe', icon: Coffee, label: 'Cafe' },
    { value: 'library', icon: Library, label: 'Library' },
    { value: 'coworking', icon: Briefcase, label: 'Coworking' },
  ];

  return (
    <Tabs
      value={placeType}
      defaultValue={types[0].value}
      onValueChange={setPlaceType}
      className='w-full my-6'
    >
      <TabsList className='grid w-full grid-cols-3'>
        {types.map(({ value, icon: Icon, label }) => (
          <TabsTrigger
            key={value}
            value={value}
            className='flex items-center justify-center'
          >
            <Icon className='mr-2 h-4 w-4' />
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
