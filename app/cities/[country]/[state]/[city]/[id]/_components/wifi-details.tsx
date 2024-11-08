'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { submitUserPlaceInfo } from '../actions';
import { AmenityAggregation } from '@/utils/types';
import { ThumbsUp } from 'lucide-react';

export default function WifiDetails({
  placeId,
  wifiNetwork,
  wifiPassword
}: {
  placeId: string;
  wifiNetwork?: AmenityAggregation | null;
  wifiPassword?: AmenityAggregation | null;
}) {
  const [network, setNetwork] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [isAuthError, setIsAuthError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission default behavior

    try {
      // Submit network name
      const networkSubmission = await submitUserPlaceInfo(
        placeId,
        'wifi_network',
        network
      );

      // Submit password
      const passwordSubmission = await submitUserPlaceInfo(
        placeId,
        'wifi_password',
        password
      );

      if (networkSubmission.success && passwordSubmission.success) {
        setError('Success!');
        setIsAuthError(false);
        // Optionally clear the form
        setNetwork('');
        setPassword('');
      } else {
        setError(
          networkSubmission.error ||
            passwordSubmission.error ||
            'Failed to submit data'
        );
        setIsAuthError(
          !!(networkSubmission.authError || passwordSubmission.authError)
        );
      }
    } catch (err) {
      setError('An error occurred');
    }
  };

  return (
    <div className="flex flex-row flex-wrap items-center gap-4 py-2 ">
      <p>
        <span className="font-bold">Wifi Password:</span>
        <Popover>
          <PopoverTrigger asChild>
            <span className="ml-2 cursor-pointer px-3 rounded text-white py-2 hover:opacity-70 bg-muted-foreground">
              Add ✚
            </span>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-5 bg-background text-foreground">
            <div className="flex flex-col mb-3">
              {wifiNetwork?.value_distribution &&
                Object.entries(wifiNetwork.value_distribution).map(
                  ([networkName, count]) => (
                    <div key={network} className="flex items-center gap-2 mb-1">
                      <span className="font-bold">Network: </span>
                      {networkName}
                      <ThumbsUp
                        className="w-6 h-6 hover:scale-110"
                        onClick={() =>
                          submitUserPlaceInfo(
                            placeId,
                            'wifi_network',
                            networkName
                          )
                        }
                      />
                      ({count})
                    </div>
                  )
                )}
              {wifiPassword?.value_distribution &&
                Object.entries(wifiPassword.value_distribution).map(
                  ([pass, count]) => (
                    <div key={network} className="flex items-center gap-2 mb-1">
                      <span className="font-bold">Password: </span>
                      {pass}
                      <ThumbsUp
                        className="w-6 h-6 hover:scale-110"
                        onClick={() =>
                          submitUserPlaceInfo(placeId, 'wifi_password', pass)
                        }
                      />
                      ({count})
                    </div>
                  )
                )}
            </div>
            <form onSubmit={handleSubmit}>
              <p className="mb-4">
                <span className="font-bold">Add Wifi network and password</span>
              </p>
              <div className="flex flex-col items-center mb-4 gap-3">
                <Input
                  type="text"
                  placeholder={`Wifi network name`}
                  value={network}
                  onChange={(e) => setNetwork(e.target.value)}
                  className="flex-grow bg-background text-foreground border border-foreground rounded px-3 py-2"
                />
                <Input
                  type="text"
                  placeholder={`Wifi Password`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-grow bg-background text-foreground border border-foreground rounded px-3 py-2"
                />
              </div>
              <Button
                type="submit"
                disabled={!password}
                className="bg-foreground text-background"
              >
                Submit
              </Button>
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
            </form>
          </PopoverContent>
        </Popover>
      </p>
    </div>
  );
}
