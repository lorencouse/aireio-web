'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import useUpdateUrlQuery from '@/utils/hook/useUpdateUrlQuery';

interface SortMethodProps {
  // sortMethod: string;
  searchParams: { [key: string]: string | string[] | undefined };
}

const SortMethod: React.FC<SortMethodProps> = ({
  // sortMethod,
  searchParams
}) => {
  const sortMethods = ['distance', 'rating', 'rating-count', 'price'];
  const sortMethodParams = searchParams.get('sort_method') || 'distance';

  const [sortMethod, setSortMethod] = useState(sortMethodParams);

  const { updateUrlQuery } = useUpdateUrlQuery();

  const handleSortMethodChange = (value: string) => {
    updateUrlQuery('sort_method', value, searchParams);
    setSortMethod(value);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="capitalize">
          {`Sort by: ${sortMethod}`}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Sort By</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={sortMethod}>
          {sortMethods.map((option) => (
            <DropdownMenuRadioItem
              value={option}
              className="capitalize"
              key={option}
              onClick={() => handleSortMethodChange(option)}
            >
              {option}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SortMethod;
