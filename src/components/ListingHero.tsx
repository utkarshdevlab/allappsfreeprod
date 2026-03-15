import React from 'react';
import Link from 'next/link';

interface ListingHeroProps {
    title: string;
    description: string;
    icon: string;
    gradient: string;
    breadcrumbs: { label: string; href: string }[];
}

export default function ListingHero({ title, description, icon, gradient, breadcrumbs }: ListingHeroProps) {
    return (
        <div className={`relative ${gradient} overflow-hidden shadow-2xl`}>
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute inset-0" style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
            }}></div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                {/* Breadcrumbs */}
                <nav className="flex items-center space-x-2 text-sm text-white/80 mb-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
                    {breadcrumbs.map((crumb, index) => (
                        <React.Fragment key={crumb.href}>
                            <Link href={crumb.href} className="hover:text-white transition-colors">
                                {crumb.label}
                            </Link>
                            {index < breadcrumbs.length - 1 && <span className="text-white/40">→</span>}
                        </React.Fragment>
                    ))}
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
                    <div className="lg:col-span-2 text-left space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/20 backdrop-blur-md rounded-lg border border-white/10 text-white text-sm font-bold tracking-wide uppercase">
                            <span className="text-lg">{icon}</span>
                            Official Directory
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-[1.1] drop-shadow-xl">
                            {title}
                        </h1>

                        <p className="max-w-2xl text-xl md:text-2xl text-white/90 font-medium leading-relaxed drop-shadow-md">
                            {description}
                        </p>
                    </div>

                    {/* Rigid Icon Card */}
                    <div className="hidden lg:block lg:col-span-1">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-white/20 rounded-3xl blur opacity-25"></div>
                            <div className="relative aspect-square flex items-center justify-center bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl">
                                <span className="text-[120px] drop-shadow-2xl">{icon}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Rigid Bottom Divider */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        </div>
    );
}
