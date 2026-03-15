'use client';

import React, { useState, useMemo } from 'react';
import { Tool } from '@/types/tools';
import ToolSection from '@/components/ToolSection';
import ListingHero from '@/components/ListingHero';
import CategorySidebar from '@/components/CategorySidebar';

interface ListingClientProps {
    initialTools: Tool[];
    title: string;
    description: string;
    icon: string;
    gradient: string;
    type?: 'app' | 'game';
}

export default function ListingClient({
    initialTools,
    title,
    description,
    icon,
    gradient,
    type
}: ListingClientProps) {
    const [activeCategory, setActiveCategory] = useState('all');

    const breadcrumbs = [
        { label: 'Home', href: '/' },
        { label: 'Tools', href: '/tools' },
    ];

    if (type === 'game') breadcrumbs.push({ label: 'Games', href: '/tools/games' });
    if (type === 'app') breadcrumbs.push({ label: 'Apps', href: '/tools/apps' });

    const categories = useMemo(() => {
        const cats = new Set(initialTools.map(t => t.category));
        return Array.from(cats).sort();
    }, [initialTools]);

    const groupedTools = useMemo(() => {
        const map = new Map<string, Tool[]>();
        initialTools.forEach(tool => {
            if (!map.has(tool.category)) {
                map.set(tool.category, []);
            }
            map.get(tool.category)!.push(tool);
        });
        return map;
    }, [initialTools]);

    const displayedCategories = activeCategory === 'all'
        ? categories
        : [activeCategory];

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <ListingHero
                title={title}
                description={description}
                icon={icon}
                gradient={gradient}
                breadcrumbs={breadcrumbs}
                stats={[
                    { label: 'Collection', value: `${initialTools.length} Free`, icon: '⭐' },
                    { label: 'Tools', value: 'Verified', icon: '👥' }
                ]}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Sidebar */}
                    <div className="w-full lg:w-64 flex-shrink-0">
                        <CategorySidebar
                            categories={categories}
                            activeCategory={activeCategory}
                            onCategoryChange={setActiveCategory}
                        />
                    </div>

                    {/* Main Content */}
                    <div className="flex-grow">
                        {displayedCategories.map((category) => (
                            <ToolSection
                                key={category}
                                title={category}
                                tools={groupedTools.get(category) || []}
                                showViewAll={false}
                                maxItems={50}
                            />
                        ))}

                        {displayedCategories.length === 0 && (
                            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                                <div className="text-6xl mb-4">🏜️</div>
                                <h3 className="text-xl font-bold text-gray-900">No tools found</h3>
                                <p className="text-gray-500">Try selecting a different category from the sidebar.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
