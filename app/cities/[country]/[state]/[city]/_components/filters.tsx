import React from 'react';
import SegmentedTypePicker from './segmented-type-picker';
import SortMethod from './sort-method';
import SortOrderPicker from './sort-order-picker';
import { ReadonlyURLSearchParams } from 'next/navigation';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { SlidersHorizontal } from 'lucide-react';

const Filters = ({
  searchParams
}: {
  searchParams: ReadonlyURLSearchParams | null;
}) => {
  return (
    <div className="city-filters w-full">
      <Accordion type="single" collapsible className="w-full ">
        <AccordionItem
          value="filters"
          className="flex flex-row flex-wrap w-full "
        >
          <AccordionTrigger className="text-lg font-bold px-4  justify-start gap-4">
            <SlidersHorizontal />
            Filter by:
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-row flex-wrap pt-2 px-4 gap-4 justify-center">
              <SegmentedTypePicker searchParams={searchParams} />

              <SortMethod searchParams={searchParams} />

              <SortOrderPicker searchParams={searchParams} />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Filters;
