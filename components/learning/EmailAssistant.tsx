
import React, { useState } from 'react';
import * as geminiService from '../../services/geminiService';
import Button from '../shared/Button';
import Spinner from '../shared/Spinner';
import Card from '../shared/Card';

const EmailAssistant: React.FC = () => {
    const [emailText, setEmailText] = useState('');
    const [feedback, setFeedback] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGetFeedback = async () => {
        if (!emailText.trim()) return;
        setIsLoading(true);
        setFeedback('');
        const result = await geminiService.getEmailFeedback(emailText);
        setFeedback(result);
        setIsLoading(false);
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Email Assistant</h2>
            <p className="text-slate-600 mb-6">Draft a professional email below. Our AI will check it for tone, clarity, and grammatical errors to ensure it's ready to send.</p>
            
            <textarea
                value={emailText}
                onChange={(e) => setEmailText(e.target.value)}
                placeholder="Subject: Project Update..."
                className="w-full p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 h-72 mb-4"
            />
            
            <Button onClick={handleGetFeedback} isLoading={isLoading} disabled={isLoading || !emailText.trim()}>
                Review My Email
            </Button>

            {isLoading && (
                 <div className="flex justify-center items-center p-10">
                    <Spinner className="text-indigo-600 w-10 h-10" />
                </div>
            )}

            {feedback && (
                <Card className="mt-8 bg-blue-50 border border-blue-200">
                    <div className="p-6">
                        <h3 className="text-xl font-bold text-blue-800 mb-4">Feedback & Suggestions</h3>
                        <div className="prose prose-slate max-w-none text-blue-700 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: feedback }} />
                    </div>
                </Card>
            )}
        </div>
    );
};

export default EmailAssistant;
