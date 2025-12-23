
import React from 'react';
import Icon from './Icon';

interface HeaderProps {
  onGoHome: () => void;
  showHomeButton: boolean;
}

const Header: React.FC<HeaderProps> = ({ onGoHome, showHomeButton }) => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
            <Icon name="language" className="text-white w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">AI English Assistant</h1>
        </div>
        {showHomeButton && (
          <button
            onClick={onGoHome}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors duration-200"
          >
            <Icon name="home" className="w-5 h-5" />
            <span>Home</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
