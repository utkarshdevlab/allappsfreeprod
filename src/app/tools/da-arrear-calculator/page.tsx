'use client';

import DAArrearCalculator from '@/components/tools/DAArrearCalculator';
import ListingHero from '@/components/ListingHero';

export default function DAArrearCalculatorPage() {
    const breadcrumbs = [
        { label: 'Home', href: '/' },
        { label: 'Tools', href: '/tools' },
        { label: 'DA Arrear Calculator', href: '/tools/da-arrear-calculator' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <ListingHero
                title="India DA Arrear Calculator"
                description="Calculate your Dearness Allowance arrears for Jan 2024 - July 2025. Online 7th Pay Commission arrear calculator with HRA revision logic for Central & State government employees."
                icon="⚖️"
                gradient="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"
                breadcrumbs={breadcrumbs}
                stats={[
                    { label: 'Rules', value: '7th Pay', icon: '📜' },
                    { label: 'Updated', value: 'Jan 2025', icon: '🕒' }
                ]}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <DAArrearCalculator />
            </div>
        </div>
    );
}
