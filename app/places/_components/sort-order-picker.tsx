'use client';

import { Dispatch, SetStateAction } from 'react';
import React from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SortOrderPickerProps {
  descending: boolean;
  setDescending: Dispatch<SetStateAction<boolean>>;
}

const SortOrderPicker: React.FC<SortOrderPickerProps> = ({
  descending,
  setDescending,
}) => {
  const sortOrders = ['ascending', 'descending'];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' className='capitalize'>{`Order: ${
          descending ? 'Descending' : 'Ascending'
        }`}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56'>
        <DropdownMenuLabel>Sort Order</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={descending ? 'descending' : 'ascending'}
          onValueChange={(value) => setDescending(value === 'descending')}
        >
          {sortOrders.map((order) => (
            <DropdownMenuRadioItem
              key={order}
              value={order}
              className='capitalize'
            >
              {order}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SortOrderPicker;
