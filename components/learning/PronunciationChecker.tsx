
import React, { useState, useEffect } from 'react';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import * as geminiService from '../../services/geminiService';
import Button from '../shared/Button';
import Icon from '../shared/Icon';
import Spinner from '../shared/Spinner';

const sampleSentences = [
    "The quick brown fox jumps over the lazy dog.",
    "She sells seashells by the seashore.",
    "How can a clam cram in a clean cream can?",
    "I wish to wash my Irish wristwatch."
];

const PronunciationChecker: React.FC = () => {
    const [textToPractice, setTextToPractice] = useState(sampleSentences[0]);
    const [feedback, setFeedback] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const { transcript, isListening, startListening, stopListening, resetTranscript } = useSpeechRecognition();

    useEffect(() => {
        if (!isListening && transcript) {
            getFeedback();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isListening, transcript]);

    const handleNewSentence = () => {
        const newSentence = sampleSentences[Math.floor(Math.random() * sampleSentences.length)];
        setTextToPractice(newSentence);
        setFeedback('');
        resetTranscript();
    };

    const getFeedback = async () => {
        if (!transcript) return;
        setIsLoading(true);
        setFeedback('');
        const result = await geminiService.getPronunciationFeedback(textToPractice, transcript);
        setFeedback(result);
        setIsLoading(false);
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Pronunciation Checker</h2>
            <p className="text-slate-600 mb-6">Read the sentence below and click the microphone to record yourself. Our AI will give you feedback on your pronunciation.</p>
            
            <div className="bg-slate-100 p-6 rounded-lg text-center mb-6">
                <p className="text-2xl font-semibold text-indigo-700">"{textToPractice}"</p>
            </div>
            
            <div className="flex justify-center items-center gap-4 mb-6">
                 <button
                    onClick={isListening ? stopListening : startListening}
                    className={`flex items-center justify-center w-20 h-20 rounded-full transition-all duration-300 ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                >
                    {isListening ? <Icon name="stop" className="w-10 h-10" /> : <Icon name="microphoneOn" className="w-10 h-10" />}
                </button>
                <Button onClick={handleNewSentence} variant="secondary">
                    New Sentence
                </Button>
            </div>

            {transcript && (
                <div className="my-4 p-4 bg-slate-50 rounded-lg">
                    <h3 className="font-semibold text-slate-700">You said:</h3>
                    <p className="text-slate-600 italic">"{transcript}"</p>
                </div>
            )}
            
            {isLoading && (
                <div className="flex justify-center items-center p-6">
                    <Spinner className="text-indigo-600 w-8 h-8" />
                    <p className="ml-4 text-slate-600">Analyzing your pronunciation...</p>
                </div>
            )}

            {feedback && (
                <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-lg">
                    <h3 className="text-lg font-bold text-green-800 mb-2">Feedback:</h3>
                    <p className="text-green-700 whitespace-pre-wrap">{feedback}</p>
                </div>
            )}
        </div>
    );
};

export default PronunciationChecker;
