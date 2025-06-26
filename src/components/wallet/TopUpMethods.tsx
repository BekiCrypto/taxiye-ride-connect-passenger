
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, Smartphone, Building2 } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import TelebirrTopUp from './TelebirrTopUp';
import CardPaymentTopUp from './CardPaymentTopUp';
import BankTransferTopUp from './BankTransferTopUp';

interface TopUpMethodsProps {
  openTopUpMethod: string | null;
  onToggleTopUpMethod: (methodId: string) => void;
}

const TopUpMethods = ({ openTopUpMethod, onToggleTopUpMethod }: TopUpMethodsProps) => {
  const topUpMethods = [
    { 
      id: 'card',
      icon: CreditCard, 
      name: 'Credit/Debit Card', 
      description: 'Visa, Mastercard',
      color: 'text-blue-500',
      component: CardPaymentTopUp
    },
    { 
      id: 'telebirr',
      icon: Smartphone, 
      name: 'Telebirr', 
      description: 'Mobile money',
      color: 'text-green-500',
      component: TelebirrTopUp
    },
    { 
      id: 'bank',
      icon: Building2, 
      name: 'Bank Transfer', 
      description: 'Direct transfer',
      color: 'text-purple-500',
      component: BankTransferTopUp
    },
  ];

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white text-lg">Top-up Methods</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {topUpMethods.map((method) => {
          const Icon = method.icon;
          const TopUpComponent = method.component;
          const isOpen = openTopUpMethod === method.id;
          
          return (
            <div key={method.id}>
              <Collapsible open={isOpen} onOpenChange={() => onToggleTopUpMethod(method.id)}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start h-14 text-white hover:bg-gray-700"
                  >
                    <Icon className={`w-5 h-5 mr-3 ${method.color}`} />
                    <div className="text-left flex-1">
                      <p className="font-medium">{method.name}</p>
                      <p className="text-sm text-gray-400">{method.description}</p>
                    </div>
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-3">
                  <TopUpComponent />
                </CollapsibleContent>
              </Collapsible>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default TopUpMethods;
