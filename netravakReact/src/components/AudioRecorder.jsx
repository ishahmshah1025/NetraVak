"use client";

import { useState, useRef, useEffect } from "react";
import { Mic } from "lucide-react";

export default function AudioRecorder() {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [volume, setVolume] = useState(0);
  const mediaRecorder = useRef(null);
  const audioContext = useRef(null);
  const analyser = useRef(null);
  const audioChunks = useRef([]);
  const animationFrame = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
      if (audioContext.current) {
        audioContext.current.close();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const analyzeAudio = (stream) => {
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    analyser.current = audioContext.current.createAnalyser();
    analyser.current.fftSize = 1024;
    analyser.current.smoothingTimeConstant = 0.8;
    
    const source = audioContext.current.createMediaStreamSource(stream);
    source.connect(analyser.current);
    
    const dataArray = new Uint8Array(analyser.current.frequencyBinCount);
    
    const updateVolume = () => {
      analyser.current.getByteFrequencyData(dataArray);
      const values = dataArray.slice(0, 100); // Focus on lower frequencies for better voice detection
      const average = values.reduce((sum, value) => sum + value, 0) / values.length;
      const normalizedVolume = Math.min(average / 128, 1);
      setVolume(normalizedVolume);
      animationFrame.current = requestAnimationFrame(updateVolume);
    };

    animationFrame.current = requestAnimationFrame(updateVolume);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      streamRef.current = stream;
      mediaRecorder.current = new MediaRecorder(stream);
      analyzeAudio(stream);

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        audioChunks.current = [];
        
        if (animationFrame.current) {
          cancelAnimationFrame(animationFrame.current);
        }
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
        setVolume(0);
      };

      mediaRecorder.current.start();
      setRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
      mediaRecorder.current.stop();
      setRecording(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 border rounded-lg bg-gray-900">
      <h2 className="text-lg font-semibold mb-4 text-white">Real-time Audio Recorder</h2>

      <div className="relative mb-4">
        <div className="w-32 h-32 flex items-center justify-center">
          {recording && (
            <>
              <div 
                className="absolute inset-0 rounded-full bg-red-500/50 transition-transform duration-150"
                style={{
                  transform: `scale(${1 + volume * 1.5})`,
                }}
              />
              <div 
                className="absolute inset-0 rounded-full bg-red-400/40 transition-transform duration-150"
                style={{
                  transform: `scale(${1 + volume * 1.2})`,
                }}
              />
              <div 
                className="absolute inset-0 rounded-full bg-red-300/30 transition-transform duration-150"
                style={{
                  transform: `scale(${1 + volume * 0.9})`,
                }}
              />
            </>
          )}
          <button
            onClick={recording ? stopRecording : startRecording}
            className={`relative z-10 p-4 rounded-full transition-colors ${
              recording ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            <Mic className="w-8 h-8 text-white" />
          </button>
        </div>
      </div>

      {audioURL && (
        <div className="mt-4">
          <p className="font-semibold text-white">🎧 Playback:</p>
          <audio controls className="mt-2">
            <source src={audioURL} type="audio/wav" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
}