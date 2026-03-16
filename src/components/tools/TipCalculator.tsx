'use client';

import React, { useState, useEffect } from 'react';

const TipCalculator = () => {
    const [bill, setBill] = useState<number>(100);
    const [tipPercentage, setTipPercentage] = useState<number>(18);
    const [people, setPeople] = useState<number>(1);
    const [results, setResults] = useState({
        tipAmount: 0,
        totalBill: 0,
        perPerson: 0
    });

    useEffect(() => {
        const tip = (bill * tipPercentage) / 100;
        const total = bill + tip;
        setResults({
            tipAmount: Number(tip.toFixed(2)),
            totalBill: Number(total.toFixed(2)),
            perPerson: Number((total / (people || 1)).toFixed(2))
        });
    }, [bill, tipPercentage, people]);

    const tipPresets = [15, 18, 20, 22, 25];

    return (
        <div className="space-y-12">
            {/* Tool Interface */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Panel */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <span className="p-2 bg-pink-100 text-pink-600 rounded-lg">🍽️</span>
                        Bill Details
                    </h2>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Total Bill Amount ($)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                                <input
                                    type="number"
                                    value={bill}
                                    onChange={(e) => setBill(Number(e.target.value))}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-pink-500 focus:ring-0 transition-all font-bold text-gray-900"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Tip Percentage (%)</label>
                            <div className="grid grid-cols-5 gap-2 mb-4">
                                {tipPresets.map((preset) => (
                                    <button
                                        key={preset}
                                        onClick={() => setTipPercentage(preset)}
                                        className={`py-2 px-1 rounded-lg text-sm font-bold transition-all ${tipPercentage === preset
                                            ? 'bg-pink-600 text-white shadow-md'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        {preset}%
                                    </button>
                                ))}
                            </div>
                            <div className="relative">
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">%</span>
                                <input
                                    type="number"
                                    value={tipPercentage}
                                    onChange={(e) => setTipPercentage(Number(e.target.value))}
                                    className="w-full pr-10 pl-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-pink-500 focus:ring-0 transition-all font-bold text-gray-900"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Number of People</label>
                            <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-xl border-2 border-gray-100">
                                <button
                                    onClick={() => setPeople(Math.max(1, people - 1))}
                                    className="w-12 h-12 flex items-center justify-center bg-white rounded-lg shadow-sm border border-gray-200 text-2xl font-bold text-gray-600 hover:bg-gray-50"
                                >
                                    -
                                </button>
                                <input
                                    type="number"
                                    value={people}
                                    onChange={(e) => setPeople(Math.max(1, Number(e.target.value)))}
                                    className="flex-1 bg-transparent border-none focus:ring-0 text-center font-black text-2xl text-gray-900"
                                />
                                <button
                                    onClick={() => setPeople(people + 1)}
                                    className="w-12 h-12 flex items-center justify-center bg-white rounded-lg shadow-sm border border-gray-200 text-2xl font-bold text-gray-600 hover:bg-gray-50"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results Panel */}
                <div className="bg-gradient-to-br from-pink-600 to-rose-700 rounded-3xl p-8 text-white shadow-xl h-full flex flex-col">
                    <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
                        <span className="p-2 bg-white/20 rounded-lg">🧾</span>
                        Payment Breakdown
                    </h2>

                    <div className="space-y-8 flex-1">
                        <div className="bg-white/10 p-6 rounded-2xl border border-white/10">
                            <p className="text-pink-100 text-sm font-bold uppercase tracking-wider mb-1">Total Bill with Tip</p>
                            <p className="text-5xl font-black">${results.totalBill.toLocaleString()}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/10 p-4 rounded-xl">
                                <p className="text-pink-200 text-xs font-bold uppercase tracking-wider mb-1">Tip Amount</p>
                                <p className="text-2xl font-bold">${results.tipAmount.toLocaleString()}</p>
                            </div>
                            <div className="bg-white/10 p-4 rounded-xl">
                                <p className="text-pink-200 text-xs font-bold uppercase tracking-wider mb-1">Per Person</p>
                                <p className="text-2xl font-bold">${results.perPerson.toLocaleString()}</p>
                            </div>
                        </div>

                        <div className="mt-8 flex items-center gap-4 p-4 bg-rose-900/40 rounded-2xl">
                            <div className="text-2xl">💡</div>
                            <p className="text-sm font-medium leading-tight">
                                An **{tipPercentage}% tip** is considered {tipPercentage < 18 ? 'below average' : tipPercentage <= 20 ? 'standard' : 'excellent'} for US dining.
                            </p>
                        </div>
                    </div>

                    <button className="w-full mt-12 py-4 bg-white text-pink-600 rounded-2xl font-black text-lg shadow-lg hover:bg-pink-50 transition-all leading-none">
                        RESET CALCULATOR
                    </button>
                </div>
            </div>

            {/* SEO Section */}
            <div className="prose prose-pink max-w-none bg-white p-8 md:p-12 rounded-3xl border border-gray-100 shadow-sm mt-12 sm:p-6 lg:p-12">
                <h2 className="text-3xl font-black text-gray-900 mb-8 pb-4 border-b-4 border-pink-500 w-fit">
                    US Tipping Etiquette & Calculator Guide
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Standard US Tipping Rates</h3>
                        <p className="text-gray-600 leading-relaxed mb-6">
                            Tipping in the United States is more than a courtesy; it&apos;s a social expectation as service staff often rely on gratuities for a significant portion of their income.
                        </p>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <span className="font-bold">Standard Dining</span>
                                <span className="text-pink-600 font-extrabold">18% - 20%</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <span className="font-bold">Exceptional Service</span>
                                <span className="text-pink-600 font-extrabold">22% - 25%</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <span className="font-bold">Service at Bar</span>
                                <span className="text-pink-600 font-extrabold">$1 - $2 per drink</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">How to Use the Bill Splitter</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Splitting a bill with friends or colleagues shouldn&apos;t be stressful. Follow these quick steps:
                        </p>
                        <ol className="mt-4 space-y-4">
                            <li className="flex gap-4">
                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-bold">1</span>
                                <p className="text-gray-600">Enter the **Total Bill Amount** (pre-tax or post-tax, depending on preference).</p>
                            </li>
                            <li className="flex gap-4">
                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-bold">2</span>
                                <p className="text-gray-600">Select a **Tip Percentage**. Standard defaults are provided for convenience.</p>
                            </li>
                            <li className="flex gap-4">
                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-bold">3</span>
                                <p className="text-gray-600">Adjust the **Number of People** to see exactly what each person owes.</p>
                            </li>
                        </ol>
                    </div>
                </div>

                <div className="mt-12 bg-pink-50 rounded-3xl p-8 border border-pink-100">
                    <h3 className="text-2xl font-bold text-pink-900 mb-6 font-display">Tipping FAQ</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <p className="font-bold text-pink-800 mb-1">Should I tip on the total before or after tax?</p>
                            <p className="text-pink-700/80 text-sm">Traditionally, it is customary to tip on the subtotal **before tax**, but many consumers choose the post-tax total for convenience or generosity.</p>
                        </div>
                        <div>
                            <p className="font-bold text-pink-800 mb-1">Is tipping mandatory for large groups?</p>
                            <p className="text-pink-700/80 text-sm">Most restaurants in the US automatically add a **gratuity (usually 18%)** for parties of 6 or more. Check your receipt carefully!</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TipCalculator;
