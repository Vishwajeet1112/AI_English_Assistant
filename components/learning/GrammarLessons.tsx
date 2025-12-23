
import React, { useState } from 'react';
import * as geminiService from '../../services/geminiService';
import Card from '../shared/Card';
import Spinner from '../shared/Spinner';

const grammarTopics = [
    'Is, Am, Are',
    'Has vs Have',
    'Simple Present Tense',
    'Articles: A, An, The',
    'Prepositions: In, On, At'
];

const GrammarLessons: React.FC = () => {
    const [selectedTopic, setSelectedTopic] = useState('');
    const [lesson, setLesson] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleTopicSelect = async (topic: string) => {
        setSelectedTopic(topic);
        setIsLoading(true);
        setLesson('');
        const explanation = await geminiService.getSimpleGrammarLesson(topic);
        setLesson(explanation);
        setIsLoading(false);
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Basic Grammar Lessons</h2>
            <p className="text-slate-600 mb-6">Choose a topic to get a simple explanation from our AI teacher.</p>
            
            <div className="flex flex-wrap gap-3 mb-8">
                {grammarTopics.map(topic => (
                    <button
                        key={topic}
                        onClick={() => handleTopicSelect(topic)}
                        disabled={isLoading}
                        className={`px-4 py-2 rounded-full font-medium transition-colors duration-200 ${
                            selectedTopic === topic && !isLoading
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50'
                        }`}
                    >
                        {topic}
                    </button>
                ))}
            </div>

            {isLoading && (
                 <div className="flex justify-center items-center p-10">
                    <Spinner className="text-indigo-600 w-10 h-10" />
                </div>
            )}

            {lesson && !isLoading && (
                <Card className="bg-green-50 border border-green-200">
                    <div className="p-6">
                        <h3 className="text-xl font-bold text-green-800 mb-4">Lesson: {selectedTopic}</h3>
                        <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: lesson.replace(/\n/g, '<br />') }} />
                    </div>
                </Card>
            )}
        </div>
    );
};

export default GrammarLessons;
