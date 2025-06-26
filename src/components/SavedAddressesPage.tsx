
import React, { useState } from 'react';
import { ArrowLeft, MapPin, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';
import AddressAutocomplete from './AddressAutocomplete';
import { PlaceDetails } from '@/services/googleMapsService';

interface SavedAddress {
  id: number;
  label: string;
  address: string;
  type: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  placeId?: string;
}

const SavedAddressesPage = ({ onBack }: { onBack: () => void }) => {
  const [addresses, setAddresses] = useState<SavedAddress[]>([
    { id: 1, label: 'Home', address: 'Bole, Addis Ababa', type: 'home' },
    { id: 2, label: 'Work', address: 'CMC, Addis Ababa', type: 'work' }
  ]);
  const [isAdding, setIsAdding] = useState(false);
  const [newAddress, setNewAddress] = useState({ label: '', address: '' });
  const [selectedPlace, setSelectedPlace] = useState<PlaceDetails | null>(null);
  const { toast } = useToast();
  const { isLoaded: mapsLoaded, error: mapsError } = useGoogleMaps();

  const handleAddAddress = () => {
    if (!newAddress.label.trim() || !newAddress.address.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please fill in both label and address fields.",
        variant: "destructive",
      });
      return;
    }

    const newId = Math.max(...addresses.map(a => a.id)) + 1;
    const addressData: SavedAddress = {
      id: newId,
      label: newAddress.label,
      address: newAddress.address,
      type: 'custom'
    };

    // Add coordinates and place ID if we have place details
    if (selectedPlace) {
      addressData.coordinates = selectedPlace.geometry.location;
      addressData.placeId = selectedPlace.place_id;
    }

    setAddresses(prev => [...prev, addressData]);
    
    setNewAddress({ label: '', address: '' });
    setSelectedPlace(null);
    setIsAdding(false);
    
    toast({
      title: "Address Added",
      description: "Your new address has been saved successfully.",
    });
  };

  const handleDeleteAddress = (id: number) => {
    setAddresses(prev => prev.filter(addr => addr.id !== id));
    toast({
      title: "Address Deleted",
      description: "The address has been removed from your saved locations.",
    });
  };

  const handlePlaceSelect = (place: PlaceDetails) => {
    setSelectedPlace(place);
    setNewAddress(prev => ({ ...prev, address: place.formatted_address }));
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-gray-400 mr-3"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold text-white">Saved Addresses</h1>
          </div>
          <Button
            onClick={() => setIsAdding(true)}
            size="sm"
            className="bg-yellow-500 hover:bg-yellow-600 text-black"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {mapsError && (
          <Card className="bg-red-900/20 border-red-500 mb-4">
            <CardContent className="p-4">
              <p className="text-red-400 text-sm">
                Google Maps integration unavailable: {mapsError}
              </p>
              <p className="text-gray-400 text-xs mt-1">
                You can still add addresses manually.
              </p>
            </CardContent>
          </Card>
        )}

        <div className="space-y-3">
          {isAdding && (
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4 space-y-3">
                <Input
                  placeholder="Label (e.g., Home, Work)"
                  value={newAddress.label}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, label: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                />
                
                {mapsLoaded && !mapsError ? (
                  <AddressAutocomplete
                    value={newAddress.address}
                    onChange={(value) => setNewAddress(prev => ({ ...prev, address: value }))}
                    onPlaceSelect={handlePlaceSelect}
                    placeholder="Search for address"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                ) : (
                  <Input
                    placeholder="Full Address"
                    value={newAddress.address}
                    onChange={(e) => setNewAddress(prev => ({ ...prev, address: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                )}
                
                <div className="flex space-x-2">
                  <Button
                    onClick={handleAddAddress}
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black"
                  >
                    Save
                  </Button>
                  <Button
                    onClick={() => {
                      setIsAdding(false);
                      setNewAddress({ label: '', address: '' });
                      setSelectedPlace(null);
                    }}
                    variant="outline"
                    className="flex-1 border-gray-600 text-gray-300"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {addresses.map((address) => (
            <Card key={address.id} className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <MapPin className="w-5 h-5 text-yellow-500 mt-0.5" />
                    <div>
                      <p className="text-white font-medium">{address.label}</p>
                      <p className="text-gray-400 text-sm">{address.address}</p>
                      {address.coordinates && (
                        <p className="text-gray-500 text-xs mt-1">
                          {address.coordinates.lat.toFixed(6)}, {address.coordinates.lng.toFixed(6)}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    onClick={() => handleDeleteAddress(address.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SavedAddressesPage;
