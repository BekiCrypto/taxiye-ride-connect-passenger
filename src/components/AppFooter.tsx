
import React from 'react';

const AppFooter = () => {
  return (
    <div className="text-center py-4 mt-8 border-t border-gray-700">
      <div className="flex items-center justify-center mb-2">
        <div className="w-6 h-6 mr-2">
          <img 
            src="https://cmsprod.taxiye.com/uploads/taxiye_logo_main_09d8b73c2f.svg" 
            alt="Taxiye" 
            className="w-full h-full object-contain"
          />
        </div>
        <span className="text-yellow-500 font-medium text-sm">Always moving!</span>
      </div>
      <p className="text-gray-400 text-xs">Copyright © Taxiye — Always moving!</p>
      <p className="text-gray-500 text-xs mt-1">Developed by Elnet Technologies PLC</p>
    </div>
  );
};

export default AppFooter;
