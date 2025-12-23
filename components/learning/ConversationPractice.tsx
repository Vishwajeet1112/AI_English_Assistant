
import React from 'react';
import { UserType } from '../../types';
import Chatbot from './Chatbot';

const ConversationPractice: React.FC = () => {
    return (
        <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Real-time Conversation</h2>
            <p className="text-slate-600 mb-6">Practice your speaking and listening skills by having a conversation on any topic. The AI will act as a native speaker to help you improve your fluency.</p>
            <Chatbot userType={UserType.Advanced} />
        </div>
    );
};

export default ConversationPractice;
