
import React, { useState, useCallback, useEffect } from 'react';
import { UserType } from '../../types';
import * as geminiService from '../../services/geminiService';
import Button from '../shared/Button';
import Card from '../shared/Card';
import Icon from '../shared/Icon';
import Spinner from '../shared/Spinner';
import { useTextToSpeech } from '../../hooks/useTextToSpeech';

interface VocabularyBuilderProps {
    userType: UserType;
}

interface VocabWord {
    word: string;
    definition: string;
    example: string;
}

const VocabularyBuilder: React.FC<VocabularyBuilderProps> = ({ userType }) => {
    const [wordData, setWordData] = useState<VocabWord | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { speak, isSpeaking } = useTextToSpeech();

    const getLevel = (): 'Beginner' | 'Advanced' | 'Business' => {
        if (userType === UserType.Professional) return 'Business';
        if (userType === UserType.Advanced) return 'Advanced';
        return 'Beginner';
    };

    const fetchNewWord = useCallback(async () => {
        setIsLoading(true);
        const data = await geminiService.getVocabularyWord(getLevel());
        setWordData(data);
        setIsLoading(false);
    }, [userType]);

    useEffect(() => {
        fetchNewWord();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userType]);

    return (
        <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Vocabulary Builder</h2>
            <p className="text-slate-600 mb-6">Learn a new word every day! Here is a word tailored for a <span className="font-semibold text-indigo-600">{userType}</span>.</p>
            
            <div className="flex justify-center mb-8">
                <Button onClick={fetchNewWord} isLoading={isLoading} disabled={isLoading}>
                    Get a New Word
                </Button>
            </div>

            {isLoading && !wordData && (
                 <div className="flex justify-center items-center p-10">
                    <Spinner className="text-indigo-600 w-10 h-10" />
                </div>
            )}
            
            {wordData && !isLoading && (
                 <Card className="max-w-md mx-auto transform transition-all duration-500 ease-out">
                    <div className="p-8">
                        <div className="flex justify-between items-center mb-2">
                             <h3 className="text-4xl font-bold text-indigo-600">{wordData.word}</h3>
                             <button onClick={() => speak(wordData.word)} disabled={isSpeaking} className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-indigo-600">
                                <Icon name="speaker" className="w-7 h-7" />
                             </button>
                        </div>
                       
                        <div className="mt-4">
                            <h4 className="font-semibold text-slate-700">Definition:</h4>
                            <p className="text-slate-600">{wordData.definition}</p>
                        </div>
                        <div className="mt-4">
                            <h4 className="font-semibold text-slate-700">Example:</h4>
                            <p className="text-slate-600 italic">"{wordData.example}"</p>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default VocabularyBuilder;
