import React from 'react';

const StyledTitle: React.FC = () => {
  return (
    <span className="font-bold">
      ai
      <span style={{ textDecoration: 'overline' }}>re</span>
      io
      <span style={{ fontSize: '0.7em', verticalAlign: 'super' }}>™</span>
    </span>
  );
};

export default StyledTitle;
