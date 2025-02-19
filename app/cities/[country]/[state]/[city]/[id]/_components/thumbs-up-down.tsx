'use client';

import { ThumbsDown, ThumbsUp } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getLikeStatus } from '../actions';
import { PlaceLike } from '@/utils/types';
import { updateLike } from '../actions';
import { useEffect } from 'react';
import { getUser } from '@/utils/supabase/queries';
import { set } from 'react-hook-form';

type ThumbsUpDownProps = {
  onToggle?: (newState: 'like' | 'dislike' | null) => void;
  className?: string;
  likes?: PlaceLike[];
  placeId: string;
};

const ThumbsUpDown: React.FC<ThumbsUpDownProps> = ({
  onToggle,
  className,
  likes,
  placeId
}) => {
  const [selectedThumb, setSelectedThumb] = useState<'like' | 'dislike' | null>(
    null
  );
  const [likeCount, setLikeCount] = useState<number>(0);
  const [dislikeCount, setDislikeCount] = useState<number>(0);

  const handleThumbsButton = async (buttonType: 'like' | 'dislike' | null) => {
    const oldState = selectedThumb;
    const newState = selectedThumb === buttonType ? null : buttonType;

    // Store old counts to revert if needed
    const oldLikeCount = likeCount;
    const oldDislikeCount = dislikeCount;

    // Update counts based on the state changes
    if (oldState === 'like') {
      setLikeCount((prev) => prev - 1);
    } else if (oldState === 'dislike') {
      setDislikeCount((prev) => prev - 1);
    }

    if (newState === 'like') {
      setLikeCount((prev) => prev + 1);
    } else if (newState === 'dislike') {
      setDislikeCount((prev) => prev + 1);
    }

    try {
      setSelectedThumb(newState);
      if (onToggle) onToggle(newState);

      const result = await updateLike(placeId, newState);
      if (!result.success) {
        // Revert on failure or auth error
        setSelectedThumb(oldState);
        if (onToggle) onToggle(oldState);
        // Revert counts
        setLikeCount(oldLikeCount);
        setDislikeCount(oldDislikeCount);
      }
    } catch (error) {
      // Revert on any unexpected errors
      setSelectedThumb(oldState);
      if (onToggle) onToggle(oldState);
      // Revert counts
      setLikeCount(oldLikeCount);
      setDislikeCount(oldDislikeCount);
    }
  };

  useEffect(() => {
    if (likes) {
      let lCount = 0;
      let dislCount = 0;
      likes.forEach((like) => {
        if (like.is_like) {
          lCount++;
        } else {
          dislCount++;
        }
      });
      setLikeCount(lCount);
      setDislikeCount(dislCount);
      const checkLikeStatus = async () => {
        const { status } = await getLikeStatus(likes);
        setSelectedThumb(status);
      };

      checkLikeStatus();
    }
  }, [placeId]);

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="text-sm text-muted-foreground">Recommend:</span>

      <Button
        variant="ghost"
        size="sm"
        className={cn(
          'rounded-full p-2 hover:bg-green-50',
          selectedThumb === 'like' &&
            'bg-green-100 text-green-700 hover:bg-green-200 hover:text-green-800'
        )}
        onClick={() => handleThumbsButton('like')}
        aria-label="Thumbs up"
      >
        <ThumbsUp
          className={cn(
            'h-5 w-5',
            selectedThumb === 'like' ? 'fill-green-500' : ''
          )}
        />
      </Button>
      {likeCount}
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          'rounded-full p-2 hover:bg-red-50',
          selectedThumb === 'dislike' &&
            'bg-red-100 text-red-700 hover:bg-red-200 hover:text-red-800'
        )}
        onClick={() => handleThumbsButton('dislike')}
        aria-label="Thumbs down"
      >
        <ThumbsDown
          className={cn(
            'h-5 w-5',
            selectedThumb === 'dislike' ? 'fill-red-500' : ''
          )}
        />
      </Button>
      {dislikeCount}
    </div>
  );
};

export default ThumbsUpDown;
