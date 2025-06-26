
import React from 'react';
import { Banknote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface CashPaymentProps {
  onPayment: (method: string, amount: number) => void;
  amount: number;
}

const CashPayment = ({ onPayment, amount }: CashPaymentProps) => {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <Banknote className="w-5 h-5 text-orange-500" />
            <div>
              <p className="font-medium text-white">Cash Payment</p>
              <p className="text-sm text-gray-400">Pay with cash to the driver</p>
            </div>
          </div>
          <p className="text-yellow-500 font-bold">ETB {amount.toFixed(2)}</p>
        </div>
        
        <Button 
          onClick={() => onPayment('cash', amount)}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white"
        >
          Select Cash Payment
        </Button>
        
        <p className="text-gray-400 text-sm mt-2 text-center">
          You will pay the driver directly
        </p>
      </CardContent>
    </Card>
  );
};

export default CashPayment;
