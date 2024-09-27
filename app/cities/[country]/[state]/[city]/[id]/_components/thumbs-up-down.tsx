import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

const ThumbsUpDown = ({ initialValue = false, onChange }) => {
  const [value, setValue] = useState(initialValue);

  const handleClick = (newValue) => {
    setValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant={value ? 'default' : 'outline'}
        size="icon"
        onClick={() => handleClick(true)}
      >
        <ThumbsUp className={value ? 'text-white' : 'text-gray-500'} />
      </Button>
      <Button
        variant={!value ? 'default' : 'outline'}
        size="icon"
        onClick={() => handleClick(false)}
      >
        <ThumbsDown className={!value ? 'text-white' : 'text-gray-500'} />
      </Button>
    </div>
  );
};

export default ThumbsUpDown;
