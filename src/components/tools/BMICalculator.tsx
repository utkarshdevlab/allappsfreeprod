'use client';

import React, { useState, useEffect } from 'react';

const BMICalculator = () => {
    const [unitSystem, setUnitSystem] = useState<'imperial' | 'metric'>('imperial');
    const [weight, setWeight] = useState<number>(160); // lbs or kg
    const [heightFeet, setHeightFeet] = useState<number>(5);
    const [heightInches, setHeightInches] = useState<number>(10);
    const [heightCm, setHeightCm] = useState<number>(178);

    const [bmi, setBmi] = useState<number>(0);
    const [category, setCategory] = useState<{ label: string; color: string }>({ label: '', color: '' });

    const calculateBMI = React.useCallback(() => {
        let finalBmi = 0;
        if (unitSystem === 'imperial') {
            const totalInches = (heightFeet * 12) + heightInches;
            if (totalInches > 0) {
                finalBmi = (weight / (totalInches * totalInches)) * 703;
            }
        } else {
            if (heightCm > 0) {
                finalBmi = weight / ((heightCm / 100) * (heightCm / 100));
            }
        }

        setBmi(Number(finalBmi.toFixed(1)));
        determineCategory(finalBmi);
    }, [unitSystem, weight, heightFeet, heightInches, heightCm]);

    useEffect(() => {
        calculateBMI();
    }, [calculateBMI]);

    const determineCategory = (val: number) => {
        if (val < 18.5) setCategory({ label: 'Underweight', color: 'text-blue-500' });
        else if (val >= 18.5 && val < 25) setCategory({ label: 'Healthy Weight', color: 'text-green-600' });
        else if (val >= 25 && val < 30) setCategory({ label: 'Overweight', color: 'text-yellow-600' });
        else setCategory({ label: 'Obese', color: 'text-red-600' });
    };

    return (
        <div className="space-y-12">
            {/* Tool Interface */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Panel */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <span className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">⚖️</span>
                        Your Vitals
                    </h2>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Unit System</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setUnitSystem('imperial')}
                                    className={`py-3 px-4 rounded-xl font-bold transition-all ${unitSystem === 'imperial'
                                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200 border-2 border-emerald-600'
                                        : 'bg-gray-50 text-gray-600 border-2 border-transparent hover:bg-gray-100'
                                        }`}
                                >
                                    Imperial (US)
                                </button>
                                <button
                                    onClick={() => setUnitSystem('metric')}
                                    className={`py-3 px-4 rounded-xl font-bold transition-all ${unitSystem === 'metric'
                                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200 border-2 border-emerald-600'
                                        : 'bg-gray-50 text-gray-600 border-2 border-transparent hover:bg-gray-100'
                                        }`}
                                >
                                    Metric
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Weight ({unitSystem === 'imperial' ? 'lbs' : 'kg'})</label>
                            <input
                                type="number"
                                value={weight}
                                onChange={(e) => setWeight(Number(e.target.value))}
                                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-emerald-500 focus:ring-0 transition-all font-bold text-gray-900 text-xl"
                            />
                        </div>

                        {unitSystem === 'imperial' ? (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Height (ft)</label>
                                    <input
                                        type="number"
                                        value={heightFeet}
                                        onChange={(e) => setHeightFeet(Number(e.target.value))}
                                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-emerald-500 focus:ring-0 transition-all font-bold text-gray-900 text-xl"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Height (in)</label>
                                    <input
                                        type="number"
                                        value={heightInches}
                                        onChange={(e) => setHeightInches(Number(e.target.value))}
                                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-emerald-500 focus:ring-0 transition-all font-bold text-gray-900 text-xl"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Height (cm)</label>
                                <input
                                    type="number"
                                    value={heightCm}
                                    onChange={(e) => setHeightCm(Number(e.target.value))}
                                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-emerald-500 focus:ring-0 transition-all font-bold text-gray-900 text-xl"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Results Panel */}
                <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-8 text-white shadow-xl h-full flex flex-col justify-center text-center">
                    <p className="text-emerald-100 text-sm font-bold uppercase tracking-widest mb-2">Your Body Mass Index</p>
                    <p className="text-8xl font-black mb-4 drop-shadow-xl">{bmi}</p>

                    <div className="inline-block px-6 py-2 bg-white rounded-full mx-auto shadow-lg mb-8">
                        <p className={`text-xl font-black ${category.color.replace('text-', 'text-local-')}`}>
                            <span className={category.color}>{category.label}</span>
                        </p>
                    </div>

                    <div className="grid grid-cols-4 gap-1 bg-white/10 p-4 rounded-2xl border border-white/20">
                        <div className={`p-2 rounded-lg text-xs font-bold ${bmi < 18.5 ? 'bg-white text-emerald-700 shadow-md' : 'text-emerald-100'}`}>
                            &lt;18.5
                        </div>
                        <div className={`p-2 rounded-lg text-xs font-bold ${bmi >= 18.5 && bmi < 25 ? 'bg-white text-emerald-700 shadow-md' : 'text-emerald-100'}`}>
                            18.5-25
                        </div>
                        <div className={`p-2 rounded-lg text-xs font-bold ${bmi >= 25 && bmi < 30 ? 'bg-white text-emerald-700 shadow-md' : 'text-emerald-100'}`}>
                            25-30
                        </div>
                        <div className={`p-2 rounded-lg text-xs font-bold ${bmi >= 30 ? 'bg-white text-emerald-700 shadow-md' : 'text-emerald-100'}`}>
                            30+
                        </div>
                    </div>
                </div>
            </div>

            {/* SEO Section */}
            <div className="prose prose-emerald max-w-none bg-white p-8 md:p-12 rounded-3xl border border-gray-100 shadow-sm mt-12 sm:p-6 lg:p-12">
                <h2 className="text-3xl font-black text-gray-900 mb-8 pb-4 border-b-4 border-emerald-500 w-fit">
                    Understanding your BMI Result
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">What is BMI?</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Body Mass Index (BMI) is a simple numerical measure of a person&apos;s thickness or thinness based on their height and weight. It is widely used by healthcare professionals to categorize individuals into weight groups that may impact their health.
                        </p>
                        <div className="mt-8 space-y-4">
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <div className="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-sm border border-gray-200 text-xl font-bold">1</div>
                                <p className="text-sm font-medium text-gray-700 leading-tight">BMI is a screening tool, not a diagnostic of overall body fat or health.</p>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <div className="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-sm border border-gray-200 text-xl font-bold">2</div>
                                <p className="text-sm font-medium text-gray-700 leading-tight">It does not account for muscle mass, bone density, or overall body composition.</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">The Formula (Imperial vs Metric)</h3>
                        <p className="text-gray-600 leading-relaxed mb-6">
                            Our calculator handles the math for you, but knowing the logic is helpful:
                        </p>
                        <div className="space-y-4 font-mono text-sm">
                            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                                <p className="text-emerald-900 font-bold mb-1">Metric Formula:</p>
                                <p className="text-emerald-700">BMI = weight (kg) / [height (m)]²</p>
                            </div>
                            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                                <p className="text-emerald-900 font-bold mb-1">Imperial Formula (US):</p>
                                <p className="text-emerald-700">BMI = 703 * weight (lbs) / [height (in)]²</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 overflow-hidden border border-gray-100 rounded-3xl shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-emerald-600 text-white">
                                <th className="p-4 font-black">BMI Range</th>
                                <th className="p-4 font-black">Category</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            <tr className="border-b border-gray-50">
                                <td className="p-4 text-gray-600 font-medium">Below 18.5</td>
                                <td className="p-4 font-bold text-blue-500">Underweight</td>
                            </tr>
                            <tr className="border-b border-gray-50 bg-emerald-50/30">
                                <td className="p-4 text-gray-600 font-medium">18.5 – 24.9</td>
                                <td className="p-4 font-bold text-green-600">Normal / Healthy weight</td>
                            </tr>
                            <tr className="border-b border-gray-50">
                                <td className="p-4 text-gray-600 font-medium">25.0 – 29.9</td>
                                <td className="p-4 font-bold text-yellow-600">Overweight</td>
                            </tr>
                            <tr>
                                <td className="p-4 text-gray-600 font-medium">30.0 and Above</td>
                                <td className="p-4 font-bold text-red-600">Obese</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default BMICalculator;
