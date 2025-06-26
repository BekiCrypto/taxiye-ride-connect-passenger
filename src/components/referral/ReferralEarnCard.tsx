
import React, { useState, useEffect } from 'react';
import { Gift, Share, Users, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ReferralStats {
  totalReferrals: number;
  totalEarnings: number;
  availableCoupons: number;
}

const ReferralEarnCard = () => {
  const [referralCode, setReferralCode] = useState('');
  const [referralLink, setReferralLink] = useState('');
  const [stats, setStats] = useState<ReferralStats>({
    totalReferrals: 0,
    totalEarnings: 0,
    availableCoupons: 0
  });
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    generateReferralCode();
    loadReferralStats();
  }, []);

  const generateReferralCode = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      // Generate unique code based on user ID
      const code = `TX${user.id.slice(0, 6).toUpperCase()}`;
      const link = `${window.location.origin}?ref=${code}`;
      setReferralCode(code);
      setReferralLink(link);
    }
  };

  const loadReferralStats = () => {
    // Mock data - this would come from actual referral tracking
    setStats({
      totalReferrals: 5,
      totalEarnings: 125.00,
      availableCoupons: 3
    });
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({
        title: "Copied!",
        description: `${type} copied to clipboard`,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const shareReferralLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join Taxiye with my referral!',
          text: `Use my referral code ${referralCode} and get ETB 25 bonus when you sign up!`,
          url: referralLink,
        });
      } catch (error) {
        copyToClipboard(referralLink, 'Referral link');
      }
    } else {
      copyToClipboard(referralLink, 'Referral link');
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center space-x-3 text-white">
          <Gift className="w-6 h-6 text-yellow-500" />
          <span>Refer & Earn</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-full mx-auto mb-2">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-white">{stats.totalReferrals}</p>
            <p className="text-xs text-gray-400">Referrals</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-green-500/20 rounded-full mx-auto mb-2">
              <Gift className="w-6 h-6 text-green-400" />
            </div>
            <p className="text-2xl font-bold text-white">ETB {stats.totalEarnings}</p>
            <p className="text-xs text-gray-400">Earned</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-yellow-500/20 rounded-full mx-auto mb-2">
              <Gift className="w-6 h-6 text-yellow-400" />
            </div>
            <p className="text-2xl font-bold text-white">{stats.availableCoupons}</p>
            <p className="text-xs text-gray-400">Coupons</p>
          </div>
        </div>

        {/* Referral Code Section */}
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Your Referral Code
            </label>
            <div className="flex space-x-2">
              <Input
                value={referralCode}
                readOnly
                className="bg-gray-700 border-gray-600 text-white flex-1"
              />
              <Button
                onClick={() => copyToClipboard(referralCode, 'Referral code')}
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Referral Link
            </label>
            <div className="flex space-x-2">
              <Input
                value={referralLink}
                readOnly
                className="bg-gray-700 border-gray-600 text-white flex-1 text-sm"
              />
              <Button
                onClick={shareReferralLink}
                className="bg-yellow-500 hover:bg-yellow-600 text-black"
                size="sm"
              >
                <Share className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-gray-700/50 rounded-lg p-4">
          <h4 className="font-semibold text-white mb-2">How it Works</h4>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Share your referral code with friends</li>
            <li>• They get ETB 25 bonus on signup</li>
            <li>• You earn ETB 25 when they complete first ride</li>
            <li>• Collect coupons for wallet top-ups and discounts</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReferralEarnCard;
