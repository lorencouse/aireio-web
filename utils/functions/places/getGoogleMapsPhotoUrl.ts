const getGoogleMapsPhotoUrl = (ref: string | undefined) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    console.error('Google Maps API key is not set');
    return '';
  }
  if (!ref) {
    console.warn('Photo reference is undefined');
    return '';
  }
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${ref}&key=${apiKey}`;
};

export default getGoogleMapsPhotoUrl;
