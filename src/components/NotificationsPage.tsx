
import React, { useState } from 'react';
import { ArrowLeft, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import AppFooter from '@/components/AppFooter';

const NotificationsPage = ({ onBack }: { onBack: () => void }) => {
  const [settings, setSettings] = useState({
    pushNotifications: true,
    rideUpdates: true,
    promotions: true,
    smsNotifications: true,
    emailNotifications: true
  });
  const { toast } = useToast();

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    toast({
      title: "Settings Updated",
      description: "Your notification preferences have been saved.",
    });
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
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-white">Notifications</h1>
            <div className="w-6 h-6">
              <img 
                src="https://cmsprod.taxiye.com/uploads/taxiye_logo_main_09d8b73c2f.svg" 
                alt="Taxiye" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Bell className="w-5 h-5 mr-2 text-yellow-500" />
              Notification Settings
            </CardTitle>
            <p className="text-yellow-500 text-sm font-medium">Always moving!</p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Push Notifications</p>
                <p className="text-gray-400 text-sm">Receive notifications on your device</p>
              </div>
              <Switch
                checked={settings.pushNotifications}
                onCheckedChange={() => handleToggle('pushNotifications')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Ride Updates</p>
                <p className="text-gray-400 text-sm">Driver arrival, trip start/end updates</p>
              </div>
              <Switch
                checked={settings.rideUpdates}
                onCheckedChange={() => handleToggle('rideUpdates')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">SMS Notifications</p>
                <p className="text-gray-400 text-sm">Text messages for important updates</p>
              </div>
              <Switch
                checked={settings.smsNotifications}
                onCheckedChange={() => handleToggle('smsNotifications')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Email Notifications</p>
                <p className="text-gray-400 text-sm">Trip receipts and account updates</p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={() => handleToggle('emailNotifications')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Promotions</p>
                <p className="text-gray-400 text-sm">Special offers and discounts</p>
              </div>
              <Switch
                checked={settings.promotions}
                onCheckedChange={() => handleToggle('promotions')}
              />
            </div>
          </CardContent>
        </Card>

        <AppFooter />
      </div>
    </div>
  );
};

export default NotificationsPage;
