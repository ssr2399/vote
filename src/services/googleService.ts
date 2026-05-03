/// <reference types="vite/client" />
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";

setOptions({
  key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
});

export const loadGoogleMaps = async () => {
    const [{ Map }, { Marker }] = await Promise.all([
        importLibrary("maps") as Promise<google.maps.MapsLibrary>,
        importLibrary("marker") as Promise<google.maps.MarkerLibrary>
    ]);
    return { Map, Marker };
};

// Civic Info API
export const getPollingLocation = async (address: string) => {
    const apiKey = import.meta.env.VITE_GOOGLE_CIVIC_API_KEY;
    if (!apiKey) {
        // Civic API key not configured — graceful fallback
        return null;
    }
    // Note: To use the Civic info API, we typically query:
    // https://civicinfo.googleapis.com/civicinfo/v2/voterinfo?address=${address}&key=${apiKey}
    // Using a placeholder address or demo data if actual query fails.
    
    try {
         const response = await fetch(`https://civicinfo.googleapis.com/civicinfo/v2/voterinfo?address=${encodeURIComponent(address)}&key=${apiKey}&electionId=2000`);
         const data = await response.json();
         return data;
    } catch (_e) {
        // Civic API unavailable — graceful fallback
        return null;
    }
}
