
import React, { useState } from 'react';
import { Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const BankTransferTopUp = () => {
  const [amount, setAmount] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const banks = [
    { id: 'cbe', name: 'Commercial Bank of Ethiopia' },
    { id: 'dashen', name: 'Dashen Bank' },
    { id: 'awash', name: 'Awash Bank' },
    { id: 'boa', name: 'Bank of Abyssinia' },
    { id: 'wegagen', name: 'Wegagen Bank' },
    { id: 'united', name: 'United Bank' }
  ];

  const handleTopUp = async () => {
    if (!amount || !selectedBank) return;
    
    setIsProcessing(true);
    // Simulate top-up processing
    setTimeout(() => {
      const bankName = banks.find(b => b.id === selectedBank)?.name;
      toast({
        title: "Transfer Initiated!",
        description: `Bank transfer of ETB ${amount} initiated from ${bankName}`,
      });
      setAmount('');
      setSelectedBank('');
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="p-4">
        <div className="flex items-center space-x-3 mb-4">
          <Building className="w-5 h-5 text-purple-500" />
          <div>
            <h3 className="font-medium text-white">Bank Transfer</h3>
            <p className="text-sm text-gray-400">Transfer from your bank account</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <Select value={selectedBank} onValueChange={setSelectedBank}>
            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
              <SelectValue placeholder="Select your bank" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              {banks.map((bank) => (
                <SelectItem key={bank.id} value={bank.id} className="text-white hover:bg-gray-600">
                  {bank.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Input
            type="number"
            placeholder="Amount (ETB)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-gray-700 border-gray-600 text-white"
            min="50"
            max="10000"
          />
          
          <Button 
            onClick={handleTopUp}
            disabled={!amount || !selectedBank || isProcessing}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white"
          >
            {isProcessing ? 'Processing...' : `Transfer ETB ${amount || '0'}`}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BankTransferTopUp;
