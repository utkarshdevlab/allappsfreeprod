'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
    CloudRain,
    Coffee,
    Music,
    Wind,
    Volume2,
    VolumeX,
    Play,
    Pause,
    Moon,
    Sun,
    Zap,
    Maximize2
} from 'lucide-react';

import { Howl } from 'howler';

interface SoundLayer {
    id: string;
    name: string;
    icon: React.ElementType;
    url: string;
    volume: number;
    isActive: boolean;
    howl?: Howl;
}

const VibeMaster = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [layers, setLayers] = useState<SoundLayer[]>([
        { id: 'rain', name: 'Soft Rain', icon: CloudRain, url: 'https://assets.mixkit.co/sfx/preview/mixkit-rain-falling-on-metal-roof-2430.mp3', volume: 0.5, isActive: false },
        { id: 'cafe', name: 'Paris Cafe', icon: Coffee, url: 'https://assets.mixkit.co/sfx/preview/mixkit-coffee-shop-ambience-with-people-talking-and-clatter-562.mp3', volume: 0.3, isActive: false },
        { id: 'lofi', name: 'Lo-fi Beat', icon: Music, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', volume: 0.4, isActive: false },
        { id: 'wind', name: 'Deep Wind', icon: Wind, url: 'https://assets.mixkit.co/sfx/preview/mixkit-wind-whistling-loop-1160.mp3', volume: 0.2, isActive: false },
    ]);

    const [preset, setPreset] = useState<'night' | 'day' | 'cyber'>('night');
    const [isPlayingGlobal, setIsPlayingGlobal] = useState(false);

    useEffect(() => {
        const initializedLayers = layers.map(layer => {
            if (!layer.howl) {
                const howl = new Howl({
                    src: [layer.url],
                    loop: true,
                    volume: layer.volume,
                    html5: true,
                });
                return { ...layer, howl };
            }
            return layer;
        });
        setLayers(initializedLayers);

        return () => {
            initializedLayers.forEach(layer => {
                if (layer.howl) layer.howl.unload();
            });
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const toggleLayer = (id: string) => {
        setLayers(prev => prev.map(l => {
            if (l.id === id) {
                const newIsActive = !l.isActive;
                if (isPlayingGlobal) {
                    if (newIsActive) {
                        l.howl?.play();
                        l.howl?.fade(0, l.volume, 500);
                    } else {
                        l.howl?.pause();
                    }
                }
                return { ...l, isActive: newIsActive };
            }
            return l;
        }));
        if (!isPlayingGlobal) {
            setIsPlayingGlobal(true);
            layers.forEach(l => {
                if (l.id === id || l.isActive) {
                    l.howl?.play();
                }
            });
        }
    };

    const updateVolume = (id: string, vol: number) => {
        setLayers(prev => prev.map(l => {
            if (l.id === id) {
                l.howl?.volume(vol);
                return { ...l, volume: vol };
            }
            return l;
        }));
    };

    useEffect(() => {
        layers.forEach(layer => {
            if (layer.howl) {
                if (isPlayingGlobal && layer.isActive) {
                    if (!layer.howl.playing()) {
                        layer.howl.play();
                    }
                } else {
                    layer.howl.pause();
                }
            }
        });
    }, [isPlayingGlobal, layers]);

    const bgStyles = {
        night: 'from-slate-900 via-indigo-950 to-slate-900',
        day: 'from-sky-100 via-amber-50 to-sky-100',
        cyber: 'from-fuchsia-950 via-slate-900 to-teal-950'
    };

    const accentColors = {
        night: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10',
        day: 'text-amber-600 border-amber-200 bg-amber-50',
        cyber: 'text-fuchsia-400 border-fuchsia-500/30 bg-fuchsia-500/10'
    };

    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };

    return (
        <div className="space-y-12">
            <div
                ref={containerRef}
                className={`relative w-full rounded-[2.5rem] overflow-hidden transition-all duration-1000 bg-gradient-to-br shadow-3xl flex flex-col items-center justify-center p-6 md:p-12 border-4 border-white/10 ${bgStyles[preset]} ${isFullscreen ? 'h-screen w-screen rounded-none border-none' : 'min-h-[850px]'
                    }`}
            >
                <div className={`absolute z-20 transition-all duration-500 ${isFullscreen ? 'top-10 right-10' : 'top-8 right-8'}`}>
                    <button
                        onClick={toggleFullscreen}
                        className="p-4 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 transition-all text-white group"
                        title="Toggle Fullscreen"
                    >
                        <Maximize2 className={`w-6 h-6 transition-transform duration-500 ${isFullscreen ? 'rotate-180' : ''}`} />
                    </button>
                </div>

                {/* Generative Visualizer (Abstract) */}
                <div className="absolute inset-0 opacity-40 pointer-events-none">
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px] mix-blend-screen animate-pulse ${preset === 'night' ? 'bg-indigo-500/20' : preset === 'day' ? 'bg-amber-400/20' : 'bg-fuchsia-500/20'}`}></div>
                    <div className={`absolute top-1/4 left-1/4 w-[300px] h-[300px] rounded-full blur-[80px] mix-blend-screen animate-bounce-slow duration-1000 ${preset === 'night' ? 'bg-purple-500/10' : preset === 'day' ? 'bg-sky-400/10' : 'bg-teal-500/10'}`}></div>
                </div>

                <div className={`relative z-10 w-full max-w-5xl transition-all duration-700 ${isFullscreen ? 'space-y-8 md:scale-110' : 'space-y-12'}`}>
                    {/* Header & Presets */}
                    <div className="flex flex-col md:row items-center justify-between gap-6">
                        <div className="space-y-1 text-center md:text-left">
                            <h1 className={`text-4xl md:text-6xl font-black tracking-tighter uppercase transition-colors duration-500 ${preset === 'day' ? 'text-slate-900' : 'text-white'}`}>Vibe Master</h1>
                            <p className={`text-sm md:text-base font-black uppercase tracking-[0.4em] transition-colors duration-500 ${preset === 'day' ? 'text-slate-500' : 'text-indigo-200/40'}`}>Ambient Sound Engine</p>
                        </div>

                        <div className="flex bg-white/5 backdrop-blur-3xl p-2 rounded-[2rem] border border-white/10 shadow-2xl">
                            {[
                                { id: 'night', icon: Moon, label: 'Midnight' },
                                { id: 'day', icon: Sun, label: 'Solstice' },
                                { id: 'cyber', icon: Zap, label: 'Neon' }
                            ].map((p) => (
                                <button
                                    key={p.id}
                                    onClick={() => setPreset(p.id as any)}
                                    className={`flex items-center gap-3 px-8 py-4 rounded-[1.5rem] font-black text-xs md:text-sm transition-all duration-500 ${preset === p.id
                                        ? 'bg-white text-slate-900 shadow-[0_20px_40px_-10px_rgba(255,255,255,0.3)] scale-105'
                                        : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                                >
                                    <p.icon className="w-5 h-5" />
                                    <span className="hidden lg:inline">{p.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Mixer Grid */}
                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 ${isFullscreen ? 'pb-4' : 'pb-12'}`}>
                        {layers.map((layer) => (
                            <div
                                key={layer.id}
                                className={`group relative p-10 rounded-[2.5rem] border-2 transition-all duration-700 ${layer.isActive ? accentColors[preset] : 'bg-white/5 border-white/5 hover:border-white/10'} backdrop-blur-3xl shadow-2xl`}
                            >
                                <div className="flex items-center justify-between mb-10">
                                    <div className="flex items-center gap-6">
                                        <div className={`p-5 rounded-2xl transition-all duration-700 ${layer.isActive ? 'bg-white text-slate-900 scale-125 rotate-12 shadow-[0_20px_40px_-10px_rgba(255,255,255,0.4)]' : 'bg-white/5 text-white'}`}>
                                            <layer.icon className="w-10 h-10" />
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className={`text-2xl font-black ${layer.isActive ? '' : 'text-white'}`}>{layer.name}</h3>
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${layer.isActive ? 'bg-current animate-pulse' : 'bg-white/20'}`}></div>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => toggleLayer(layer.id)}
                                        className={`w-16 h-16 rounded-3xl flex items-center justify-center transition-all duration-500 ${layer.isActive ? 'bg-white text-slate-900 hover:scale-110 shadow-xl' : 'bg-white/10 text-white hover:bg-white/20 hover:rounded-full'}`}
                                    >
                                        {layer.isActive ? <Volume2 className="w-7 h-7" /> : <VolumeX className="w-7 h-7" />}
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-[0.2em] opacity-40">
                                        <span>Intensity Level</span>
                                        <span className="text-sm font-black tabular-nums">{Math.round(layer.volume * 100)}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.01"
                                        value={layer.volume}
                                        onChange={(e) => updateVolume(layer.id, parseFloat(e.target.value))}
                                        disabled={!layer.isActive}
                                        className={`w-full h-3 rounded-full appearance-none bg-black/20 transition-all ${!layer.isActive ? 'opacity-20 cursor-not-allowed' : 'cursor-pointer hover:h-4'}`}
                                        style={{
                                            background: `linear-gradient(to right, ${preset === 'day' ? '#1e293b' : '#fff'} ${layer.volume * 100}%, rgba(255,255,255,0.05) ${layer.volume * 100}%)`
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Global Controls */}
                    <div className="flex flex-col items-center space-y-6">
                        <button
                            onClick={() => setIsPlayingGlobal(!isPlayingGlobal)}
                            className={`group relative px-20 py-8 rounded-[3rem] font-black text-2xl uppercase tracking-[0.3em] transition-all duration-500 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] flex items-center gap-6 overflow-hidden transform hover:-translate-y-1 active:translate-y-0 ${preset === 'day' ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}
                        >
                            <div className="absolute inset-0 bg-indigo-600 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                            {isPlayingGlobal ? <Pause className="w-8 h-8 animate-pulse" /> : <Play className="w-8 h-8" />}
                            {isPlayingGlobal ? 'Pause Vibe' : 'Immersion Start'}
                        </button>
                        <p className={`text-[11px] font-black uppercase tracking-[0.5em] transition-colors duration-500 ${preset === 'day' ? 'text-slate-400' : 'text-white/20'}`}>
                            Mixing 4 High-fidelity real-time channels
                        </p>
                    </div>
                </div>

            </div>

            <style jsx>{`
                input[type='range']::-webkit-slider-thumb {
                    appearance: none;
                    width: 20px;
                    height: 20px;
                    background: white;
                    border-radius: 50%;
                    cursor: pointer;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                }
                .shadow-3xl {
                    box-shadow: 0 35px 60px -15px rgba(0, 0, 0, 0.5);
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0) scale(1.0); }
                    50% { transform: translateY(-30px) scale(1.1); }
                }
            `}</style>
        </div>
    );
};

export default VibeMaster;
