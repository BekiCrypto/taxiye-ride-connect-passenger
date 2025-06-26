
import React, { useState } from 'react';
import { Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BankTransferPaymentProps {
  onPayment: (method: string, amount: number, details?: any) => void;
  amount: number;
}

const BankTransferPayment = ({ onPayment, amount }: BankTransferPaymentProps) => {
  const [selectedBank, setSelectedBank] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const banks = [
    { id: 'cbe', name: 'Commercial Bank of Ethiopia' },
    { id: 'dashen', name: 'Dashen Bank' },
    { id: 'awash', name: 'Awash Bank' },
    { id: 'boa', name: 'Bank of Abyssinia' },
    { id: 'wegagen', name: 'Wegagen Bank' },
    { id: 'united', name: 'United Bank' }
  ];

  const handlePayment = async () => {
    if (!selectedBank) return;
    
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      const bankName = banks.find(b => b.id === selectedBank)?.name;
      onPayment('bank_transfer', amount, { bank: bankName });
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <Building className="w-5 h-5 text-purple-500" />
            <div>
              <p className="font-medium text-white">Bank Transfer</p>
              <p className="text-sm text-gray-400">Transfer from your bank account</p>
            </div>
          </div>
          <p className="text-yellow-500 font-bold">ETB {amount.toFixed(2)}</p>
        </div>
        
        <div className="space-y-3">
          <Select value={selectedBank} onValueChange={setSelectedBank}>
            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
              <SelectValue placeholder="Select your bank" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              {banks.map((bank) => (
                <SelectItem key={bank.id} value={bank.id} className="text-white hover:bg-gray-600">
                  {bank.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            onClick={handlePayment}
            disabled={!selectedBank || isProcessing}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white"
          >
            {isProcessing ? 'Processing...' : 'Pay via Bank Transfer'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BankTransferPayment;
