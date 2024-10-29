'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { SubmitUserPlaceInfo } from '@/app/cities/[country]/[state]/[city]/[id]/actions';
import Link from 'next/link';
import formatPlaceName from '@/utils/functions/formatPlaceName';

export const getRatingColor = (index: number | null) => {
  switch (index) {
    case 0:
      return 'bg-red-600 ';
    case 1:
      return 'bg-red-500 ';
    case 2:
      return 'bg-orange-500 ';
    case 3:
      return 'bg-yellow-400 ';
    case 4:
      return 'bg-lime-500 ';
    case 5:
      return 'bg-green-500 ';
    default:
      return 'bg-foreground';
  }
};

export default function ContributionRating({
  name,
  value,
  placeId,
  date
}: {
  name: string;
  value: number | null;
  placeId: string;
  date: string;
}) {
  // Initialize buttonValue based on the most common value in value_distribution
  const [buttonValue, setButtonValue] = useState<number | null>(value);
  const [error, setError] = useState<string | null>(null);
  const [isAuthError, setIsAuthError] = useState(false);

  const buttonVals = ['X', '1', '2', '3', '4', '5'];

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

  const formattedTitle = formatPlaceName(name);
  const title = formattedTitle.replace('Serves', '');

  return (
    <div className="flex flex-row flex-wrap items-center gap-4 py-2 ">
      <p>
        <Popover>
          <PopoverTrigger asChild>
            <span
              className={`ml-2 cursor-pointer px-3 rounded text-white py-2 hover:opacity-70 ${getRatingColor(buttonValue)} `}
            >
              {value}
            </span>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-4 max-w-[90vw]">
            <h3 className="font-bold text-lg mb-4">
              Rate {title} at this location:
            </h3>

            <div className="flex flex-row flex-wrap gap-2 justify-center">
              {buttonVals.map((val, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => handleClick(index)}
                  className={`text-lg text-white min-w-[40px] p-2 hover:scale-105 ${
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
            {date && (
              <p className="text-sm text-gray-500 mt-2">Last updated: {date}</p>
            )}
          </PopoverContent>
        </Popover>
      </p>
    </div>
  );
}
