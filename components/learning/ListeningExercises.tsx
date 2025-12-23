
import React, { useState, useCallback } from 'react';
import { useTextToSpeech } from '../../hooks/useTextToSpeech';
import * as geminiService from '../../services/geminiService';
import Button from '../shared/Button';
import Icon from '../shared/Icon';
import Spinner from '../shared/Spinner';

interface Question {
    question: string;
    options: string[];
    answer: string;
}

interface Exercise {
    script: string;
    questions: Question[];
}

const ListeningExercises: React.FC = () => {
    const [exercise, setExercise] = useState<Exercise | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [topic, setTopic] = useState('a recent scientific discovery');
    const [answers, setAnswers] = useState<string[]>([]);
    const [showResults, setShowResults] = useState(false);

    const { speak, isSpeaking } = useTextToSpeech();

    const fetchExercise = useCallback(async () => {
        setIsLoading(true);
        setExercise(null);
        setAnswers([]);
        setShowResults(false);
        const data = await geminiService.getListeningQuestions(topic);
        setExercise(data);
        if (data) {
            setAnswers(new Array(data.questions.length).fill(''));
        }
        setIsLoading(false);
    }, [topic]);

    const handleAnswerChange = (questionIndex: number, answer: string) => {
        const newAnswers = [...answers];
        newAnswers[questionIndex] = answer;
        setAnswers(newAnswers);
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Listening Exercises</h2>
            <p className="text-slate-600 mb-6">Listen to a short audio clip and answer questions to test your comprehension. Generate a new exercise on any topic you like!</p>
            
            <div className="flex items-center gap-2 max-w-md mb-6">
                <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Enter a topic..."
                    className="flex-1 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
                <Button onClick={fetchExercise} isLoading={isLoading} disabled={isLoading}>
                    New Exercise
                </Button>
            </div>

            {isLoading && (
                 <div className="flex justify-center items-center p-10">
                    <Spinner className="text-indigo-600 w-10 h-10" />
                </div>
            )}
            
            {exercise && !isLoading && (
                <div>
                    <div className="bg-slate-100 p-6 rounded-lg mb-6">
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">Listen to the script:</h3>
                        <button onClick={() => speak(exercise.script)} disabled={isSpeaking} className="flex items-center gap-2 text-indigo-600 font-medium">
                            <Icon name="speaker" className="w-6 h-6"/>
                            <span>{isSpeaking ? 'Playing...' : 'Play Audio'}</span>
                        </button>
                    </div>

                    <div>
                        {exercise.questions.map((q, qIndex) => (
                            <div key={qIndex} className="mb-6 p-4 border rounded-lg">
                                <p className="font-semibold text-slate-700 mb-3">{qIndex + 1}. {q.question}</p>
                                <div className="space-y-2">
                                    {q.options.map((option, oIndex) => (
                                        <label key={oIndex} className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${showResults ? (option === q.answer ? 'bg-green-100 border-green-300' : (answers[qIndex] === option ? 'bg-red-100 border-red-300' : 'bg-white')) : 'bg-white'}`}>
                                            <input
                                                type="radio"
                                                name={`question-${qIndex}`}
                                                value={option}
                                                checked={answers[qIndex] === option}
                                                onChange={() => handleAnswerChange(qIndex, option)}
                                                disabled={showResults}
                                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300"
                                            />
                                            <span className="ml-3 text-slate-700">{option}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {!showResults && (
                        <Button onClick={() => setShowResults(true)}>
                            Check Answers
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
};

export default ListeningExercises;
