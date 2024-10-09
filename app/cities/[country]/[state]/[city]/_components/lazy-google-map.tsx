// LazyGoogleMap.tsx
import dynamic from 'next/dynamic';
import { ReadonlyURLSearchParams } from 'next/navigation';

const GoogleMap = dynamic(() => import('./google-map'), {
  loading: () => <div>Loading map...</div>,
  ssr: false // This component only renders client-side
});

interface LazyGoogleMapProps {
  searchParams: ReadonlyURLSearchParams;
  lat: string;
  lng: string;
}

const LazyGoogleMap: React.FC<LazyGoogleMapProps> = ({
  searchParams,
  lat,
  lng
}) => {
  return <GoogleMap searchParams={searchParams} lat={lat} lng={lng} />;
};

export default LazyGoogleMap;
