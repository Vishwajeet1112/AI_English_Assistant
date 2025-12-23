
import React, { useState } from 'react';
import * as geminiService from '../../services/geminiService';
import Button from '../shared/Button';
import Spinner from '../shared/Spinner';
import Icon from '../shared/Icon';

const VisualLearning: React.FC = () => {
    const [word, setWord] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerateImage = async () => {
        if (!word.trim()) {
            setError('Please enter a word.');
            return;
        }
        setError('');
        setIsLoading(true);
        setImageUrl('');
        const url = await geminiService.generateVisualForWord(word);
        if (!url) {
            setError('Could not generate an image. Please try another word.');
        } else {
            setImageUrl(url);
        }
        setIsLoading(false);
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Visual Learning</h2>
            <p className="text-slate-600 mb-6">Learn words with pictures! Enter a noun (like "apple", "dog", or "house") to see an AI-generated image of it.</p>
            
            <div className="flex items-center gap-2 max-w-md mx-auto">
                <input
                    type="text"
                    value={word}
                    onChange={(e) => setWord(e.target.value)}
                    placeholder="Enter a word..."
                    className="flex-1 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
                <Button onClick={handleGenerateImage} isLoading={isLoading} disabled={isLoading || !word}>
                    Generate
                </Button>
            </div>
            {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
            
            <div className="mt-8 flex justify-center">
                {isLoading ? (
                     <div className="w-80 h-80 bg-slate-100 rounded-lg flex flex-col justify-center items-center text-slate-500">
                        <Spinner className="text-indigo-600 w-12 h-12" />
                        <p className="mt-4">Generating image for "{word}"...</p>
                    </div>
                ) : imageUrl ? (
                     <div className="text-center">
                        <img src={imageUrl} alt={word} className="w-80 h-80 object-cover rounded-lg shadow-lg"/>
                        <p className="mt-4 text-2xl font-semibold capitalize text-slate-800">{word}</p>
                     </div>
                ) : (
                    <div className="w-80 h-80 bg-slate-100 rounded-lg flex flex-col justify-center items-center text-slate-500 border-2 border-dashed">
                        <Icon name="image" className="w-20 h-20 text-slate-400" />
                        <p className="mt-4">Your image will appear here</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VisualLearning;
