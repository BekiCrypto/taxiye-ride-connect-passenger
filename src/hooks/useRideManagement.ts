
import { useState } from 'react';

export const useRideManagement = () => {
  const [isRideInProgress, setIsRideInProgress] = useState(false);
  const [rideProgress, setRideProgress] = useState(0);
  const [rideData, setRideData] = useState<any>(null);

  const handleRideStart = (rideInfo: any) => {
    setIsRideInProgress(true);
    setRideData(rideInfo);
    setRideProgress(20);

    // Simulate ride progress
    const interval = setInterval(() => {
      setRideProgress((prevProgress) => {
        const newProgress = Math.min(prevProgress + 20, 100);
        if (newProgress === 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsRideInProgress(false);
            setRideProgress(0);
            setRideData(null);
          }, 3000);
        }
        return newProgress;
      });
    }, 2000);
  };

  return {
    isRideInProgress,
    rideProgress,
    rideData,
    handleRideStart
  };
};
