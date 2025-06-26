
import React, { useState } from 'react';
import { Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const TelebirrTopUp = () => {
  const [amount, setAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleTopUp = async () => {
    if (!amount || !phoneNumber) return;
    
    setIsProcessing(true);
    // Simulate top-up processing
    setTimeout(() => {
      toast({
        title: "Top-up Successful!",
        description: `ETB ${amount} added to your wallet via Telebirr`,
      });
      setAmount('');
      setPhoneNumber('');
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="p-4">
        <div className="flex items-center space-x-3 mb-4">
          <Phone className="w-5 h-5 text-blue-500" />
          <div>
            <h3 className="font-medium text-white">Telebirr Top-up</h3>
            <p className="text-sm text-gray-400">Add money using Telebirr</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <Input
            type="tel"
            placeholder="Phone number (0911234567)"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="bg-gray-700 border-gray-600 text-white"
          />
          
          <Input
            type="number"
            placeholder="Amount (ETB)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-gray-700 border-gray-600 text-white"
            min="10"
            max="5000"
          />
          
          <Button 
            onClick={handleTopUp}
            disabled={!amount || !phoneNumber || isProcessing}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
          >
            {isProcessing ? 'Processing...' : `Top-up ETB ${amount || '0'}`}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TelebirrTopUp;
