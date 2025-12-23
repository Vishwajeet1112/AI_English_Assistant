
import React, { useState } from 'react';
import { UserType, Message } from '../../types';
import * as geminiService from '../../services/geminiService';
import Button from '../shared/Button';
import Icon from '../shared/Icon';
import Spinner from '../shared/Spinner';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { useTextToSpeech } from '../../hooks/useTextToSpeech';

interface RolePlayProps {
    userName: string;
}

const getScenarios = (userName: string) => ({
    'Job Interview': `You are a hiring manager for a tech company. The candidate's name is ${userName}. Start the interview by asking ${userName} to introduce themselves. Be encouraging but professional.`,
    'Customer Call': `You are a customer service representative. The customer's name is ${userName}. ${userName} has a problem about a recent order. Start the call by greeting them by name and asking how you can help.`,
    'Presentation Q&A': `You are an audience member at a business presentation given by ${userName}. Address ${userName} by name and ask insightful questions about their presentation on "Quarterly Sales Performance".`
});

type Scenario = 'Job Interview' | 'Customer Call' | 'Presentation Q&A';

const RolePlaySimulations: React.FC<RolePlayProps> = ({ userName }) => {
    const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [history, setHistory] = useState<{role: string, parts: {text: string}[]}[]>([]);
    
    const { transcript, isListening, startListening, stopListening } = useSpeechRecognition();
    const { speak, isSpeaking } = useTextToSpeech();

    const scenarios = getScenarios(userName);

    React.useEffect(() => {
      if (transcript) setInput(transcript);
    }, [transcript]);

    const startScenario = async (scenario: Scenario) => {
        setSelectedScenario(scenario);
        setIsLoading(true);
        setMessages([]);
        const systemInstruction = scenarios[scenario];
        const initialPrompt = "I am ready to start the simulation.";
        
        try {
            const response = await geminiService.getChatResponse(initialPrompt, [], systemInstruction);
            const aiText = response.text;
            const aiMessage: Message = { id: Date.now().toString(), text: aiText, sender: 'ai' };
            setMessages([aiMessage]);
            setHistory([{ role: 'user', parts: [{text: initialPrompt}] }, { role: 'model', parts: [{text: aiText}] }]);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSend = async () => {
        if (!input.trim() || !selectedScenario) return;

        const userMessage: Message = { id: Date.now().toString(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        
        try {
            const response = await geminiService.getChatResponse(input, history, scenarios[selectedScenario]);
            const aiText = response.text;
            const aiMessage: Message = { id: (Date.now() + 1).toString(), text: aiText, sender: 'ai' };
            setMessages(prev => [...prev, aiMessage]);
            setHistory(prev => [...prev, { role: 'user', parts: [{text: input}] }, { role: 'model', parts: [{text: aiText}] }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!selectedScenario) {
        return (
            <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Role-Play Simulations</h2>
                <p className="text-slate-600 mb-6">Hi {userName}, choose a professional scenario to practice your English skills in a safe environment.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(Object.keys(scenarios) as Scenario[]).map(key => (
                        <button 
                            key={key} 
                            onClick={() => startScenario(key)} 
                            disabled={isLoading}
                            className="p-6 border-2 border-slate-100 rounded-xl text-left hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
                        >
                            <div className="bg-slate-100 group-hover:bg-white p-3 rounded-lg w-fit mb-3">
                                <Icon name="briefcase" className="w-6 h-6 text-indigo-600" />
                            </div>
                            <h4 className="font-bold text-slate-800">{key}</h4>
                            <p className="text-sm text-slate-500 mt-1">Practice conversation skills for this real-world scenario.</p>
                        </button>
                    ))}
                </div>
                 {isLoading && <div className="flex justify-center p-8"><Spinner className="w-8 h-8 text-indigo-600"/></div>}
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Simulation: {selectedScenario}</h2>
                <p className="text-sm text-indigo-600 font-medium">Acting as: AI Simulation Host</p>
              </div>
              <Button onClick={() => setSelectedScenario(null)} variant="ghost" className="text-red-500 hover:bg-red-50">End Simulation</Button>
            </div>
            
            <div className="h-[400px] bg-slate-50 rounded-xl p-4 overflow-y-auto mb-4 border border-slate-200 shadow-inner">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex items-start gap-3 my-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                        {msg.sender === 'ai' && <div className="w-8 h-8 bg-indigo-500 rounded-full flex-shrink-0 flex items-center justify-center shadow-sm"><Icon name="briefcase" className="w-5 h-5 text-white" /></div>}
                        <div className={`p-4 rounded-2xl max-w-[80%] shadow-sm ${msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-800'}`}>
                            <p className="text-sm sm:text-base" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                            {msg.sender === 'ai' && (
                                <button onClick={() => speak(msg.text)} disabled={isSpeaking} className="text-slate-400 hover:text-indigo-600 mt-2 transition-colors">
                                    <Icon name="speaker" className="w-4 h-4"/>
                                </button>
                            )}
                        </div>
                        {msg.sender === 'user' && <div className="w-8 h-8 bg-slate-300 rounded-full flex-shrink-0 flex items-center justify-center shadow-sm"><Icon name="profile" className="w-5 h-5 text-slate-600" /></div>}
                    </div>
                ))}
                {isLoading && (
                   <div className="flex justify-start">
                     <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200">
                       <Spinner className="text-indigo-600"/>
                     </div>
                   </div>
                )}
            </div>
             <div className="flex items-center gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Respond to the scenario..."
                  className="flex-1 p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 shadow-sm"
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <Button onClick={handleSend} isLoading={isLoading} disabled={!input.trim()} className="rounded-xl h-12 w-12 !p-0"><Icon name="send" className="w-5 h-5"/></Button>
                <button onClick={isListening ? stopListening : startListening} className={`h-12 w-12 flex items-center justify-center rounded-xl transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                    {isListening ? <Icon name="stop" className="w-5 h-5" /> : <Icon name="microphone" className="w-5 h-5" />}
                </button>
            </div>
        </div>
    );
};

export default RolePlaySimulations;
