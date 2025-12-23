
import React, { useState } from 'react';
import { UserType } from '../../types';
import * as geminiService from '../../services/geminiService';
import Button from '../shared/Button';
import Spinner from '../shared/Spinner';
import Card from '../shared/Card';

interface WritingAssistantProps {
    userType: UserType;
}

const WritingAssistant: React.FC<WritingAssistantProps> = ({ userType }) => {
    const [text, setText] = useState('');
    const [feedback, setFeedback] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGetFeedback = async () => {
        if (!text.trim()) return;
        setIsLoading(true);
        setFeedback('');
        const result = await geminiService.getWritingFeedback(text, userType);
        setFeedback(result);
        setIsLoading(false);
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Writing Assistant</h2>
            <p className="text-slate-600 mb-6">Write an essay, a paragraph, or just a few sentences. Our AI will give you feedback on grammar, style, and clarity.</p>
            
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Start writing here..."
                className="w-full p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 h-64 mb-4"
            />
            
            <Button onClick={handleGetFeedback} isLoading={isLoading} disabled={isLoading || !text.trim()}>
                Get Feedback
            </Button>

            {isLoading && (
                 <div className="flex justify-center items-center p-10">
                    <Spinner className="text-indigo-600 w-10 h-10" />
                </div>
            )}

            {feedback && (
                <Card className="mt-8 bg-blue-50 border border-blue-200">
                    <div className="p-6">
                        <h3 className="text-xl font-bold text-blue-800 mb-4">AI Feedback</h3>
                        <div className="prose prose-slate max-w-none text-blue-700" dangerouslySetInnerHTML={{ __html: feedback.replace(/\n/g, '<br />') }} />
                    </div>
                </Card>
            )}
        </div>
    );
};

export default WritingAssistant;
