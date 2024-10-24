'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { SubmitUserPlaceInfo } from '../actions';
import Link from 'next/link';

const getRatingColor = (index: number | null) => {
  switch (index) {
    case 0:
      return 'bg-black ';
    case 1:
      return 'bg-red-500 ';
    case 2:
      return 'bg-orange-500 ';
    case 3:
      return 'bg-yellow-500 ';
    case 4:
      return 'bg-lime-500 ';
    case 5:
      return 'bg-green-500 ';
    default:
      return '';
  }
};

export default function Amenity({
  name,
  value,
  placeId
}: {
  name: string;
  value: boolean | null;
  placeId: string;
}) {
  const [buttonValue, setButtonValue] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAuthError, setIsAuthError] = useState(false);

  const buttonVals = ['None', '1', '2', '3', '4', '5'];

  const handleClick = async (index: number) => {
    try {
      const { success, error, authError } = await SubmitUserPlaceInfo(
        placeId,
        name,
        index.toString()
      );

      if (success) {
        setButtonValue(index);
        setError('Success!');
        setIsAuthError(false);
      } else {
        setError(error || 'Failed to submit data');
        setIsAuthError(!!authError);
      }
    } catch (err) {
      setError('An error occurred');
    }
  };

  const title = name.replace('Serves', '');

  return (
    <div className="flex flex-row flex-wrap items-center gap-4 mb-2">
      <p>
        <span className="font-bold">{title}:</span>
        <Popover>
          <PopoverTrigger asChild>
            <span
              className={`ml-2 cursor-pointer hover:opacity-70 ${getRatingColor(buttonValue)}`}
            >
              {value
                ? '✅'
                : value === false
                  ? '❌'
                  : buttonValue
                    ? buttonVals[buttonValue]
                    : 'Add➕'}
            </span>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-5">
            <h3 className="font-bold text-lg mb-5">
              Rate {title} at this location
            </h3>

            <div className="flex flex-row flex-wrap gap-2">
              {buttonVals.map((val, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => handleClick(index)}
                  className={`text-lg text-white p-3 hover:scale-105 ${
                    buttonValue === index ? 'ring-2 ring-offset-2' : ''
                  } 
  ${getRatingColor(index)}`}
                >
                  {val}
                </Button>
              ))}
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            {isAuthError && (
              <p className="mt-2">
                Please{' '}
                <Link href="/signin" className="underline">
                  Log in
                </Link>{' '}
                to submit details
              </p>
            )}
          </PopoverContent>
        </Popover>
      </p>
    </div>
  );
}
