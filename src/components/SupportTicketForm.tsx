
import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const SupportTicketForm = () => {
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

  return (
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
  );
};

export default SupportTicketForm;
