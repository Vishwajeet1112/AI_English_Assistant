
import React, { useState } from 'react';
import * as geminiService from '../../services/geminiService';
import Button from '../shared/Button';
import Card from '../shared/Card';
import Spinner from '../shared/Spinner';

const TranslationTool: React.FC = () => {
    const [inputText, setInputText] = useState('');
    const [nativeLanguage, setNativeLanguage] = useState('Spanish');
    const [result, setResult] = useState<{ translation: string; definition: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim()) {
            setError('Please enter some text to translate.');
            return;
        }
        setError('');
        setIsLoading(true);
        setResult(null);
        const data = await geminiService.getTranslationAndDefinition(inputText, nativeLanguage);
        if (data.translation === 'Error') {
            setError('Could not process your request. Please try again.');
        } else {
            setResult(data);
        }
        setIsLoading(false);
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Translation & Definition</h2>
            <p className="text-slate-600 mb-6">Enter a word or sentence to translate it into your native language and see its English definition.</p>
            
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label htmlFor="inputText" className="block text-sm font-medium text-slate-700 mb-1">English Text</label>
                        <textarea
                            id="inputText"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            placeholder="e.g., Hello, how are you?"
                            rows={3}
                        />
                    </div>
                    <div>
                        <label htmlFor="nativeLanguage" className="block text-sm font-medium text-slate-700 mb-1">Translate To</label>
                        <input
                            type="text"
                            id="nativeLanguage"
                            value={nativeLanguage}
                            onChange={(e) => setNativeLanguage(e.target.value)}
                            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            placeholder="e.g., Spanish, Hindi, French"
                        />
                    </div>
                </div>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <Button type="submit" isLoading={isLoading} disabled={isLoading || !inputText}>
                    Translate & Define
                </Button>
            </form>

            {isLoading && (
                 <div className="flex justify-center items-center p-10">
                    <Spinner className="text-indigo-600 w-10 h-10" />
                </div>
            )}

            {result && (
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-slate-800">Translation into {nativeLanguage}</h3>
                            <p className="mt-2 text-xl text-indigo-600">{result.translation}</p>
                        </div>
                    </Card>
                    <Card>
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-slate-800">English Definition</h3>
                            <p className="mt-2 text-slate-600">{result.definition}</p>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default TranslationTool;
