
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import WalletPayment from './WalletPayment';
import TelebirrPayment from './TelebirrPayment';
import CardPayment from './CardPayment';
import BankTransferPayment from './BankTransferPayment';
import CashPayment from './CashPayment';

interface PaymentSelectorProps {
  onBack: () => void;
  amount: number;
  rideDetails?: {
    pickup: string;
    dropoff: string;
    vehicleType: string;
  };
}

const PaymentSelector = ({ onBack, amount, rideDetails }: PaymentSelectorProps) => {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const { toast } = useToast();

  const handlePayment = (method: string, paymentAmount: number, details?: any) => {
    console.log('Payment processed:', { method, amount: paymentAmount, details });
    
    toast({
      title: "Payment Successful!",
      description: `Payment of ETB ${paymentAmount.toFixed(2)} completed via ${method}`,
    });

    // Simulate completing the ride
    setTimeout(() => {
      onBack(); // Return to main screen
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-gray-400 mr-3"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-white">Choose Payment Method</h1>
        </div>

        {/* Ride Summary */}
        {rideDetails && (
          <div className="bg-gray-800 rounded-lg p-4 mb-6 border border-gray-700">
            <h3 className="text-white font-medium mb-2">Ride Summary</h3>
            <div className="space-y-1 text-sm text-gray-400">
              <p>From: {rideDetails.pickup}</p>
              <p>To: {rideDetails.dropoff}</p>
              <p>Vehicle: {rideDetails.vehicleType}</p>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-600">
              <div className="flex justify-between items-center">
                <span className="text-white font-medium">Total Fare:</span>
                <span className="text-yellow-500 font-bold text-lg">ETB {amount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Payment Methods */}
        <div className="space-y-4">
          <WalletPayment onPayment={handlePayment} amount={amount} />
          <CashPayment onPayment={handlePayment} amount={amount} />
          <TelebirrPayment onPayment={handlePayment} amount={amount} />
          <CardPayment onPayment={handlePayment} amount={amount} />
          <BankTransferPayment onPayment={handlePayment} amount={amount} />
        </div>
      </div>
    </div>
  );
};

export default PaymentSelector;
