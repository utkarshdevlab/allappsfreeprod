'use client';

import React, { useState, useRef, useEffect } from 'react';
import { RotateCw, Plus, Trash2, Trophy, Target, PieChart, Maximize2 } from 'lucide-react';

interface Option {
    id: string;
    text: string;
    weight: number;
    color: string;
}

const COLORS = [
    '#6366f1', '#ec4899', '#f59e0b', '#10b981',
    '#3b82f6', '#8b5cf6', '#ef4444', '#06b6d4'
];

const DecisionWheel = () => {
    const [options, setOptions] = useState<Option[]>([
        { id: '1', text: 'Sushi', weight: 1, color: COLORS[0] },
        { id: '2', text: 'Pizza', weight: 1, color: COLORS[1] },
        { id: '3', text: 'Tacos', weight: 1, color: COLORS[2] },
        { id: '4', text: 'Salad', weight: 1, color: COLORS[3] },
    ]);
    const [isSpinning, setIsSpinning] = useState(false);
    const [winner, setWinner] = useState<Option | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [rotation, setRotation] = useState(0);

    const addOption = () => {
        if (options.length >= 8) return;
        const newOption: Option = {
            id: Date.now().toString(),
            text: `Option ${options.length + 1}`,
            weight: 1,
            color: COLORS[options.length % COLORS.length]
        };
        setOptions([...options, newOption]);
    };

    const removeOption = (id: string) => {
        if (options.length <= 2) return;
        setOptions(options.filter(o => o.id !== id));
    };

    const updateOption = (id: string, updates: Partial<Option>) => {
        setOptions(options.map(o => o.id === id ? { ...o, ...updates } : o));
    };

    const totalWeight = options.reduce((sum, o) => sum + o.weight, 0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const size = canvas.width;
        const center = size / 2;
        const radius = size / 2 - 10;

        ctx.clearRect(0, 0, size, size);

        let currentAngle = rotation;
        options.forEach((option) => {
            const sliceAngle = (option.weight / totalWeight) * 2 * Math.PI;

            ctx.beginPath();
            ctx.moveTo(center, center);
            ctx.arc(center, center, radius, currentAngle, currentAngle + sliceAngle);
            ctx.closePath();

            ctx.fillStyle = option.color;
            ctx.fill();
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Text
            ctx.save();
            ctx.translate(center, center);
            ctx.rotate(currentAngle + sliceAngle / 2);
            ctx.textAlign = 'right';
            ctx.fillStyle = 'white';
            ctx.font = 'bold 14px sans-serif';
            ctx.fillText(option.text, radius - 20, 5);
            ctx.restore();

            currentAngle += sliceAngle;
        });

        // Pointer
        ctx.beginPath();
        ctx.moveTo(size - 20, center);
        ctx.lineTo(size, center - 10);
        ctx.lineTo(size, center + 10);
        ctx.closePath();
        ctx.fillStyle = '#ef4444';
        ctx.fill();
    }, [options, rotation, totalWeight]);

    const spin = () => {
        if (isSpinning) return;
        setIsSpinning(true);
        setWinner(null);

        const spinRotation = 20 + Math.random() * 30; // Random extra rotations
        const duration = 4000;
        const start = performance.now();

        const animate = (time: number) => {
            const elapsed = time - start;
            const progress = elapsed / duration;

            if (progress < 1) {
                // Ease out cubic
                const easeOut = 1 - Math.pow(1 - progress, 3);
                setRotation(easeOut * spinRotation * Math.PI * 2);
                requestAnimationFrame(animate);
            } else {
                setIsSpinning(false);
                const finalRotation = (spinRotation * Math.PI * 2) % (Math.PI * 2);
                // Calculate winner based on finalRotation
                // The pointer is at 0 rad (right side). 
                // We need to find which slice covers the 0 rad point.
                // Since we rotated the wheel by `rotation`, a point originally at angle `a` is now at `a + rotation`.
                // We want `a + rotation = 0` (mod 2pi), so `a = -rotation`.
                const targetAngle = (2 * Math.PI - (finalRotation % (2 * Math.PI))) % (2 * Math.PI);
                let currentAngle = 0;
                for (const option of options) {
                    const sliceAngle = (option.weight / totalWeight) * 2 * Math.PI;
                    if (targetAngle >= currentAngle && targetAngle < currentAngle + sliceAngle) {
                        setWinner(option);
                        break;
                    }
                    currentAngle += sliceAngle;
                }
            }
        };
        requestAnimationFrame(animate);
    };

    return (
        <div ref={containerRef} className="max-w-6xl mx-auto space-y-12 bg-white/50 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white shadow-2xl overflow-hidden">
            <div className="flex justify-end pr-4">
                <button
                    onClick={() => {
                        if (!document.fullscreenElement) {
                            containerRef.current?.requestFullscreen();
                        } else {
                            document.exitFullscreen();
                        }
                    }}
                    className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                    title="Toggle Fullscreen"
                >
                    <Maximize2 className="w-6 h-6" />
                </button>
            </div>
            <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center p-3 bg-rose-100 rounded-2xl text-rose-600 mb-2">
                    <Target className="w-10 h-10" />
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-gray-900">Decision Architect</h2>
                <p className="text-gray-500 max-w-xl mx-auto font-medium">
                    Weighted probabilities meet premium mechanics. Add your options, adjust their importance, and let the wheel decide your next move.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                {/* Configuration */}
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                            <PieChart className="w-5 h-5 text-indigo-500" /> Probability Matrix
                        </h3>
                        <button
                            onClick={addOption}
                            disabled={options.length >= 8}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                        >
                            <Plus className="w-4 h-4" /> Add Option
                        </button>
                    </div>

                    <div className="space-y-3 custom-scrollbar max-h-[400px] overflow-y-auto pr-2">
                        {options.map((option) => (
                            <div key={option.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus-within:border-indigo-100 focus-within:bg-white transition-all group">
                                <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: option.color }} />
                                <input
                                    type="text"
                                    value={option.text}
                                    onChange={(e) => updateOption(option.id, { text: e.target.value })}
                                    className="flex-grow bg-transparent font-bold text-gray-700 outline-none"
                                />
                                <div className="flex items-center gap-3">
                                    <div className="flex flex-col">
                                        <input
                                            type="range"
                                            min="1"
                                            max="10"
                                            value={option.weight}
                                            onChange={(e) => updateOption(option.id, { weight: parseInt(e.target.value) })}
                                            className="w-24 accent-indigo-600"
                                        />
                                        <span className="text-[10px] font-black text-gray-400 uppercase text-center mt-1">Weight: {option.weight}</span>
                                    </div>
                                    <button
                                        onClick={() => removeOption(option.id)}
                                        className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                        <p className="text-xs text-indigo-700 font-bold leading-relaxed">
                            💡 PRO TIP: Increase the weight of an option to give it a higher statistical chance of winning.
                        </p>
                    </div>
                </div>

                {/* The Wheel */}
                <div className="flex flex-col items-center space-y-8 relative">
                    <div className="relative group">
                        <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                        <canvas
                            ref={canvasRef}
                            width={400}
                            height={400}
                            className="relative bg-white rounded-full shadow-2xl border-8 border-white"
                        />
                    </div>

                    <button
                        onClick={spin}
                        disabled={isSpinning}
                        className={`group relative px-12 py-5 rounded-2xl font-black text-xl uppercase tracking-widest transition-all ${isSpinning
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-900 text-white hover:bg-black hover:scale-105 shadow-[0_20px_50px_rgba(0,0,0,0.2)] active:scale-95'
                            }`}
                    >
                        <span className="flex items-center gap-3">
                            <RotateCw className={`w-6 h-6 ${isSpinning ? 'animate-spin' : ''}`} />
                            {isSpinning ? 'Architecting...' : 'Spin the Wheel'}
                        </span>
                    </button>

                    {winner && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center animate-in zoom-in fade-in duration-500 pointer-events-none">
                            <div className="bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white inline-block scale-110">
                                <div className="inline-flex items-center justify-center p-3 bg-yellow-100 rounded-2xl text-yellow-600 mb-4 scale-125">
                                    <Trophy className="w-8 h-8" />
                                </div>
                                <h4 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Result Selected</h4>
                                <p className="text-4xl font-black text-gray-900">{winner.text}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 10px;
                }
            `}</style>
        </div>
    );
};

export default DecisionWheel;
