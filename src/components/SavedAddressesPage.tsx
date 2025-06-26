
import React, { useState } from 'react';
import { ArrowLeft, MapPin, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const SavedAddressesPage = ({ onBack }: { onBack: () => void }) => {
  const [addresses, setAddresses] = useState([
    { id: 1, label: 'Home', address: 'Bole, Addis Ababa', type: 'home' },
    { id: 2, label: 'Work', address: 'CMC, Addis Ababa', type: 'work' }
  ]);
  const [isAdding, setIsAdding] = useState(false);
  const [newAddress, setNewAddress] = useState({ label: '', address: '' });
  const { toast } = useToast();

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
    setAddresses(prev => [...prev, {
      id: newId,
      label: newAddress.label,
      address: newAddress.address,
      type: 'custom'
    }]);
    
    setNewAddress({ label: '', address: '' });
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
                <Input
                  placeholder="Full Address"
                  value={newAddress.address}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, address: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                />
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
