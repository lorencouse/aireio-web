import React from 'react';

export const EmojiAmenity = ({
  emoji,
  value
}: {
  emoji: string;
  value: boolean;
}) => {
  if (!value) {
    return null;
  }

  return (
    <span >
      <span className="text-2xl">{emoji} :</span>
      <span className="ml-2">
        {value === true ? '✅' : value === false ? '❌' : '🤔'}
      </span>
    </span>
  );
};
