
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Filter, MapPin, Calendar, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface TripHistoryPageProps {
  onBack: () => void;
}

interface Trip {
  id: string;
  pickup_location: string;
  dropoff_location: string;
  fare: number;
  created_at: string;
  completed_at: string;
  status: string;
  distance_km: number;
  driver_phone_ref: string;
}

const TripHistoryPage: React.FC<TripHistoryPageProps> = ({ onBack }) => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const { toast } = useToast();

  useEffect(() => {
    fetchTrips();
  }, [statusFilter, sortBy]);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to view your trip history.",
          variant: "destructive",
        });
        return;
      }

      // Get user's passenger profile
      const { data: passengerData } = await supabase
        .from('passengers')
        .select('phone')
        .eq('user_id', user.id)
        .single();

      if (!passengerData) {
        console.log('No passenger profile found');
        setTrips([]);
        return;
      }

      // Build query
      let query = supabase
        .from('rides')
        .select('*')
        .eq('passenger_phone_ref', passengerData.phone);

      // Apply status filter
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      // Apply sorting
      if (sortBy === 'newest') {
        query = query.order('created_at', { ascending: false });
      } else if (sortBy === 'oldest') {
        query = query.order('created_at', { ascending: true });
      } else if (sortBy === 'fare_high') {
        query = query.order('fare', { ascending: false });
      } else if (sortBy === 'fare_low') {
        query = query.order('fare', { ascending: true });
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching trips:', error);
        toast({
          title: "Error",
          description: "Failed to load trip history. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setTrips(data || []);
    } catch (error) {
      console.error('Error in fetchTrips:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredTrips = trips.filter(trip => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      trip.pickup_location.toLowerCase().includes(searchLower) ||
      trip.dropoff_location.toLowerCase().includes(searchLower)
    );
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400';
      case 'cancelled':
        return 'text-red-400';
      case 'pending':
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy • HH:mm');
    } catch {
      return 'Invalid date';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={onBack}
            variant="ghost"
            size="sm"
            className="text-white hover:text-yellow-500"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <h1 className="text-xl font-bold text-white">Trip History</h1>
          <div className="w-16"></div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4 mb-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by pickup or destination..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
            />
          </div>

          {/* Filter Row */}
          <div className="flex space-x-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="flex-1 bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="flex-1 bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="fare_high">Highest Fare</SelectItem>
                <SelectItem value="fare_low">Lowest Fare</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Trip List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto"></div>
              <p className="text-gray-400 mt-4">Loading trips...</p>
            </div>
          ) : filteredTrips.length === 0 ? (
            <div className="text-center py-8">
              <MapPin className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg mb-2">No trips found</p>
              <p className="text-gray-500 text-sm">
                {searchTerm ? 'Try adjusting your search criteria' : 'Your trip history will appear here after you take your first ride'}
              </p>
            </div>
          ) : (
            filteredTrips.map((trip) => (
              <Card key={trip.id} className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-start space-x-3">
                        <div className="flex flex-col items-center">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <div className="w-0.5 h-4 bg-gray-600 my-1"></div>
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-medium text-sm mb-1">
                            {trip.pickup_location}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {trip.dropoff_location}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(trip.created_at)}
                        </span>
                        {trip.distance_km && (
                          <span>{trip.distance_km.toFixed(1)} km</span>
                        )}
                        <span className={`capitalize ${getStatusColor(trip.status)}`}>
                          {trip.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-yellow-500 font-bold text-lg">
                        ETB {trip.fare?.toFixed(2) || '0.00'}
                      </p>
                    </div>
                  </div>
                  
                  {trip.status === 'completed' && (
                    <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="w-4 h-4 text-yellow-500 fill-current" />
                        ))}
                      </div>
                      <Button variant="ghost" size="sm" className="text-yellow-500 hover:text-yellow-400">
                        Rate Trip
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Summary */}
        {!loading && filteredTrips.length > 0 && (
          <Card className="bg-gray-800 border-gray-700 mt-6">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-400 text-sm">Total Trips</p>
                  <p className="text-white font-bold text-lg">{filteredTrips.length}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total Spent</p>
                  <p className="text-yellow-500 font-bold text-lg">
                    ETB {filteredTrips.reduce((sum, trip) => sum + (trip.fare || 0), 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TripHistoryPage;
