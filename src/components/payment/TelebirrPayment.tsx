
import React, { useState } from 'react';
import { Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface TelebirrPaymentProps {
  onPayment: (method: string, amount: number, details?: any) => void;
  amount: number;
}

const TelebirrPayment = ({ onPayment, amount }: TelebirrPaymentProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    if (!phoneNumber.trim()) return;
    
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      onPayment('telebirr', amount, { phoneNumber });
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <Phone className="w-5 h-5 text-blue-500" />
            <div>
              <p className="font-medium text-white">Telebirr Payment</p>
              <p className="text-sm text-gray-400">Pay with your Telebirr account</p>
            </div>
          </div>
          <p className="text-yellow-500 font-bold">ETB {amount.toFixed(2)}</p>
        </div>
        
        <div className="space-y-3">
          <Input
            type="tel"
            placeholder="Enter phone number (e.g., 0911234567)"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="bg-gray-700 border-gray-600 text-white"
          />
          
          <Button 
            onClick={handlePayment}
            disabled={!phoneNumber.trim() || isProcessing}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
          >
            {isProcessing ? 'Processing...' : 'Pay with Telebirr'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TelebirrPayment;
