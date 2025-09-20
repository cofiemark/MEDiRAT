import React from 'react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-800 text-sm text-gray-500 dark:text-gray-400 p-4 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-center sm:text-left space-y-2 sm:space-y-0">
        <span>© {currentYear} MEDiRAT®. All rights reserved.</span>
        <span className="font-medium">Support: +233-244663040</span>
      </div>
    </footer>
  );
};