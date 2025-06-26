
import React from 'react';
import { History } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TripsContentProps {
  onViewTripHistory: () => void;
}

const TripsContent = ({ onViewTripHistory }: TripsContentProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Trips</h2>
        <Button
          onClick={onViewTripHistory}
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
        >
          View All History
        </Button>
      </div>
      
      <div className="text-center py-12">
        <History className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Your Trips</h3>
        <p className="text-gray-400 mb-6">
          View your complete trip history with detailed information about each ride.
        </p>
        <Button
          onClick={onViewTripHistory}
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-3"
        >
          View Trip History
        </Button>
      </div>
    </div>
  );
};

export default TripsContent;
