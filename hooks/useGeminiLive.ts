
import { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { ConnectionState, ChatMessage } from '../types';
import { createBlob, base64ToBytes, decodeAudioData } from '../utils/audioUtils';

const INPUT_SAMPLE_RATE = 16000;
const OUTPUT_SAMPLE_RATE = 24000;
const MODEL_NAME = 'gemini-2.5-flash-native-audio-preview-09-2025';

export interface MouthCue {
  open: number;
  width: number;
}

interface UseGeminiLiveReturn {
  connectionState: ConnectionState;
  connect: () => Promise<void>;
  disconnect: () => void;
  sendTextMessage: (text: string) => void;
  mouthCue: MouthCue;
  error: string | null;
  history: ChatMessage[];
}

export const useGeminiLive = (): UseGeminiLiveReturn => {
  const [connectionState, setConnectionState] = useState<ConnectionState>(ConnectionState.DISCONNECTED);
  const [error, setError] = useState<string | null>(null);
  const [mouthCue, setMouthCue] = useState<MouthCue>({ open: 0, width: 0.5 });
  const [history, setHistory] = useState<ChatMessage[]>([]);

  const audioContextRef = useRef<AudioContext | null>(null);
  const inputContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const currentInputTranscription = useRef('');
  const currentOutputTranscription = useRef('');

  useEffect(() => {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({
      sampleRate: OUTPUT_SAMPLE_RATE,
    });
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 1024; 
    analyser.smoothingTimeConstant = 0.05; 
    analyser.connect(ctx.destination);
    audioContextRef.current = ctx;
    analyserRef.current = analyser;
    return () => { ctx.close(); };
  }, []);

  useEffect(() => {
    let animationFrameId: number;
    const analyzeAudio = () => {
      if (analyserRef.current && connectionState === ConnectionState.CONNECTED) {
        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyserRef.current.getByteFrequencyData(dataArray);
        let sumSquares = 0;
        for (let i = 0; i < bufferLength; i++) sumSquares += dataArray[i] * dataArray[i];
        const rms = Math.sqrt(sumSquares / bufferLength);
        const targetOpen = Math.min(1, Math.max(0, (rms - 5) / 40));
        let lowEnergy = 0;
        let highEnergy = 0;
        for (let i = 5; i < 20; i++) lowEnergy += dataArray[i];
        for (let i = 100; i < 200; i++) highEnergy += dataArray[i];
        lowEnergy /= 15;
        highEnergy /= 100;
        let targetWidth = 0.5;
        if (targetOpen > 0.1) {
            const ratio = highEnergy / (lowEnergy + 0.01);
            if (ratio > 1.2) targetWidth = 0.8; 
            else if (ratio < 0.5) targetWidth = 0.2;
            else targetWidth = 0.5;
        }
        setMouthCue(prev => ({
            open: prev.open + (targetOpen - prev.open) * (targetOpen > prev.open ? 0.9 : 0.4),
            width: prev.width + (targetWidth - prev.width) * 0.5
        }));
      } else {
        setMouthCue(prev => ({ open: prev.open * 0.8, width: prev.width * 0.8 + 0.1 }));
      }
      animationFrameId = requestAnimationFrame(analyzeAudio);
    };
    analyzeAudio();
    return () => cancelAnimationFrame(animationFrameId);
  }, [connectionState]);

  const disconnect = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    sourcesRef.current.forEach(source => { try { source.stop(); } catch (e) {} });
    sourcesRef.current.clear();
    setConnectionState(ConnectionState.DISCONNECTED);
    setMouthCue({ open: 0, width: 0.5 });
  }, []);

  const sendTextMessage = useCallback((text: string) => {
    if (sessionRef.current && connectionState === ConnectionState.CONNECTED) {
        sessionRef.current.then((session: any) => {
            session.sendRealtimeInput({
                parts: [{ text }]
            });
        });
        setHistory(prev => [...prev, { role: 'user', text, timestamp: new Date() }]);
    }
  }, [connectionState]);

  const connect = useCallback(async () => {
    if (!process.env.API_KEY) {
      setError("API Key not found.");
      return;
    }
    try {
      setConnectionState(ConnectionState.CONNECTING);
      setError(null);
      if (audioContextRef.current?.state === 'suspended') await audioContextRef.current.resume();
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: INPUT_SAMPLE_RATE });
      inputContextRef.current = inputCtx;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const client = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const sessionPromise = client.live.connect({
        model: MODEL_NAME,
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Charon' } } },
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          systemInstruction: "You are Santa Claus. You are jolly, kind, and magical. You are talking to a human face-to-face. Speak with warmth, use 'Ho ho ho!' naturally. Acknowledge any Christmas wishes they send. Keep answers conversational and relatively short.",
        },
        callbacks: {
          onopen: () => {
            setConnectionState(ConnectionState.CONNECTED);
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData, INPUT_SAMPLE_RATE);
              sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.inputTranscription) currentInputTranscription.current += message.serverContent.inputTranscription.text;
            if (message.serverContent?.outputTranscription) currentOutputTranscription.current += message.serverContent.outputTranscription.text;
            if (message.serverContent?.turnComplete) {
                const userText = currentInputTranscription.current.trim();
                const modelText = currentOutputTranscription.current.trim();
                if (userText || modelText) {
                    setHistory(prev => {
                        const newHistory = [...prev];
                        if (userText) newHistory.push({ role: 'user', text: userText, timestamp: new Date() });
                        if (modelText) newHistory.push({ role: 'model', text: modelText, timestamp: new Date() });
                        return newHistory;
                    });
                    currentInputTranscription.current = '';
                    currentOutputTranscription.current = '';
                }
            }
            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio && audioContextRef.current && analyserRef.current) {
               const ctx = audioContextRef.current;
               nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
               try {
                 const audioBuffer = await decodeAudioData(base64ToBytes(base64Audio), ctx, OUTPUT_SAMPLE_RATE);
                 const source = ctx.createBufferSource();
                 source.buffer = audioBuffer;
                 source.connect(analyserRef.current);
                 source.start(nextStartTimeRef.current);
                 nextStartTimeRef.current += audioBuffer.duration;
                 sourcesRef.current.add(source);
                 source.onended = () => sourcesRef.current.delete(source);
               } catch (err) { console.error("Audio error", err); }
            }
          },
          onclose: () => disconnect(),
          onerror: (err) => { setError("Connection Error"); disconnect(); }
        }
      });
      sessionRef.current = sessionPromise;
    } catch (err: any) { setError(err.message); setConnectionState(ConnectionState.ERROR); }
  }, [disconnect]);

  return { connectionState, connect, disconnect, sendTextMessage, mouthCue, error, history };
};
