'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
    Terminal,
    Activity,
    Cpu,
    Network,
    Shield,
    Settings,
    Lock,
    EyeOff,
    Maximize2,
    RefreshCw,
    PieChart,
    BarChart3,
    Server,
    Volume2,
    VolumeX,
    CheckCircle2
} from 'lucide-react';

const WorkEscape = () => {
    const [isSecretMode, setIsSecretMode] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [logs, setLogs] = useState<string[]>(['[SYSTEM] Initializing kernel...', '[SYSTEM] Loading telemetry...']);
    const [isMuted, setIsMuted] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    // Mock logs effect
    useEffect(() => {
        const interval = setInterval(() => {
            const mockLogs = [
                `[PROCESS] worker-${Math.floor(Math.random() * 9999)} updated successfully`,
                `[NETWORK] Incoming handshake from 192.168.${Math.floor(Math.random() * 255)}.1`,
                `[CACHE] Purged 8 unused buckets in us-east-1`,
                `[SECURITY] Entropy level stable at 98.4%`,
                `[BUILD] Compiled main.rs in ${Math.floor(Math.random() * 500)}ms`,
            ];
            setLogs(prev => [...prev.slice(-15), mockLogs[Math.floor(Math.random() * mockLogs.length)]]);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    // Time effect
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const toggleSecret = () => setIsSecretMode(prev => !prev);

    if (isSecretMode) {
        return (
            <div className="relative h-[650px] w-full rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white flex flex-col items-center justify-center space-y-8 animate-in fade-in zoom-in duration-700">
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_50%)]"></div>
                    <div className="stars-container"></div>
                </div>

                <div className="relative z-10 text-center space-y-6">
                    <div className="w-32 h-32 mx-auto rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-2xl animate-pulse">
                        <Activity className="w-16 h-16 text-pink-400" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-4xl font-black tracking-tight">Zen Space Unlocked</h2>
                        <p className="text-indigo-200 font-medium">Relax. Deep breaths. You&apos;re doing great.</p>
                    </div>

                    <div className="flex items-center justify-center gap-4">
                        <button
                            onClick={() => setIsMuted(!isMuted)}
                            className="p-4 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 transition-all font-bold flex items-center gap-2"
                        >
                            {isMuted ? <VolumeX /> : <Volume2 />}
                            {isMuted ? 'Sound Off' : 'Rain Ambient'}
                        </button>
                        <button
                            onClick={toggleSecret}
                            className="p-4 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 transition-all font-bold flex items-center gap-2"
                        >
                            <Lock className="w-5 h-5" /> Back to &quot;Work&quot;
                        </button>
                    </div>
                </div>

                <div className="absolute bottom-12 w-full max-w-md px-8">
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-pink-400 w-1/3 animate-progress"></div>
                    </div>
                    <div className="flex justify-between mt-2 text-xs font-bold text-indigo-300 uppercase tracking-widest">
                        <span>Meditation Mode</span>
                        <span>Session Active</span>
                    </div>
                </div>

                <style jsx>{`
                    @keyframes progress {
                        0% { width: 0%; }
                        100% { width: 100%; }
                    }
                    .animate-progress {
                        animation: progress 60s linear infinite;
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="h-[650px] w-full rounded-3xl overflow-hidden bg-slate-950 font-mono text-slate-400 border border-slate-800 flex shadow-2xl">
            {/* Sidebar */}
            <div className="w-16 md:w-64 border-r border-slate-800 bg-slate-900/50 flex flex-col">
                <div className="p-4 border-b border-slate-800 flex items-center gap-2 overflow-hidden">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                    <span className="text-xs font-black text-slate-200 uppercase tracking-widest hidden md:block">System-OS v2.4</span>
                </div>
                <nav className="flex-grow p-2 space-y-1">
                    {[
                        { icon: Server, label: 'Instances', active: true },
                        { icon: Cpu, label: 'Processors' },
                        { icon: Network, label: 'Virtual LAN' },
                        { icon: Shield, label: 'Firewalls' },
                        { icon: BarChart3, label: 'Metrics' },
                        { icon: Settings, label: 'Environment' },
                    ].map((item, idx) => (
                        <div key={idx} className={`flex items-center gap-3 p-3 rounded-xl cursor-default transition-colors ${item.active ? 'bg-slate-800 text-slate-100' : 'hover:bg-slate-800/50'}`}>
                            <item.icon className="w-5 h-5" />
                            <span className="text-sm font-medium hidden md:block">{item.label}</span>
                        </div>
                    ))}
                </nav>
                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={toggleSecret}
                        className="w-full p-2 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-slate-300 transition-colors flex justify-center"
                        title="Enter Debug Console"
                    >
                        <Lock className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Main Console */}
            <div className="flex-grow flex flex-col divide-y divide-slate-800">
                {/* Header */}
                <header className="h-14 flex items-center justify-between px-6 bg-slate-900">
                    <div className="flex items-center gap-4">
                        <Terminal className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs font-bold text-slate-300 truncate">console@production: /opt/cluster-01/logs</span>
                        <button
                            onClick={() => {
                                if (!document.fullscreenElement) {
                                    containerRef.current?.requestFullscreen();
                                } else {
                                    document.exitFullscreen();
                                }
                            }}
                            className="p-1 hover:bg-slate-800 rounded text-slate-500 hover:text-slate-300 transition-colors"
                            title="Toggle Fullscreen"
                        >
                            <Maximize2 className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-tighter">
                        <span className="flex items-center gap-1"><Cpu className="w-3 h-3" /> 12% CPU</span>
                        <span className="hidden sm:flex items-center gap-1"><Activity className="w-3 h-3" /> 2.4 GB</span>
                        <span className="text-slate-100 bg-slate-700 px-2 py-0.5 rounded italic">{currentTime.toLocaleTimeString()}</span>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-0 h-full overflow-hidden">
                    {/* Live Logs */}
                    <div className="lg:col-span-2 p-6 flex flex-col space-y-1 bg-black/20 overflow-hidden">
                        <div className="text-[10px] font-black text-slate-600 mb-4 uppercase tracking-[0.2em] flex items-center gap-2">
                            <Maximize2 className="w-3 h-3" /> Real-time Kernel Stream
                        </div>
                        {logs.map((log, idx) => (
                            <div key={idx} className="text-xs leading-relaxed group">
                                <span className="text-slate-700 select-none">{`[${currentTime.toLocaleDateString()}]`}</span>{' '}
                                <span className={log.includes('PROCESS') ? 'text-emerald-500' : log.includes('SECURITY') ? 'text-amber-500' : 'text-slate-400'}>
                                    {log}
                                </span>
                            </div>
                        ))}
                        <div className="w-2 h-4 bg-emerald-500 animate-pulse mt-2" />
                    </div>

                    {/* Stats Panels */}
                    <div className="border-l border-slate-800 p-6 space-y-6 hidden lg:block bg-slate-900/30">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black text-slate-500 uppercase">Memory Load</span>
                                <RefreshCw className="w-3 h-3 animate-spin text-slate-700" />
                            </div>
                            <div className="flex gap-1 h-8 items-end">
                                {[30, 45, 20, 10, 60, 80, 50, 40, 70, 90, 85, 40].map((h, i) => (
                                    <div key={i} className="flex-grow bg-emerald-500/20 hover:bg-emerald-500/40 transition-colors rounded-sm" style={{ height: `${h}%` }} />
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <span className="text-[10px] font-black text-slate-500 uppercase">Network Outbound</span>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-800">
                                    <div className="text-[10px] text-slate-500 mb-1 leading-none">THROUGHPUT</div>
                                    <div className="text-lg font-bold text-slate-200">2.1 GB/s</div>
                                </div>
                                <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-800">
                                    <div className="text-[10px] text-slate-500 mb-1 leading-none">LATENCY</div>
                                    <div className="text-lg font-bold text-slate-200">14ms</div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl space-y-2">
                            <div className="flex items-center gap-2 text-emerald-500">
                                <Shield className="w-4 h-4" />
                                <span className="text-xs font-black uppercase">Secure Mode</span>
                            </div>
                            <p className="text-[10px] leading-relaxed text-slate-400 italic">
                                All instances are currently reporting stable entropy and zero intrusion attempts.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer Bar */}
                <footer className="h-10 bg-slate-900 border-t border-slate-800 px-6 flex items-center justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <div className="flex gap-6">
                        <span className="flex items-center gap-1"><PieChart className="w-3 h-3" /> Node-01: OK</span>
                        <span className="flex items-center gap-1 text-emerald-600"><CheckCircle2 className="w-3 h-3" /> Ready</span>
                    </div>
                    <div className="flex gap-4">
                        <span className="hover:text-slate-300 cursor-pointer transition-colors" onClick={toggleSecret}>Toggle Secret Mode</span>
                        <EyeOff className="w-3 h-3 cursor-pointer" onClick={toggleSecret} />
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default WorkEscape;
