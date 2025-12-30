import { useCallback, useRef, useState } from "react";

interface VoiceAgentOptions {
    shopId?: string;
    wsUrl?: string;
    onTranscript?: (role: "user" | "assistant", text: string) => void;
    onStatusChange?: (status: string) => void;
    onError?: (error: string) => void;
}

export function useVoiceAgent(options: VoiceAgentOptions = {}) {
    const getWsUrl = () => {
        if (typeof window === 'undefined') return "";
        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
        const wsProtocol = baseUrl.startsWith('https') ? 'wss' : 'ws';
        const cleanBaseUrl = baseUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
        
        if (options.shopId) {
            return `${wsProtocol}://${cleanBaseUrl}/ws/voice/shop/${options.shopId}/`;
        }
        
        return `${wsProtocol}://${cleanBaseUrl}/ws/voice/`;
    };

    const {
        wsUrl = getWsUrl(),
        onTranscript,
        onStatusChange,
        onError,
    } = options;

    const [isConnected, setIsConnected] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    const wsRef = useRef<WebSocket | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const audioQueueRef = useRef<Float32Array[]>([]);
    const isPlayingRef = useRef(false);

    const playNextChunk = useCallback(() => {
        if (audioQueueRef.current.length === 0) {
            setIsPlaying(false);
            isPlayingRef.current = false;
            return;
        }

        setIsPlaying(true);
        isPlayingRef.current = true;
        const float32 = audioQueueRef.current.shift()!;
        const ctx = audioContextRef.current!;

        const buffer = ctx.createBuffer(1, float32.length, 24000);
        buffer.getChannelData(0).set(float32);

        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.onended = playNextChunk;
        source.start();
    }, []);

    const playAudio = useCallback(
        (base64: string) => {
            if (!audioContextRef.current) {
                audioContextRef.current = new AudioContext({ sampleRate: 24000 });
            }

            const binary = atob(base64);
            const bytes = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) {
                bytes[i] = binary.charCodeAt(i);
            }

            const pcm16 = new Int16Array(bytes.buffer);
            const float32 = new Float32Array(pcm16.length);
            for (let i = 0; i < pcm16.length; i++) {
                float32[i] = pcm16[i] / 32768;
            }

            audioQueueRef.current.push(float32);
            if (!isPlayingRef.current) playNextChunk();
        },
        [playNextChunk]
    );

    const connect = useCallback(() => {
        if (wsRef.current?.readyState === WebSocket.OPEN) return;

        console.log('[VoiceAgent] Connecting to:', wsUrl);
        onStatusChange?.("connecting");
        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
            console.log('[VoiceAgent] Connected successfully');
            setIsConnected(true);
            onStatusChange?.("connected");
        };

        ws.onclose = (event) => {
            console.log('[VoiceAgent] Disconnected. Code:', event.code, 'Reason:', event.reason);
            setIsConnected(false);
            onStatusChange?.("disconnected");
        };

        ws.onerror = (error) => {
            console.error('[VoiceAgent] WebSocket error:', error);
            onError?.("Connection failed");
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);

            switch (data.type) {
                case "transcript":
                    onTranscript?.(data.role, data.text);
                    break;
                case "audio":
                    playAudio(data.data);
                    break;
                case "error":
                    onError?.(data.message);
                    break;
            }
        };

        wsRef.current = ws;
    }, [wsUrl, onTranscript, onStatusChange, onError, playAudio]);

    const startRecording = useCallback(async () => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
            connect();
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    channelCount: 1,
                    echoCancellation: true,
                    noiseSuppression: true,
                },
            });

            streamRef.current = stream;
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            audioContextRef.current = audioContext;

            const source = audioContext.createMediaStreamSource(stream);
            const processor = audioContext.createScriptProcessor(4096, 1, 1);
            const nativeSampleRate = audioContext.sampleRate;

            processor.onaudioprocess = (e) => {
                const inputData = e.inputBuffer.getChannelData(0);
                const ratio = nativeSampleRate / 24000;
                const resampledLength = Math.floor(inputData.length / ratio);
                const resampled = new Float32Array(resampledLength);

                for (let i = 0; i < resampledLength; i++) {
                    resampled[i] = inputData[Math.floor(i * ratio)];
                }

                const pcm16 = new Int16Array(resampled.length);
                for (let i = 0; i < resampled.length; i++) {
                    pcm16[i] = Math.max(-32768, Math.min(32767, resampled[i] * 32768));
                }

                const uint8 = new Uint8Array(pcm16.buffer);
                let binary = "";
                for (let i = 0; i < uint8.length; i++) {
                    binary += String.fromCharCode(uint8[i]);
                }

                if (wsRef.current?.readyState === WebSocket.OPEN) {
                    wsRef.current.send(
                        JSON.stringify({ type: "audio", data: btoa(binary) })
                    );
                }
            };

            source.connect(processor);
            processor.connect(audioContext.destination);
            setIsRecording(true);
        } catch (error) {
            onError?.("Microphone access denied");
        }
    }, [connect, onError]);

    const stopRecording = useCallback(() => {
        setIsRecording(false);
        streamRef.current?.getTracks().forEach((track) => track.stop());
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close();
        }
    }, []);

    const sendText = useCallback((text: string) => {
        wsRef.current?.send(JSON.stringify({ type: "text", text }));
    }, []);

    const disconnect = useCallback(() => {
        wsRef.current?.close();
        stopRecording();
    }, [stopRecording]);

    return {
        isConnected,
        isRecording,
        isPlaying,
        connect,
        disconnect,
        startRecording,
        stopRecording,
        sendText,
    };
}
