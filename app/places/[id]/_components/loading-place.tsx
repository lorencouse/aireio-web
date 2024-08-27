import React from 'react';

import { Skeleton } from '@/components/ui/skeleton';

const LoadingPlace = () => {
  return (
    <div className='w-full'>
      <Skeleton className='h-[350px] w-full m-4' />
      <div className='space-y-2'>
        <Skeleton className='h-4 w-96' />
        <Skeleton className='h-4 w-72' />
        <Skeleton className='h-4 w-64' />
      </div>
    </div>
  );
};

export default LoadingPlace;
