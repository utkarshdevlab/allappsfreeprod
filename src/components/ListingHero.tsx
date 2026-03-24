import React from 'react';
import Link from 'next/link';
import { BreadcrumbStructuredData } from './StructuredData';

interface ListingHeroProps {
    title: string;
    description: string;
    icon: string;
    gradient?: string;
    breadcrumbs: { label: string; href: string }[];
    stats?: { label: string; value: string; icon: string }[];
}

export default function ListingHero({
    title,
    description,
    icon,
    gradient = "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600",
    breadcrumbs,
    stats = [
        { label: 'Collection', value: '100% Free', icon: '⭐' },
        { label: 'Tools', value: 'Verified', icon: '👥' }
    ]
}: ListingHeroProps) {
    return (
        <div className={`relative ${gradient} overflow-hidden`}>
            <BreadcrumbStructuredData items={breadcrumbs.map(b => ({ name: b.label, url: `https://www.allappsfree.com${b.href}` }))} />
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="absolute inset-0" style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
            }}></div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Breadcrumbs */}
                <nav className="flex items-center space-x-2 text-sm text-white/80 mb-6">
                    {breadcrumbs.map((crumb, index) => (
                        <React.Fragment key={crumb.href}>
                            <Link href={crumb.href} className="hover:text-white transition-colors">
                                {crumb.label}
                            </Link>
                            {index < breadcrumbs.length - 1 && <span>→</span>}
                        </React.Fragment>
                    ))}
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                    <div className="lg:col-span-2">
                        <div className="flex items-center space-x-3 mb-4">
                            <span className="px-4 py-2 text-sm font-bold bg-blue-600 text-white rounded-full backdrop-blur-sm border-2 border-blue-400 shadow-lg">
                                OFFICIAL DIRECTORY
                            </span>
                            <span className="px-4 py-2 text-sm font-bold bg-gray-800 text-white rounded-full backdrop-blur-sm border-2 border-gray-600 shadow-lg">
                                ALLAPPSFREE
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight drop-shadow-lg uppercase">
                            {title}
                        </h1>
                        <p className="text-xl text-white mb-6 leading-relaxed drop-shadow-md">
                            {description}
                        </p>

                        <div className="flex flex-wrap items-center gap-4">
                            {stats.map((stat) => (
                                <div key={stat.label} className="flex items-center space-x-2 bg-gray-800/90 backdrop-blur-sm px-4 py-2 rounded-full border-2 border-gray-600 shadow-lg">
                                    <span className="text-2xl">{stat.icon}</span>
                                    <span className="text-white font-bold">{stat.value} {stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl blur opacity-75"></div>
                            <div className="relative w-full h-48 flex items-center justify-center bg-white/10 backdrop-blur-xl rounded-2xl border-4 border-white/20 shadow-2xl">
                                <span className="text-[100px] drop-shadow-2xl">{icon}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
