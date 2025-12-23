
import React, { useState, useEffect } from 'react';
import * as geminiService from '../../services/geminiService';
import Button from '../shared/Button';
import Spinner from '../shared/Spinner';
import Card from '../shared/Card';

const industries = ['IT', 'Finance', 'Marketing', 'Healthcare', 'Sales'];

interface Term {
    term: string;
    definition: string;
}

const IndustryVocabulary: React.FC = () => {
    const [selectedIndustry, setSelectedIndustry] = useState(industries[0]);
    const [terms, setTerms] = useState<Term[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchVocabulary = async (industry: string) => {
        setIsLoading(true);
        setTerms([]);
        const result = await geminiService.getIndustryVocabulary(industry);
        setTerms(result);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchVocabulary(selectedIndustry);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const handleIndustrySelect = (industry: string) => {
        setSelectedIndustry(industry);
        fetchVocabulary(industry);
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Industry-Specific Vocabulary</h2>
            <p className="text-slate-600 mb-6">Select an industry to learn essential vocabulary to communicate effectively in your field.</p>
            
            <div className="flex flex-wrap gap-3 mb-8">
                {industries.map(industry => (
                    <button
                        key={industry}
                        onClick={() => handleIndustrySelect(industry)}
                        disabled={isLoading}
                        className={`px-4 py-2 rounded-full font-medium transition-colors duration-200 ${
                            selectedIndustry === industry && !isLoading
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50'
                        }`}
                    >
                        {industry}
                    </button>
                ))}
            </div>

            {isLoading && (
                 <div className="flex justify-center items-center p-10">
                    <Spinner className="text-indigo-600 w-10 h-10" />
                </div>
            )}
            
            {!isLoading && terms.length > 0 && (
                <div className="space-y-4">
                    {terms.map((term, index) => (
                        <Card key={index} className="border border-slate-200">
                            <div className="p-4">
                                <h3 className="font-bold text-lg text-indigo-700">{term.term}</h3>
                                <p className="text-slate-600 mt-1">{term.definition}</p>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
            {!isLoading && terms.length === 0 && (
                <p className="text-center text-slate-500 mt-10">Could not load vocabulary for this industry.</p>
            )}
        </div>
    );
};

export default IndustryVocabulary;
