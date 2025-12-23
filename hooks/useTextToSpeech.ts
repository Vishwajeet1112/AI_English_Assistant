
import { useState, useCallback } from 'react';
import * as geminiService from '../services/geminiService';

interface TextToSpeechHook {
  speak: (text: string) => Promise<void>;
  isSpeaking: boolean;
  cancel: () => void;
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export const useTextToSpeech = (): TextToSpeechHook => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioSource, setAudioSource] = useState<AudioBufferSourceNode | null>(null);

  const speak = useCallback(async (text: string) => {
    if (isSpeaking) return;
    
    setIsSpeaking(true);
    try {
      const base64Audio = await geminiService.generateSpeech(text);
      if (!base64Audio) throw new Error("Failed to generate speech");

      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const audioBuffer = await decodeAudioData(decode(base64Audio), audioCtx, 24000, 1);
      
      const source = audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioCtx.destination);
      
      source.onended = () => {
        setIsSpeaking(false);
        setAudioSource(null);
      };
      
      setAudioSource(source);
      source.start();
    } catch (error) {
      console.error("TTS Hook Error:", error);
      setIsSpeaking(false);
    }
  }, [isSpeaking]);

  const cancel = useCallback(() => {
    if (audioSource) {
      audioSource.stop();
      setAudioSource(null);
      setIsSpeaking(false);
    }
  }, [audioSource]);

  return { speak, isSpeaking, cancel };
};
