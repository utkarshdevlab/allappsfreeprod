'use client';

import { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function MortgageCalculator() {
    const [loanAmount, setLoanAmount] = useState<number>(300000);
    const [interestRate, setInterestRate] = useState<number>(6.5);
    const [loanTerm, setLoanTerm] = useState<number>(30);
    const [downPayment, setDownPayment] = useState<number>(60000);
    const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
    const [totalPayment, setTotalPayment] = useState<number>(0);
    const [totalInterest, setTotalInterest] = useState<number>(0);

    useEffect(() => {
        const calculateMortgage = () => {
            const principal = loanAmount - downPayment;
            const monthlyRate = interestRate / 100 / 12;
            const numberOfPayments = loanTerm * 12;

            if (principal <= 0 || interestRate <= 0 || loanTerm <= 0) {
                setMonthlyPayment(0);
                setTotalPayment(0);
                setTotalInterest(0);
                return;
            }

            const mortgage =
                (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
                (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

            if (isFinite(mortgage)) {
                setMonthlyPayment(mortgage);
                const total = mortgage * numberOfPayments;
                setTotalPayment(total);
                setTotalInterest(total - principal);
            }
        };

        calculateMortgage();
    }, [loanAmount, interestRate, loanTerm, downPayment]);

    const chartData = {
        labels: ['Principal', 'Total Interest'],
        datasets: [
            {
                data: [loanAmount - downPayment, totalInterest],
                backgroundColor: ['#3b82f6', '#10b981'],
                hoverBackgroundColor: ['#2563eb', '#059669'],
                borderWidth: 0,
            },
        ],
    };

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
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Mortgage Calculator</h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Inputs */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Home Price</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                <input
                                    type="number"
                                    value={loanAmount}
                                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                                    className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors text-lg"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Down Payment</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                <input
                                    type="number"
                                    value={downPayment}
                                    onChange={(e) => setDownPayment(Number(e.target.value))}
                                    className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors text-lg"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                {((downPayment / loanAmount) * 100).toFixed(1)}% of home price
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Interest Rate</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={interestRate}
                                        onChange={(e) => setInterestRate(Number(e.target.value))}
                                        className="w-full pl-4 pr-8 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors text-lg"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Loan Term</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={loanTerm}
                                        onChange={(e) => setLoanTerm(Number(e.target.value))}
                                        className="w-full pl-4 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors text-lg"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">Years</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Results */}
                    <div className="bg-gray-50 rounded-xl p-6 flex flex-col justify-center">
                        <div className="text-center mb-6">
                            <p className="text-gray-500 font-medium mb-1">Estimated Monthly Payment</p>
                            <p className="text-4xl font-bold text-blue-600">{formatCurrency(monthlyPayment)}</p>
                        </div>

                        <div className="flex justify-center mb-6 h-48">
                            <Doughnut data={chartData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-100">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                    <span className="text-gray-600">Principal</span>
                                </div>
                                <span className="font-bold text-gray-900">{formatCurrency(loanAmount - downPayment)}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-100">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    <span className="text-gray-600">Total Interest</span>
                                </div>
                                <span className="font-bold text-gray-900">{formatCurrency(totalInterest)}</span>
                            </div>
                            <div className="pt-3 mt-3 border-t border-gray-200 flex justify-between items-center">
                                <span className="text-gray-900 font-bold">Total Cost</span>
                                <span className="text-xl font-bold text-gray-900">{formatCurrency(totalPayment)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* SEO Content */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100 prose prose-lg max-w-none">
                <h2 className="text-blue-900">How to Use the Mortgage Calculator</h2>
                <p>
                    Our free Mortgage Calculator helps you estimate your monthly mortgage payments.
                    Simply enter the home price, your down payment, the interest rate, and the loan term (length of the mortgage).
                </p>

                <h3>Understanding the Inputs</h3>
                <ul>
                    <li><strong>Home Price:</strong> The purchase price of the home you want to buy.</li>
                    <li><strong>Down Payment:</strong> The amount of money you pay upfront. A higher down payment reduces your monthly payments and total interest.</li>
                    <li><strong>Interest Rate:</strong> The annual interest rate charged by the lender.</li>
                    <li><strong>Loan Term:</strong> The number of years you have to repay the loan. Common terms are 15 or 30 years.</li>
                </ul>

                <h3>Principal vs. Interest</h3>
                <p>
                    Your monthly payment goes toward paying off two things: the principal (the amount you borrowed) and the interest (the cost of borrowing).
                    In the early years of a mortgage, a larger portion of your payment goes toward interest. Over time, more goes toward the principal.
                </p>
            </div>
        </div>
    );
}
