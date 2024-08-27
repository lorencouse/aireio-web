import React from 'react';

const RadiusSlider = ({ radius, onChange }) => {
  return (
    <div className='flex flex-col items-center space-y-2'>
      <label
        htmlFor='radius-slider'
        className='text-sm font-medium text-gray-700'
      >
        Radius: {radius / 1000} km
      </label>
      <input
        id='radius-slider'
        type='range'
        min='500'
        max='15000'
        step='500'
        value={radius}
        onChange={(e) => onChange(Number(e.target.value))}
        className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer'
      />
      <div className='w-full flex justify-between text-xs text-gray-600'>
        <span>0.5km</span>
        <span>15km</span>
      </div>
    </div>
  );
};

export default RadiusSlider;
