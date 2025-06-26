
/// <reference types="google.maps" />

export interface PlaceAutocomplete {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
  types: string[];
  distance_meters?: number;
}

export interface PlaceDetails {
  place_id: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  name: string;
  types: string[];
}

declare global {
  interface Window {
    google: typeof google;
  }
}

class GoogleMapsService {
  private apiKey: string;
  private autocompleteService: google.maps.places.AutocompleteService | null = null;
  private placesService: google.maps.places.PlacesService | null = null;
  private currentLocation: { lat: number; lng: number } | null = null;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.loadGoogleMapsAPI();
    this.getCurrentLocation();
  }

  private async getCurrentLocation(): Promise<void> {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
        },
        (error) => {
          console.warn('Could not get current location for search bias:', error);
          // Default to Addis Ababa if geolocation fails
          this.currentLocation = { lat: 9.0320, lng: 38.7469 };
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 300000 }
      );
    } else {
      // Default to Addis Ababa
      this.currentLocation = { lat: 9.0320, lng: 38.7469 };
    }
  }

  private async loadGoogleMapsAPI(): Promise<void> {
    if (window.google) {
      this.initializeServices();
      return;
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        this.initializeServices();
        resolve();
      };
      
      script.onerror = () => {
        reject(new Error('Failed to load Google Maps API'));
      };
      
      document.head.appendChild(script);
    });
  }

  private initializeServices(): void {
    if (window.google) {
      this.autocompleteService = new google.maps.places.AutocompleteService();
      // Create a dummy div for PlacesService
      const div = document.createElement('div');
      this.placesService = new google.maps.places.PlacesService(div);
    }
  }

  async getPlacePredictions(input: string): Promise<PlaceAutocomplete[]> {
    if (!this.autocompleteService || !input.trim()) {
      return [];
    }

    const predictions: PlaceAutocomplete[] = [];

    // Multiple search requests for comprehensive results
    const searchRequests = [
      // Primary search with establishment and address types
      {
        input,
        types: ['establishment'],
        componentRestrictions: { country: 'et' },
        location: this.currentLocation,
        radius: 50000 // 50km radius
      },
      // Secondary search for geocoding (addresses)
      {
        input,
        types: ['geocode'],
        componentRestrictions: { country: 'et' },
        location: this.currentLocation,
        radius: 50000
      },
      // Tertiary search for regions (broader areas)
      {
        input,
        types: ['(regions)'],
        componentRestrictions: { country: 'et' },
        location: this.currentLocation,
        radius: 100000 // 100km radius for regions
      }
    ];

    // Execute all search requests
    const searchPromises = searchRequests.map(request => 
      new Promise<google.maps.places.AutocompletePrediction[]>((resolve) => {
        this.autocompleteService!.getPlacePredictions(
          request,
          (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
              resolve(results);
            } else {
              resolve([]);
            }
          }
        );
      })
    );

    try {
      const allResults = await Promise.all(searchPromises);
      const seenPlaceIds = new Set<string>();
      
      // Combine and deduplicate results
      allResults.forEach(results => {
        results.forEach(prediction => {
          if (!seenPlaceIds.has(prediction.place_id)) {
            seenPlaceIds.add(prediction.place_id);
            predictions.push({
              place_id: prediction.place_id,
              description: prediction.description,
              structured_formatting: prediction.structured_formatting,
              types: prediction.types || []
            });
          }
        });
      });

      // Sort predictions by relevance
      return this.sortPredictionsByRelevance(predictions, input);
    } catch (error) {
      console.error('Error fetching predictions:', error);
      return [];
    }
  }

  private sortPredictionsByRelevance(predictions: PlaceAutocomplete[], input: string): PlaceAutocomplete[] {
    const inputLower = input.toLowerCase();
    
    return predictions.sort((a, b) => {
      // Exact matches first
      const aExactMatch = a.structured_formatting.main_text.toLowerCase() === inputLower;
      const bExactMatch = b.structured_formatting.main_text.toLowerCase() === inputLower;
      if (aExactMatch && !bExactMatch) return -1;
      if (bExactMatch && !aExactMatch) return 1;
      
      // Starts with input
      const aStartsWith = a.structured_formatting.main_text.toLowerCase().startsWith(inputLower);
      const bStartsWith = b.structured_formatting.main_text.toLowerCase().startsWith(inputLower);
      if (aStartsWith && !bStartsWith) return -1;
      if (bStartsWith && !aStartsWith) return 1;
      
      // Prioritize establishments (businesses, landmarks) over addresses
      const aIsEstablishment = a.types.some(type => 
        ['establishment', 'point_of_interest', 'store', 'restaurant', 'hospital', 'school', 'bank'].includes(type)
      );
      const bIsEstablishment = b.types.some(type => 
        ['establishment', 'point_of_interest', 'store', 'restaurant', 'hospital', 'school', 'bank'].includes(type)
      );
      if (aIsEstablishment && !bIsEstablishment) return -1;
      if (bIsEstablishment && !aIsEstablishment) return 1;
      
      // Length preference (shorter descriptions often more relevant)
      return a.description.length - b.description.length;
    });
  }

  async getPlaceDetails(placeId: string): Promise<PlaceDetails | null> {
    if (!this.placesService) {
      return null;
    }

    return new Promise((resolve, reject) => {
      this.placesService!.getDetails(
        {
          placeId,
          fields: ['place_id', 'formatted_address', 'geometry', 'name', 'types']
        },
        (place, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && place) {
            resolve({
              place_id: place.place_id!,
              formatted_address: place.formatted_address!,
              geometry: {
                location: {
                  lat: place.geometry!.location!.lat(),
                  lng: place.geometry!.location!.lng()
                }
              },
              name: place.name!,
              types: place.types || []
            });
          } else {
            resolve(null);
          }
        }
      );
    });
  }
}

let googleMapsServiceInstance: GoogleMapsService | null = null;

export const initializeGoogleMapsService = (apiKey: string) => {
  googleMapsServiceInstance = new GoogleMapsService(apiKey);
  return googleMapsServiceInstance;
};

export const getGoogleMapsService = () => {
  return googleMapsServiceInstance;
};
