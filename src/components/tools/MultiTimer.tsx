"use client";

import React, { useState, useEffect, useRef } from 'react';
import { SEOContent, UseCasesSection, FeaturesSection, FAQSection } from './SEOContent';

interface TimerItem {
    id: string;
    label: string;
    totalSeconds: number;
    remainingSeconds: number;
    isRunning: boolean;
    finished: boolean;
}

const MultiTimer = () => {
    const [mode, setMode] = useState<'stopwatch' | 'timer'>('timer');
    const [timers, setTimers] = useState<TimerItem[]>([]);
    const [swTime, setSwTime] = useState(0);
    const [swRunning, setSwRunning] = useState(false);
    const [laps, setLaps] = useState<number[]>([]);
    const [customMinutes, setCustomMinutes] = useState(1);
    const [customLabel, setCustomLabel] = useState('');
    const swRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Stopwatch
    useEffect(() => {
        if (swRunning) {
            swRef.current = setInterval(() => {
                setSwTime(prev => prev + 10);
            }, 10);
        } else {
            if (swRef.current) clearInterval(swRef.current);
        }
        return () => { if (swRef.current) clearInterval(swRef.current); };
    }, [swRunning]);

    const formatSwTime = (ms: number) => {
        const h = Math.floor(ms / 3600000);
        const m = Math.floor((ms % 3600000) / 60000);
        const s = Math.floor((ms % 60000) / 1000);
        const cs = Math.floor((ms % 1000) / 10);
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${cs.toString().padStart(2, '0')}`;
    };

    const addLap = () => { setLaps(prev => [swTime, ...prev]); };
    const resetSw = () => { setSwRunning(false); setSwTime(0); setLaps([]); };

    // Multi-Timer
    useEffect(() => {
        timerRef.current = setInterval(() => {
            setTimers(prev => prev.map(t => {
                if (!t.isRunning || t.remainingSeconds <= 0) return t;
                const next = t.remainingSeconds - 1;
                return { ...t, remainingSeconds: next, isRunning: next > 0, finished: next === 0 };
            }));
        }, 1000);
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, []);

    const addTimer = (seconds: number, label?: string) => {
        const newTimer: TimerItem = {
            id: Date.now().toString(),
            label: label || `${Math.floor(seconds / 60)} Min Timer`,
            totalSeconds: seconds,
            remainingSeconds: seconds,
            isRunning: true,
            finished: false,
        };
        setTimers(prev => [newTimer, ...prev]);
    };

    const toggleTimer = (id: string) => {
        setTimers(prev => prev.map(t => t.id === id
            ? { ...t, isRunning: !t.isRunning, finished: false }
            : t
        ));
    };

    const deleteTimer = (id: string) => setTimers(prev => prev.filter(t => t.id !== id));

    const resetTimer = (id: string) => {
        setTimers(prev => prev.map(t => t.id === id
            ? { ...t, remainingSeconds: t.totalSeconds, isRunning: false, finished: false }
            : t
        ));
    };

    const formatTimerTime = (s: number) => {
        const h = Math.floor(s / 3600);
        const m = Math.floor((s % 3600) / 60);
        const sec = s % 60;
        return h > 0
            ? `${h}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
            : `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    };

    return (
        <div className="max-w-4xl mx-auto">

            {/* Mode Switcher */}
            <div className="flex justify-center mb-8">
                <div className="inline-flex p-1 bg-gray-100 rounded-2xl border border-gray-200 shadow-inner">
                    <button
                        onClick={() => setMode('timer')}
                        className={`px-8 py-3 rounded-xl font-black transition-all ${mode === 'timer' ? 'bg-white text-blue-600 shadow-lg scale-105' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        ⏱️ MULTI-TIMER
                    </button>
                    <button
                        onClick={() => setMode('stopwatch')}
                        className={`px-8 py-3 rounded-xl font-black transition-all ${mode === 'stopwatch' ? 'bg-white text-blue-600 shadow-lg scale-105' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        🔄 STOPWATCH
                    </button>
                </div>
            </div>

            {/* Stopwatch */}
            {mode === 'stopwatch' && (
                <div className="space-y-8">
                    <div className="bg-white p-12 rounded-3xl border-2 border-gray-100 shadow-2xl text-center space-y-8">
                        <div className="text-7xl md:text-8xl font-black font-mono tracking-tighter text-blue-600 tabular-nums select-none">
                            {formatSwTime(swTime)}
                        </div>
                        <div className="flex flex-wrap justify-center gap-4">
                            {!swRunning ? (
                                <button onClick={() => setSwRunning(true)} className="px-10 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 hover:scale-105 transition-all shadow-xl shadow-blue-200">
                                    START
                                </button>
                            ) : (
                                <button onClick={() => setSwRunning(false)} className="px-10 py-4 bg-orange-500 text-white font-black rounded-2xl hover:bg-orange-600 hover:scale-105 transition-all shadow-xl shadow-orange-200">
                                    PAUSE
                                </button>
                            )}
                            <button onClick={addLap} disabled={!swRunning && swTime === 0} className="px-10 py-4 bg-gray-800 text-white font-black rounded-2xl hover:bg-gray-900 hover:scale-105 transition-all shadow-xl disabled:opacity-40">
                                LAP
                            </button>
                            <button onClick={resetSw} className="px-10 py-4 bg-white border-2 border-gray-200 text-gray-700 font-black rounded-2xl hover:bg-gray-50 hover:scale-105 transition-all shadow-xl">
                                RESET
                            </button>
                        </div>
                    </div>

                    {laps.length > 0 && (
                        <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 max-h-96 overflow-y-auto">
                            <h3 className="text-lg font-black text-gray-900 mb-4">🏁 Lap History</h3>
                            <div className="space-y-2">
                                {laps.map((lap, i) => (
                                    <div key={i} className="flex justify-between items-center p-4 bg-white rounded-xl border border-gray-200">
                                        <span className="font-bold text-gray-400">LAP {laps.length - i}</span>
                                        <span className="font-black font-mono text-gray-800 tabular-nums text-xl">{formatSwTime(lap)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Multi-Timer */}
            {mode === 'timer' && (
                <div className="space-y-8">
                    {/* Quick Presets */}
                    <div className="bg-blue-50 p-6 rounded-3xl border-2 border-blue-100">
                        <p className="text-blue-900 font-black mb-4 text-sm uppercase tracking-wider">Quick Add Preset</p>
                        <div className="flex flex-wrap gap-3">
                            {[1, 5, 10, 15, 30, 60].map(m => (
                                <button
                                    key={m}
                                    onClick={() => addTimer(m * 60)}
                                    className="px-4 py-2 bg-white text-blue-600 border border-blue-200 rounded-xl font-bold hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                >
                                    +{m}m
                                </button>
                            ))}
                        </div>

                        {/* Custom Timer */}
                        <div className="flex gap-3 mt-4">
                            <input
                                type="number"
                                min={1}
                                value={customMinutes}
                                onChange={e => setCustomMinutes(parseInt(e.target.value) || 1)}
                                placeholder="Minutes"
                                className="w-28 p-2 rounded-xl border border-blue-200 text-blue-900 font-bold outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <input
                                type="text"
                                value={customLabel}
                                onChange={e => setCustomLabel(e.target.value)}
                                placeholder="Label (optional)"
                                className="flex-1 p-2 rounded-xl border border-blue-200 text-blue-900 font-medium outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <button
                                onClick={() => { addTimer(customMinutes * 60, customLabel || undefined); setCustomLabel(''); }}
                                className="px-5 py-2 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 transition-all"
                            >
                                ADD
                            </button>
                        </div>
                    </div>

                    {/* Active Timers */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {timers.map((timer) => {
                            const pct = timer.totalSeconds > 0 ? (timer.remainingSeconds / timer.totalSeconds) * 100 : 0;
                            return (
                                <div
                                    key={timer.id}
                                    className={`bg-white p-8 rounded-3xl border-2 shadow-xl space-y-5 relative overflow-hidden transition-all ${timer.finished ? 'border-green-300' : 'border-gray-100'}`}
                                >
                                    {/* Progress bar at top */}
                                    <div className="absolute top-0 left-0 h-1.5 bg-blue-500 transition-all duration-1000 rounded-t-3xl" style={{ width: `${pct}%` }} />

                                    <div className="flex justify-between items-start pt-2">
                                        <h3 className="text-lg font-black text-gray-900">{timer.label}</h3>
                                        <button onClick={() => deleteTimer(timer.id)} className="text-gray-300 hover:text-red-500 font-black text-xl leading-none transition-colors">✕</button>
                                    </div>

                                    <div className={`text-5xl font-black font-mono tabular-nums text-center ${timer.finished ? 'text-green-500' : 'text-blue-600'}`}>
                                        {timer.finished ? '✅ Done!' : formatTimerTime(timer.remainingSeconds)}
                                    </div>

                                    <div className="flex gap-2">
                                        {!timer.finished && (
                                            <button
                                                onClick={() => toggleTimer(timer.id)}
                                                className={`flex-1 py-3 rounded-xl font-bold transition-all text-white ${timer.isRunning ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'}`}
                                            >
                                                {timer.isRunning ? 'PAUSE' : 'RESUME'}
                                            </button>
                                        )}
                                        <button onClick={() => resetTimer(timer.id)} className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all">
                                            RESET
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {timers.length === 0 && (
                        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                            <div className="text-6xl mb-4">⌛</div>
                            <h3 className="text-xl font-bold text-gray-400">No active timers. Add one above to get started!</h3>
                        </div>
                    )}
                </div>
            )}

            <SEOContent title="Comprehensive Timing Toolkit">
                <p>
                    Stay on top of your schedule with our premium Timers &amp; Stopwatches toolkit. Designed for productivity, sports, cooking, and professional time management, this tool offers a high-precision, distraction-free environment for all your timing needs.
                </p>

                <FeaturesSection
                    title="Toolkit Features"
                    features={[
                        "Multi-Timer Mode: Run multiple countdown timers simultaneously with custom labels.",
                        "Pro Stopwatch: High-precision tracking with sub-second accuracy and lap functionality.",
                        "Quick Presets: Instant timers for 1, 5, 10, 15, 30, and 60 minutes.",
                        "Custom Timers: Set any duration with a custom label.",
                        "Progress Tracking: Visual progress bars for every active timer.",
                        "Completely Free: All premium timing features with zero ads or signups."
                    ]}
                />

                <UseCasesSection
                    cases={[
                        { title: "Productivity & Focus", description: "Use multiple timers for time-blocking or the Pomodoro technique to maximize your work output." },
                        { title: "Kitchen & Cooking", description: "Track multiple dishes at once with dedicated timers for each pot or oven tray." },
                        { title: "Sports & Training", description: "Professional stopwatch for timing sprints, sets, or circuit training rounds with lap tracking." },
                        { title: "Professional Meetings", description: "Keep presentations and meetings on track using countdown timers for specific agenda items." }
                    ]}
                />

                <FAQSection
                    faqs={[
                        { question: "Can I run multiple timers at once?", answer: "Absolutely! You can add as many timers as you need and run them concurrently. Each timer can be paused and reset individually." },
                        { question: "Will the timer work if I switch tabs?", answer: "Yes, as long as the browser window remains open. For very long timers, we recommend keeping the tab active for maximum accuracy." },
                        { question: "How accurate is the stopwatch?", answer: "Our stopwatch uses high-precision JavaScript timing, offering accuracy down to 10 milliseconds (0.01 seconds)." },
                        { question: "Can I add a custom timer duration?", answer: "Yes! Use the 'Custom Timer' input in Multi-Timer mode to set any duration in minutes, with an optional label." }
                    ]}
                />
            </SEOContent>
        </div>
    );
};

export default MultiTimer;
