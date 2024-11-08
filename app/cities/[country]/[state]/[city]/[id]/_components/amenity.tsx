'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { submitUserPlaceInfo } from '../actions';
import Link from 'next/link';
import { AmenityAggregation } from '@/utils/types';

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

export default function Amenity({
  name,
  value,
  placeId,
  aggregation
}: {
  name: string;
  value: boolean | null;
  placeId: string;
  aggregation?: AmenityAggregation;
}) {
  // Initialize buttonValue based on the most common value in value_distribution
  const [buttonValue, setButtonValue] = useState<number | null>(() => {
    if (aggregation?.value_distribution) {
      const distribution = aggregation.value_distribution as Record<
        string,
        number
      >;

      // Calculate weighted average
      let totalScore = 0;
      let totalCount = 0;

      Object.entries(distribution).forEach(([value, count]) => {
        totalScore += parseInt(value) * count;
        totalCount += count;
      });

      // Return rounded average if there are submissions, null otherwise
      return totalCount > 0 ? Math.round(totalScore / totalCount) : null;
    }
    return null;
  });
  const [error, setError] = useState<string | null>(null);
  const [isAuthError, setIsAuthError] = useState(false);

  const buttonVals = ['X', '1', '2', '3', '4', '5'];

  const handleClick = async (index: number) => {
    try {
      const { success, error, authError } = await submitUserPlaceInfo(
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
    <div className="flex flex-row flex-wrap items-center gap-4 py-2 ">
      <p>
        <span className="font-bold">{title}:</span>
        <Popover>
          <PopoverTrigger asChild>
            <span
              className={`ml-2 cursor-pointer px-3 rounded text-white py-2 hover:opacity-70 ${getRatingColor(buttonValue)} ${buttonValue !== null ? 'text-white ' : value ? ' bg-green-500' : value === false ? ' bg-red-600' : 'bg-muted-foreground'}`}
            >
              {buttonValue !== null
                ? `${buttonVals[buttonValue]}`
                : value
                  ? '✓'
                  : value === false
                    ? 'X'
                    : 'Add ✚'}
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
            {aggregation?.last_updated && (
              <p className="text-sm text-gray-500 mt-2">
                Last updated:{' '}
                {new Date(aggregation.last_updated).toLocaleDateString()}
              </p>
            )}
          </PopoverContent>
        </Popover>
      </p>
    </div>
  );
}
