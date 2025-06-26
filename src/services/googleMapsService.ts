
export interface PlaceAutocomplete {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
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
}

class GoogleMapsService {
  private apiKey: string;
  private autocompleteService: google.maps.places.AutocompleteService | null = null;
  private placesService: google.maps.places.PlacesService | null = null;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.loadGoogleMapsAPI();
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

    return new Promise((resolve, reject) => {
      this.autocompleteService!.getPlacePredictions(
        {
          input,
          types: ['address'],
          componentRestrictions: { country: 'et' } // Restrict to Ethiopia
        },
        (predictions, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
            resolve(predictions.map(p => ({
              place_id: p.place_id,
              description: p.description,
              structured_formatting: p.structured_formatting
            })));
          } else {
            resolve([]);
          }
        }
      );
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
          fields: ['place_id', 'formatted_address', 'geometry', 'name']
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
              name: place.name!
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
