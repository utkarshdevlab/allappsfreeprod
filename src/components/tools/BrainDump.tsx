'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
    Brain,
    Sparkles,
    CheckCircle2,
    Trash2,
    Copy,
    Maximize,
    FileText,
    Lightbulb
} from 'lucide-react';
import { SEOContent, FeaturesSection, UseCasesSection } from './SEOContent';

interface CategorizedItem {
    text: string;
    category: 'task' | 'idea' | 'question' | 'note';
}

const CATEGORY_ICONS = {
    task: '✅',
    idea: '💡',
    question: '❓',
    note: '📝'
};

const BrainDump = () => {
    const [input, setInput] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const categorizedItems = useMemo(() => {
        if (!input.trim()) return [];

        return input.split('\n').filter(line => line.trim()).map(line => {
            const trimmedLine = line.trim().toLowerCase();
            let category: CategorizedItem['category'] = 'note';

            if (trimmedLine.startsWith('- [ ]') || trimmedLine.startsWith('todo:') || trimmedLine.startsWith('task:')) {
                category = 'task';
            } else if (trimmedLine.startsWith('!') || trimmedLine.startsWith('idea:') || trimmedLine.includes('💡')) {
                category = 'idea';
            } else if (trimmedLine.endsWith('?')) {
                category = 'question';
            }

            return { text: line.trim(), category };
        });
    }, [input]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(input);
        alert('Copied to clipboard!');
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };

    return (
        <div className="space-y-8">
            <div
                ref={containerRef}
                className={`max-w-7xl mx-auto space-y-6 md:space-y-8 p-6 md:p-12 rounded-[3.5rem] border shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] flex flex-col transition-all duration-700 relative overflow-hidden ${isFullscreen
                    ? 'bg-[#0a0c10] border-white/5 pt-6 md:pt-8 px-8 md:px-16 w-screen h-screen rounded-none max-w-none space-y-4'
                    : 'bg-white/80 backdrop-blur-3xl border-white shadow-indigo-100/50 min-h-[750px]'
                    }`}
            >
                {/* Ambient Background Glows */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className={`absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full blur-[120px] transition-opacity duration-1000 ${isFullscreen ? 'bg-indigo-600/20 opacity-100' : 'bg-indigo-200/40 opacity-50'
                        }`}></div>
                    <div className={`absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full blur-[120px] transition-opacity duration-1000 ${isFullscreen ? 'bg-purple-600/20 opacity-100' : 'bg-purple-200/40 opacity-50'
                        }`}></div>
                </div>

                <div className={`text-center space-y-2 md:space-y-4 relative z-10 ${isFullscreen ? 'mb-4' : 'mb-8'}`}>
                    <div className={`inline-flex items-center justify-center rounded-[2rem] transition-all duration-500 ${isFullscreen
                        ? 'p-2.5 bg-indigo-500/20 text-indigo-400 scale-90'
                        : 'p-5 bg-indigo-600 text-white shadow-xl shadow-indigo-200 scale-110'
                        }`}>
                        <Brain className={isFullscreen ? 'w-8 h-8' : 'w-12 h-12'} />
                    </div>
                    <div className="space-y-1">
                        <h1 className={`font-black tracking-tight transition-all duration-500 ${isFullscreen ? 'text-3xl md:text-4xl text-white' : 'text-5xl md:text-6xl text-slate-900'
                            }`}>
                            Mental De-clutter
                        </h1>
                        <p className={`max-w-2xl mx-auto leading-relaxed transition-all duration-500 ${isFullscreen ? 'text-sm text-indigo-200/60' : 'text-xl text-slate-500 font-medium'
                            }`}>
                            Empty your brain. Type everything as it comes—tasks, ideas, random thoughts.
                            We&apos;ll organize it for you in real-time.
                        </p>
                    </div>
                </div>

                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 relative z-10 overflow-hidden ${isFullscreen ? 'flex-grow h-0 pb-8' : ''}`}>
                    {/* Input Section */}
                    <div className="flex flex-col space-y-4 md:space-y-6 h-full min-h-[300px] lg:min-h-0">
                        <div className="flex items-center justify-between px-4">
                            <label className={`text-xs font-black uppercase tracking-[0.3em] flex items-center gap-2.5 transition-colors duration-500 ${isFullscreen ? 'text-indigo-400' : 'text-indigo-600/70'
                                }`}>
                                <Sparkles className="w-3.5 h-3.5" />
                                Stream of Consciousness
                            </label>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={toggleFullscreen}
                                    className={`p-3 transition-all duration-300 rounded-2xl ${isFullscreen
                                        ? 'bg-white/5 text-white/40 hover:text-white hover:bg-white/10'
                                        : 'bg-indigo-50 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-100'
                                        }`}
                                    title="Toggle Fullscreen"
                                >
                                    <Maximize className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setInput('')}
                                    className={`p-3 transition-all duration-300 rounded-2xl ${isFullscreen
                                        ? 'bg-red-500/5 text-red-400/50 hover:text-red-400 hover:bg-red-500/20'
                                        : 'bg-red-50 text-red-400 hover:text-red-500 hover:bg-red-100'
                                        }`}
                                    title="Clear all"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={copyToClipboard}
                                    className={`p-3 transition-all duration-300 rounded-2xl ${isFullscreen
                                        ? 'bg-emerald-500/5 text-emerald-400/50 hover:text-emerald-400 hover:bg-emerald-500/20'
                                        : 'bg-emerald-50 text-emerald-400 hover:text-emerald-500 hover:bg-emerald-100'
                                        }`}
                                    title="Copy Content"
                                >
                                    <Copy className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="relative flex-grow">
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type freely... &#10;- [ ] Take over the world&#10;! Create a flying car 💡&#10;What is the meaning of life?&#10;Check the oven in 20 mins."
                                className={`w-full h-full p-10 rounded-[2.5rem] text-xl resize-none focus:outline-none focus:ring-8 transition-all duration-500 font-medium placeholder:opacity-30 leading-relaxed scrollbar-hide border-2 ${isFullscreen
                                    ? 'bg-white/[0.03] border-white/5 text-white placeholder:text-white focus:ring-indigo-500/10'
                                    : 'bg-slate-50 border-slate-100 text-slate-800 placeholder:text-slate-400 focus:ring-indigo-500/5'
                                    }`}
                            />
                        </div>
                    </div>

                    {/* Organized Workspace */}
                    <div className={`rounded-[2.5rem] p-10 border-2 shadow-sm flex flex-col transition-all duration-500 ${isFullscreen
                        ? 'bg-white/[0.02] border-white/5'
                        : 'bg-white border-slate-100 shadow-xl shadow-indigo-50/50'
                        }`}>
                        <div className="flex items-center gap-4 mb-10">
                            <div className={`p-3 rounded-2xl transition-colors duration-500 ${isFullscreen ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
                                }`}>
                                <FileText className="w-6 h-6" />
                            </div>
                            <h3 className={`text-2xl font-black tracking-tight transition-colors duration-500 ${isFullscreen ? 'text-white' : 'text-slate-800'
                                }`}>
                                Organized View
                            </h3>
                        </div>

                        <div className="flex-grow space-y-10 overflow-y-auto pr-4 custom-scrollbar">
                            {categorizedItems.length > 0 ? (
                                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                                    {(['task', 'idea', 'question', 'note'] as const).map((category) => {
                                        const items = categorizedItems.filter(i => i.category === category);
                                        if (items.length === 0) return null;

                                        return (
                                            <div key={category} className="space-y-5 group/category text-center lg:text-left">
                                                <div className="flex items-center gap-3 justify-center lg:justify-start">
                                                    <span className="text-2xl filter drop-shadow-md">{CATEGORY_ICONS[category]}</span>
                                                    <h4 className={`text-xs font-black uppercase tracking-[0.4em] transition-colors duration-500 ${isFullscreen ? 'text-indigo-400/60' : 'text-slate-400'
                                                        }`}>
                                                        {category}s
                                                    </h4>
                                                </div>
                                                <div className="grid grid-cols-1 gap-4">
                                                    {items.map((item, idx) => (
                                                        <div
                                                            key={idx}
                                                            className={`p-6 rounded-[1.5rem] flex items-start gap-5 group transition-all duration-300 border-2 ${isFullscreen
                                                                ? 'bg-white/[0.03] border-white/5 hover:bg-white/[0.06] hover:border-white/10 text-indigo-50'
                                                                : 'bg-slate-50 border-slate-50 hover:border-indigo-100 hover:bg-white hover:shadow-lg text-slate-700'
                                                                }`}
                                                        >
                                                            <CheckCircle2 className={`w-6 h-6 mt-0.5 shrink-0 transition-all duration-500 ${isFullscreen
                                                                ? 'text-indigo-500/30 group-hover:text-indigo-400 group-hover:scale-110'
                                                                : 'text-slate-200 group-hover:text-indigo-500 group-hover:scale-110'
                                                                }`} />
                                                            <span className="text-lg leading-relaxed">{item.text}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-30 select-none">
                                    <div className={`p-10 rounded-[2.5rem] border-4 border-dashed transition-colors duration-500 ${isFullscreen ? 'border-white/10' : 'border-slate-100'
                                        }`}>
                                        <Lightbulb className={`w-16 h-16 ${isFullscreen ? 'text-indigo-400' : 'text-slate-300'}`} />
                                    </div>
                                    <div className="space-y-2">
                                        <p className={`text-lg font-bold transition-colors duration-500 ${isFullscreen ? 'text-white' : 'text-slate-500'}`}>
                                            Workspace Ready
                                        </p>
                                        <p className={`text-sm max-w-[200px] leading-relaxed ${isFullscreen ? 'text-indigo-200/40' : 'text-slate-400'}`}>
                                            Start typing on the left to see your thoughts organized.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: ${isFullscreen ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'};
                    border-radius: 20px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: ${isFullscreen ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'};
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
            </div>

            {/* SEO Content */}
            <SEOContent title="The Science of Mental De-cluttering">
                <p>
                    Brain dumping is a proven cognitive technique to reduce &quot;mental load.&quot; By externalizing your thoughts, you free up working memory, allowing for better focus and reduced anxiety. Our AI-powered engine takes this further by automatically organizing your stream-of-consciousness into actionable insights.
                </p>

                <FeaturesSection
                    title="Why It Works"
                    features={[
                        "Reduces \"Zeigarnik Effect\" (preoccupation with unfinished tasks)",
                        "Provides immediate visual clarity on chaotic thoughts",
                        "Categorizes ideas before they are forgotten",
                        "Creates a structured roadmap from a messy mind"
                    ]}
                />

                <UseCasesSection
                    title="How to Use Your Digital Workspace"
                    cases={[
                        { title: "Open Zen", description: "Enter fullscreen mode for a distraction-free environment." },
                        { title: "Type Freely", description: "Don't worry about formatting. Just type every thought." },
                        { title: "See Magic", description: "Watch as tasks and ideas are sorted in real-time." },
                        { title: "Clear & Copy", description: "Export your organized notes to your favorite PM tool." }
                    ]}
                />
            </SEOContent>
        </div>
    );
};

export default BrainDump;
