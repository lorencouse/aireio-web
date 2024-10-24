'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { Toggle } from '@/components/ui/toggle';
import { Heart } from 'lucide-react';
import { toggleFavorite, getFavoriteStatus } from '../actions';
import { useToast } from '@/hooks/use-toast';

interface FavoriteToggleProps {
  placeId: string;
}

const FavoriteToggle = ({ placeId }: FavoriteToggleProps) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      const { favorited, error, authError } = await getFavoriteStatus(placeId);

      if (authError) {
        // Handle auth error (e.g., redirect to login)
        return;
      }

      if (!error) {
        setIsFavorited(favorited);
      }
    };

    checkFavoriteStatus();
  }, [placeId]);

  const handleToggle = async (pressed: boolean) => {
    const previousState = isFavorited;

    // Optimistic update
    setIsFavorited(pressed);

    startTransition(async () => {
      try {
        const result = await toggleFavorite(placeId, pressed);

        if (result.success) {
          toast({
            title: isFavorited
              ? 'Removed from favorites'
              : 'Added to favorites',
            duration: 2000
          });
        } else {
          if (result.authError) {
            toast({
              title: 'Please sign in to add to favorites',
              duration: 2000
            });
          } else {
            throw new Error(result.error);
          }
          // Revert on error
          setIsFavorited(previousState);
        }
      } catch (error) {
        console.error('Error toggling favorite:', error);
        toast({
          title: 'Error',
          description: 'Failed to update',
          variant: 'destructive'
        });
        // Revert on error
        setIsFavorited(previousState);
      }
    });
  };

  return (
    <Toggle
      pressed={isFavorited}
      onPressedChange={handleToggle}
      disabled={isPending}
      aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
      className="hover:bg-rose-100 hover:scale-105 hover:-translate-y-1 data-[state=on]:bg-rose-200 data-[state=off]:bg-muted data-[state=on]:text-rose-600 disabled:opacity-50 rounded-full"
    >
      <Heart
        className={`h-4 w-4 ${
          isFavorited ? 'fill-rose-600 text-rose-600' : 'text-slate-600'
        } ${isPending ? 'opacity-50' : ''} mr-2`}
      />
      {isFavorited ? 'In Favorites' : 'Add to Favorites'}
    </Toggle>
  );
};

export default FavoriteToggle;
