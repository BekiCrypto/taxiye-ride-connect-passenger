
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, Plus } from 'lucide-react';

interface WalletBalanceProps {
  balance: number;
  onAddMoney: () => void;
}

const WalletBalance = ({ balance, onAddMoney }: WalletBalanceProps) => {
  return (
    <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 border-none">
      <CardContent className="p-6 text-center">
        <Wallet className="w-12 h-12 mx-auto mb-4 text-black" />
        <p className="text-black/80 text-sm font-medium">Current Balance</p>
        <p className="text-3xl font-bold text-black">ETB {balance.toFixed(2)}</p>
        <Button 
          className="mt-4 bg-black text-yellow-500 hover:bg-gray-900 font-semibold"
          onClick={onAddMoney}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Money
        </Button>
      </CardContent>
    </Card>
  );
};

export default WalletBalance;
