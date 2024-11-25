interface LocationData {
  name: string;
  local_names?: { [key: string]: string };
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export async function verifyLocation(location: string, apiKey: string) {
  try {
    const response = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${apiKey}`
    );
    const data = await response.json() as LocationData[];

    if (data.length > 0) {
      return {
        exists: true,
        locationData: data[0], // First result from the API
      };
    } else {
      return { exists: false };
    }
  } catch (error) {
    console.error("Error verifying location:", error);
    return { exists: false };
  }
}