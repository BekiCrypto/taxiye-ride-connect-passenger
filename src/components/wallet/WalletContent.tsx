
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, Plus, History, CreditCard, Smartphone, Building2 } from 'lucide-react';
import AppFooter from '@/components/AppFooter';

const WalletContent = () => {
  const topUpMethods = [
    { 
      icon: CreditCard, 
      name: 'Credit/Debit Card', 
      description: 'Visa, Mastercard',
      color: 'text-blue-500'
    },
    { 
      icon: Smartphone, 
      name: 'Telebirr', 
      description: 'Mobile money',
      color: 'text-green-500'
    },
    { 
      icon: Building2, 
      name: 'Bank Transfer', 
      description: 'Direct transfer',
      color: 'text-purple-500'
    },
  ];

  const transactions = [
    { id: 1, type: 'ride', description: 'Trip to Bole Airport', amount: -45.50, date: '2024-01-15' },
    { id: 2, type: 'topup', description: 'Wallet Top-up', amount: +100.00, date: '2024-01-14' },
    { id: 3, type: 'ride', description: 'Trip to Mercato', amount: -25.00, date: '2024-01-13' },
    { id: 4, type: 'ride', description: 'Trip to 4 Kilo', amount: -18.75, date: '2024-01-12' },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Logo */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 flex items-center justify-center bg-yellow-500 rounded-full p-2">
            <img 
              src="https://cmsprod.taxiye.com/uploads/taxiye_logo_main_09d8b73c2f.svg" 
              alt="Taxiye" 
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Wallet</h1>
            <p className="text-yellow-500 text-sm font-medium">Always moving!</p>
          </div>
        </div>
      </div>

      {/* Balance Card */}
      <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 border-none">
        <CardContent className="p-6 text-center">
          <Wallet className="w-12 h-12 mx-auto mb-4 text-black" />
          <p className="text-black/80 text-sm font-medium">Current Balance</p>
          <p className="text-3xl font-bold text-black">ETB 125.50</p>
          <Button 
            className="mt-4 bg-black text-yellow-500 hover:bg-gray-900 font-semibold"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Money
          </Button>
        </CardContent>
      </Card>

      {/* Top-up Methods */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white text-lg">Top-up Methods</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {topUpMethods.map((method, index) => {
            const Icon = method.icon;
            return (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start h-14 text-white hover:bg-gray-700"
              >
                <Icon className={`w-5 h-5 mr-3 ${method.color}`} />
                <div className="text-left">
                  <p className="font-medium">{method.name}</p>
                  <p className="text-sm text-gray-400">{method.description}</p>
                </div>
              </Button>
            );
          })}
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white text-lg">Recent Transactions</CardTitle>
          <Button variant="ghost" size="sm" className="text-yellow-500">
            <History className="w-4 h-4 mr-1" />
            View All
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between py-2">
              <div>
                <p className="text-white font-medium">{transaction.description}</p>
                <p className="text-gray-400 text-sm">{transaction.date}</p>
              </div>
              <p className={`font-semibold ${
                transaction.amount > 0 ? 'text-green-500' : 'text-red-400'
              }`}>
                {transaction.amount > 0 ? '+' : ''}ETB {Math.abs(transaction.amount).toFixed(2)}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      <AppFooter />
    </div>
  );
};

export default WalletContent;
