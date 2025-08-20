import { Loader } from '@googlemaps/js-api-loader';
import { Coordinates, TransportLink } from '@/types';

// Global Google Maps type declaration
/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  const google: any;
}

// Google Maps API loader instance
let loader: Loader | null = null;

export const initGoogleMaps = async (): Promise<void> => {
  if (typeof window === 'undefined') return;
  
  if (!loader) {
    loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
      version: 'weekly',
      libraries: ['places', 'geometry', 'marker']
    });
  }

  try {
    await loader.load();
  } catch (error) {
    console.error('Failed to load Google Maps API:', error);
    throw error;
  }
};

// Geocode address to coordinates
export const geocodeAddress = async (address: string): Promise<Coordinates> => {
  await initGoogleMaps();
  
  return new Promise((resolve, reject) => {
    const geocoder = new google.maps.Geocoder();
    
    geocoder.geocode(
      { 
        address,
        componentRestrictions: { country: 'GB' }
      },
      (results: any, status: any) => {
        if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
          const location = results[0].geometry.location;
          resolve({
            lat: location.lat(),
            lng: location.lng()
          });
        } else {
          reject(new Error(`Geocoding failed: ${status}`));
        }
      }
    );
  });
};

// Generate static map image URL
export const generateStaticMapUrl = (
  coordinates: Coordinates,
  options: {
    width?: number;
    height?: number;
    zoom?: number;
    maptype?: 'roadmap' | 'satellite' | 'hybrid' | 'terrain';
    markers?: Array<{
      location: Coordinates;
      color?: string;
      label?: string;
      size?: 'tiny' | 'mid' | 'small';
    }>;
    style?: string;
  } = {}
): string => {
  const {
    width = 600,
    height = 400,
    zoom = 15,
    maptype = 'roadmap',
    markers = [],
    style
  } = options;

  const baseUrl = 'https://maps.googleapis.com/maps/api/staticmap';
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const params = new URLSearchParams({
    center: `${coordinates.lat},${coordinates.lng}`,
    zoom: zoom.toString(),
    size: `${width}x${height}`,
    maptype,
    key: apiKey!
  });

  // Add default marker for the property
  if (markers.length === 0) {
    params.append('markers', `color:red|size:mid|${coordinates.lat},${coordinates.lng}`);
  } else {
    // Add custom markers
    markers.forEach(marker => {
      const markerString = [
        marker.color ? `color:${marker.color}` : '',
        marker.size ? `size:${marker.size}` : 'size:mid',
        marker.label ? `label:${marker.label}` : '',
        `${marker.location.lat},${marker.location.lng}`
      ].filter(Boolean).join('|');
      
      params.append('markers', markerString);
    });
  }

  // Add custom styling for professional look
  if (style) {
    params.append('style', style);
  } else {
    // Default professional styling
    const defaultStyles = [
      'feature:poi|visibility:off',
      'feature:transit|visibility:off',
      'feature:road|element:labels|visibility:off'
    ];
    defaultStyles.forEach(styleRule => {
      params.append('style', styleRule);
    });
  }

  return `${baseUrl}?${params.toString()}`;
};

// Find nearby transport links
export const findTransportLinks = async (
  coordinates: Coordinates,
  radius: number = 2000 // 2km default
): Promise<TransportLink[]> => {
  await initGoogleMaps();

  return new Promise((resolve) => {
    const service = new google.maps.places.PlacesService(
      document.createElement('div')
    );

    const transportTypes = [
      { type: 'train_station', category: 'rail' },
      { type: 'bus_station', category: 'bus' },
      { type: 'subway_station', category: 'rail' },
      { type: 'airport', category: 'airport' }
    ];

    const allResults: TransportLink[] = [];
    let pendingRequests = transportTypes.length;

    transportTypes.forEach(({ type, category }) => {
      const request = {
        location: new google.maps.LatLng(coordinates.lat, coordinates.lng),
        radius,
        type: type as any
      };

      service.nearbySearch(request, (results: any, status: any) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          const links = results.slice(0, 3).map((place: any) => ({
            type: category as TransportLink['type'],
            name: place.name || 'Unknown',
            distance: calculateDistance(
              coordinates,
              {
                lat: place.geometry?.location?.lat() || 0,
                lng: place.geometry?.location?.lng() || 0
              }
            ),
            walkingTime: estimateWalkingTime(
              calculateDistanceInMeters(
                coordinates,
                {
                  lat: place.geometry?.location?.lat() || 0,
                  lng: place.geometry?.location?.lng() || 0
                }
              )
            ),
            coordinates: {
              lat: place.geometry?.location?.lat() || 0,
              lng: place.geometry?.location?.lng() || 0
            }
          }));

          allResults.push(...links);
        }

        pendingRequests--;
        if (pendingRequests === 0) {
          // Sort by distance and remove duplicates
          const uniqueResults = allResults
            .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))
            .filter((item, index, arr) => 
              arr.findIndex(i => i.name === item.name) === index
            )
            .slice(0, 6); // Limit to 6 transport links

          resolve(uniqueResults);
        }
      });
    });

    // Handle timeout
    setTimeout(() => {
      if (pendingRequests > 0) {
        resolve(allResults);
      }
    }, 5000);
  });
};

// Calculate distance between two coordinates (in km)
export const calculateDistance = (
  coord1: Coordinates,
  coord2: Coordinates
): string => {
  const R = 6371; // Earth's radius in km
  const dLat = deg2rad(coord2.lat - coord1.lat);
  const dLng = deg2rad(coord2.lng - coord1.lng);
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(coord1.lat)) * Math.cos(deg2rad(coord2.lat)) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;

  return distance < 1 
    ? `${Math.round(distance * 1000)}m`
    : `${distance.toFixed(1)}km`;
};

// Calculate distance in meters for walking time estimation
const calculateDistanceInMeters = (
  coord1: Coordinates,
  coord2: Coordinates
): number => {
  const R = 6371000; // Earth's radius in meters
  const dLat = deg2rad(coord2.lat - coord1.lat);
  const dLng = deg2rad(coord2.lng - coord1.lng);
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(coord1.lat)) * Math.cos(deg2rad(coord2.lat)) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Estimate walking time based on distance
const estimateWalkingTime = (distanceInMeters: number): string => {
  const walkingSpeedMps = 1.4; // Average walking speed 1.4 m/s (5 km/h)
  const timeInSeconds = distanceInMeters / walkingSpeedMps;
  const timeInMinutes = Math.round(timeInSeconds / 60);
  
  if (timeInMinutes < 1) return '< 1 min';
  if (timeInMinutes === 1) return '1 min';
  return `${timeInMinutes} mins`;
};

// Convert degrees to radians
const deg2rad = (deg: number): number => {
  return deg * (Math.PI / 180);
};

// Address autocomplete component helper
export const createAddressAutocomplete = (
  input: HTMLInputElement,
  onPlaceSelect: (place: any) => void
): any => {
  const autocomplete = new google.maps.places.Autocomplete(input, {
    types: ['address'],
    componentRestrictions: { country: 'GB' },
    fields: [
      'formatted_address',
      'address_components',
      'geometry',
      'place_id',
      'name'
    ]
  });

  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace();
    if (place && place.geometry) {
      onPlaceSelect(place);
    }
  });

  return autocomplete;
};

// Extract postcode from Google Places result
export const extractPostcode = (addressComponents: any[]): string => {
  const postcodeComponent = addressComponents.find(
    (component: any) => component.types.includes('postal_code')
  );
  
  return postcodeComponent?.long_name || '';
};

// Check if Google Maps API is loaded
export const isGoogleMapsLoaded = (): boolean => {
  return typeof window !== 'undefined' && 
         typeof window.google !== 'undefined' && 
         typeof window.google.maps !== 'undefined';
};
