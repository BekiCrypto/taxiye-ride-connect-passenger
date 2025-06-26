
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import TelebirrTopUp from '@/components/wallet/TelebirrTopUp';
import BankTransferTopUp from '@/components/wallet/BankTransferTopUp';
import CardPaymentTopUp from '@/components/wallet/CardPaymentTopUp';

const WalletContent = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Wallet</h2>
      
      {/* Balance Card */}
      <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 border-0">
        <CardContent className="p-6 text-center">
          <p className="text-black/70 text-sm mb-2">Current Balance</p>
          <p className="text-3xl font-bold text-black">ETB 450.00</p>
        </CardContent>
      </Card>

      {/* Top-up Options with Accordion */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white">Top-up Options</h3>
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="telebirr" className="border-gray-700">
            <AccordionTrigger className="text-white hover:text-yellow-500 hover:no-underline">
              Telebirr Top-up
            </AccordionTrigger>
            <AccordionContent>
              <TelebirrTopUp />
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="bank-transfer" className="border-gray-700">
            <AccordionTrigger className="text-white hover:text-yellow-500 hover:no-underline">
              Bank Transfer
            </AccordionTrigger>
            <AccordionContent>
              <BankTransferTopUp />
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="card-payment" className="border-gray-700">
            <AccordionTrigger className="text-white hover:text-yellow-500 hover:no-underline">
              Card Payment
            </AccordionTrigger>
            <AccordionContent>
              <CardPaymentTopUp />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Recent Transactions */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-white font-medium">Ride Payment</p>
                <p className="text-gray-400 text-sm">Today, 2:30 PM</p>
              </div>
              <p className="text-red-400 font-medium">-ETB 85.00</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-white font-medium">Telebirr Top-up</p>
                <p className="text-gray-400 text-sm">Yesterday, 5:15 PM</p>
              </div>
              <p className="text-green-400 font-medium">+ETB 200.00</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WalletContent;
