'use client';

import { useState } from 'react';

export default function GSTCalculator() {
  const [amount, setAmount] = useState(10000);
  const [gstRate, setGstRate] = useState(18);
  const [calculationType, setCalculationType] = useState<'exclusive' | 'inclusive'>('exclusive');

  const calculateGST = () => {
    if (calculationType === 'exclusive') {
      const gstAmount = (amount * gstRate) / 100;
      const totalAmount = amount + gstAmount;
      const cgst = gstAmount / 2;
      const sgst = gstAmount / 2;
      return { baseAmount: amount, gstAmount, cgst, sgst, igst: gstAmount, totalAmount };
    } else {
      const baseAmount = (amount * 100) / (100 + gstRate);
      const gstAmount = amount - baseAmount;
      const cgst = gstAmount / 2;
      const sgst = gstAmount / 2;
      return { baseAmount, gstAmount, cgst, sgst, igst: gstAmount, totalAmount: amount };
    }
  };

  const result = calculateGST();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">GST Calculator</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Calculation Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setCalculationType('exclusive')}
                  className={`px-4 py-3 rounded-lg font-medium transition-all ${
                    calculationType === 'exclusive'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Add GST
                </button>
                <button
                  onClick={() => setCalculationType('inclusive')}
                  className={`px-4 py-3 rounded-lg font-medium transition-all ${
                    calculationType === 'inclusive'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Remove GST
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {calculationType === 'exclusive' ? 'Amount (Excluding GST)' : 'Amount (Including GST)'} (₹)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GST Rate (%)
              </label>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {[5, 12, 18, 28].map(rate => (
                  <button
                    key={rate}
                    onClick={() => setGstRate(rate)}
                    className={`px-3 py-2 rounded-lg font-medium transition-all ${
                      gstRate === rate
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {rate}%
                  </button>
                ))}
              </div>
              <input
                type="number"
                step="0.1"
                value={gstRate}
                onChange={(e) => setGstRate(Number(e.target.value))}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
              <div className="text-sm opacity-90 mb-2">Total Amount</div>
              <div className="text-4xl font-bold">₹{Math.round(result.totalAmount).toLocaleString('en-IN')}</div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Base Amount</span>
                <span className="text-lg font-bold text-gray-900">₹{Math.round(result.baseAmount).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">GST Amount ({gstRate}%)</span>
                <span className="text-lg font-bold text-green-600">₹{Math.round(result.gstAmount).toLocaleString('en-IN')}</span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-gray-500">CGST ({gstRate/2}%)</span>
                  <span className="text-sm font-semibold text-gray-700">₹{Math.round(result.cgst).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">SGST ({gstRate/2}%)</span>
                  <span className="text-sm font-semibold text-gray-700">₹{Math.round(result.sgst).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-xl p-4 border-2 border-purple-200">
              <div className="text-xs text-purple-600 mb-1">For Interstate (IGST)</div>
              <div className="text-xl font-bold text-purple-700">₹{Math.round(result.igst).toLocaleString('en-IN')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* SEO Content */}
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 border border-gray-200 prose prose-lg max-w-none">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">GST Calculator - Calculate GST Online Free India 2025</h1>
        
        <p className="text-gray-700 mb-6">
          Calculate GST (Goods and Services Tax) instantly with our free online GST calculator. Add or remove GST from any amount, get CGST, SGST, and IGST breakup for accurate invoicing and tax filing in India.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">What is GST?</h2>
        <p className="text-gray-700 mb-6">
          GST (Goods and Services Tax) is an indirect tax levied on the supply of goods and services in India. It replaced multiple indirect taxes like VAT, Service Tax, and Excise Duty. GST is a destination-based tax collected at each stage of the supply chain.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">GST Rates in India</h2>
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-green-500">
            <div className="text-2xl font-bold text-green-600">5%</div>
            <p className="text-xs text-gray-600 mt-1">Essential items, transport</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-blue-500">
            <div className="text-2xl font-bold text-blue-600">12%</div>
            <p className="text-xs text-gray-600 mt-1">Processed food, computers</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-orange-500">
            <div className="text-2xl font-bold text-orange-600">18%</div>
            <p className="text-xs text-gray-600 mt-1">Most goods & services</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-red-500">
            <div className="text-2xl font-bold text-red-600">28%</div>
            <p className="text-xs text-gray-600 mt-1">Luxury items, automobiles</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">Types of GST</h2>
        <ul className="list-disc pl-6 text-gray-700 mb-6">
          <li><strong>CGST (Central GST)</strong> - Collected by Central Government on intra-state sales</li>
          <li><strong>SGST (State GST)</strong> - Collected by State Government on intra-state sales</li>
          <li><strong>IGST (Integrated GST)</strong> - Collected by Central Government on inter-state sales</li>
          <li><strong>UTGST</strong> - Union Territory GST for UT transactions</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">How to Calculate GST?</h2>
        <p className="text-gray-700 mb-4"><strong>To Add GST (Exclusive):</strong></p>
        <ul className="list-disc pl-6 text-gray-700 mb-4">
          <li>GST Amount = (Original Amount × GST%) / 100</li>
          <li>Total Amount = Original Amount + GST Amount</li>
        </ul>
        <p className="text-gray-700 mb-4"><strong>To Remove GST (Inclusive):</strong></p>
        <ul className="list-disc pl-6 text-gray-700 mb-6">
          <li>Base Amount = (Total Amount × 100) / (100 + GST%)</li>
          <li>GST Amount = Total Amount - Base Amount</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">GST Registration Requirements</h2>
        <ul className="list-disc pl-6 text-gray-700 mb-6">
          <li>Mandatory for businesses with turnover above ₹40 lakhs (₹20 lakhs for services)</li>
          <li>₹20 lakhs threshold for special category states</li>
          <li>Compulsory for inter-state suppliers regardless of turnover</li>
          <li>E-commerce operators must register irrespective of turnover</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">Benefits of GST</h2>
        <ul className="list-disc pl-6 text-gray-700 mb-6">
          <li><strong>Simplified Tax Structure</strong> - One tax instead of multiple indirect taxes</li>
          <li><strong>Reduced Tax Burden</strong> - Elimination of cascading effect</li>
          <li><strong>Easy Compliance</strong> - Online registration and filing</li>
          <li><strong>Input Tax Credit</strong> - Claim credit for taxes paid on purchases</li>
          <li><strong>Transparent System</strong> - Digital tracking of entire supply chain</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">GST Filing Due Dates</h2>
        <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
          <ul className="text-sm text-gray-700 space-y-2">
            <li><strong>GSTR-1:</strong> 11th of next month (Outward supplies)</li>
            <li><strong>GSTR-3B:</strong> 20th of next month (Summary return)</li>
            <li><strong>GSTR-9:</strong> December 31st (Annual return)</li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">Frequently Asked Questions</h2>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Is GST applicable on all products?</h3>
        <p className="text-gray-700 mb-4">
          No, some items like fresh fruits, vegetables, milk, and educational services are exempt from GST. Petroleum products are also currently outside GST.
        </p>

        <h3 className="text-xl font-semibold text-gray-900 mb-2">Can I claim Input Tax Credit?</h3>
        <p className="text-gray-700 mb-4">
          Yes, registered businesses can claim ITC for GST paid on business purchases, reducing their overall tax liability.
        </p>

        <h3 className="text-xl font-semibold text-gray-900 mb-2">What is reverse charge mechanism?</h3>
        <p className="text-gray-700 mb-4">
          Under reverse charge, the recipient of goods/services pays GST instead of the supplier. This applies to specific categories notified by the government.
        </p>

        <p className="text-lg font-semibold text-blue-600 mt-8">
          Calculate GST accurately for your business - Free, fast, and reliable GST calculator for India!
        </p>
      </div>
    </div>
  );
}
