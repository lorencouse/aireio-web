import React from 'react';

const EmojiAmenity = ({ emoji, value }: { emoji: string; value: boolean }) => {
  if (!value) {
    return null;
  }

  return (
    <span className="bg-gray-100 p-2 rounded-3xl">
      <span className="text-2xl">{emoji}</span>
      <span className="ml-2">
        {value === true ? '✅' : value === false ? '❌' : '🤔'}
      </span>
    </span>
  );
};

const EmojiAmenities = ({ place }: { place: Place }) => {
  return (
    <div className="flex gap-8 mt-4">
      <EmojiAmenity emoji="🛜" value={place.internet_access} />
      <EmojiAmenity emoji="🚽" value={place.toilet} />
      <EmojiAmenity emoji="♿︎" value={place.wheelchair_accessible} />
      <EmojiAmenity emoji="🔌" value={place.power_outlets} />
      <EmojiAmenity emoji="🅿️🚗" value={place.parking} />
      {(place.type === 'cafe' || place.type === 'restaurant') && (
        <>
          <EmojiAmenity emoji="🍻" value={place.serves_beer} />
          <EmojiAmenity emoji="🍷" value={place.serves_wine} />
          <EmojiAmenity emoji="🍳" value={place.serves_breakfast} />
          <EmojiAmenity emoji="🥞" value={place.serves_brunch} />
          <EmojiAmenity emoji="🥪" value={place.serves_lunch} />
          <EmojiAmenity emoji="🍽️" value={place.serves_dinner} />
          <EmojiAmenity emoji="🪑" value={place.indoor_seating} />
          <EmojiAmenity emoji="☀️" value={place.outdoor_seating} />
        </>
      )}
    </div>
  );
};

export default EmojiAmenities;
