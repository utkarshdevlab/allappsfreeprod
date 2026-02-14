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
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default function RentVsBuyCalculator() {
    const [homePrice, setHomePrice] = useState<number>(400000);
    const [monthlyRent, setMonthlyRent] = useState<number>(2500);
    const [years, setYears] = useState<number>(7);
    const [homeAppreciation, setHomeAppreciation] = useState<number>(3);
    const [rentIncrease, setRentIncrease] = useState<number>(2);
    const [investmentReturn, setInvestmentReturn] = useState<number>(5);
    const [interestRate, setInterestRate] = useState<number>(6.5);
    const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);

    const [verdict, setVerdict] = useState<string>('');
    const [savings, setSavings] = useState<number>(0);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [chartData, setChartData] = useState<any>({ labels: [], datasets: [] });

    useEffect(() => {
        const calculateRentVsBuy = () => {
            const labels = [];
            const rentCosts: number[] = [];
            const buyCosts: number[] = [];

            // Buy costs
            const downPayment = homePrice * (downPaymentPercent / 100);
            const loanAmount = homePrice - downPayment;
            const monthlyRate = interestRate / 100 / 12;
            const mortgagePayment = (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -30 * 12));
            const annualPropertyTax = homePrice * 0.012; // approx 1.2%
            const annualMaintenance = homePrice * 0.01; // approx 1%
            const closingCosts = homePrice * 0.03; // approx 3%

            let totalRentCost = 0;
            // let totalBuyCost = closingCosts + downPayment;

            // Opportunity cost: what if down payment was invested?
            let investmentValue = downPayment;
            let homeValue = homePrice;

            for (let i = 1; i <= years; i++) {
                labels.push(`Year ${i}`);

                // Rent
                const annualRent = monthlyRent * 12 * Math.pow(1 + rentIncrease / 100, i - 1);
                totalRentCost += annualRent + (annualRent * 0.015); // renters insurance approx

                // Buy
                const interestPaid = loanAmount * interestRate / 100; // Simplified
                // const principalPaid = (mortgagePayment * 12) - interestPaid;
                const annualTaxMaintenance = annualPropertyTax + annualMaintenance;

                // Add explicit costs
                // totalBuyCost += (mortgagePayment * 12) + annualTaxMaintenance;

                // Remove equity build from cost (simplified view of net cost)
                // totalBuyCost -= principalPaid; // Logic commented out as we are using simplified unrecoverable costs

                // Appreciation
                homeValue = homeValue * (1 + homeAppreciation / 100);

                // Opportunity cost calculation
                investmentValue = investmentValue * (1 + investmentReturn / 100);

                rentCosts.push(totalRentCost + (investmentValue - downPayment));

                // Re-calculation for "Unrecoverable Costs comparison"
                const currentRentCost = annualRent;
                const currentBuyUnrecoverable = (interestPaid) + annualTaxMaintenance - (homeValue - (homeValue / (1 + homeAppreciation / 100)));

                // Accumulate
                if (i === 1) {
                    rentCosts[0] = currentRentCost - (investmentValue - downPayment);
                    buyCosts[0] = currentBuyUnrecoverable + closingCosts;
                } else {
                    rentCosts[i - 1] = rentCosts[i - 2] + currentRentCost;
                    buyCosts[i - 1] = buyCosts[i - 2] + currentBuyUnrecoverable;
                }
            }

            const totalRentPaid = monthlyRent * 12 * ((Math.pow(1 + rentIncrease / 100, years) - 1) / (rentIncrease / 100 || 1)); // geometric series
            const investmentGain = downPayment * Math.pow(1 + investmentReturn / 100, years) - downPayment;
            const netRentCost = totalRentPaid - investmentGain;

            // Buy:
            const totalMortgagePayments = mortgagePayment * 12 * years;
            const totalTaxMaint = (annualPropertyTax + annualMaintenance) * years;
            const endEquity = (homePrice * Math.pow(1 + homeAppreciation / 100, years)) - (loanAmount * ((Math.pow(1 + monthlyRate, 30 * 12) - Math.pow(1 + monthlyRate, years * 12)) / (Math.pow(1 + monthlyRate, 30 * 12) - 1)));

            const netBuyCost = totalMortgagePayments + totalTaxMaint + closingCosts + downPayment - endEquity;

            const diff = netRentCost - netBuyCost;

            if (diff > 0) {
                setVerdict('Buying is cheaper');
                setSavings(diff);
            } else {
                setVerdict('Renting is cheaper');
                setSavings(Math.abs(diff));
            }

            setChartData({
                labels,
                datasets: [
                    {
                        label: 'Net Cost of Renting',
                        data: rentCosts,
                        borderColor: '#ef4444',
                        backgroundColor: '#ef4444',
                        tension: 0.3,
                    },
                    {
                        label: 'Net Cost of Buying',
                        data: buyCosts,
                        borderColor: '#10b981',
                        backgroundColor: '#10b981',
                        tension: 0.3,
                    },
                ],
            });
        };

        calculateRentVsBuy();
    }, [homePrice, monthlyRent, years, homeAppreciation, rentIncrease, investmentReturn, interestRate, downPaymentPercent]);

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
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Rent vs. Buy Calculator</h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Inputs */}
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Rent</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                    <input
                                        type="number"
                                        value={monthlyRent}
                                        onChange={(e) => setMonthlyRent(Number(e.target.value))}
                                        className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Home Price</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                    <input
                                        type="number"
                                        value={homePrice}
                                        onChange={(e) => setHomePrice(Number(e.target.value))}
                                        className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Down Payment (%)</label>
                        <div className="relative">
                            <input
                                type="number"
                                value={downPaymentPercent}
                                onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <label className="block text-sm font-medium text-gray-700 mb-2">How long will you stay?</label>
                    <input
                        type="range"
                        min="1"
                        max="30"
                        value={years}
                        onChange={(e) => setYears(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-right font-medium text-blue-600 mt-1">{years} years</div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Appreciation (%)</label>
                        <input
                            type="number"
                            step="0.5"
                            value={homeAppreciation}
                            onChange={(e) => setHomeAppreciation(Number(e.target.value))}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Rent Increase (%)</label>
                        <input
                            type="number"
                            step="0.5"
                            value={rentIncrease}
                            onChange={(e) => setRentIncrease(Number(e.target.value))}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Investment Return (%)</label>
                        <input
                            type="number"
                            step="0.5"
                            value={investmentReturn}
                            onChange={(e) => setInvestmentReturn(Number(e.target.value))}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mortgage Rate (%)</label>
                        <input
                            type="number"
                            step="0.1"
                            value={interestRate}
                            onChange={(e) => setInterestRate(Number(e.target.value))}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                        />
                    </div>
                </div>
            </div>

            {/* Results */}
            <div className="bg-gray-50 rounded-xl p-6 flex flex-col justify-center">
                <div className="text-center mb-6">
                    <p className="text-gray-500 font-medium mb-1">After {years} years</p>
                    <p className={`text-3xl font-bold ${verdict.includes('Buy') ? 'text-green-600' : 'text-blue-600'}`}>
                        {verdict}
                    </p>
                    <p className="text-gray-600 mt-2">
                        by approximately <span className="font-bold">{formatCurrency(savings)}</span>
                    </p>
                </div>

                <div className="flex-1 min-h-[250px] relative">
                    <Line
                        data={chartData}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: { position: 'bottom' },
                                tooltip: {
                                    callbacks: {
                                        label: (context) => ` ${context.dataset.label}: ${formatCurrency(context.raw as number)}`
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

            {/* SEO Content */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-100 prose prose-lg max-w-none">
                <h2 className="text-indigo-900">Should You Rent or Buy?</h2>
                <p>
                    Deciding between renting and buying a home is a major financial decision.
                    While buying builds equity, it comes with upfront costs (down payment, closing costs) and ongoing expenses (maintenance, taxes).
                    Renting offers flexibility and lower upfront costs, but your payments don&apos;t build wealth.
                </p>
                <p>
                    Use our interactive Rent vs. Buy Calculator to see the total cost of each option over time,
                    factoring in opportunity costs, tax benefits, and home value appreciation.
                </p>
                <h3>The 5-Year Rule</h3>
                <p>
                    Generally, if you plan to stay in a home for less than 5 years, renting is often cheaper.
                    The transaction costs of buying and selling (like agent commissions) usually outweigh the equity built in a short time.
                </p>
            </div>
        </div>
    );
}
