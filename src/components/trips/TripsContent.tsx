
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Clock, 
  Star, 
  Calendar,
  Navigation,
  History
} from 'lucide-react';
import AppFooter from '@/components/AppFooter';

interface TripsContentProps {
  onViewTripHistory: () => void;
}

const TripsContent = ({ onViewTripHistory }: TripsContentProps) => {
  const recentTrips = [
    {
      id: 1,
      from: 'Bole International Airport',
      to: 'Addis Ababa University',
      date: '2024-01-15',
      time: '14:30',
      fare: 45.50,
      status: 'completed',
      rating: 5,
      driver: 'Alemayehu K.',
      vehicle: 'Toyota Corolla'
    },
    {
      id: 2,
      from: 'Mercato',
      to: 'Piazza',
      date: '2024-01-14',
      time: '09:15',
      fare: 25.00,
      status: 'completed',
      rating: 4,
      driver: 'Meseret T.',
      vehicle: 'Hyundai Elantra'
    },
    {
      id: 3,
      from: '4 Kilo',
      to: 'Sarbet',
      date: '2024-01-13',
      time: '18:45',
      fare: 18.75,
      status: 'completed',
      rating: 5,
      driver: 'Dawit M.',
      vehicle: 'Toyota Yaris'
    }
  ];

  const upcomingTrips = [
    {
      id: 4,
      from: 'Home',
      to: 'Office',
      date: '2024-01-16',
      time: '08:00',
      status: 'scheduled',
      estimatedFare: 32.00
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header with Logo */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 flex items-center justify-center bg-yellow-500 rounded-full p-2">
            <img 
              src="https://cmsprod.taxiye.com/uploads/taxiye_logo_main_09d8b73c2f.svg" 
              alt="Taxiye" 
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Trips</h1>
            <p className="text-yellow-500 text-sm font-medium">Always moving!</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-yellow-500"
          onClick={onViewTripHistory}
        >
          <History className="w-4 h-4 mr-1" />
          View All
        </Button>
      </div>

      {/* Trip Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 text-center">
            <Navigation className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
            <p className="text-2xl font-bold text-white">23</p>
            <p className="text-gray-400 text-sm">Total Trips</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 text-center">
            <Star className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
            <p className="text-2xl font-bold text-white">4.9</p>
            <p className="text-gray-400 text-sm">Avg Rating</p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Trips */}
      {upcomingTrips.length > 0 && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-yellow-500" />
              Upcoming Trips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingTrips.map((trip) => (
              <div key={trip.id} className="border border-gray-700 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <MapPin className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-white text-sm">{trip.from}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 text-red-500 mr-2" />
                      <span className="text-white text-sm">{trip.to}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                    Scheduled
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-400">
                    <Clock className="w-4 h-4 mr-1" />
                    {trip.date} at {trip.time}
                  </div>
                  <div className="text-white font-semibold">
                    ~ETB {trip.estimatedFare.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Recent Trips */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white text-lg">Recent Trips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentTrips.map((trip) => (
            <div key={trip.id} className="border border-gray-700 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <MapPin className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-white text-sm">{trip.from}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 text-red-500 mr-2" />
                    <span className="text-white text-sm">{trip.to}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center mb-1">
                    {[...Array(trip.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  <Badge variant="secondary" className="bg-green-900 text-green-300">
                    Completed
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-gray-400">
                  <Clock className="w-4 h-4 mr-1" />
                  {trip.date} at {trip.time}
                </div>
                <div className="text-white font-semibold">
                  ETB {trip.fare.toFixed(2)}
                </div>
              </div>
              
              <div className="mt-2 text-xs text-gray-400">
                Driver: {trip.driver} • {trip.vehicle}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <AppFooter />
    </div>
  );
};

export default TripsContent;
