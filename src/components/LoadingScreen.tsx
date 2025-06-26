
import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center">
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-6 animate-pulse bg-yellow-500 rounded-full p-4">
          <img 
            src="https://cmsprod.taxiye.com/uploads/taxiye_logo_main_09d8b73c2f.svg" 
            alt="Taxiye" 
            className="w-full h-full object-contain"
          />
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-2">Taxiye</h1>
        <p className="text-yellow-500 font-semibold mb-6">Always moving!</p>
        
        <div className="flex items-center justify-center space-x-1">
          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
      
      {/* Copyright at bottom */}
      <div className="absolute bottom-8 text-center">
        <p className="text-gray-400 text-xs">Copyright © Taxiye — Always moving!</p>
        <p className="text-gray-500 text-xs mt-1">Developed by Elnet Technologies PLC</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
