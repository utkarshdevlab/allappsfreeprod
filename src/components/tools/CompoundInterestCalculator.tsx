'use client';

import React, { useState, useEffect } from 'react';
import { SEOContent, UseCasesSection, FAQSection } from './SEOContent';

const CompoundInterestCalculator = () => {
    const [principal, setPrincipal] = useState<number>(10000);
    const [monthlyContribution, setMonthlyContribution] = useState<number>(500);
    const [years, setYears] = useState<number>(10);
    const [rate, setRate] = useState<number>(8);
    const [compoundingFrequency, setCompoundingFrequency] = useState<number>(12); // monthly by default

    const [results, setResults] = useState({
        futureValue: 0,
        totalContributions: 0,
        totalInterest: 0
    });

    const calculateCompounding = React.useCallback(() => {
        const r = rate / 100;
        const n = compoundingFrequency;
        const t = years;
        const PMT = monthlyContribution;

        // A = P(1 + r/n)^(nt) + PMT * [((1 + r/n)^(nt) - 1) / (r/n)] * (1 + r/n)
        // Note: Assuming contributions are at the beginning of the period (standard for growth models)

        const compoundFactor = Math.pow(1 + r / n, n * t);
        const principalGrowth = principal * compoundFactor;

        let contributionGrowth = 0;
        if (r > 0) {
            // Future Value of Annuity Due (contributions at beginning of month)
            // Since PMT is monthly, we use monthly rate r/12 and 12*t periods
            const monthlyRate = r / 12;
            const totalMonths = 12 * t;
            contributionGrowth = PMT * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate);
        } else {
            contributionGrowth = PMT * 12 * t;
        }

        const total = principalGrowth + contributionGrowth;
        const contributions = principal + (PMT * 12 * t);

        setResults({
            futureValue: Math.round(total),
            totalContributions: Math.round(contributions),
            totalInterest: Math.round(total - contributions)
        });
    }, [principal, monthlyContribution, rate, years, compoundingFrequency]);

    useEffect(() => {
        calculateCompounding();
    }, [calculateCompounding]);

    return (
        <div className="space-y-12">
            {/* Tool Interface */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Panel */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm sm:p-4">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <span className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">📈</span>
                        Investment Strategy
                    </h2>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Initial Principal ($)</label>
                                <input
                                    type="number"
                                    value={principal}
                                    onChange={(e) => setPrincipal(Number(e.target.value))}
                                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-indigo-500 focus:ring-0 transition-all font-bold text-gray-900"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Monthly Contribution ($)</label>
                                <input
                                    type="number"
                                    value={monthlyContribution}
                                    onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-indigo-500 focus:ring-0 transition-all font-bold text-gray-900"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Investment Period (Years)</label>
                                <input
                                    type="number"
                                    value={years}
                                    onChange={(e) => setYears(Number(e.target.value))}
                                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-indigo-500 focus:ring-0 transition-all font-bold text-gray-900"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Expected Return (%)</label>
                                <input
                                    type="number"
                                    value={rate}
                                    onChange={(e) => setRate(Number(e.target.value))}
                                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-indigo-500 focus:ring-0 transition-all font-bold text-gray-900"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Compounding Frequency</label>
                            <select
                                value={compoundingFrequency}
                                onChange={(e) => setCompoundingFrequency(Number(e.target.value))}
                                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-indigo-500 focus:ring-0 transition-all font-bold text-gray-900"
                            >
                                <option value={365}>Daily</option>
                                <option value={12}>Monthly</option>
                                <option value={4}>Quarterly</option>
                                <option value={2}>Semi-Annually</option>
                                <option value={1}>Annually</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Results Panel */}
                <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-8 text-white shadow-xl h-full flex flex-col justify-between">
                    <div>
                        <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
                            <span className="p-2 bg-white/20 rounded-lg">💎</span>
                            Future Wealth Projection
                        </h2>

                        <div className="space-y-8">
                            <div>
                                <p className="text-indigo-100 text-sm font-bold uppercase tracking-wider mb-1">Estimated Future Value</p>
                                <p className="text-5xl font-black">${results.futureValue.toLocaleString()}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 py-8 border-y border-white/10">
                                <div>
                                    <p className="text-indigo-200 text-xs font-bold uppercase tracking-wider mb-1">Total Contributions</p>
                                    <p className="text-2xl font-bold">${results.totalContributions.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-indigo-200 text-xs font-bold uppercase tracking-wider mb-1">Total Interest Earned</p>
                                    <p className="text-2xl font-bold text-emerald-300 font-mono">+${results.totalInterest.toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                                <p className="text-indigo-100 text-xs font-bold uppercase mb-2">Wealth Breakdown</p>
                                <div className="h-4 bg-white/10 rounded-full overflow-hidden flex">
                                    <div
                                        className="h-full bg-white transition-all duration-500"
                                        style={{ width: `${(results.totalContributions / results.futureValue) * 100}%` }}
                                    ></div>
                                    <div
                                        className="h-full bg-emerald-400 transition-all duration-500"
                                        style={{ width: `${(results.totalInterest / results.futureValue) * 100}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between mt-2 text-[10px] font-bold">
                                    <span className="flex items-center gap-1"><div className="w-2 h-2 bg-white rounded-full"></div> CONTRIBUTIONS</span>
                                    <span className="flex items-center gap-1"><div className="w-2 h-2 bg-emerald-400 rounded-full"></div> INTEREST</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <p className="text-[10px] text-indigo-300 italic text-center mt-6">
                        Disclaimer: Projections are for educational purposes and do not guarantee future returns.
                    </p>
                </div>
            </div>

            {/* SEO Section */}
            <SEOContent title="Compound Interest: The Eighth Wonder of the World">
                <p>
                    Unlike simple interest, which is only calculated on the principal amount, <strong>compound interest</strong> is calculated on the principal plus the accumulated interest from previous periods. This creates a snowball effect that can lead to exponential wealth growth over time.
                </p>
                <p>
                    <strong>Why Frequency Matters:</strong> The more frequently interest is compounded (e.g., daily vs. annually), the faster your money grows. Daily compounding yields slightly more than monthly, and monthly significantly more than annual.
                </p>

                <UseCasesSection
                    title="Key Wealth Building Factors"
                    cases={[
                        { title: "Time (The Multiplier)", description: "The longer you leave your money invested, the more powerful the compounding effect becomes." },
                        { title: "Consistent Contributions", description: "Adding small amounts monthly can drastically change the final outcome compared to a one-time lump sum." },
                        { title: "Rate of Return", description: "Even a 1% difference in annual return can result in thousands of dollars over a 30-year period." }
                    ]}
                />

                <FAQSection
                    faqs={[
                        { question: "What is the Rule of 72?", answer: "The Rule of 72 is a quick way to estimate how many years it will take for your investment to double. Simply divide 72 by your annual rate of return. (e.g., at an 8% return, your money doubles in 9 years)." },
                        { question: "Is compound interest taxable?", answer: "It depends on the account type. In standard brokerage accounts, interest is generally taxable. In tax-advantaged accounts like a 401(k) or Roth IRA in the US, compounding is tax-deferred or tax-free." }
                    ]}
                />
            </SEOContent>
        </div>
    );
};

export default CompoundInterestCalculator;
