
import React, { useState } from 'react';
import { CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface CardPaymentProps {
  onPayment: (method: string, amount: number, details?: any) => void;
  amount: number;
}

const CardPayment = ({ onPayment, amount }: CardPaymentProps) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    if (!cardNumber.trim() || !expiryDate.trim() || !cvv.trim()) return;
    
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      onPayment('card', amount, { 
        cardNumber: cardNumber.slice(-4), 
        expiryDate 
      });
      setIsProcessing(false);
    }, 3000);
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <CreditCard className="w-5 h-5 text-green-500" />
            <div>
              <p className="font-medium text-white">Card Payment</p>
              <p className="text-sm text-gray-400">Pay with credit/debit card</p>
            </div>
          </div>
          <p className="text-yellow-500 font-bold">ETB {amount.toFixed(2)}</p>
        </div>
        
        <div className="space-y-3">
          <Input
            type="text"
            placeholder="Card Number (1234 5678 9012 3456)"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            className="bg-gray-700 border-gray-600 text-white"
            maxLength={19}
          />
          
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="MM/YY"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
              maxLength={5}
            />
            <Input
              type="text"
              placeholder="CVV"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
              maxLength={4}
            />
          </div>
          
          <Button 
            onClick={handlePayment}
            disabled={!cardNumber.trim() || !expiryDate.trim() || !cvv.trim() || isProcessing}
            className="w-full bg-green-500 hover:bg-green-600 text-white"
          >
            {isProcessing ? 'Processing...' : 'Pay with Card'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardPayment;
