
import React from 'react';
import { Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface WalletPaymentProps {
  onPayment: (method: string, amount: number) => void;
  amount: number;
  balance?: number;
}

const WalletPayment = ({ onPayment, amount, balance = 450 }: WalletPaymentProps) => {
  const canPay = balance >= amount;

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <Wallet className="w-5 h-5 text-yellow-500" />
            <div>
              <p className="font-medium text-white">Wallet Payment</p>
              <p className="text-sm text-gray-400">Current Balance: ETB {balance.toFixed(2)}</p>
            </div>
          </div>
          <p className="text-yellow-500 font-bold">ETB {amount.toFixed(2)}</p>
        </div>
        
        <Button 
          onClick={() => onPayment('wallet', amount)}
          disabled={!canPay}
          className={`w-full ${
            canPay 
              ? 'bg-yellow-500 hover:bg-yellow-600 text-black' 
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          {canPay ? 'Pay with Wallet' : 'Insufficient Balance'}
        </Button>
        
        {!canPay && (
          <p className="text-red-400 text-sm mt-2 text-center">
            Need ETB {(amount - balance).toFixed(2)} more
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default WalletPayment;
