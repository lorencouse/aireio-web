import { Dispatch, SetStateAction } from 'react';
import React, { useState } from 'react';

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

interface SortOrderPickerProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const SortOrderPicker: React.FC<SortOrderPickerProps> = ({ searchParams }) => {
  const sortOrders = ['asc', 'des'];
  const sortOrderParams = (searchParams.sort_order as string) || 'asc';
  const [sortOrder, setSortOrder] = useState(sortOrderParams);
  const { updateUrlQuery } = useUpdateUrlQuery();

  const handleSortOrderChange = (value: string) => {
    updateUrlQuery('sort_order', value, searchParams);
    setSortOrder(value);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="capitalize">
          {`Order: ${sortOrder}`}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Sort Order</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={sortOrder}>
          {sortOrders.map((order) => (
            // <Link
            //   key={order}
            //   href={`?${updateUrlQuery('sort_order', order, searchParams)}`}
            //   passHref
            //   replace
            //   scroll={false}
            // >
            <DropdownMenuRadioItem
              value={order}
              className="capitalize"
              key={order}
              onClick={() => handleSortOrderChange(order)}
            >
              {order}
            </DropdownMenuRadioItem>
            // </Link>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SortOrderPicker;
