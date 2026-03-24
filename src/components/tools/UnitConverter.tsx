'use client';

import React, { useState, useEffect } from 'react';
import { SEOContent, FeaturesSection, FAQSection } from './SEOContent';

type UnitCategory = 'length' | 'weight' | 'temperature' | 'volume';

const CONVERSION_DATA: Record<UnitCategory, { units: string[]; ratios: Record<string, number>; symbols: Record<string, string> }> = {
    length: {
        units: ['Meters', 'Kilometers', 'Centimeters', 'Inches', 'Feet', 'Yards', 'Miles'],
        symbols: { Meters: 'm', Kilometers: 'km', Centimeters: 'cm', Inches: 'in', Feet: 'ft', Yards: 'yd', Miles: 'mi' },
        ratios: {
            Meters: 1,
            Kilometers: 1000,
            Centimeters: 0.01,
            Inches: 0.0254,
            Feet: 0.3048,
            Yards: 0.9144,
            Miles: 1609.34
        }
    },
    weight: {
        units: ['Kilograms', 'Grams', 'Pounds', 'Ounces'],
        symbols: { Kilograms: 'kg', Grams: 'g', Pounds: 'lb', Ounces: 'oz' },
        ratios: {
            Kilograms: 1,
            Grams: 0.001,
            Pounds: 0.453592,
            Ounces: 0.0283495
        }
    },
    volume: {
        units: ['Liters', 'Milliliters', 'Gallons (US)', 'Quarts (US)', 'Pints (US)', 'Cups (US)'],
        symbols: { Liters: 'L', Milliliters: 'ml', 'Gallons (US)': 'gal', 'Quarts (US)': 'qt', 'Pints (US)': 'pt', 'Cups (US)': 'cup' },
        ratios: {
            Liters: 1,
            Milliliters: 0.001,
            'Gallons (US)': 3.78541,
            'Quarts (US)': 0.946353,
            'Pints (US)': 0.473176,
            'Cups (US)': 0.236588
        }
    },
    temperature: {
        units: ['Celsius', 'Fahrenheit', 'Kelvin'],
        symbols: { Celsius: '°C', Fahrenheit: '°F', Kelvin: 'K' },
        ratios: {} // Temperature uses formulas
    }
};

const UnitConverter = () => {
    const [category, setCategory] = useState<UnitCategory>('length');
    const [value, setValue] = useState<number>(1);
    const [fromUnit, setFromUnit] = useState<string>('');
    const [toUnit, setToUnit] = useState<string>('');
    const [result, setResult] = useState<number>(0);

    useEffect(() => {
        setFromUnit(CONVERSION_DATA[category].units[0]);
        setToUnit(CONVERSION_DATA[category].units[3] || CONVERSION_DATA[category].units[1]);
    }, [category]);

    const convert = React.useCallback(() => {
        if (category === 'temperature') {
            let baseCelsius = 0;
            if (fromUnit === 'Celsius') baseCelsius = value;
            else if (fromUnit === 'Fahrenheit') baseCelsius = (value - 32) * 5 / 9;
            else if (fromUnit === 'Kelvin') baseCelsius = value - 273.15;

            let final = 0;
            if (toUnit === 'Celsius') final = baseCelsius;
            else if (toUnit === 'Fahrenheit') final = (baseCelsius * 9 / 5) + 32;
            else if (toUnit === 'Kelvin') final = baseCelsius + 273.15;

            setResult(Number(final.toFixed(2)));
        } else {
            const data = CONVERSION_DATA[category];
            const valInBase = value * data.ratios[fromUnit];
            const final = valInBase / data.ratios[toUnit];
            setResult(Number(final.toFixed(4)));
        }
    }, [value, fromUnit, toUnit, category]);

    useEffect(() => {
        convert();
    }, [convert]);

    return (
        <div className="space-y-12">
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 p-1.5 bg-gray-100 rounded-2xl w-fit mx-auto shadow-inner">
                {(Object.keys(CONVERSION_DATA) as UnitCategory[]).map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`px-8 py-3 rounded-xl font-bold transition-all text-sm uppercase tracking-wider ${category === cat
                            ? 'bg-white text-indigo-600 shadow-md transform scale-105'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Tool Interface */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* Input Side */}
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl space-y-8">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-black text-gray-400 uppercase tracking-widest">From</label>
                            <span className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full font-bold">SOURCE</span>
                        </div>
                        <div className="flex gap-4">
                            <input
                                type="number"
                                value={value}
                                onChange={(e) => setValue(Number(e.target.value))}
                                className="w-1/2 p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-indigo-500 focus:ring-0 transition-all font-black text-2xl text-gray-900"
                            />
                            <select
                                value={fromUnit}
                                onChange={(e) => setFromUnit(e.target.value)}
                                className="w-1/2 p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-indigo-500 focus:ring-0 transition-all font-bold text-gray-700"
                            >
                                {CONVERSION_DATA[category].units.map(u => <option key={u} value={u}>{u}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-center -my-4 relative z-10">
                        <button
                            onClick={() => {
                                const temp = fromUnit;
                                setFromUnit(toUnit);
                                setToUnit(temp);
                                setValue(result);
                            }}
                            className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg hover:rotate-180 transition-all duration-500 text-xl font-bold border-4 border-white"
                        >
                            ⇄
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-black text-gray-400 uppercase tracking-widest">To</label>
                            <span className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full font-bold">TARGET</span>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-1/2 p-4 bg-indigo-50 border-2 border-indigo-100 rounded-2xl font-black text-2xl text-indigo-700 flex items-center shadow-inner">
                                {result}
                            </div>
                            <select
                                value={toUnit}
                                onChange={(e) => setToUnit(e.target.value)}
                                className="w-1/2 p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-indigo-500 focus:ring-0 transition-all font-bold text-gray-700 shadow-sm"
                            >
                                {CONVERSION_DATA[category].units.map(u => <option key={u} value={u}>{u}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Info/Context Side */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-indigo-700 to-blue-800 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10 text-9xl">🔄</div>
                        <div className="relative z-10">
                            <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
                                Quick Summary
                            </h3>
                            <div className="space-y-2">
                                <p className="text-4xl font-extrabold leading-tight">
                                    {value} {CONVERSION_DATA[category].symbols[fromUnit]}
                                </p>
                                <p className="text-indigo-200 text-xl font-bold uppercase tracking-widest">Equals</p>
                                <p className="text-5xl font-black text-yellow-400">
                                    {result} {CONVERSION_DATA[category].symbols[toUnit]}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <p className="text-xs font-black text-gray-400 uppercase mb-2">Unit Type</p>
                            <p className="font-bold text-gray-900 capitalize">{category}</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <p className="text-xs font-black text-gray-400 uppercase mb-2">Accuracy</p>
                            <p className="font-bold text-gray-900">4 Decimal Places</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* SEO Section */}
            <SEOContent title="US Metric vs. Imperial System Guide">
                <p>
                    The United States is one of the few countries that primarily uses the <strong>Imperial System</strong> (often referred to as US Customary units). For many travelers, engineers, and scientists, converting these units to the globally standard <strong>Metric System</strong> is an everyday necessity.
                </p>

                <p>
                    Temperature is arguably the most common daily conversion. While the US uses Fahrenheit for weather and cooking, most scientific applications and other countries use Celsius. Key benchmarks include Freezing Point (0°C / 32°F), Room Temp (20°C / 68°F), and Boiling Point (100°C / 212°F).
                </p>

                <FeaturesSection
                    title="Common Benchmarks"
                    features={[
                        "1 Inch = 2.54 Centimeters",
                        "1 Mile = 1.61 Kilometers",
                        "1 Pound = 0.45 Kilograms",
                        "1 Gallon = 3.78 Liters"
                    ]}
                />

                <FAQSection
                    faqs={[
                        { question: "Why doesn't the US use the metric system?", answer: "The US actually metricated in 1975 under the Metric Conversion Act, but it was voluntary. Extensive industrial infrastructure and cultural habits have kept US Customary units as the primary system for consumer goods." },
                        { question: "What is the difference between US liquid gallons and UK gallons?", answer: "A US Gallon is approximately 3.78 liters, while an Imperial (UK) Gallon is larger at 4.54 liters. This tool defaults to US Customary Liquid Gallons for our US audience." }
                    ]}
                />
            </SEOContent>
        </div>
    );
};

export default UnitConverter;
