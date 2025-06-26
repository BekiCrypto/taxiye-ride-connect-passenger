import React from 'react';
import { ArrowLeft, MessageCircle, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface ChatBotPageProps {
  onBack: () => void;
  platform: 'whatsapp' | 'telegram';
}

const ChatBotPage = ({ onBack, platform }: ChatBotPageProps) => {
  const platformName = platform === 'whatsapp' ? 'WhatsApp' : 'Telegram';
  const PlatformIcon = MessageCircle;  // Capitalized to use as component

  const chatSessions = [
    {
      id: 'session-1',
      title: 'Ride Booking Help',
      lastMessage: 'How can I book a ride for tomorrow morning?',
      timestamp: '2 hours ago',
      messages: [
        { type: 'user', content: 'How can I book a ride for tomorrow morning?', time: '10:30 AM' },
        { type: 'bot', content: 'I can help you schedule a ride! You can book rides up to 7 days in advance. Would you like me to guide you through the scheduling process?', time: '10:31 AM' },
        { type: 'user', content: 'Yes please', time: '10:32 AM' },
        { type: 'bot', content: 'Great! First, open the main screen in your Taxiye app and look for the "Schedule Ride" button. What time do you need the ride tomorrow?', time: '10:32 AM' }
      ]
    },
    {
      id: 'session-2',
      title: 'Payment Issue',
      lastMessage: 'My payment was declined, what should I do?',
      timestamp: '1 day ago',
      messages: [
        { type: 'user', content: 'My payment was declined, what should I do?', time: 'Yesterday 3:15 PM' },
        { type: 'bot', content: 'I\'m sorry to hear about the payment issue. Let me help you resolve this. Which payment method were you trying to use?', time: 'Yesterday 3:16 PM' },
        { type: 'user', content: 'Telebirr', time: 'Yesterday 3:17 PM' },
        { type: 'bot', content: 'For Telebirr payment issues, please check: 1) Your account balance, 2) Network connection, 3) Try again in a few minutes. If the problem persists, you can contact Telebirr support or use an alternative payment method like wallet top-up.', time: 'Yesterday 3:18 PM' }
      ]
    },
    {
      id: 'session-3',
      title: 'Driver Rating',
      lastMessage: 'How do I rate my driver?',
      timestamp: '2 days ago',
      messages: [
        { type: 'user', content: 'How do I rate my driver?', time: '2 days ago 6:45 PM' },
        { type: 'bot', content: 'After your ride ends, you\'ll automatically see a rating screen. You can rate your driver from 1-5 stars and leave optional feedback. This helps us maintain service quality and helps other passengers too!', time: '2 days ago 6:46 PM' },
        { type: 'user', content: 'What if I forgot to rate?', time: '2 days ago 6:47 PM' },
        { type: 'bot', content: 'You can still rate recent rides! Go to your ride history in the app, find the ride, and tap on it to see the rating option.', time: '2 days ago 6:48 PM' }
      ]
    }
  ];

  const handleStartNewChat = () => {
    const message = encodeURIComponent('Hello, I need help with Taxiye');
    const url = platform === 'whatsapp' 
      ? `https://wa.me/6055?text=${message}`
      : `https://t.me/6055?start=${message}`;
    window.open(url, '_blank');
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
          <h1 className="text-xl font-bold text-white">{platformName} ChatBot</h1>
        </div>

        <Card className="bg-gray-800 border-gray-700 mb-4">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Bot className="w-5 h-5 mr-2 text-yellow-500" />
              AI Assistant Chat History
            </CardTitle>
            <p className="text-gray-400 text-sm">
              Browse your previous conversations with our AI assistant
            </p>
          </CardHeader>
          
          <CardContent>
            <Button
              onClick={handleStartNewChat}
              className="w-full mb-4 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
            >
              <PlatformIcon className="w-4 h-4 mr-2" />
              Start New Chat on {platformName}
            </Button>

            <Accordion type="single" collapsible className="w-full">
              {chatSessions.map((session) => (
                <AccordionItem key={session.id} value={session.id} className="border-gray-700">
                  <AccordionTrigger className="text-white hover:text-yellow-500 text-left">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{session.title}</span>
                      <span className="text-sm text-gray-400">{session.timestamp}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {session.messages.map((message, index) => (
                        <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-xs px-3 py-2 rounded-lg ${
                            message.type === 'user' 
                              ? 'bg-yellow-500 text-black ml-4' 
                              : 'bg-gray-700 text-white mr-4'
                          }`}>
                            <p className="text-sm">{message.content}</p>
                            <p className="text-xs opacity-70 mt-1">{message.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChatBotPage;
