
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const getAIClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

const generateContent = async (
    model: string,
    prompt: string, 
    systemInstruction?: string
): Promise<string> => {
    const ai = getAIClient();
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
            },
        });
        return response.text;
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "Sorry, I encountered an error. Please try again.";
    }
};

export const getChatResponse = (prompt: string, history: {role: string, parts: {text: string}[]}[], systemInstruction: string) => {
    const ai = getAIClient();
    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        history: history,
        config: {
            systemInstruction: systemInstruction,
        }
    });
    return chat.sendMessage({message: prompt});
};

export const generateSpeech = async (text: string): Promise<string | undefined> => {
    const ai = getAIClient();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: text }] }],
            config: {
                responseModalities: ["AUDIO"],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' },
                    },
                },
            },
        });
        return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    } catch (error) {
        console.error("Gemini TTS Error:", error);
        return undefined;
    }
};

export const getPronunciationFeedback = async (originalText: string, userPronunciation: string): Promise<string> => {
    const prompt = `A user is practicing their English pronunciation.
    The target sentence is: "${originalText}"
    The user pronounced it as: "${userPronunciation}"

    Please analyze the user's pronunciation based on the text representation. Provide short, clear, and encouraging feedback. Point out specific areas for improvement if any. If the pronunciation seems correct, congratulate them.`;
    return generateContent('gemini-2.5-flash', prompt, 'You are a friendly and expert pronunciation coach.');
};

export const getVocabularyWord = async (level: 'Beginner' | 'Advanced' | 'Business'): Promise<any> => {
    const ai = getAIClient();
    const prompt = `Provide one English vocabulary word suitable for a ${level} learner.`;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        word: { type: Type.STRING },
                        definition: { type: Type.STRING },
                        example: { type: Type.STRING },
                    },
                    required: ["word", "definition", "example"]
                },
                systemInstruction: 'You are a helpful vocabulary bot that provides words in JSON format.'
            },
        });
        return JSON.parse(response.text);
    } catch (error) {
        console.error("Gemini Vocabulary Error:", error);
        return { word: "Error", definition: "Could not fetch a word.", example: "Please try again." };
    }
};

export const getTranslationAndDefinition = async (text: string, nativeLanguage: string): Promise<any> => {
    const ai = getAIClient();
    const prompt = `For the text "${text}", provide two things:
    1. A translation into ${nativeLanguage}.
    2. A simple English definition of the text.`;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        translation: { type: Type.STRING },
                        definition: { type: Type.STRING },
                    },
                    required: ["translation", "definition"]
                },
                systemInstruction: 'You are a helpful translation and dictionary bot.'
            },
        });
        return JSON.parse(response.text);
    } catch (error) {
        console.error("Gemini Translation Error:", error);
        return { translation: "Error", definition: "Could not process the text." };
    }
}

export const generateVisualForWord = async (word: string): Promise<string> => {
    const ai = getAIClient();
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-3.0-generate-002',
            prompt: `A clear, simple, high-quality photorealistic image of "${word}". The image should be educational and easy to understand for an English learner.`,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '1:1',
            },
        });
        const base64ImageBytes = response.generatedImages[0].image.imageBytes;
        return `data:image/jpeg;base64,${base64ImageBytes}`;
    } catch (error) {
        console.error("Gemini Image Generation Error:", error);
        return "";
    }
};

export const getSimpleGrammarLesson = async (topic: string): Promise<string> => {
    const prompt = `Explain the grammar topic "${topic}" in a very simple and easy-to-understand way for an absolute beginner in English. Use simple sentences and provide clear examples.`;
    return generateContent('gemini-2.5-flash', prompt, 'You are a patient and clear English grammar teacher for beginners.');
};

export const getWritingFeedback = async (text: string, level: string): Promise<string> => {
    const prompt = `Please review the following text written by a ${level} English learner. Provide constructive feedback on grammar, style, vocabulary, and clarity. Suggest specific improvements to help them learn.

    TEXT:
    ---
    ${text}
    ---`;
    return generateContent('gemini-2.5-flash', prompt, 'You are an expert English writing instructor.');
};

export const getListeningQuestions = async (topic: string): Promise<any> => {
    const ai = getAIClient();
    const prompt = `Generate a short audio script (about 3-4 sentences) about "${topic}" suitable for an advanced English learner. Then, create 3 multiple-choice questions based on the script to test listening comprehension.`;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        script: { type: Type.STRING },
                        questions: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    question: { type: Type.STRING },
                                    options: { type: Type.ARRAY, items: { type: Type.STRING } },
                                    answer: { type: Type.STRING }
                                },
                                required: ["question", "options", "answer"]
                            }
                        }
                    },
                    required: ["script", "questions"]
                },
                systemInstruction: 'You create educational content in JSON format.'
            },
        });
        return JSON.parse(response.text);
    } catch (error) {
        console.error("Gemini Listening Exercise Error:", error);
        return null;
    }
};

export const getEmailFeedback = async (emailText: string): Promise<string> => {
    const prompt = `Review this business email draft. Correct any grammatical errors, improve the tone to be more professional, and suggest changes for clarity and effectiveness.

    EMAIL DRAFT:
    ---
    ${emailText}
    ---`;
    return generateContent('gemini-2.5-flash', prompt, 'You are an expert business communication coach.');
};

export const getIndustryVocabulary = async (industry: string): Promise<any> => {
    const ai = getAIClient();
    const prompt = `Provide a list of 5 essential English vocabulary terms for the ${industry} industry.`;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            term: { type: Type.STRING },
                            definition: { type: Type.STRING },
                        },
                        required: ["term", "definition"]
                    }
                },
                systemInstruction: 'You are an expert in professional and industry-specific vocabulary.'
            },
        });
        return JSON.parse(response.text);
    } catch (error) {
        console.error("Gemini Industry Vocab Error:", error);
        return [];
    }
};
