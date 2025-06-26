
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { History } from 'lucide-react';

interface Transaction {
  id: number;
  type: string;
  description: string;
  amount: number;
  date: string;
}

interface TransactionListProps {
  transactions: Transaction[];
  showAllTransactions: boolean;
  onToggleShowAll: () => void;
}

const TransactionList = ({ transactions, showAllTransactions, onToggleShowAll }: TransactionListProps) => {
  const displayedTransactions = showAllTransactions ? transactions : transactions.slice(0, 4);

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white text-lg">Recent Transactions</CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-yellow-500"
          onClick={onToggleShowAll}
        >
          <History className="w-4 h-4 mr-1" />
          {showAllTransactions ? 'Show Less' : 'View All'}
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {displayedTransactions.map((transaction) => (
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
  );
};

export default TransactionList;
