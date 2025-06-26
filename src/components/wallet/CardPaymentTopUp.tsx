
import React, { useState } from 'react';
import { CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const CardPaymentTopUp = () => {
  const [amount, setAmount] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleTopUp = async () => {
    if (!amount || !cardNumber || !expiryDate || !cvv) return;
    
    setIsProcessing(true);
    // Simulate top-up processing
    setTimeout(() => {
      toast({
        title: "Top-up Successful!",
        description: `ETB ${amount} added to your wallet via card ending in ${cardNumber.slice(-4)}`,
      });
      setAmount('');
      setCardNumber('');
      setExpiryDate('');
      setCvv('');
      setIsProcessing(false);
    }, 3000);
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="p-4">
        <div className="flex items-center space-x-3 mb-4">
          <CreditCard className="w-5 h-5 text-green-500" />
          <div>
            <h3 className="font-medium text-white">Card Payment</h3>
            <p className="text-sm text-gray-400">Add money using credit/debit card</p>
          </div>
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
            disabled={!amount || !cardNumber || !expiryDate || !cvv || isProcessing}
            className="w-full bg-green-500 hover:bg-green-600 text-white"
          >
            {isProcessing ? 'Processing...' : `Top-up ETB ${amount || '0'}`}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardPaymentTopUp;
