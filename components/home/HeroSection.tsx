
import React from 'react';
import { UserType } from '../../types';
import Card from '../shared/Card';
import Icon from '../shared/Icon';

interface HeroSectionProps {
  onSelect: (type: UserType) => void;
  userName: string;
  setUserName: (name: string) => void;
}

const UserTypeCard: React.FC<{ 
  type: UserType; 
  description: string; 
  icon: string; 
  onClick: () => void; 
  disabled: boolean;
}> = ({ type, description, icon, onClick, disabled }) => (
    <div
      onClick={!disabled ? onClick : undefined}
      className={`transform transition-all duration-300 ${disabled ? 'opacity-60 grayscale cursor-not-allowed' : 'hover:scale-105 cursor-pointer'}`}
    >
      <Card className="text-center h-full flex flex-col border-2 border-transparent hover:border-indigo-200">
        <div className="p-6 bg-indigo-50 flex-shrink-0">
          <div className="bg-white rounded-full w-16 h-16 mx-auto flex items-center justify-center shadow-md">
            <Icon name={icon} className="w-8 h-8 text-indigo-600" />
          </div>
        </div>
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-xl font-semibold text-slate-800">{type}</h3>
          <p className="mt-2 text-slate-500 flex-grow text-sm">{description}</p>
          <div className="mt-6">
            <span className={`inline-block px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${disabled ? 'bg-slate-200 text-slate-400' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>
              {disabled ? 'Enter name first' : 'Select Path'}
            </span>
          </div>
        </div>
      </Card>
    </div>
);


const HeroSection: React.FC<HeroSectionProps> = ({ onSelect, userName, setUserName }) => {
  const isNameEmpty = !userName.trim();

  return (
    <div className="text-center py-10">
      <h2 className="text-4xl font-black text-slate-900 sm:text-5xl md:text-6xl tracking-tight">
        Welcome to <span className="text-indigo-600">Your English Page</span>
      </h2>
      <p className="mt-6 max-w-2xl mx-auto text-xl text-slate-500 leading-relaxed">
        Experience AI-powered learning tailored just for you. Please introduce yourself to begin.
      </p>

      <div className="mt-12 max-w-sm mx-auto">
        <label htmlFor="user-name" className="block text-sm font-bold text-black mb-3 uppercase tracking-widest">
          What is your name?
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Icon name="profile" className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          </div>
          <input
            type="text"
            name="user-name"
            id="user-name"
            className="block w-full pl-12 pr-4 py-4 sm:text-lg border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none bg-white shadow-sm text-black placeholder-slate-400"
            placeholder="e.g. Alex"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>
        {isNameEmpty && <p className="mt-3 text-xs text-indigo-400 font-medium italic">Your name helps our AI personalize your journey.</p>}
      </div>

      <div className="mt-16 max-w-6xl mx-auto grid gap-6 md:grid-cols-3 px-4">
        <UserTypeCard
          type={UserType.Beginner}
          description="Perfect for starting from scratch. Basic grammar, vocabulary, and simple interactive conversations."
          icon="book"
          disabled={isNameEmpty}
          onClick={() => onSelect(UserType.Beginner)}
        />
        <UserTypeCard
          type={UserType.Advanced}
          description="Deepen your fluency with complex topics, natural expressions, and real-time speech practice."
          icon="language"
          disabled={isNameEmpty}
          onClick={() => onSelect(UserType.Advanced)}
        />
        <UserTypeCard
          type={UserType.Professional}
          description="Business-focused training for emails, presentations, and professional role-play simulations."
          icon="briefcase"
          disabled={isNameEmpty}
          onClick={() => onSelect(UserType.Professional)}
        />
      </div>
    </div>
  );
};

export default HeroSection;
