
import React, { useState, useCallback } from 'react';
import { UserType } from './types';
import HeroSection from './components/home/HeroSection';
import LearningDashboard from './components/learning/LearningDashboard';
import Header from './components/shared/Header';
import Footer from './components/shared/Footer';

const App: React.FC = () => {
  const [userType, setUserType] = useState<UserType | null>(null);
  const [userName, setUserName] = useState<string>('');

  const handleUserTypeSelect = useCallback((type: UserType) => {
    setUserType(type);
  }, []);

  const handleGoHome = useCallback(() => {
    setUserType(null);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans antialiased">
      <Header onGoHome={handleGoHome} showHomeButton={!!userType} />
      <main className="flex-grow container mx-auto px-4 py-8">
        {!userType ? (
          <HeroSection 
            onSelect={handleUserTypeSelect} 
            userName={userName} 
            setUserName={setUserName} 
          />
        ) : (
          <LearningDashboard userType={userType} userName={userName} />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default App;
