
import React from 'react';
import { Phone, Mail, MessageCircle, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SupportOptionsProps {
  onShowFAQ: () => void;
  onShowWhatsApp: () => void;
  onShowTelegram: () => void;
}

const SupportOptions = ({ onShowFAQ, onShowWhatsApp, onShowTelegram }: SupportOptionsProps) => {
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
      action: onShowWhatsApp
    },
    {
      icon: MessageCircle,
      title: 'Telegram ChatBot',
      description: 'Chat with our AI assistant - 6055',
      action: onShowTelegram
    }
  ];

  return (
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
      
      {/* FAQ Button */}
      <Button
        onClick={onShowFAQ}
        className="w-full justify-start bg-gray-800 hover:bg-gray-700 text-white border-gray-700 h-auto p-4"
        variant="outline"
      >
        <HelpCircle className="w-5 h-5 mr-3 text-yellow-500" />
        <div className="text-left">
          <p className="font-medium">Frequently Asked Questions</p>
          <p className="text-sm text-gray-400">Find answers to common questions</p>
        </div>
      </Button>
    </div>
  );
};

export default SupportOptions;
