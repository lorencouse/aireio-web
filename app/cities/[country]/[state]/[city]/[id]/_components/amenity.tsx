'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { getUser } from '@/utils/supabase/queries';
import { SubmitUserPlaceData } from '../actions';

export default function Amenity({
  name,
  value,
  placeId
}: {
  name: string;
  value: boolean | null;
  placeId: string;
}) {
  const [buttonValue, setButtonValue] = useState<boolean | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleTrueClick = async () => {
    if (buttonValue === true) {
      setButtonValue(null);
    } else {
      setButtonValue(true);
      const success = await SubmitUserPlaceData(placeId, name, true);

      if (success) {
        setSubmitted(true);
      }
    }
  };

  const handleFalseClick = async () => {
    if (buttonValue === false) {
      setButtonValue(null);
    } else {
      setButtonValue(false);
      const success = await SubmitUserPlaceData(placeId, name, false);
    }
  };

  return (
    <div className="seating flex flex-row items-center gap-4 mb-2">
      <p>
        <span className="font-bold">{name}:</span>
        <Popover>
          <PopoverTrigger asChild>
            <span className="ml-2 underline cursor-pointer">
              {value === true ? 'Yes' : value === false ? 'No' : 'Add'}
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
                onClick={handleTrueClick}
                disabled={submitted}
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
                onClick={handleFalseClick}
                disabled={submitted}
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
