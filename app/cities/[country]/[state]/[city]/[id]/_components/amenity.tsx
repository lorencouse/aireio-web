'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { SubmitUserPlaceData } from '../actions';
import Link from 'next/link';

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
  const [error, setError] = useState<string | null>(null);
  const [isAuthError, setIsAuthError] = useState(false);

  const handleClick = async (newValue: boolean) => {
    setButtonValue(newValue);
    const { success, error, authError } = await SubmitUserPlaceData(
      placeId,
      name,
      newValue
    );

    if (success) {
      setSubmitted(true);
      setError(null);
      setIsAuthError(false);
      setError('Success!');
    } else {
      setError(error || 'Failed to submit data');
      setIsAuthError(!!authError);
      if (authError) {
        // Optionally, you can redirect to login page here
        // router.push('/login')
      }
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
                onClick={() => handleClick(true)}
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
                onClick={() => handleClick(false)}
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
            {error && <p className="text-red-500 mt-2">{error}</p>}
            {isAuthError && (
              <p className="mt-2">
                Please <Link href="/signin">Log in</Link> to submit details
              </p>
            )}
          </PopoverContent>
        </Popover>
      </p>
    </div>
  );
}
