
import React, { useState } from 'react';
import AppFooter from '@/components/AppFooter';
import WalletHeader from './WalletHeader';
import WalletBalance from './WalletBalance';
import TopUpMethods from './TopUpMethods';
import TransactionList from './TransactionList';

const WalletContent = () => {
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [openTopUpMethod, setOpenTopUpMethod] = useState<string | null>(null);

  const allTransactions = [
    { id: 1, type: 'ride', description: 'Trip to Bole Airport', amount: -45.50, date: '2024-01-15' },
    { id: 2, type: 'topup', description: 'Wallet Top-up', amount: +100.00, date: '2024-01-14' },
    { id: 3, type: 'ride', description: 'Trip to Mercato', amount: -25.00, date: '2024-01-13' },
    { id: 4, type: 'ride', description: 'Trip to 4 Kilo', amount: -18.75, date: '2024-01-12' },
    { id: 5, type: 'topup', description: 'Telebirr Top-up', amount: +50.00, date: '2024-01-11' },
    { id: 6, type: 'ride', description: 'Trip to Piazza', amount: -32.25, date: '2024-01-10' },
    { id: 7, type: 'ride', description: 'Trip to CMC', amount: -15.50, date: '2024-01-09' },
    { id: 8, type: 'topup', description: 'Card Top-up', amount: +200.00, date: '2024-01-08' },
  ];

  const toggleTopUpMethod = (methodId: string) => {
    setOpenTopUpMethod(openTopUpMethod === methodId ? null : methodId);
  };

  const handleAddMoney = () => {
    setOpenTopUpMethod('card');
  };

  const handleToggleShowAll = () => {
    setShowAllTransactions(!showAllTransactions);
  };

  return (
    <div className="space-y-6">
      <WalletHeader />
      
      <WalletBalance 
        balance={125.50}
        onAddMoney={handleAddMoney}
      />

      <TopUpMethods 
        openTopUpMethod={openTopUpMethod}
        onToggleTopUpMethod={toggleTopUpMethod}
      />

      <TransactionList 
        transactions={allTransactions}
        showAllTransactions={showAllTransactions}
        onToggleShowAll={handleToggleShowAll}
      />

      <AppFooter />
    </div>
  );
};

export default WalletContent;
