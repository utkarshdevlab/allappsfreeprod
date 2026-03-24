'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Zap,
    Target,
    Timer,
    RotateCcw,
    Share2,
    Maximize2
} from 'lucide-react';
import { SEOContent, FeaturesSection, UseCasesSection } from './SEOContent';

type Mode = 'Flow' | 'Focus' | 'Challenge' | 'Precision';

const SAMPLE_TEXTS = {
    Flow: "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle. As with all matters of the heart, you'll know when you find it.",
    Focus: "Simplicity is the ultimate sophistication. It takes a lot of hard work to make something simple, to truly understand the underlying challenges and come up with elegant solutions.",
    Challenge: "A complex system that works is invariably found to have evolved from a simple system that worked. A complex system designed from scratch never works and cannot be patched up to make it work.",
    Precision: "The discipline of writing something down is the first step toward making it happen. In business, if you don't write it down, you probably won't do it."
};

const TypeZen = () => {
    const [mode, setMode] = useState<Mode>('Flow');
    const [input, setInput] = useState('');
    const [startTime, setStartTime] = useState<number | null>(null);
    const [endTime, setEndTime] = useState<number | null>(null);
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(100);
    const [isFinished, setIsFinished] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const inputRef = useRef<HTMLInputElement>(null);
    const targetText = SAMPLE_TEXTS[mode];

    const reset = useCallback(() => {
        setInput('');
        setStartTime(null);
        setEndTime(null);
        setWpm(0);
        setAccuracy(100);
        setIsFinished(false);
        if (inputRef.current) inputRef.current.focus();
    }, []);

    useEffect(() => {
        reset();
    }, [mode, reset]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === '1') setMode('Flow');
                if (e.key === '2') setMode('Focus');
                if (e.key === '3') setMode('Challenge');
                if (e.key === '4') setMode('Precision');
            }
            if (e.key === 'Escape') reset();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [reset]);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (isFinished) return;

        if (!startTime) setStartTime(Date.now());

        // Accuracy Calculation
        let errors = 0;
        for (let i = 0; i < value.length; i++) {
            if (value[i] !== targetText[i]) errors++;
        }
        const acc = Math.max(0, Math.floor(((value.length - errors) / value.length) * 100));
        setAccuracy(isNaN(acc) ? 100 : acc);

        // WPM Calculation
        const now = Date.now();
        const minutes = (now - (startTime || now)) / 60000;
        const words = value.length / 5;
        setWpm(minutes > 0 ? Math.floor(words / minutes) : 0);

        setInput(value);

        if (value.length === targetText.length) {
            setEndTime(now);
            setIsFinished(true);
        }
    };

    const getFlowScore = () => {
        const score = Math.floor((wpm * (accuracy / 100)) * 1.5);
        if (score > 120) return { label: 'Godlike', color: 'text-purple-500' };
        if (score > 90) return { label: 'Locked In', color: 'text-blue-500' };
        if (score > 60) return { label: 'Flowing', color: 'text-emerald-500' };
        return { label: 'Steady', color: 'text-amber-500' };
    };

    return (
        <div className="space-y-8">
            <div ref={containerRef} className="min-h-[600px] w-full bg-[#0a0a0a] rounded-[3rem] p-12 flex flex-col items-center justify-center relative overflow-hidden text-neutral-400 selection:bg-white/10">
                {/* Fullscreen Button */}
                <div className="absolute top-12 right-12 z-20">
                    <button
                        onClick={() => {
                            if (!document.fullscreenElement) {
                                containerRef.current?.requestFullscreen();
                            } else {
                                document.exitFullscreen();
                            }
                        }}
                        className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/5 transition-all text-white/40 hover:text-white"
                        title="Toggle Fullscreen"
                    >
                        <Maximize2 className="w-6 h-6" />
                    </button>
                </div>
                {/* Background Glow */}
                <div className={`absolute inset-0 transition-opacity duration-1000 ${startTime && !isFinished ? 'opacity-20' : 'opacity-0'}`}>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-blue-600/30 via-purple-600/30 to-pink-600/30 blur-[120px] animate-pulse"></div>
                </div>

                {/* Header / Modes */}
                <div className={`absolute top-12 flex flex-col items-center space-y-4 transition-all duration-500 ${startTime ? 'opacity-0 -translate-y-8' : 'opacity-100'}`}>
                    <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.4em]">
                        {['Flow', 'Focus', 'Challenge', 'Precision'].map((m, i) => (
                            <button
                                key={m}
                                onClick={() => setMode(m as Mode)}
                                className={`transition-colors hover:text-white ${mode === m ? 'text-white' : 'text-neutral-600'}`}
                            >
                                {i + 1}. {m}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Interface */}
                <div className="relative z-10 w-full max-w-4xl overflow-hidden cursor-text" onClick={() => inputRef.current?.focus()}>
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={handleInput}
                        className="absolute opacity-0 pointer-events-none"
                        autoFocus
                    />

                    {isFinished ? (
                        <div className="animate-in zoom-in fade-in duration-700 flex flex-col items-center space-y-12">
                            <div className="text-center space-y-2">
                                <h3 className="text-sm font-black text-neutral-500 uppercase tracking-widest">Session Complete</h3>
                                <p className={`text-6xl font-black italic tracking-tighter ${getFlowScore().color}`}>
                                    {getFlowScore().label} ⚡
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-2xl px-4">
                                <div className="p-8 bg-white/5 rounded-3xl border border-white/10 text-center space-y-1 group hover:border-white/20 transition-all">
                                    <div className="text-[10px] font-black text-neutral-500 uppercase tracking-widest flex items-center justify-center gap-2">
                                        <Zap className="w-3 h-3 text-blue-400" /> Speed
                                    </div>
                                    <div className="text-4xl font-black text-white">{wpm} <span className="text-sm font-bold text-neutral-600">WPM</span></div>
                                </div>
                                <div className="p-8 bg-white/5 rounded-3xl border border-white/10 text-center space-y-1 group hover:border-white/20 transition-all">
                                    <div className="text-[10px] font-black text-neutral-500 uppercase tracking-widest flex items-center justify-center gap-2">
                                        <Target className="w-3 h-3 text-emerald-400" /> Accuracy
                                    </div>
                                    <div className="text-4xl font-black text-white">{accuracy}<span className="text-sm font-bold text-neutral-600">%</span></div>
                                </div>
                                <div className="p-8 bg-white/5 rounded-3xl border border-white/10 text-center space-y-1 group hover:border-white/20 transition-all">
                                    <div className="text-[10px] font-black text-neutral-500 uppercase tracking-widest flex items-center justify-center gap-2">
                                        <Timer className="w-3 h-3 text-pink-400" /> Time
                                    </div>
                                    <div className="text-4xl font-black text-white">{((endTime! - startTime!) / 1000).toFixed(1)}<span className="text-sm font-bold text-neutral-600">s</span></div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <button
                                    onClick={reset}
                                    className="px-8 py-4 bg-white text-black rounded-2xl font-black flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
                                >
                                    <RotateCcw className="w-4 h-4" /> Try Again
                                </button>
                                <button className="px-8 py-4 bg-white/10 text-white rounded-2xl font-black flex items-center gap-2 hover:bg-white/20 transition-all">
                                    <Share2 className="w-4 h-4" /> Share Flow
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="relative text-3xl md:text-5xl font-medium leading-tight text-neutral-700 tracking-tight select-none">
                            {/* Shadow Text */}
                            <div className="absolute inset-0 z-0">
                                {targetText}
                            </div>

                            {/* Active Progress */}
                            <div className="relative z-10">
                                {targetText.split('').map((char, i) => {
                                    let color = 'text-neutral-700'; // Default
                                    if (i < input.length) {
                                        color = input[i] === targetText[i] ? 'text-white' : 'text-rose-500';
                                    }
                                    return (
                                        <span key={i} className={`${color} transition-colors duration-200`}>
                                            {i === input.length && (
                                                <span className="relative">
                                                    <span className="absolute left-0 bottom-0 w-1 h-[1.2em] bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-pulse" />
                                                </span>
                                            )}
                                            {char}
                                        </span>
                                    );
                                })}
                                {!input && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <p className="text-white/20 italic animate-pulse">Start typing...</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Floating Stats Bar */}
                <div className={`absolute bottom-12 flex items-center gap-12 transition-all duration-700 ${startTime && !isFinished ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <div className="flex flex-col items-center">
                        <span className="text-[8px] font-black text-neutral-600 uppercase tracking-widest mb-1">WPM</span>
                        <span className="text-2xl font-black text-white">{wpm}</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-[8px] font-black text-neutral-600 uppercase tracking-widest mb-1">ACC</span>
                        <span className="text-2xl font-black text-white">{accuracy}%</span>
                    </div>
                </div>

                {/* Keyboard Shortcuts Hint */}
                <div className={`absolute bottom-6 text-[8px] font-black text-neutral-700 uppercase tracking-widest transition-opacity duration-1000 ${startTime ? 'opacity-0' : 'opacity-100'}`}>
                    Ctrl + 1-4 to Switch Modes • Esc to Reset
                </div>
            </div>

            {/* SEO Content */}
            <SEOContent title="The Zen of Touch Typing">
                <p>
                    Typing is more than just input; it&apos;s a bridge between thought and digital reality. TypeZen is designed to transform mundane practice into a meditative experience. By removing distractions and focusing on micro-interactions, we help you achieve a &quot;Flow State&quot; where your fingers move as fast as your ideas.
                </p>

                <FeaturesSection
                    title="Why Practice?"
                    features={[
                        "Boost WPM with distraction-free focus modes",
                        "Achieve \"Flow State\" with responsive visual feedback",
                        "Beautiful result cards to track and share your progress",
                        "Premium minimalist aesthetics for a calming experience"
                    ]}
                />

                <UseCasesSection
                    title="Mastering TypeZen"
                    cases={[
                        {
                            title: "Pick Mode",
                            description: "Choose from Focus, Flow, or Precision tests."
                        },
                        {
                            title: "Just Type",
                            description: "The clock starts when you hit the first key."
                        },
                        {
                            title: "Stay Locked",
                            description: "Watch your real-time WPM react to your speed."
                        },
                        {
                            title: "Share Flow",
                            description: "Download your premium result card and challenge others."
                        }
                    ]}
                />
            </SEOContent>
        </div>
    );
};

export default TypeZen;
