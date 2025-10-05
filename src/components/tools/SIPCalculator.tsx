'use client';

import { useState } from 'react';

export default function SIPCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [timePeriod, setTimePeriod] = useState(10);

  const calculateSIP = () => {
    const P = monthlyInvestment;
    const r = expectedReturn / 12 / 100;
    const n = timePeriod * 12;
    
    const futureValue = P * (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
    const totalInvestment = P * n;
    const estimatedReturns = futureValue - totalInvestment;
    
    return {
      futureValue: Math.round(futureValue),
      totalInvestment: Math.round(totalInvestment),
      estimatedReturns: Math.round(estimatedReturns)
    };
  };

  const result = calculateSIP();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">SIP Calculator</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Investment (₹)
              </label>
              <input
                type="number"
                value={monthlyInvestment}
                onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="range"
                min="500"
                max="100000"
                step="500"
                value={monthlyInvestment}
                onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                className="w-full mt-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expected Return Rate (% p.a.)
              </label>
              <input
                type="number"
                step="0.1"
                value={expectedReturn}
                onChange={(e) => setExpectedReturn(Number(e.target.value))}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="range"
                min="1"
                max="30"
                step="0.5"
                value={expectedReturn}
                onChange={(e) => setExpectedReturn(Number(e.target.value))}
                className="w-full mt-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Period (Years)
              </label>
              <input
                type="number"
                value={timePeriod}
                onChange={(e) => setTimePeriod(Number(e.target.value))}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="range"
                min="1"
                max="40"
                value={timePeriod}
                onChange={(e) => setTimePeriod(Number(e.target.value))}
                className="w-full mt-2"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
              <div className="text-sm opacity-90 mb-2">Expected Amount</div>
              <div className="text-4xl font-bold">₹{result.futureValue.toLocaleString('en-IN')}</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                <div className="text-xs text-blue-600 mb-1">Invested Amount</div>
                <div className="text-lg font-bold text-blue-700">₹{result.totalInvestment.toLocaleString('en-IN')}</div>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 border-2 border-purple-200">
                <div className="text-xs text-purple-600 mb-1">Est. Returns</div>
                <div className="text-lg font-bold text-purple-700">₹{result.estimatedReturns.toLocaleString('en-IN')}</div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-sm font-medium text-gray-700 mb-3">Wealth Gain</div>
              <div className="flex gap-2 h-8 rounded-lg overflow-hidden">
                <div 
                  className="bg-blue-500 flex items-center justify-center text-white text-xs font-bold"
                  style={{ width: `${(result.totalInvestment / result.futureValue) * 100}%` }}
                >
                  {Math.round((result.totalInvestment / result.futureValue) * 100)}%
                </div>
                <div 
                  className="bg-purple-500 flex items-center justify-center text-white text-xs font-bold"
                  style={{ width: `${(result.estimatedReturns / result.futureValue) * 100}%` }}
                >
                  {Math.round((result.estimatedReturns / result.futureValue) * 100)}%
                </div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-600">
                <span>Invested</span>
                <span>Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEO Content */}
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 border border-gray-200 prose prose-lg max-w-none">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">SIP Calculator - Calculate Mutual Fund SIP Returns Online</h1>
        
        <p className="text-gray-700 mb-6">
          Calculate your Systematic Investment Plan (SIP) returns with our free online SIP calculator. Plan your mutual fund investments and see how small monthly investments can grow into substantial wealth over time through the power of compounding.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">What is SIP?</h2>
        <p className="text-gray-700 mb-6">
          SIP (Systematic Investment Plan) is a method of investing in mutual funds where you invest a fixed amount regularly (monthly/quarterly) instead of a lump sum. It&apos;s a disciplined approach to wealth creation that leverages rupee cost averaging and the power of compounding.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">How Does SIP Work?</h2>
        <p className="text-gray-700 mb-4">
          When you invest through SIP, a fixed amount is automatically debited from your bank account and invested in your chosen mutual fund scheme. You get more units when the market is down and fewer units when it&apos;s up, averaging out your purchase cost.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">Benefits of SIP Investment</h2>
        <ul className="list-disc pl-6 text-gray-700 mb-6">
          <li><strong>Disciplined Investing</strong> - Automated monthly investments build financial discipline</li>
          <li><strong>Power of Compounding</strong> - Your returns generate more returns over time</li>
          <li><strong>Rupee Cost Averaging</strong> - Reduces impact of market volatility</li>
          <li><strong>Flexibility</strong> - Start with as low as ₹500 per month</li>
          <li><strong>No Market Timing</strong> - Invest regularly without worrying about market highs and lows</li>
          <li><strong>Wealth Creation</strong> - Build substantial corpus for long-term goals</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">SIP vs Lump Sum Investment</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2">📊 SIP Investment</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✓ Regular small investments</li>
              <li>✓ Reduces market timing risk</li>
              <li>✓ Suitable for salaried individuals</li>
              <li>✓ Flexible and affordable</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2">💰 Lump Sum</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✓ One-time large investment</li>
              <li>✓ Requires market timing</li>
              <li>✓ Higher initial capital needed</li>
              <li>✓ Suitable for windfall gains</li>
            </ul>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">How to Start SIP?</h2>
        <ol className="list-decimal pl-6 text-gray-700 mb-6">
          <li>Complete your KYC (Know Your Customer) verification</li>
          <li>Choose a mutual fund scheme based on your goals and risk appetite</li>
          <li>Decide your monthly investment amount</li>
          <li>Set up auto-debit from your bank account</li>
          <li>Monitor your investments periodically</li>
        </ol>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">Popular SIP Investment Goals</h2>
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2">🏠 Home Purchase</h3>
            <p className="text-sm text-gray-600">Build down payment for your dream home</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2">🎓 Child Education</h3>
            <p className="text-sm text-gray-600">Secure your child&apos;s higher education</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2">🌴 Retirement</h3>
            <p className="text-sm text-gray-600">Build retirement corpus for financial freedom</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">SIP Investment Tips</h2>
        <ul className="list-disc pl-6 text-gray-700 mb-6">
          <li>Start early to maximize compounding benefits</li>
          <li>Increase SIP amount annually with salary increments (Step-up SIP)</li>
          <li>Stay invested for long term (5+ years) for better returns</li>
          <li>Diversify across different fund categories</li>
          <li>Review portfolio annually but avoid frequent changes</li>
          <li>Don&apos;t stop SIP during market downturns</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">Frequently Asked Questions</h2>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">What is the minimum SIP amount?</h3>
        <p className="text-gray-700 mb-4">
          Most mutual funds allow SIP starting from ₹500 per month. Some funds may have higher minimums like ₹1,000 or ₹5,000.
        </p>

        <h3 className="text-xl font-semibold text-gray-900 mb-2">Can I stop or pause my SIP?</h3>
        <p className="text-gray-700 mb-4">
          Yes, you can pause or stop your SIP anytime without any penalty. However, staying invested is recommended for better long-term returns.
        </p>

        <h3 className="text-xl font-semibold text-gray-900 mb-2">What returns can I expect from SIP?</h3>
        <p className="text-gray-700 mb-4">
          Historical data shows equity mutual funds have delivered 12-15% annual returns over 10+ years. However, past performance doesn&apos;t guarantee future returns.
        </p>

        <h3 className="text-xl font-semibold text-gray-900 mb-2">Is SIP tax-free?</h3>
        <p className="text-gray-700 mb-4">
          SIP investments are subject to capital gains tax. Equity funds held for more than 1 year attract 10% LTCG tax on gains above ₹1 lakh. Debt funds follow different tax rules.
        </p>

        <p className="text-lg font-semibold text-green-600 mt-8">
          Start your SIP journey today and build wealth systematically - Calculate your returns now!
        </p>
      </div>
    </div>
  );
}
