import React from 'react';

const PriceLevel = ({
  priceLevel,
  primaryColor,
  secondaryColor
}: {
  priceLevel: number;
  primaryColor: string;
  secondaryColor: string;
}) => {
  const maxLevel = 4;

  if (priceLevel === undefined || priceLevel === null) {
    return <span className={secondaryColor}>?</span>;
  }

  return (
    <div className="flex">
      {[...Array(maxLevel)].map((_, index) => (
        <span
          key={index}
          className={`${index < priceLevel ? primaryColor : secondaryColor}`}
        >
          $
        </span>
      ))}
    </div>
  );
};

export default PriceLevel;
