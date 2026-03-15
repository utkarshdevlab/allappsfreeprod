import React from 'react';

interface ListingHeroProps {
    title: string;
    description: string;
    icon: string;
    gradient: string;
    secondaryGradient?: string;
}

export default function ListingHero({ title, description, icon, gradient, secondaryGradient }: ListingHeroProps) {
    return (
        <div className={`relative overflow-hidden ${gradient} py-20 md:py-32 rounded-b-[3rem] md:rounded-b-[5rem] shadow-2xl transition-all duration-700`}>
            {/* Animated Mesh Gradients - Core Aesthetics */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className={`absolute -top-1/4 -left-1/4 w-1/2 h-1/2 ${secondaryGradient || 'bg-blue-400/20'} blur-[120px] rounded-full animate-blob`}></div>
                <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-purple-400/20 blur-[120px] rounded-full animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-1/4 left-1/4 w-1/2 h-1/2 bg-pink-400/20 blur-[120px] rounded-full animate-blob animation-delay-4000"></div>
            </div>

            {/* Floating Glassmorphism Shapes */}
            <div className="absolute top-10 right-10 w-32 h-32 bg-white/5 backdrop-blur-3xl rounded-full border border-white/10 shadow-2xl animate-float pointer-events-none hidden md:block"></div>
            <div className="absolute bottom-20 left-10 w-24 h-24 bg-white/5 backdrop-blur-2xl rounded-full border border-white/10 shadow-xl animate-float-delayed pointer-events-none hidden md:block"></div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="space-y-8">
                    {/* Glowing Icon Container */}
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full scale-150 animate-pulse"></div>
                        <div className="relative inline-flex items-center justify-center w-24 h-24 md:w-32 md:h-32 bg-white/10 backdrop-blur-xl rounded-[2.5rem] border border-white/20 shadow-[0_0_50px_rgba(255,255,255,0.1)] group transition-transform duration-500 hover:scale-110">
                            <span className="text-6xl md:text-7xl drop-shadow-2xl filter group-hover:brightness-110 transition-all">
                                {icon}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-tight drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)]">
                            {title}
                        </h1>
                        <p className="max-w-3xl mx-auto text-xl md:text-3xl text-white/80 font-medium leading-relaxed drop-shadow-md px-4">
                            {description}
                        </p>
                    </div>

                    {/* Quick Stats or Vibes */}
                    <div className="flex flex-wrap justify-center gap-4 pt-4">
                        <span className="px-5 py-2.5 bg-white/10 backdrop-blur-md rounded-full text-white text-sm font-bold border border-white/10 shadow-lg">
                            ✨ Premium Features
                        </span>
                        <span className="px-5 py-2.5 bg-white/10 backdrop-blur-md rounded-full text-white text-sm font-bold border border-white/10 shadow-lg">
                            🚀 Ad-Free
                        </span>
                        <span className="px-5 py-2.5 bg-white/10 backdrop-blur-md rounded-full text-white text-sm font-bold border border-white/10 shadow-lg">
                            🔒 100% Private
                        </span>
                    </div>
                </div>
            </div>

            {/* Aesthetic Highlight */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
        </div>
    );
}
