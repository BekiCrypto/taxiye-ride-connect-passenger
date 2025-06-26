
import React from 'react';

const WalletHeader = () => {
  return (
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
        </div>
      </div>
    </div>
  );
};

export default WalletHeader;
