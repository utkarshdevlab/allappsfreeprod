'use client';

import { useState, useMemo } from 'react';

const DA_RATES = [
    { date: 'Jan 2024', rate: 50 },
    { date: 'Jul 2024', rate: 53 },
    { date: 'Jan 2025', rate: 55 },
    { date: 'Jul 2025 (Forecast)', rate: 58 },
];

const HRA_RATES = {
    X: { base: 27, revised: 30 }, // 30% if DA >= 50%
    Y: { base: 18, revised: 20 }, // 20% if DA >= 50%
    Z: { base: 9, revised: 10 },  // 10% if DA >= 50%
};

export default function DAArrearCalculator() {
    const [basicPay, setBasicPay] = useState(50000);
    const [hraCategory, setHraCategory] = useState<'X' | 'Y' | 'Z'>('Y');
    const [startMonth, setStartMonth] = useState('Jan 2024');
    const [endMonth, setEndMonth] = useState('Jan 2025');

    const arrearData = useMemo(() => {
        const startIndex = DA_RATES.findIndex(r => r.date === startMonth);
        const endIndex = DA_RATES.findIndex(r => r.date === endMonth);

        if (startIndex === -1 || endIndex === -1 || startIndex > endIndex) return [];

        const months = [];

        for (let i = startIndex; i <= endIndex; i++) {
            const rateObj = DA_RATES[i];
            // For simplicity in this tool, we assume each "step" in DA_RATES represents a 6-month period
            // unless it's the current month.
            const monthsInStep = 6;

            const oldRate = i > 0 ? DA_RATES[i - 1].rate : 46;
            const newRate = rateObj.rate;
            const diff = newRate - oldRate;

            const monthlyDaArrear = (basicPay * diff) / 100;

            // HRA Logic: Revise if DA >= 50%
            // In 7th Pay, HRA was 24/16/8 and became 27/18/9 when DA hit 25%
            // It becomes 30/20/10 when DA hits 50%
            const hraBase = HRA_RATES[hraCategory].base;
            const hraRevised = HRA_RATES[hraCategory].revised;
            const hraDiff = newRate >= 50 ? (hraRevised - hraBase) : 0;
            const monthlyHraArrear = (basicPay * hraDiff) / 100;

            const stepTotal = (monthlyDaArrear + monthlyHraArrear) * monthsInStep;

            months.push({
                period: rateObj.date,
                daRate: newRate,
                daDiff: diff,
                monthlyArrear: monthlyDaArrear,
                hraGain: monthlyHraArrear,
                stepTotal: stepTotal
            });

        }

        return months;
    }, [basicPay, hraCategory, startMonth, endMonth]);

    const totalAmount = arrearData.reduce((acc, curr) => acc + curr.stepTotal, 0);

    return (
        <div className="space-y-6">
            {/* Calculator Card */}
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">India DA Arrear Calculator (7th Pay Commission)</h2>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Inputs */}
                    <div className="lg:col-span-1 space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Basic Pay (₹)
                            </label>
                            <input
                                type="number"
                                value={basicPay}
                                onChange={(e) => setBasicPay(Number(e.target.value))}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="mt-1 text-xs text-gray-500 font-medium">As per 7th Pay Commission Matrix</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                City Category (HRA)
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {(['X', 'Y', 'Z'] as const).map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setHraCategory(cat)}
                                        className={`py-2 rounded-lg font-bold border-2 transition-all ${hraCategory === cat
                                            ? 'bg-blue-600 border-blue-600 text-white'
                                            : 'bg-white border-gray-300 text-gray-600 hover:border-blue-300'
                                            }`}
                                    >
                                        {cat} Class
                                    </button>
                                ))}
                            </div>
                            <p className="mt-2 text-[10px] text-gray-400">X: Metros (30%), Y: Big Cities (20%), Z: Others (10%)</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                                <select
                                    value={startMonth}
                                    onChange={(e) => setStartMonth(e.target.value)}
                                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg"
                                >
                                    {DA_RATES.map(r => <option key={r.date} value={r.date}>{r.date}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                                <select
                                    value={endMonth}
                                    onChange={(e) => setEndMonth(e.target.value)}
                                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg"
                                >
                                    {DA_RATES.map(r => <option key={r.date} value={r.date}>{r.date}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Results Summary */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                            <div className="relative z-10">
                                <div className="text-indigo-100 font-medium mb-1">Total Estimated Arrear</div>
                                <div className="text-5xl font-black mb-4">₹{totalAmount.toLocaleString('en-IN')}</div>
                                <div className="flex gap-4">
                                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 flex-1 border border-white/20">
                                        <div className="text-xs text-indigo-200 uppercase tracking-wider font-bold mb-1">DA Rate</div>
                                        <div className="text-xl font-bold">{DA_RATES.find(r => r.date === endMonth)?.rate}%</div>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 flex-1 border border-white/20">
                                        <div className="text-xs text-indigo-200 uppercase tracking-wider font-bold mb-1">HRA Rate</div>
                                        <div className="text-xl font-bold">{hraCategory === 'X' ? '30%' : hraCategory === 'Y' ? '20%' : '10%'}</div>
                                    </div>
                                </div>
                            </div>
                            {/* Decorative Pattern */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 -mr-20 -mt-20 rounded-full blur-3xl"></div>
                        </div>

                        <div className="overflow-hidden border-2 border-gray-100 rounded-xl">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b-2 border-gray-100 text-xs font-bold text-gray-500 uppercase">
                                    <tr>
                                        <th className="px-4 py-3">Period</th>
                                        <th className="px-4 py-3">DA %</th>
                                        <th className="px-4 py-3 text-right">Monthly DA Arrear</th>
                                        <th className="px-4 py-3 text-right">Monthly HRA Gain</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    {arrearData.map((row, idx) => (
                                        <tr key={idx} className="hover:bg-blue-50/50 transition-colors">
                                            <td className="px-4 py-3 font-bold text-gray-700">{row.period}</td>
                                            <td className="px-4 py-3"><span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">{row.daRate}%</span></td>
                                            <td className="px-4 py-3 text-right font-medium text-gray-900">₹{Math.round(row.monthlyArrear).toLocaleString('en-IN')}</td>
                                            <td className="px-4 py-3 text-right font-medium text-blue-600">₹{Math.round(row.hraGain).toLocaleString('en-IN')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* SEO Content Section */}
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 prose prose-lg max-w-none shadow-sm">
                <h2 className="text-3xl font-black text-gray-900 mb-6">India DA Arrear Calculation Guide 2024-2025</h2>

                <div className="grid md:grid-cols-2 gap-8 not-prose mb-8">
                    <div className="bg-orange-50 border-2 border-orange-100 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-orange-800 mb-2">What is DA Arrear?</h3>
                        <p className="text-orange-900/80 text-sm leading-relaxed">
                            Dearness Allowance (DA) is revised by the Government of India twice a year (Jan & July). Arrears are paid when the cumulative rate increase is announced several months after the effective date, covering the backdated payouts.
                        </p>
                    </div>
                    <div className="bg-green-50 border-2 border-green-100 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-green-800 mb-2">HRA Revision Rule</h3>
                        <p className="text-green-900/80 text-sm leading-relaxed">
                            Under the 7th Pay Commission, House Rent Allowance (HRA) is automatically revised from 27/18/9% to 30/20/10% globally once the DA reaches or crosses the 50% threshold (Effective Jan 2024).
                        </p>
                    </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-900">How to Calculate DA Arrear?</h3>
                <p>
                    The calculation follows a simple formula based on your Basic Pay:
                </p>
                <div className="bg-gray-900 text-white rounded-xl p-6 my-6 font-mono text-center">
                    Arrear = (Basic Pay × Increase in DA %) × Number of Months
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mt-8">Latest DA Rates (2024 - 2025)</h3>
                <div className="overflow-x-auto my-6 border-2 border-gray-100 rounded-xl">
                    <table className="w-full text-sm">
                        <thead className="bg-blue-600 text-white font-bold">
                            <tr>
                                <th className="px-6 py-4">Effective Date</th>
                                <th className="px-6 py-4 text-center">DA Rate (%)</th>
                                <th className="px-6 py-4 text-center">HRA (X/Y/Z)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            <tr className="hover:bg-gray-50"><td className="px-6 py-4 font-bold">Jan 2024</td><td className="px-6 py-4 text-center">50%</td><td className="px-6 py-4 text-center">30/20/10%</td></tr>
                            <tr className="hover:bg-gray-50"><td className="px-6 py-4 font-bold">July 2024</td><td className="px-6 py-4 text-center">53%</td><td className="px-6 py-4 text-center">30/20/10%</td></tr>
                            <tr className="hover:bg-gray-50 bg-blue-50/30"><td className="px-6 py-4 font-bold">Jan 2025</td><td className="px-6 py-4 text-center font-black">55%</td><td className="px-6 py-4 text-center">30/20/10%</td></tr>
                            <tr className="hover:bg-gray-50"><td className="px-6 py-4 font-bold">July 2025 (Exp.)</td><td className="px-6 py-4 text-center">58%</td><td className="px-6 py-4 text-center">30/20/10%</td></tr>
                        </tbody>
                    </table>
                </div>

                <div className="bg-blue-600 rounded-2xl p-8 text-white text-center mt-12 shadow-inner">
                    <h3 className="text-2xl font-black mb-2 text-white">Plan Your Salary Savings Today!</h3>
                    <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                        Use our free DA Arrear Calculator to get instant estimates for central government, railway, and defense employees. No registration required.
                    </p>
                </div>
            </div>
        </div>
    );
}
