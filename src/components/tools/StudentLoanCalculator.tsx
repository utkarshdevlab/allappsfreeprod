'use client';

import { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function StudentLoanCalculator() {
    const [loanAmount, setLoanAmount] = useState<number>(30000);
    const [interestRate, setInterestRate] = useState<number>(5.5);
    const [loanTerm, setLoanTerm] = useState<number>(10);
    const [extraPayment, setExtraPayment] = useState<number>(0);

    const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
    const [totalInterest, setTotalInterest] = useState<number>(0);
    const [payoffMonths, setPayoffMonths] = useState<number>(0);
    const [originalTotalInterest, setOriginalTotalInterest] = useState<number>(0);

    useEffect(() => {
        const calculateLoan = () => {
            if (loanAmount <= 0 || interestRate <= 0 || loanTerm <= 0) return;

            const monthlyRate = interestRate / 100 / 12;
            const totalMonths = loanTerm * 12;

            // Standard Monthly Payment
            const standardPayment =
                (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
                (Math.pow(1 + monthlyRate, totalMonths) - 1);

            if (!isFinite(standardPayment)) return;

            setMonthlyPayment(standardPayment);

            // Calculate original total interest
            setOriginalTotalInterest((standardPayment * totalMonths) - loanAmount);

            // Calculate with extra payment
            let balance = loanAmount;
            let actualMonths = 0;
            let actualInterest = 0;
            const actualMonthlyPayment = standardPayment + extraPayment;

            while (balance > 0 && actualMonths < 1000) { // Safety break
                const interest = balance * monthlyRate;
                const principal = actualMonthlyPayment - interest;

                balance -= principal;
                actualInterest += interest;
                actualMonths++;

                if (balance < 0) {
                    // Adjust last month
                    actualInterest += balance; // rebate negative balance (simplified)
                }
            }

            setPayoffMonths(actualMonths);
            setTotalInterest(actualInterest);
        };

        calculateLoan();
    }, [loanAmount, interestRate, loanTerm, extraPayment]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
        }).format(value);
    };

    const chartData = {
        labels: ['Principal', 'Interest'],
        datasets: [
            {
                data: [loanAmount, totalInterest],
                backgroundColor: ['#3b82f6', '#f59e0b'],
                borderWidth: 0,
            },
        ],
    };

    return (
        <div className="space-y-8">
            {/* Calculator Card */}
            <div className="bg-white rounded-2xl p-6 md:p-8 border-2 border-gray-100 shadow-xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Student Loan Calculator</h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Inputs */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Loan Balance</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                <input
                                    type="number"
                                    value={loanAmount}
                                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                                    className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                                />
                            </div>
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
                                        className="w-full pl-4 pr-8 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
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
                                        className="w-full pl-4 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">Years</span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100">
                            <label className="block text-sm font-medium text-blue-800 mb-2">Add Extra Monthly Payment?</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                <input
                                    type="number"
                                    value={extraPayment}
                                    onChange={(e) => setExtraPayment(Number(e.target.value))}
                                    className="w-full pl-8 pr-4 py-3 border-2 border-blue-100 bg-blue-50 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-2">See how much faster you can be debt-free!</p>
                        </div>
                    </div>

                    {/* Results */}
                    <div className="bg-gray-50 rounded-xl p-6 flex flex-col justify-center">

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-white p-4 rounded-xl border border-gray-200 text-center">
                                <p className="text-gray-500 text-sm mb-1">Monthly Pay</p>
                                <p className="text-2xl font-bold text-gray-900">{formatCurrency(monthlyPayment + extraPayment)}</p>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-gray-200 text-center">
                                <p className="text-gray-500 text-sm mb-1">Payoff Time</p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {Math.floor(payoffMonths / 12)}y {payoffMonths % 12}m
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-center mb-4 h-40">
                            <Doughnut data={chartData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'right' } } }} />
                        </div>

                        {extraPayment > 0 && (
                            <div className="bg-green-100 p-4 rounded-xl border border-green-200">
                                <p className="text-green-800 font-bold flex items-center gap-2">
                                    <span>🎉</span> You&apos;ll save {formatCurrency(originalTotalInterest - totalInterest)}!
                                </p>
                                <p className="text-green-700 text-sm mt-1">
                                    And be debt-free {Math.floor(((loanTerm * 12) - payoffMonths) / 12)} years sooner.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* SEO Content */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-100 prose prose-lg max-w-none">
                <h2 className="text-blue-900">Crush Your Student Loans</h2>
                <p>
                    Student loans can linger for years, accumulating thousands in interest.
                    Use our calculator to see exactly how your payments break down and discover the power of making extra payments.
                </p>

                <h3>How to Pay Off Loans Faster</h3>
                <ul>
                    <li><strong>Pay more than the minimum:</strong> Even an extra $50 a month can shave years off your repayment term.</li>
                    <li><strong>Refinance:</strong> If you have good credit, refinancing to a lower interest rate can save you money immediately.</li>
                    <li><strong>Bi-weekly payments:</strong> Making a half-payment every two weeks results in one extra full payment per year without much effort.</li>
                </ul>
            </div>
        </div>
    );
}
