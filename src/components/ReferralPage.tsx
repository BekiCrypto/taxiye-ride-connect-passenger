
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import ReferralEarnCard from '@/components/referral/ReferralEarnCard';
import CouponManager from '@/components/referral/CouponManager';

interface ReferralPageProps {
  onBack: () => void;
}

const ReferralPage = ({ onBack }: ReferralPageProps) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-md mx-auto bg-gray-900 min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-white">Referral Program</h1>
          <div className="w-9"></div> {/* Spacer for center alignment */}
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          <ReferralEarnCard />
          <CouponManager />
        </div>
      </div>
    </div>
  );
};

export default ReferralPage;
