import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

const fetchOSMDetails = async (longitude: number, latitude: number) => {
  try {
    const query = `
      [out:json];
      (
        node(around:1000, ${latitude}, ${longitude})["amenity"="cafe"];
        node(around:1000, ${latitude}, ${longitude})["amenity"="library"];
        node(around:1000, ${latitude}, ${longitude})["amenity"="coworking_space"];
      );
      out body;
      >;
      out skel qt;
    `;
    const encodedQuery = encodeURIComponent(query.trim());
    const url = `https://overpass-api.de/api/interpreter?data=${encodedQuery}`;
    console.log('Querying Overpass API with URL:', url);
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'YourApp/1.0',
      },
    });
    console.log('Received response:', JSON.stringify(response.data, null, 2));
    return response.data.elements;
  } catch (error) {
    console.error(
      'Error fetching OSM data:',
      error.response?.data || error.message,
    );
    return [];
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { longitude, latitude } = req.query;

  if (!longitude || !latitude) {
    return res
      .status(400)
      .json({ error: 'Longitude and latitude are required' });
  }

  try {
    const osmDetails = await fetchOSMDetails(
      parseFloat(longitude as string),
      parseFloat(latitude as string),
    );
    if (osmDetails.length === 0) {
      console.log('No OSM data found for the given coordinates');
    }
    res.status(200).json(osmDetails);
  } catch (error) {
    console.error('Error in API handler:', error);
    res.status(500).json({ error: 'Failed to fetch OSM details' });
  }
}
