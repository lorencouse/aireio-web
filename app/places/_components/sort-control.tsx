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

interface SortControlProps {
  sortMethod: string;
  setSortMethod: Dispatch<SetStateAction<string>>;
}

const SortControl: React.FC<SortControlProps> = ({
  sortMethod,
  setSortMethod,
}) => {
  const sortMethods = ['distance', 'rating', 'rating-count', 'price'];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          className='capitalize'
        >{`Sort by: ${sortMethod}`}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56'>
        <DropdownMenuLabel>Sort By</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={sortMethod}
          onValueChange={setSortMethod}
        >
          {sortMethods.map((option) => (
            <DropdownMenuRadioItem
              key={option}
              value={option}
              className='capitalize'
            >
              {option}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SortControl;
