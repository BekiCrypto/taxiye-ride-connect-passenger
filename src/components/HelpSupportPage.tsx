
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FAQPage from './FAQPage';
import SupportOptions from './SupportOptions';
import SupportTicketForm from './SupportTicketForm';

const HelpSupportPage = ({ onBack }: { onBack: () => void }) => {
  const [showFAQ, setShowFAQ] = useState(false);

  if (showFAQ) {
    return <FAQPage onBack={() => setShowFAQ(false)} />;
  }

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

        <SupportOptions onShowFAQ={() => setShowFAQ(true)} />
        
        <SupportTicketForm />
      </div>
    </div>
  );
};

export default HelpSupportPage;
