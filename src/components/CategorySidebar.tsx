'use client';

import React from 'react';

interface CategorySidebarProps {
    categories: string[];
    activeCategory: string;
    onCategoryChange: (category: string) => void;
}

export default function CategorySidebar({ categories, activeCategory, onCategoryChange }: CategorySidebarProps) {
    return (
        <aside className="sticky top-24 hidden lg:block w-64 space-y-2 p-1">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 px-3">
                CATEGORIES
            </h3>
            <button
                onClick={() => onCategoryChange('all')}
                className={`w-full flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${activeCategory === 'all'
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 translate-x-1'
                        : 'text-gray-600 hover:bg-white hover:text-blue-600 hover:shadow-sm'
                    }`}
            >
                <span className="mr-3 text-lg">📁</span>
                All Collection
            </button>

            {categories.map((category) => (
                <button
                    key={category}
                    onClick={() => onCategoryChange(category)}
                    className={`w-full flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${activeCategory === category
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 translate-x-1'
                            : 'text-gray-600 hover:bg-white hover:text-blue-600 hover:shadow-sm'
                        }`}
                >
                    <span className="mr-3 text-lg">
                        {category === 'Puzzle' ? '🧩' :
                            category === 'Arcade' ? '🎮' :
                                category === 'Security' ? '🔒' :
                                    category === 'Utility' ? '🔧' :
                                        category === 'Design' ? '🎨' :
                                            category === 'Audio' ? '🎵' :
                                                category === 'Finance' ? '💰' :
                                                    category === 'Developer' ? '👨‍💻' : '⚙️'}
                    </span>
                    {category}
                </button>
            ))}
        </aside>
    );
}
