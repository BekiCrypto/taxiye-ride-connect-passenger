
import React, { useState } from 'react';
import { Ticket, Wallet, Percent } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface Coupon {
  id: string;
  type: 'wallet_topup' | 'ride_discount';
  title: string;
  description: string;
  value: number;
  expiryDate: string;
  isUsed: boolean;
}

const CouponManager = () => {
  const { toast } = useToast();
  
  // Mock coupon data - this would come from database
  const [coupons] = useState<Coupon[]>([
    {
      id: '1',
      type: 'wallet_topup',
      title: 'ETB 25 Wallet Bonus',
      description: 'Add ETB 25 to your wallet',
      value: 25,
      expiryDate: '2024-12-31',
      isUsed: false
    },
    {
      id: '2',
      type: 'ride_discount',
      title: '20% Ride Discount',
      description: 'Get 20% off your next ride',
      value: 20,
      expiryDate: '2024-12-31',
      isUsed: false
    },
    {
      id: '3',
      type: 'wallet_topup',
      title: 'ETB 50 Wallet Bonus',
      description: 'Add ETB 50 to your wallet',
      value: 50,
      expiryDate: '2024-11-30',
      isUsed: true
    }
  ]);

  const redeemCoupon = (coupon: Coupon) => {
    if (coupon.isUsed) return;
    
    toast({
      title: "Coupon Redeemed!",
      description: `${coupon.title} has been applied to your account`,
    });
  };

  const getCouponIcon = (type: string) => {
    switch (type) {
      case 'wallet_topup':
        return <Wallet className="w-4 h-4" />;
      case 'ride_discount':
        return <Percent className="w-4 h-4" />;
      default:
        return <Ticket className="w-4 h-4" />;
    }
  };

  const getCouponColor = (type: string) => {
    switch (type) {
      case 'wallet_topup':
        return 'bg-green-500';
      case 'ride_discount':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center space-x-3 text-white">
          <Ticket className="w-6 h-6 text-yellow-500" />
          <span>My Coupons</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {coupons.length === 0 ? (
          <div className="text-center py-8">
            <Ticket className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No coupons available</p>
            <p className="text-sm text-gray-500">Refer friends to earn coupons!</p>
          </div>
        ) : (
          coupons.map((coupon) => (
            <div
              key={coupon.id}
              className={`p-4 rounded-lg border ${
                coupon.isUsed 
                  ? 'bg-gray-700/50 border-gray-600 opacity-60' 
                  : 'bg-gray-700 border-gray-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${getCouponColor(coupon.type)} rounded-full flex items-center justify-center`}>
                    {getCouponIcon(coupon.type)}
                  </div>
                  <div>
                    <h4 className="font-medium text-white">{coupon.title}</h4>
                    <p className="text-sm text-gray-400">{coupon.description}</p>
                    <p className="text-xs text-gray-500">Expires: {coupon.expiryDate}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {coupon.isUsed ? (
                    <Badge variant="secondary" className="bg-gray-600 text-gray-300">
                      Used
                    </Badge>
                  ) : (
                    <Button
                      onClick={() => redeemCoupon(coupon)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-black"
                      size="sm"
                    >
                      Redeem
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default CouponManager;
