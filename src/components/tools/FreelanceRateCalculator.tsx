'use client';

import { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function FreelanceRateCalculator() {
    const [desiredIncome, setDesiredIncome] = useState<number>(80000);
    const [billableHours, setBillableHours] = useState<number>(30);
    const [weeksOff, setWeeksOff] = useState<number>(4);
    const [monthlyExpenses, setMonthlyExpenses] = useState<number>(500);
    const [taxRate, setTaxRate] = useState<number>(25);

    const [hourlyRate, setHourlyRate] = useState<number>(0);
    const [dailyRate, setDailyRate] = useState<number>(0);
    const [totalRevenueNeeded, setTotalRevenueNeeded] = useState<number>(0);

    const [chartData, setChartData] = useState<{
        labels: string[];
        datasets: {
            data: number[];
            backgroundColor: string[];
            borderWidth: number;
        }[];
    }>({
        labels: [],
        datasets: []
    });

    useEffect(() => {
        const calculateRate = () => {
            const annualExpenses = monthlyExpenses * 12;
            const taxMultiplier = 1 / (1 - (taxRate / 100));
            const grossRevenue = (desiredIncome + annualExpenses) * taxMultiplier;

            const workingWeeks = 52 - weeksOff;
            const totalBillableHours = workingWeeks * billableHours;

            if (totalBillableHours <= 0) return;

            setTotalRevenueNeeded(grossRevenue);
            setHourlyRate(grossRevenue / totalBillableHours);
            setDailyRate(grossRevenue / (workingWeeks * 5)); // Assuming 5 day work week for daily rate scaling

            setChartData({
                labels: ['Net Salary', 'Taxes', 'Business Expenses'],
                datasets: [
                    {
                        data: [desiredIncome, grossRevenue - desiredIncome - annualExpenses, annualExpenses],
                        backgroundColor: ['#3b82f6', '#ef4444', '#f59e0b'],
                        borderWidth: 0,
                    },
                ],
            });
        };

        calculateRate();
    }, [desiredIncome, billableHours, weeksOff, monthlyExpenses, taxRate]);

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
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Freelance Rate Calculator</h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Inputs */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Desired Annual Net Income</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                <input
                                    type="number"
                                    value={desiredIncome}
                                    onChange={(e) => setDesiredIncome(Number(e.target.value))}
                                    className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors text-lg"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Take-home pay after taxes/expenses</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Weeks Off/Year</label>
                                <input
                                    type="number"
                                    value={weeksOff}
                                    onChange={(e) => setWeeksOff(Number(e.target.value))}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Billable Hours/Week</label>
                                <input
                                    type="number"
                                    value={billableHours}
                                    onChange={(e) => setBillableHours(Number(e.target.value))}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                                />
                                <p className="text-xs text-gray-500 mt-1">Usually 60-70% of total hours</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Expenses</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                    <input
                                        type="number"
                                        value={monthlyExpenses}
                                        onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
                                        className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tax Rate (%)</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={taxRate}
                                        onChange={(e) => setTaxRate(Number(e.target.value))}
                                        className="w-full pl-4 pr-8 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Results */}
                    <div className="bg-gray-50 rounded-xl p-6 flex flex-col justify-center">
                        <div className="text-center mb-6">
                            <p className="text-gray-500 font-medium mb-1">Minimum Hourly Rate</p>
                            <p className="text-3xl font-bold text-blue-600">{formatCurrency(hourlyRate)}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-white p-3 rounded-lg border border-gray-100 text-center">
                                <p className="text-xs text-gray-500">Daily Rate</p>
                                <p className="text-lg font-bold text-gray-900">{formatCurrency(dailyRate)}</p>
                            </div>
                            <div className="bg-white p-3 rounded-lg border border-gray-100 text-center">
                                <p className="text-xs text-gray-500">Weekly Rate</p>
                                <p className="text-lg font-bold text-gray-900">{formatCurrency(1)}</p>
                            </div>
                        </div>

                        <div className="flex justify-center mb-4 h-40">
                            <Doughnut data={chartData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'right' } } }} />
                        </div>

                        <div className="text-center p-3">
                            <p className="text-gray-600">
                                To take home <strong>{formatCurrency(desiredIncome)}</strong>,
                                you need a gross revenue of <strong>{formatCurrency(totalRevenueNeeded)}</strong>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* SEO Content */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-100 prose prose-lg max-w-none">
                <h2 className="text-purple-900">How to Calculate Your Freelance Rate</h2>
                <p>
                    Determining your freelance rate can be tricky. It&apos;s not just about what you were paid as an employee.
                    As a freelancer, you have overhead costs (health insurance, software subscriptions, office space) and unpaid admin time (invoicing, marketing).
                </p>

                <h3>Why charge more than your salary?</h3>
                <ul>
                    <li><strong>Taxes:</strong> You pay self-employment tax (social security/medicare) on top of income tax.</li>
                    <li><strong>Unpaid Time:</strong> You don&apos;t get paid for vacation, sick days, or time spent finding new clients.</li>
                    <li><strong>Expenses:</strong> You cover your own hardware, software licenses, internet, and utilities.</li>
                </ul>

                <h3>The 2-3x Rule of Thumb</h3>
                <p>
                    Many experts suggest charging 2-3x your salaried hourly wage to account for these extra costs and risks.
                    Use our calculator to find the exact number based on your financial goals.
                </p>
            </div>
        </div>
    );
}
