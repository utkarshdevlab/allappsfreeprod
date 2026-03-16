'use client';

import React, { useState, useEffect } from 'react';

const US_STATES = [
    { name: 'Alabama', rate: 4.0 },
    { name: 'Alaska', rate: 0.0 },
    { name: 'Arizona', rate: 5.6 },
    { name: 'Arkansas', rate: 6.5 },
    { name: 'California', rate: 7.25 },
    { name: 'Colorado', rate: 2.9 },
    { name: 'Connecticut', rate: 6.35 },
    { name: 'Delaware', rate: 0.0 },
    { name: 'Florida', rate: 6.0 },
    { name: 'Georgia', rate: 4.0 },
    { name: 'Hawaii', rate: 4.0 },
    { name: 'Idaho', rate: 6.0 },
    { name: 'Illinois', rate: 6.25 },
    { name: 'Indiana', rate: 7.0 },
    { name: 'Iowa', rate: 6.0 },
    { name: 'Kansas', rate: 6.5 },
    { name: 'Kentucky', rate: 6.0 },
    { name: 'Louisiana', rate: 4.45 },
    { name: 'Maine', rate: 5.5 },
    { name: 'Maryland', rate: 6.0 },
    { name: 'Massachusetts', rate: 6.25 },
    { name: 'Michigan', rate: 6.0 },
    { name: 'Minnesota', rate: 6.875 },
    { name: 'Mississippi', rate: 7.0 },
    { name: 'Missouri', rate: 4.225 },
    { name: 'Montana', rate: 0.0 },
    { name: 'Nebraska', rate: 5.5 },
    { name: 'Nevada', rate: 6.85 },
    { name: 'New Hampshire', rate: 0.0 },
    { name: 'New Jersey', rate: 6.625 },
    { name: 'New Mexico', rate: 5.0 },
    { name: 'New York', rate: 4.0 },
    { name: 'North Carolina', rate: 4.75 },
    { name: 'North Dakota', rate: 5.0 },
    { name: 'Ohio', rate: 5.75 },
    { name: 'Oklahoma', rate: 4.5 },
    { name: 'Oregon', rate: 0.0 },
    { name: 'Pennsylvania', rate: 6.0 },
    { name: 'Rhode Island', rate: 7.0 },
    { name: 'South Carolina', rate: 6.0 },
    { name: 'South Dakota', rate: 4.2 },
    { name: 'Tennessee', rate: 7.0 },
    { name: 'Texas', rate: 6.25 },
    { name: 'Utah', rate: 6.1 },
    { name: 'Vermont', rate: 6.0 },
    { name: 'Virginia', rate: 5.3 },
    { name: 'Washington', rate: 6.5 },
    { name: 'West Virginia', rate: 6.0 },
    { name: 'Wisconsin', rate: 5.0 },
    { name: 'Wyoming', rate: 4.0 }
];

const SalesTaxCalculator = () => {
    const [amount, setAmount] = useState<number>(100);
    const [stateName, setStateName] = useState<string>('California');
    const [customRate, setCustomRate] = useState<number>(7.25);
    const [mode, setMode] = useState<'add' | 'remove'>('add');

    const [results, setResults] = useState({
        netAmount: 0,
        taxAmount: 0,
        totalAmount: 0,
        rate: 0
    });

    const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const state = US_STATES.find(s => s.name === e.target.value);
        if (state) {
            setStateName(state.name);
            setCustomRate(state.rate);
        }
    };

    const calculateTax = React.useCallback(() => {
        const rate = customRate / 100;
        let net = 0;
        let tax = 0;
        let total = 0;

        if (mode === 'add') {
            net = amount;
            tax = amount * rate;
            total = amount + tax;
        } else {
            total = amount;
            net = amount / (1 + rate);
            tax = total - net;
        }

        setResults({
            netAmount: Number(net.toFixed(2)),
            taxAmount: Number(tax.toFixed(2)),
            totalAmount: Number(total.toFixed(2)),
            rate: customRate
        });
    }, [amount, customRate, mode]);

    useEffect(() => {
        calculateTax();
    }, [calculateTax]);

    return (
        <div className="space-y-12">
            {/* Tool Interface */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Panel */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <span className="p-2 bg-blue-100 text-blue-600 rounded-lg">💵</span>
                        Tax Parameters
                    </h2>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Calculation Mode</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setMode('add')}
                                    className={`py-3 px-4 rounded-xl font-bold transition-all ${mode === 'add'
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 border-2 border-blue-600'
                                        : 'bg-gray-50 text-gray-600 border-2 border-transparent hover:bg-gray-100'
                                        }`}
                                >
                                    Add Tax
                                </button>
                                <button
                                    onClick={() => setMode('remove')}
                                    className={`py-3 px-4 rounded-xl font-bold transition-all ${mode === 'remove'
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 border-2 border-blue-600'
                                        : 'bg-gray-50 text-gray-600 border-2 border-transparent hover:bg-gray-100'
                                        }`}
                                >
                                    Remove Tax
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                {mode === 'add' ? 'Net Amount ($)' : 'Total Amount ($)'}
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(Number(e.target.value))}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-blue-500 focus:ring-0 transition-all font-bold text-gray-900"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Select US State</label>
                                <select
                                    value={stateName}
                                    onChange={handleStateChange}
                                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-blue-500 focus:ring-0 transition-all font-bold text-gray-900"
                                >
                                    {US_STATES.map(s => (
                                        <option key={s.name} value={s.name}>{s.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Tax Rate (%)</label>
                                <div className="relative">
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">%</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={customRate}
                                        onChange={(e) => setCustomRate(Number(e.target.value))}
                                        className="w-full pr-10 pl-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-blue-500 focus:ring-0 transition-all font-bold text-gray-900"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results Panel */}
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl h-full flex flex-col justify-between">
                    <div>
                        <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
                            <span className="p-2 bg-white/20 rounded-lg">📊</span>
                            Calculation Results
                        </h2>

                        <div className="space-y-8">
                            <div>
                                <p className="text-blue-100 text-sm font-bold uppercase tracking-wider mb-1">
                                    {mode === 'add' ? 'Total with Tax' : 'Net Price (Before Tax)'}
                                </p>
                                <p className="text-5xl font-black">
                                    ${mode === 'add' ? results.totalAmount.toLocaleString() : results.netAmount.toLocaleString()}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-8 py-8 border-y border-white/10">
                                <div>
                                    <p className="text-blue-200 text-xs font-bold uppercase tracking-wider mb-1">Tax Amount</p>
                                    <p className="text-2xl font-bold">${results.taxAmount.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-blue-200 text-xs font-bold uppercase tracking-wider mb-1">Applied Rate</p>
                                    <p className="text-2xl font-bold">{results.rate}%</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl">
                                <div className="text-2xl">📍</div>
                                <div>
                                    <p className="text-blue-200 text-xs font-bold font-mono">STATE CONTEXT</p>
                                    <p className="font-bold">{stateName} standard rate applied.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button className="w-full mt-8 py-4 bg-white text-blue-600 rounded-2xl font-black text-lg shadow-lg hover:bg-blue-50 transition-all">
                        COPY SUMMARY
                    </button>
                </div>
            </div>

            {/* SEO Section */}
            <div className="prose prose-blue max-w-none bg-white p-8 md:p-12 rounded-3xl border border-gray-100 shadow-sm sm:p-6 lg:p-12">
                <h2 className="text-3xl font-black text-gray-900 mb-8 pb-4 border-b-4 border-blue-500 w-fit">
                    US Sales Tax Calculation Guide
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">How it Works</h3>
                        <p className="text-gray-600 leading-relaxed mb-6">
                            Our US Sales Tax Calculator is designed for accuracy across all 50 states. Whether you are a business owner calculating tax to charge or a consumer checking a receipt, we provide instant results using 2024 state-level data.
                        </p>
                        <div className="bg-gray-50 p-6 rounded-2xl border-l-4 border-blue-500">
                            <h4 className="font-bold text-blue-900 mb-2 italic">The Formula</h4>
                            <p className="font-mono text-sm text-blue-800">
                                Total = Net Amount * (1 + (Tax Rate / 100))
                            </p>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">State Variations</h3>
                        <p className="text-gray-600 leading-relaxed">
                            In the USA, sales tax is dictated by state and local jurisdictions. Five states currently have **zero state-wide sales tax**:
                        </p>
                        <ul className="mt-4 grid grid-cols-2 gap-2">
                            <li className="flex items-center gap-2 text-sm font-bold text-gray-700 bg-gray-50 p-2 rounded-lg">✅ Alaska</li>
                            <li className="flex items-center gap-2 text-sm font-bold text-gray-700 bg-gray-50 p-2 rounded-lg">✅ Delaware</li>
                            <li className="flex items-center gap-2 text-sm font-bold text-gray-700 bg-gray-50 p-2 rounded-lg">✅ Montana</li>
                            <li className="flex items-center gap-2 text-sm font-bold text-gray-700 bg-gray-50 p-2 rounded-lg">✅ New Hampshire</li>
                            <li className="flex items-center gap-2 text-sm font-bold text-gray-700 bg-gray-50 p-2 rounded-lg">✅ Oregon</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 bg-blue-50 rounded-3xl p-8 border border-blue-100">
                    <h3 className="text-2xl font-bold text-blue-900 mb-6">Frequently Asked Questions</h3>
                    <div className="space-y-6">
                        <div>
                            <p className="font-bold text-blue-800 mb-1">What is the difference between Add Tax and Remove Tax?</p>
                            <p className="text-blue-700/80">&quot;Add Tax&quot; calculates the total cost of an item including sales tax. &quot;Remove Tax&quot; (Reverse Tax) calculates the original net price of an item from its total cost.</p>
                        </div>
                        <div>
                            <p className="font-bold text-blue-800 mb-1">Are local/city taxes included?</p>
                            <p className="text-blue-700/80">This tool uses base state-level tax rates. Local city or county surcharges may apply depending on your specific zip code.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalesTaxCalculator;
