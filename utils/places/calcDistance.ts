export default function calcDistance(
  mk1: { lat: number; lng: number },
  mk2: { lat: number; lng: number },
) {
  const R = 6371.071; // Radius of the Earth 3958.8 for miles, 6371.0710 for km
  const rlat1 = mk1.lat * (Math.PI / 180); // Convert degrees to radians
  const rlat2 = mk2.lat * (Math.PI / 180); // Convert degrees to radians
  const difflat = rlat2 - rlat1; // Radian difference (latitudes)
  const difflon = (mk2.lng - mk1.lng) * (Math.PI / 180); // Radian difference (longitudes)

  const d =
    2 *
    R *
    Math.asin(
      Math.sqrt(
        Math.sin(difflat / 2) * Math.sin(difflat / 2) +
          Math.cos(rlat1) *
            Math.cos(rlat2) *
            Math.sin(difflon / 2) *
            Math.sin(difflon / 2),
      ),
    );
  return d;
}
