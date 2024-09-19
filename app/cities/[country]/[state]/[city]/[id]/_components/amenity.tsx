'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';

export default function Amenity({
  name,
  value
}: {
  name: string;
  value: boolean;
}) {
  const [buttonValue, setButtonValue] = useState<boolean | null>(null);

  return (
    <div className="seating flex flex-row items-center gap-4 mb-2">
      <p>
        <span className="font-bold">{name}:</span>
        <Popover>
          <PopoverTrigger asChild>
            <span className="ml-2 underline cursor-pointer">
              {value === true
                ? 'Yes'
                : value === false
                  ? 'No'
                  : 'Not specified'}
            </span>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-5">
            <p>
              <span className="font-bold">{name}</span> at this location
            </p>
            <div className="flex items-center space-x-2 p-2">
              <Button
                variant={buttonValue === true ? 'default' : 'outline'}
                size="icon"
                onClick={() => {
                  buttonValue === true
                    ? setButtonValue(null)
                    : setButtonValue(true);
                }}
              >
                <span
                  className={
                    buttonValue === true ? 'text-white' : 'text-gray-500'
                  }
                >
                  Yes
                </span>
              </Button>
              <Button
                variant={buttonValue === false ? 'default' : 'outline'}
                size="icon"
                onClick={() => {
                  buttonValue === false
                    ? setButtonValue(null)
                    : setButtonValue(false);
                }}
              >
                <span
                  className={
                    buttonValue === false ? 'text-white' : 'text-gray-500'
                  }
                >
                  No
                </span>
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </p>
    </div>
  );
}
