
import React, { useState } from 'react';
import { UserType, Feature } from '../../types';
import { FEATURES_BY_USER_TYPE } from '../../constants';
import Chatbot from './Chatbot';
import PronunciationChecker from './PronunciationChecker';
import VocabularyBuilder from './VocabularyBuilder';
import TranslationTool from './TranslationTool';
import VisualLearning from './VisualLearning';
import GrammarLessons from './GrammarLessons';
import ConversationPractice from './ConversationPractice';
import WritingAssistant from './WritingAssistant';
import ListeningExercises from './ListeningExercises';
import RolePlaySimulations from './RolePlaySimulations';
import EmailAssistant from './EmailAssistant';
import IndustryVocabulary from './IndustryVocabulary';

interface LearningDashboardProps {
  userType: UserType;
  userName: string;
}

const featureComponentMap: Record<Feature, React.ComponentType<any>> = {
    [Feature.Chatbot]: Chatbot,
    [Feature.Pronunciation]: PronunciationChecker,
    [Feature.Vocabulary]: VocabularyBuilder,
    [Feature.Translation]: TranslationTool,
    [Feature.VisualLearning]: VisualLearning,
    [Feature.Grammar]: GrammarLessons,
    [Feature.Conversation]: ConversationPractice,
    [Feature.Writing]: WritingAssistant,
    [Feature.Listening]: ListeningExercises,
    [Feature.Simulations]: RolePlaySimulations,
    [Feature.Email]: EmailAssistant,
    [Feature.IndustryVocab]: IndustryVocabulary,
};

const LearningDashboard: React.FC<LearningDashboardProps> = ({ userType, userName }) => {
  const availableFeatures = FEATURES_BY_USER_TYPE[userType];
  const [activeFeature, setActiveFeature] = useState<Feature>(availableFeatures[0]);

  const ActiveComponent = featureComponentMap[activeFeature];
  
  return (
    <div className="flex flex-col md:flex-row gap-8">
      <aside className="md:w-1/4 lg:w-1/5">
        <div className="bg-white p-4 rounded-xl shadow-lg sticky top-8">
          <h3 className="text-lg font-semibold text-slate-800 mb-1">Welcome, {userName}!</h3>
          <p className="text-indigo-600 font-medium mb-4 text-sm">{userType}</p>
          <hr className="mb-4 border-slate-100" />
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">Learning Tools</h4>
          <nav className="flex flex-col space-y-1">
            {availableFeatures.map((feature) => (
              <button
                key={feature}
                onClick={() => setActiveFeature(feature)}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeFeature === feature
                    ? 'bg-indigo-600 text-white shadow-md transform translate-x-1'
                    : 'bg-transparent text-slate-600 hover:bg-slate-50'
                }`}
              >
                {feature}
              </button>
            ))}
          </nav>
        </div>
      </aside>
      <div className="flex-1">
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg min-h-[600px]">
          {ActiveComponent ? (
            <ActiveComponent userType={userType} userName={userName} />
          ) : (
            <p>Select a feature to get started.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LearningDashboard;
