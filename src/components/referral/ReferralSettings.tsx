
export interface ReferralConfig {
  referrerBonus: number;
  refereeBonus: number;
  minimumRidesForBonus: number;
  couponTypes: {
    walletTopup: {
      enabled: boolean;
      amounts: number[];
    };
    rideDiscount: {
      enabled: boolean;
      percentages: number[];
    };
  };
  referralMessages: {
    shareText: string;
    howItWorksSteps: string[];
  };
}

// Default configuration - can be easily modified by marketing team
export const defaultReferralConfig: ReferralConfig = {
  referrerBonus: 25,
  refereeBonus: 25,
  minimumRidesForBonus: 1,
  couponTypes: {
    walletTopup: {
      enabled: true,
      amounts: [25, 50, 100]
    },
    rideDiscount: {
      enabled: true,
      percentages: [10, 15, 20]
    }
  },
  referralMessages: {
    shareText: "Use my referral code {code} and get ETB {bonus} bonus when you sign up!",
    howItWorksSteps: [
      "Share your referral code with friends",
      "They get ETB {refereeBonus} bonus on signup",
      "You earn ETB {referrerBonus} when they complete first ride",
      "Collect coupons for wallet top-ups and discounts"
    ]
  }
};

// Utility function to get formatted messages
export const getFormattedMessage = (template: string, config: ReferralConfig, code?: string) => {
  return template
    .replace('{code}', code || 'YOUR_CODE')
    .replace('{bonus}', config.refereeBonus.toString())
    .replace('{refereeBonus}', config.refereeBonus.toString())
    .replace('{referrerBonus}', config.referrerBonus.toString());
};
