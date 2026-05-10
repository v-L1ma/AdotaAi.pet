import axios from "axios";

const GEOCODING_BASE_URL = "https://nominatim.openstreetmap.org";

export interface GeocodingResult {
  lat: string;
  lon: string;
  display_name: string;
}

export async function geocodeAddress(query: string): Promise<GeocodingResult | null> {
  try {
    const response = await axios.get<GeocodingResult[]>(`${GEOCODING_BASE_URL}/search`, {
      params: {
        format: "json",
        limit: 1,
        countrycodes: "br",
        q: query,
      },
    });

    if (response.data && response.data.length > 0) {
      return response.data[0];
    }
    return null;
  } catch {
    return null;
  }
}

export const geocodingService = {
  geocodeAddress,
};

export default geocodingService;