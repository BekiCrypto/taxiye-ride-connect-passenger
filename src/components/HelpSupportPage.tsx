
import React, { useState } from 'react';
import { ArrowLeft, Phone, Mail, MessageCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const HelpSupportPage = ({ onBack }: { onBack: () => void }) => {
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmitTicket = async () => {
    if (!contactForm.subject.trim() || !contactForm.message.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please fill in both subject and message fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Simulate ticket submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Support Ticket Submitted",
        description: "We've received your message and will respond within 24 hours.",
      });
      
      setContactForm({ subject: '', message: '' });
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Failed to submit support ticket. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const supportOptions = [
    {
      icon: Phone,
      title: 'Call Support',
      description: '6065',
      action: () => window.open('tel:6065')
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'support@taxiye.com',
      action: () => window.open('mailto:support@taxiye.com')
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp ChatBot',
      description: 'Chat with our AI assistant - 6055',
      action: () => window.open('https://wa.me/6055')
    },
    {
      icon: MessageCircle,
      title: 'Telegram ChatBot',
      description: 'Chat with our AI assistant - 6055',
      action: () => window.open('https://t.me/6055')
    }
  ];

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
          <h1 className="text-xl font-bold text-white">Help & Support</h1>
        </div>

        {/* Quick Contact Options */}
        <div className="space-y-3 mb-6">
          {supportOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <Button
                key={index}
                onClick={option.action}
                className="w-full justify-start bg-gray-800 hover:bg-gray-700 text-white border-gray-700 h-auto p-4"
                variant="outline"
              >
                <Icon className="w-5 h-5 mr-3 text-yellow-500" />
                <div className="text-left">
                  <p className="font-medium">{option.title}</p>
                  <p className="text-sm text-gray-400">{option.description}</p>
                </div>
              </Button>
            );
          })}
        </div>

        {/* Support Ticket Form */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Submit a Support Ticket</CardTitle>
            <p className="text-gray-400 text-sm">
              Describe your issue and we'll get back to you soon.
            </p>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <Input
              placeholder="Subject"
              value={contactForm.subject}
              onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
              className="bg-gray-700 border-gray-600 text-white"
            />
            
            <textarea
              placeholder="Describe your issue in detail..."
              value={contactForm.message}
              onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
              className="w-full h-32 p-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            
            <Button
              onClick={handleSubmitTicket}
              disabled={loading || !contactForm.subject.trim() || !contactForm.message.trim()}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
            >
              <Send className="w-4 h-4 mr-2" />
              {loading ? 'Submitting...' : 'Submit Ticket'}
            </Button>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card className="bg-gray-800 border-gray-700 mt-6">
          <CardHeader>
            <CardTitle className="text-white">Frequently Asked Questions</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div>
              <p className="text-white font-medium mb-1">How do I cancel a ride?</p>
              <p className="text-gray-400 text-sm">You can cancel your ride from the trip screen before the driver arrives.</p>
            </div>
            
            <div>
              <p className="text-white font-medium mb-1">How are fares calculated?</p>
              <p className="text-gray-400 text-sm">Fares are based on distance, time, and current demand in your area.</p>
            </div>
            
            <div>
              <p className="text-white font-medium mb-1">What payment methods are accepted?</p>
              <p className="text-gray-400 text-sm">We accept cash, wallet balance, and mobile money payments.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HelpSupportPage;
