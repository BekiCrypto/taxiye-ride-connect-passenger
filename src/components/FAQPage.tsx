
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const FAQPage = ({ onBack }: { onBack: () => void }) => {
  const faqs = [
    {
      question: "How do I cancel a ride?",
      answer: "You can cancel your ride from the trip screen before the driver arrives. Cancellation fees may apply if canceled after the driver has been assigned for more than 2 minutes."
    },
    {
      question: "How are fares calculated?",
      answer: "Fares include a base rate plus distance and time charges. During peak hours or high demand, surge pricing may apply. You'll see the estimated fare before confirming your ride."
    },
    {
      question: "What payment methods are accepted?",
      answer: "We accept cash payments, wallet balance top-ups, and mobile money (Telebirr, CBE Birr, M-Birr). You can add funds to your wallet through the app."
    },
    {
      question: "How long does it take to find a driver?",
      answer: "Typically 2-5 minutes depending on your location and time of day. During peak hours or in remote areas, it may take slightly longer."
    },
    {
      question: "Can I schedule a ride in advance?",
      answer: "Yes! You can schedule rides up to 7 days in advance. Go to the main screen and select \"Schedule Ride\" to set your pickup time and date."
    },
    {
      question: "What if I left something in the vehicle?",
      answer: "Contact support immediately at 6065 or through our chatbots. We'll help you get in touch with your driver to retrieve lost items."
    },
    {
      question: "How do I rate my driver?",
      answer: "After each ride, you'll be prompted to rate your experience from 1-5 stars and leave optional feedback. This helps us maintain service quality."
    },
    {
      question: "Is it safe to ride with Taxiye?",
      answer: "All drivers undergo background checks and vehicle inspections. You can share your trip details with contacts, and we monitor all rides for safety."
    },
    {
      question: "How do I report an issue with my ride?",
      answer: "You can report issues through the app after your ride, call support at 6065, or chat with our AI assistants on WhatsApp/Telegram at 6055."
    },
    {
      question: "Can I request a specific driver?",
      answer: "Currently, drivers are automatically matched based on proximity and availability. However, you can add drivers you've had good experiences with as favorites."
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
          <h1 className="text-xl font-bold text-white">Frequently Asked Questions</h1>
        </div>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Common Questions</CardTitle>
          </CardHeader>
          
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-gray-700">
                  <AccordionTrigger className="text-white hover:text-yellow-500 text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    {faq.answer}
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

export default FAQPage;
