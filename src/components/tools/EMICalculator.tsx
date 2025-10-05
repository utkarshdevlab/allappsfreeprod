'use client';

import { useState } from 'react';

export default function EMICalculator() {
  const [loanAmount, setLoanAmount] = useState(1000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);
  const [tenureType, setTenureType] = useState<'years' | 'months'>('years');

  const calculateEMI = () => {
    const P = loanAmount;
    const r = interestRate / 12 / 100;
    const n = tenureType === 'years' ? tenure * 12 : tenure;
    
    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalAmount = emi * n;
    const totalInterest = totalAmount - P;
    
    return {
      emi: Math.round(emi),
      totalAmount: Math.round(totalAmount),
      totalInterest: Math.round(totalInterest),
      principal: P
    };
  };

  const result = calculateEMI();

  return (
    <div className="space-y-6">
      {/* Calculator Card */}
      <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">EMI Calculator</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loan Amount (₹)
              </label>
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="range"
                min="100000"
                max="10000000"
                step="100000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full mt-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Interest Rate (% per annum)
              </label>
              <input
                type="number"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="range"
                min="5"
                max="20"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full mt-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loan Tenure
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={tenure}
                  onChange={(e) => setTenure(Number(e.target.value))}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <select
                  value={tenureType}
                  onChange={(e) => setTenureType(e.target.value as 'years' | 'months')}
                  className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="years">Years</option>
                  <option value="months">Months</option>
                </select>
              </div>
              <input
                type="range"
                min={tenureType === 'years' ? '1' : '12'}
                max={tenureType === 'years' ? '30' : '360'}
                value={tenure}
                onChange={(e) => setTenure(Number(e.target.value))}
                className="w-full mt-2"
              />
            </div>
          </div>

          {/* Result Section */}
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
              <div className="text-sm opacity-90 mb-2">Monthly EMI</div>
              <div className="text-4xl font-bold">₹{result.emi.toLocaleString('en-IN')}</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
                <div className="text-xs text-green-600 mb-1">Principal Amount</div>
                <div className="text-lg font-bold text-green-700">₹{result.principal.toLocaleString('en-IN')}</div>
              </div>
              <div className="bg-orange-50 rounded-xl p-4 border-2 border-orange-200">
                <div className="text-xs text-orange-600 mb-1">Total Interest</div>
                <div className="text-lg font-bold text-orange-700">₹{result.totalInterest.toLocaleString('en-IN')}</div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-xl p-4 border-2 border-purple-200">
              <div className="text-xs text-purple-600 mb-1">Total Amount Payable</div>
              <div className="text-2xl font-bold text-purple-700">₹{result.totalAmount.toLocaleString('en-IN')}</div>
            </div>

            {/* Pie Chart */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-sm font-medium text-gray-700 mb-3">Breakup</div>
              <div className="flex gap-2 h-8 rounded-lg overflow-hidden">
                <div 
                  className="bg-green-500 flex items-center justify-center text-white text-xs font-bold"
                  style={{ width: `${(result.principal / result.totalAmount) * 100}%` }}
                >
                  {Math.round((result.principal / result.totalAmount) * 100)}%
                </div>
                <div 
                  className="bg-orange-500 flex items-center justify-center text-white text-xs font-bold"
                  style={{ width: `${(result.totalInterest / result.totalAmount) * 100}%` }}
                >
                  {Math.round((result.totalInterest / result.totalAmount) * 100)}%
                </div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-600">
                <span>Principal</span>
                <span>Interest</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEO Content */}
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 border border-gray-200 prose prose-lg max-w-none">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">EMI Calculator - Calculate Your Loan EMI Online Free</h1>
        
        <p className="text-gray-700 mb-6">
          Calculate your Equated Monthly Installment (EMI) for home loans, car loans, personal loans, and education loans instantly with our free EMI calculator. Get accurate results with detailed breakup of principal and interest components.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">What is EMI?</h2>
        <p className="text-gray-700 mb-6">
          EMI (Equated Monthly Installment) is a fixed payment amount made by a borrower to a lender at a specified date each calendar month. EMIs are used to pay off both interest and principal each month, so that over a specified number of years, the loan is paid off in full.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">How is EMI Calculated?</h2>
        <p className="text-gray-700 mb-4">
          The EMI calculation formula is: <strong>EMI = [P x R x (1+R)^N] / [(1+R)^N-1]</strong>
        </p>
        <ul className="list-disc pl-6 text-gray-700 mb-6">
          <li><strong>P</strong> = Principal loan amount</li>
          <li><strong>R</strong> = Monthly interest rate (Annual rate / 12 / 100)</li>
          <li><strong>N</strong> = Loan tenure in months</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">Benefits of Using EMI Calculator</h2>
        <ul className="list-disc pl-6 text-gray-700 mb-6">
          <li><strong>Instant Results</strong> - Get your EMI calculated in seconds</li>
          <li><strong>Plan Your Budget</strong> - Know your monthly outgo before taking a loan</li>
          <li><strong>Compare Loans</strong> - Try different loan amounts and tenures</li>
          <li><strong>Interest Breakup</strong> - See how much interest you'll pay</li>
          <li><strong>100% Free</strong> - No registration or hidden charges</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">Types of Loans You Can Calculate</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2">🏠 Home Loan EMI</h3>
            <p className="text-sm text-gray-600">Calculate EMI for housing loans with tenure up to 30 years</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2">🚗 Car Loan EMI</h3>
            <p className="text-sm text-gray-600">Find your car loan monthly installment amount</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2">💰 Personal Loan EMI</h3>
            <p className="text-sm text-gray-600">Calculate personal loan EMI for any amount</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2">🎓 Education Loan EMI</h3>
            <p className="text-sm text-gray-600">Plan your education loan repayment</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">Factors Affecting Your EMI</h2>
        <ul className="list-disc pl-6 text-gray-700 mb-6">
          <li><strong>Loan Amount</strong> - Higher loan amount means higher EMI</li>
          <li><strong>Interest Rate</strong> - Lower interest rate reduces your EMI</li>
          <li><strong>Loan Tenure</strong> - Longer tenure reduces EMI but increases total interest</li>
          <li><strong>Processing Fees</strong> - One-time charges by lenders</li>
          <li><strong>Credit Score</strong> - Better score may get you lower interest rates</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">Tips to Reduce Your EMI</h2>
        <ul className="list-disc pl-6 text-gray-700 mb-6">
          <li>Make a higher down payment to reduce loan amount</li>
          <li>Choose longer tenure to reduce monthly EMI (but increases total interest)</li>
          <li>Improve your credit score before applying</li>
          <li>Compare interest rates from multiple lenders</li>
          <li>Consider making prepayments to reduce principal</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">Frequently Asked Questions</h2>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Can I prepay my loan?</h3>
        <p className="text-gray-700 mb-4">
          Yes, most banks allow prepayment. Some may charge prepayment penalties. Check with your lender for specific terms.
        </p>

        <h3 className="text-xl font-semibold text-gray-900 mb-2">What is the ideal EMI to income ratio?</h3>
        <p className="text-gray-700 mb-4">
          Financial experts suggest keeping your EMI below 40-50% of your monthly income to maintain healthy finances.
        </p>

        <h3 className="text-xl font-semibold text-gray-900 mb-2">Does EMI include insurance?</h3>
        <p className="text-gray-700 mb-4">
          No, EMI typically includes only principal and interest. Insurance premiums are usually charged separately.
        </p>

        <p className="text-lg font-semibold text-blue-600 mt-8">
          Start planning your loan today with our free EMI calculator - No registration required!
        </p>
      </div>
    </div>
  );
}
