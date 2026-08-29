import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, RotateCcw } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function AudioNarration({ script }) {
  const { lang, tObj } = useApp();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speechSupported, setSpeechSupported] = useState(true);

  const textToRead = tObj(script);

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setSpeechSupported(false);
    }
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Timer animation simulation for playback bar
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            if ('speechSynthesis' in window) {
              window.speechSynthesis.cancel();
            }
            return 0;
          }
          return prev + 2.5;
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleTogglePlay = () => {
    if (isPlaying) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlaying(false);
    } else {
      if ('speechSynthesis' in window && textToRead) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(textToRead);
        utterance.lang = lang === 'mr' ? 'mr-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN';
        utterance.rate = 0.95;
        
        // Find best matching voice if available
        const voices = window.speechSynthesis.getVoices();
        const regionalVoice = voices.find(v => {
          if (lang === 'mr') return v.lang.includes('mr') || v.lang.includes('hi');
          if (lang === 'hi') return v.lang.includes('hi');
          return v.lang.includes('en');
        });
        if (regionalVoice) {
          utterance.voice = regionalVoice;
        }

        utterance.onend = () => {
          setIsPlaying(false);
          setProgress(0);
        };

        utterance.onerror = () => {
          // Keep simulated playback running even if TTS voice is missing
        };

        try {
          window.speechSynthesis.speak(utterance);
        } catch (e) {
          console.log('Speech synth fallback');
        }
      }
      setIsPlaying(true);
    }
  };

  const handleReset = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setProgress(0);
  };

  return (
    <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-4 border border-orange-200/80 shadow-sm my-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <button
            onClick={handleTogglePlay}
            className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md transition-transform active:scale-95 ${
              isPlaying ? 'bg-amber-600 animate-pulse' : 'bg-brand-600 hover:bg-brand-700'
            }`}
            title={isPlaying ? 'थांबवा / Pause' : 'ऐका / Listen'}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </button>

          <div>
            <div className="flex items-center space-x-1.5">
              <Volume2 className="w-4 h-4 text-brand-600" />
              <span className="text-sm font-bold text-slate-800">
                {lang === 'mr'
                  ? 'धड्याचे ऑडिओ कथन (मराठी आवाज)'
                  : lang === 'hi'
                  ? 'पाठ का ऑडियो कथन (हिंदी आवाज)'
                  : 'Audio Narration (Spoken Voice)'}
              </span>
              <span className="text-[10px] font-semibold bg-orange-100 text-brand-700 px-2 py-0.5 rounded-full">
                {lang === 'mr' ? 'ऑफलाइन उपलब्ध' : lang === 'hi' ? 'ऑफलाइन उपलब्ध' : 'Offline Mode'}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5 line-clamp-1">
              {isPlaying
                ? lang === 'mr'
                  ? 'ऑडिओ चालू आहे...'
                  : lang === 'hi'
                  ? 'ऑडियो चल रहा है...'
                  : 'Playing narration...'
                : lang === 'mr'
                ? 'वाचण्याऐवजी संपूर्ण धडा ऐका'
                : lang === 'hi'
                ? 'पढ़ने के बजाय पूरा पाठ सुनें'
                : 'Listen to this lesson via synthetic speech'}
            </p>
          </div>
        </div>

        {/* Playback Controls & Progress */}
        <div className="flex items-center space-x-3 w-full sm:w-64">
          <div className="w-full bg-orange-200/60 rounded-full h-2 overflow-hidden">
            <div
              className="bg-brand-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <button
            onClick={handleReset}
            className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-orange-100 transition-colors"
            title="पुन्हा सुरुवातीपासून ऐका / Restart"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Spoken Text Preview */}
      {isPlaying && (
        <div className="mt-3 pt-3 border-t border-orange-200/60 text-xs text-slate-700 italic bg-white/60 p-2.5 rounded-xl">
          "{textToRead}"
        </div>
      )}
    </div>
  );
}
