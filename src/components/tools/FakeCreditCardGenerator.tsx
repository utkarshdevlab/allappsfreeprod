'use client';

import { useState, useCallback } from 'react';

interface CreditCard {
  id: string;
  type: string;
  number: string;
  cvv: string;
  expiry: string;
  brand: string;
  color: string;
}

interface CardType {
  name: string;
  prefixes: string[];
  lengths: number[];
  cvvLength: number;
  color: string;
  brand: string;
}

const cardTypes: CardType[] = [
  { 
    name: 'Visa', 
    prefixes: ['4'], 
    lengths: [13, 16], 
    cvvLength: 3,
    color: 'from-blue-600 to-blue-800',
    brand: 'VISA'
  },
  { 
    name: 'Mastercard', 
    prefixes: ['51', '52', '53', '54', '55', '2221', '2222', '2223', '2224', '2225', '2226', '2227', '2228', '2229', '223', '224', '225', '226', '227', '228', '229', '23', '24', '25', '26', '271', '2720', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39'], 
    lengths: [16], 
    cvvLength: 3,
    color: 'from-red-600 to-red-800',
    brand: 'MASTERCARD'
  },
  { 
    name: 'American Express', 
    prefixes: ['34', '37'], 
    lengths: [15], 
    cvvLength: 4,
    color: 'from-green-600 to-green-800',
    brand: 'AMEX'
  },
  { 
    name: 'Discover', 
    prefixes: ['6011', '622126', '622127', '622128', '622129', '622130', '622131', '622132', '622133', '622134', '622135', '622136', '622137', '622138', '622139', '62214', '62215', '62216', '62217', '62218', '62219', '6222', '6223', '6224', '6225', '6226', '6227', '6228', '6229', '62290', '62291', '62292', '62293', '62294', '62295', '62296', '62297', '62298', '62299', '623', '624', '625', '626', '627', '628', '629', '630', '631', '632', '633', '634', '635', '636', '637', '638', '639', '640', '641', '642', '643', '644', '645', '646', '647', '648', '649', '650', '651', '652', '653', '654', '655', '656', '657', '658', '659', '660', '661', '662', '663', '664', '665', '666', '667', '668', '669', '670', '671', '672', '673', '674', '675', '676', '677', '678', '679', '680', '681', '682', '683', '684', '685', '686', '687', '688', '689', '690', '691', '692', '693', '694', '695', '696', '697', '698', '699', '700', '701', '702', '703', '704', '705', '706', '707', '708', '709', '710', '711', '712', '713', '714', '715', '716', '717', '718', '719', '720', '721'], 
    lengths: [16, 17, 18, 19], 
    cvvLength: 3,
    color: 'from-purple-600 to-purple-800',
    brand: 'DISCOVER'
  },
  { 
    name: 'JCB', 
    prefixes: ['3528', '3529', '3530', '3531', '3532', '3533', '3534', '3535', '3536', '3537', '3538', '3539', '3540', '3541', '3542', '3543', '3544', '3545', '3546', '3547', '3548', '3549', '3550', '3551', '3552', '3553', '3554', '3555', '3556', '3557', '3558', '3589', '3590', '3591', '3592', '3593', '3594', '3595', '3596', '3597', '3598', '3599'], 
    lengths: [16, 17, 18, 19], 
    cvvLength: 3,
    color: 'from-pink-600 to-pink-800',
    brand: 'JCB'
  },
  { 
    name: 'Diners Club', 
    prefixes: ['300', '301', '302', '303', '304', '305', '36', '38', '39'], 
    lengths: [14, 15, 16], 
    cvvLength: 3,
    color: 'from-orange-600 to-orange-800',
    brand: 'DINERS'
  },
  { 
    name: 'UnionPay', 
    prefixes: ['62'], 
    lengths: [16, 17, 18, 19], 
    cvvLength: 3,
    color: 'from-red-700 to-red-900',
    brand: 'UNIONPAY'
  }
];

export default function FakeCreditCardGenerator() {
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['Visa', 'Mastercard']);
  const [quantity, setQuantity] = useState(5);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const luhnCheck = (cardNumber: string): boolean => {
    let sum = 0;
    let isEven = false;
    
    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber[i]);
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    return sum % 10 === 0;
  };

  const generateCardNumber = useCallback((cardType: CardType): string => {
    const prefix = cardType.prefixes[Math.floor(Math.random() * cardType.prefixes.length)];
    const length = cardType.lengths[Math.floor(Math.random() * cardType.lengths.length)];
    
    let cardNumber = prefix;
    while (cardNumber.length < length - 1) {
      cardNumber += Math.floor(Math.random() * 10).toString();
    }
    
    // Calculate and add check digit
    let checkDigit = 0;
    while (!luhnCheck(cardNumber + checkDigit)) {
      checkDigit = (checkDigit + 1) % 10;
    }
    
    return cardNumber + checkDigit;
  }, []);

  const generateCVV = (length: number): string => {
    let cvv = '';
    for (let i = 0; i < length; i++) {
      cvv += Math.floor(Math.random() * 10).toString();
    }
    return cvv;
  };

  const generateExpiry = (): string => {
    const month = Math.floor(Math.random() * 12) + 1;
    const year = new Date().getFullYear() + Math.floor(Math.random() * 5) + 1;
    return `${month.toString().padStart(2, '0')}/${year.toString().slice(-2)}`;
  };

  const generateCards = useCallback(() => {
    const newCards: CreditCard[] = [];
    
    for (let i = 0; i < quantity; i++) {
      const cardType = cardTypes.find(type => selectedTypes.includes(type.name));
      if (!cardType) continue;
      
      const card: CreditCard = {
        id: `card-${Date.now()}-${i}`,
        type: cardType.name,
        number: generateCardNumber(cardType),
        cvv: generateCVV(cardType.cvvLength),
        expiry: generateExpiry(),
        brand: cardType.brand,
        color: cardType.color
      };
      
      newCards.push(card);
    }
    
    setCards(newCards);
  }, [selectedTypes, quantity, generateCardNumber]);

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      alert('Failed to copy to clipboard');
    }
  };

  const exportCards = (format: 'json' | 'csv' | 'text') => {
    if (cards.length === 0) return;
    
    let content = '';
    
    switch (format) {
      case 'json':
        content = JSON.stringify(cards, null, 2);
        break;
      case 'csv':
        content = 'Type,Number,CVV,Expiry,Brand\n';
        cards.forEach(card => {
          content += `"${card.type}","${card.number}","${card.cvv}","${card.expiry}","${card.brand}"\n`;
        });
        break;
      case 'text':
        cards.forEach(card => {
          content += `${card.type}: ${card.number} | CVV: ${card.cvv} | Expiry: ${card.expiry}\n`;
        });
        break;
    }
    
    const blob = new Blob([content], { type: format === 'json' ? 'application/json' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `credit-cards.${format === 'csv' ? 'csv' : format === 'json' ? 'json' : 'txt'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toggleCardType = (typeName: string) => {
    setSelectedTypes(prev => 
      prev.includes(typeName) 
        ? prev.filter(t => t !== typeName)
        : [...prev, typeName]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Fake Credit Card Generator
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Generate Luhn-validated test credit card numbers for development and testing. 
            Supporting 7 major card types with complete details including CVV and expiry dates.
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Card Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Card Types
              </label>
              <div className="grid grid-cols-2 gap-2">
                {cardTypes.map(type => (
                  <label key={type.name} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(type.name)}
                      onChange={() => toggleCardType(type.name)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{type.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Number of Cards
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={quantity}
                onChange={(e) => setQuantity(Math.min(50, Math.max(1, parseInt(e.target.value) || 1)))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Maximum 50 cards</p>
            </div>

            {/* Generate Button */}
            <div className="flex items-end">
              <button
                onClick={generateCards}
                disabled={selectedTypes.length === 0}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Generate Cards
              </button>
            </div>
          </div>
        </div>

        {/* Export Options */}
        {cards.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Options</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => exportCards('json')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Export JSON
              </button>
              <button
                onClick={() => exportCards('csv')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Export CSV
              </button>
              <button
                onClick={() => exportCards('text')}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Export Text
              </button>
            </div>
          </div>
        )}

        {/* Generated Cards */}
        {cards.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map(card => (
              <div key={card.id} className={`relative bg-gradient-to-br ${card.color} p-6 rounded-xl shadow-lg text-white`}>
                <div className="absolute top-4 right-4">
                  <span className="text-xs font-bold opacity-80">{card.brand}</span>
                </div>
                
                <div className="mb-6">
                  <div className="text-xl tracking-wider font-mono">
                    {card.number.match(/.{1,4}/g)?.join(' ')}
                  </div>
                </div>
                
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-xs opacity-80">VALID THRU</div>
                    <div className="font-mono">{card.expiry}</div>
                  </div>
                  <div>
                    <div className="text-xs opacity-80">CVV</div>
                    <div className="font-mono text-lg">{card.cvv}</div>
                  </div>
                </div>
                
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => copyToClipboard(card.number, card.id)}
                    className="flex-1 bg-white bg-opacity-20 backdrop-blur-sm px-3 py-2 rounded-lg text-sm hover:bg-opacity-30 transition-all"
                  >
                    {copiedId === card.id ? 'Copied!' : 'Copy Number'}
                  </button>
                  <button
                    onClick={() => copyToClipboard(card.cvv, `${card.id}-cvv`)}
                    className="flex-1 bg-white bg-opacity-20 backdrop-blur-sm px-3 py-2 rounded-lg text-sm hover:bg-opacity-30 transition-all"
                  >
                    {copiedId === `${card.id}-cvv` ? 'Copied!' : 'Copy CVV'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SEO Content */}
        <div className="mt-16 prose prose-lg max-w-none">
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">About Fake Credit Card Generator</h2>
            
            <p className="text-gray-700 mb-6">
              Our Fake Credit Card Generator is a comprehensive free tool for creating Luhn-validated test credit card numbers 
              for development and testing purposes. Perfect for developers, QA testers, and educators who need safe, 
              realistic test data—all processed securely in your browser.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-4">Common Use Cases</h3>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="text-green-600 font-bold mr-3">✓</span>
                  <div>
                    <strong>Payment Gateway Testing</strong>
                    <p className="text-gray-600 text-sm">Test payment form validation and checkout flows</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-green-600 font-bold mr-3">✓</span>
                  <div>
                    <strong>E-commerce Development</strong>
                    <p className="text-gray-600 text-sm">Develop shopping carts and payment systems</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-green-600 font-bold mr-3">✓</span>
                  <div>
                    <strong>QA & Automation Testing</strong>
                    <p className="text-gray-600 text-sm">Create automated test suites for payment forms</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="text-green-600 font-bold mr-3">✓</span>
                  <div>
                    <strong>Form Validation Testing</strong>
                    <p className="text-gray-600 text-sm">Test credit card input fields and validation</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-green-600 font-bold mr-3">✓</span>
                  <div>
                    <strong>Educational Purposes</strong>
                    <p className="text-gray-600 text-sm">Teach payment processing concepts</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-green-600 font-bold mr-3">✓</span>
                  <div>
                    <strong>API Development</strong>
                    <p className="text-gray-600 text-sm">Test payment APIs and billing systems</p>
                  </div>
                </div>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-4">Why Choose Our Generator?</h3>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="text-blue-600 font-bold mr-3">✓</span>
                  <div>
                    <strong>7 Card Types Supported</strong>
                    <p className="text-gray-600 text-sm">Visa, Mastercard, Amex, Discover, JCB, Diners Club, UnionPay</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-600 font-bold mr-3">✓</span>
                  <div>
                    <strong>Luhn Algorithm Validated</strong>
                    <p className="text-gray-600 text-sm">All numbers pass checksum validation like real cards</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-600 font-bold mr-3">✓</span>
                  <div>
                    <strong>Complete Card Details</strong>
                    <p className="text-gray-600 text-sm">Includes number, CVV, and future expiry dates</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="text-blue-600 font-bold mr-3">✓</span>
                  <div>
                    <strong>Bulk Generation</strong>
                    <p className="text-gray-600 text-sm">Generate up to 50 cards at once for testing</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-600 font-bold mr-3">✓</span>
                  <div>
                    <strong>Multiple Export Formats</strong>
                    <p className="text-gray-600 text-sm">JSON, CSV, and plain text export options</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-600 font-bold mr-3">✓</span>
                  <div>
                    <strong>Privacy & Security</strong>
                    <p className="text-gray-600 text-sm">All processing happens in your browser</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
              <h4 className="text-lg font-semibold text-yellow-800 mb-2">Important Disclaimer</h4>
              <p className="text-yellow-700">
                These are FAKE credit card numbers for TESTING purposes only. They cannot be used for actual purchases. 
                Any attempt to use these numbers for fraudulent activities is illegal and prohibited. 
                Use responsibly for development, testing, and educational purposes only.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
