'use client';

import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function RetirementCalculator() {
    const [currentBalance, setCurrentBalance] = useState<number>(10000);
    const [annualContribution, setAnnualContribution] = useState<number>(6000);
    const [employerMatch, setEmployerMatch] = useState<number>(3);
    const [annualSalary, setAnnualSalary] = useState<number>(60000);
    const [expectedReturn, setExpectedReturn] = useState<number>(7);
    const [yearsToGrow, setYearsToGrow] = useState<number>(30);

    const [futureBalance, setFutureBalance] = useState<number>(0);
    const [totalContributions, setTotalContributions] = useState<number>(0);
    const [totalGrowth, setTotalGrowth] = useState<number>(0);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [chartData, setChartData] = useState<any>({ labels: [], datasets: [] });

    useEffect(() => {
        const calculateRetirement = () => {
            let balance = currentBalance;
            let totalContrib = currentBalance;
            const labels = [];
            const balanceData = [];
            const contributionData = [];

            const effectiveMatch = Math.min(employerMatch, 100) / 100 * annualSalary;
            const totalAnnualAdd = annualContribution + effectiveMatch;

            for (let i = 0; i <= yearsToGrow; i++) {
                labels.push(`Year ${i}`);
                balanceData.push(balance);
                contributionData.push(totalContrib);

                if (i < yearsToGrow) {
                    const growth = balance * (expectedReturn / 100);
                    balance += growth + totalAnnualAdd;
                    totalContrib += totalAnnualAdd;
                }
            }

            setFutureBalance(balance);
            setTotalContributions(totalContrib);
            setTotalGrowth(balance - totalContrib);

            setChartData({
                labels,
                datasets: [
                    {
                        label: 'Total Balance',
                        data: balanceData,
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        fill: true,
                        tension: 0.4,
                    },
                    {
                        label: 'Total Contributions',
                        data: contributionData,
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        fill: true,
                        tension: 0.4,
                    },
                ],
            });
        };

        calculateRetirement();
    }, [currentBalance, annualContribution, employerMatch, annualSalary, expectedReturn, yearsToGrow]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (
        <div className="space-y-8">
            {/* Calculator Card */}
            <div className="bg-white rounded-2xl p-6 md:p-8 border-2 border-gray-100 shadow-xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">401(k) Retirement Calculator</h2>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Inputs */}
                    <div className="lg:col-span-1 space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Current 401(k) Balance</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                <input
                                    type="number"
                                    value={currentBalance}
                                    onChange={(e) => setCurrentBalance(Number(e.target.value))}
                                    className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Annual Contribution</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                <input
                                    type="number"
                                    value={annualContribution}
                                    onChange={(e) => setAnnualContribution(Number(e.target.value))}
                                    className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Annual Salary (for Match)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                <input
                                    type="number"
                                    value={annualSalary}
                                    onChange={(e) => setAnnualSalary(Number(e.target.value))}
                                    className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Employer Match</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        step="0.5"
                                        value={employerMatch}
                                        onChange={(e) => setEmployerMatch(Number(e.target.value))}
                                        className="w-full pl-4 pr-8 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Return Rate</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={expectedReturn}
                                        onChange={(e) => setExpectedReturn(Number(e.target.value))}
                                        className="w-full pl-4 pr-8 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Years to Grow</label>
                            <input
                                type="range"
                                min="1"
                                max="50"
                                value={yearsToGrow}
                                onChange={(e) => setYearsToGrow(Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="text-right font-medium text-blue-600 mt-1">{yearsToGrow} years</div>
                        </div>
                    </div>

                    {/* Results */}
                    <div className="lg:col-span-2 bg-gray-50 rounded-xl p-6 flex flex-col">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                <p className="text-sm text-gray-500 mb-1">Projected Balance</p>
                                <p className="text-2xl font-bold text-green-600">{formatCurrency(futureBalance)}</p>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                <p className="text-sm text-gray-500 mb-1">Total Contributions</p>
                                <p className="text-xl font-bold text-blue-600">{formatCurrency(totalContributions)}</p>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                <p className="text-sm text-gray-500 mb-1">Total Growth</p>
                                <p className="text-xl font-bold text-purple-600">{formatCurrency(totalGrowth)}</p>
                            </div>
                        </div>

                        <div className="flex-1 min-h-[300px]">
                            <Line
                                data={chartData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: { position: 'top' as const },
                                        tooltip: {
                                            callbacks: {
                                                label: (context) => {
                                                    return ` ${context.dataset.label}: ${formatCurrency(context.raw as number)}`;
                                                }
                                            }
                                        }
                                    },
                                    scales: {
                                        y: {
                                            ticks: {
                                                callback: (value) => '$' + (value as number / 1000) + 'k'
                                            }
                                        }
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* SEO Content */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100 prose prose-lg max-w-none">
                <h2 className="text-green-900">Plan Your Future with Our 401(k) Calculator</h2>
                <p>
                    See how your retirement savings can grow over time with compound interest.
                    Our 401(k) calculator helps you estimate the future value of your account based on your current balance,
                    annual contributions, employer match, and expected rate of return.
                </p>

                <h3>Key Features</h3>
                <ul>
                    <li><strong>Employer Match:</strong> Many employers offer to match a percentage of your contributions—this is free money! Make sure you contribute enough to get the full match.</li>
                    <li><strong>Compound Growth:</strong> The earlier you start, the more time your money has to grow exponentially.</li>
                    <li><strong>Interactive Chart:</strong> Visualize the powerful difference between your contributions and the investment growth over 10, 20, or 30 years.</li>
                </ul>

                <h3>What is a good rate of return?</h3>
                <p>
                    Historically, the stock market has returned about 10% annually before inflation.
                    However, for retirement planning, a conservative estimate of 6-7% is often recommended to account for inflation and market volatility.
                </p>
            </div>
        </div>
    );
}
