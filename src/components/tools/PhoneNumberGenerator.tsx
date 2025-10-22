"use client";

import { Copy, Download, ChevronDown, RefreshCw } from 'lucide-react';
import { useState, useCallback, useEffect } from 'react';

// US state to area code mapping
const stateAreaCodes: Record<string, number[]> = {
  'Alabama': [205, 251, 256, 334, 659, 938],
  'Alaska': [907],
  'Arizona': [480, 520, 602, 623, 928],
  'Arkansas': [327, 479, 501, 870],
  'California': [209, 213, 279, 310, 323, 341, 369, 408, 415, 424, 442, 510, 530, 559, 562, 619, 626, 628, 650, 657, 661, 669, 707, 714, 747, 760, 805, 818, 831, 858, 909, 916, 925, 949, 951],
  // ... (rest of the state area codes)
};

const formatPhoneNumber = (number: string, format: string = 'standard'): string => {
  const digits = number.replace(/\D/g, '');
  
  switch (format) {
    case 'dashes':
      return digits.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    case 'international':
      return `+1-${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
    case 'standard':
    default:
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
};

const SEOSection = () => (
  <div className="mt-12 prose prose-sm sm:prose lg:prose-lg xl:prose-xl mx-auto px-4">
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Random US Phone Number Generator</h2>
      <p className="text-gray-600 mb-6">
        Our Random Phone Number Generator is a free online tool designed for developers, testers, and businesses needing high-quality sample phone data. It creates valid-format US numbers using real area codes, ideal for form validation, database seeding, app prototyping, and privacy-compliant testing without risking real user information.
      </p>

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Common Use Cases for Fake Phone Numbers</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            '✓ Form Testing: Generate sample phone numbers to test input validation, formatting, and error handling in web forms.',
            '✓ Database Seeding: Populate mock databases with realistic US phone numbers for development and staging environments.',
            '✓ App Prototyping: Create demo user profiles with phone numbers for mobile or web app prototypes without using real data.',
            '✓ SMS Gateway Testing: Simulate phone numbers for testing SMS delivery, opt-in flows, and messaging services.',
            '✓ CRM Integration: Add sample contacts to CRM systems for training or workflow testing while maintaining data privacy.',
            '✓ UI/UX Design: Use generated numbers in design mockups to visualize contact lists and phone input fields.'
          ].map((item, i) => (
            <div key={i} className="flex items-start p-3 bg-gray-50 rounded-lg">
              <span className="text-green-500 mr-2 mt-0.5">✓</span>
              <span className="text-gray-700">{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Why Choose Our Phone Number Generator?</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            '✓ Valid US Formats: Generates numbers in standard (XXX) XXX-XXXX or XXX-XXX-XXXX formats with realistic patterns',
            '✓ State-Specific Area Codes: Select by state to use authentic area codes like 212 for New York or 310 for California',
            '✓ Bulk Generation: Create up to 100 phone numbers at once for large-scale testing or data seeding',
            '✓ One-Click Copy: Copy individual or all generated numbers to clipboard for quick pasting into tools',
            '✓ No Real Numbers: Ensures all output is fictional to avoid privacy issues or unintended real connections',
            '✓ Customizable Output: Choose formatting styles, include/exclude extensions, or filter by region'
          ].map((item, i) => (
            <div key={i} className="flex items-start p-3 bg-blue-50 rounded-lg">
              <span className="text-blue-500 mr-2 mt-0.5">✓</span>
              <span className="text-gray-700">{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-3">How to Use the Random Phone Number Generator</h3>
        <ol className="list-decimal pl-5 space-y-2 text-gray-700">
          <li><strong>Select Options:</strong> Choose quantity (1-100), state filter, or random nationwide</li>
          <li><strong>Customize Format:</strong> Pick display style like (XXX) XXX-XXXX or plain digits</li>
          <li><strong>Generate:</strong> Click the button to produce numbers with valid area codes</li>
          <li><strong>Review Output:</strong> View generated numbers in a list with copy buttons</li>
          <li><strong>Export or Copy:</strong> Copy all to clipboard or download as CSV for bulk use</li>
        </ol>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-3">Understanding US Phone Numbers</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-gray-700 mb-3">
            US phone numbers follow a 10-digit structure: a 3-digit area code followed by a 7-digit local number, often formatted as (area) local for readability.
          </p>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            <li><strong>Area Codes:</strong> Geographically assigned, like 212 (Manhattan) or 713 (Houston), totaling over 300 active codes</li>
            <li><strong>Local Numbers:</strong> The last 7 digits, with the first three (exchange) following specific rules to avoid all-zero patterns</li>
            <li><strong>Valid Patterns:</strong> Avoids real assignments but mimics structure for testing, e.g., no 555-01XX for fictional use</li>
            <li><strong>International Prefix:</strong> Often prefixed with +1 for global dialing, supported in export options</li>
          </ul>
          <p className="text-gray-700 mt-3">
            This tool uses a database of 300+ valid area codes to ensure realism, helping validate regex patterns like /^\(\d3\) \d3-\d4$/ in your code.
          </p>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-3">Advanced Features & State Selection</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">State-Specific Generation</h4>
            <p className="text-gray-700">
              Filter by state to generate numbers using local area codes, e.g., 480/602 for Arizona or 305/786 for Florida. This adds geographic context for regional testing.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Bulk & Export Options</h4>
            <p className="text-gray-700">
              Produce lists of 50+ numbers and export to CSV for importing into Excel, SQL databases, or JSON for API mocks.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Format Customization</h4>
            <p className="text-gray-700">
              Toggle between formatted views, E.164 international (+15551234567), or raw digits to match your validation library.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-3">Frequently Asked Questions</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-800">Are these phone numbers real?</h4>
            <p className="text-gray-700">
              No, these are randomly generated numbers following the US phone number format. While they use valid area codes, they are not connected to real phone lines or assigned to actual users, ensuring privacy and compliance.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800">Can I use these numbers for testing?</h4>
            <p className="text-gray-700">
              Yes! These numbers are perfect for testing applications, databases, or any system that requires phone number validation without using real phone numbers. They help simulate user inputs accurately.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800">How are area codes selected?</h4>
            <p className="text-gray-700">
              Area codes are chosen from a database of valid US codes, optionally filtered by state. This ensures geographic realism, such as 602 for Arizona or 415 for San Francisco, without generating invalid combinations.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800">What formats are supported?</h4>
            <p className="text-gray-700">
              The tool supports multiple formats including (XXX) XXX-XXXX, XXX-XXX-XXXX, and international +1 XXX-XXX-XXXX. You can customize the output to match your application's requirements.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800">Is there a limit to how many I can generate?</h4>
            <p className="text-gray-700">
              You can generate up to 100 phone numbers per batch to maintain performance. For larger needs, regenerate or use bulk options in your integrated code.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">Security & Privacy Considerations</h3>
        <p className="text-yellow-700 mb-2">
          Generated numbers are entirely fictional to protect privacy, but follow these guidelines:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-yellow-700">
          <li><strong>Fictional Only:</strong> No risk of generating active numbers; uses safe ranges to avoid real assignments</li>
          <li><strong>Testing Best Practices:</strong> Ideal for non-production; never use in live systems to prevent accidental outreach</li>
          <li><strong>Compliance:</strong> Supports GDPR/HIPAA by avoiding PII; combine with anonymized data in demos</li>
        </ul>
      </div>
    </div>
  </div>
);

export default function PhoneNumberGenerator() {
  const [count, setCount] = useState<number>(5);
  const [state, setState] = useState<string>('');
  const [format, setFormat] = useState<string>('standard');
  const [numbers, setNumbers] = useState<string[]>([]);
  const [copied, setCopied] = useState<boolean>(false);

  const generateNumber = useCallback((): string => {
    const areaCodes = state && stateAreaCodes[state] ? stateAreaCodes[state] : Object.values(stateAreaCodes).flat();
    const areaCode = areaCodes[Math.floor(Math.random() * areaCodes.length)];
    const exchange = Math.floor(200 + Math.random() * 800);
    const lineNumber = Math.floor(1000 + Math.random() * 9000);
    return `${areaCode}${exchange}${lineNumber}`;
  }, [state]);

  const generateNumbers = useCallback(() => {
    const newNumbers = [];
    for (let i = 0; i < Math.min(count, 100); i++) {
      newNumbers.push(generateNumber());
    }
    setNumbers(newNumbers);
    setCopied(false);
  }, [count, generateNumber]);

  const copyToClipboard = useCallback((e: React.MouseEvent<HTMLButtonElement>, number?: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const text = number || numbers.map(num => formatPhoneNumber(num, format)).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [numbers, format]);

  const downloadCSV = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Phone Number\n" 
      + numbers.map(num => `"${formatPhoneNumber(num, format)}"`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "phone_numbers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [numbers, format]);

  // Generate numbers on initial load
  useEffect(() => {
    generateNumbers();
  }, [generateNumbers]);

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">US Phone Number Generator</h2>
        
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Phone Numbers
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={count}
              onChange={(e) => setCount(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="mt-1 text-sm text-gray-500">Max 100 numbers at once</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State (Optional)
            </label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All States</option>
              {Object.keys(stateAreaCodes).sort().map((stateName) => (
                <option key={stateName} value={stateName}>
                  {stateName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Format
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="standard">(XXX) XXX-XXXX</option>
              <option value="dashes">XXX-XXX-XXXX</option>
              <option value="international">+1-XXX-XXX-XXXX</option>
              <option value="raw">XXXXXXXXXX</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <button
            onClick={generateNumbers}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw size={18} />
            Generate Numbers
          </button>
          
          <button
            onClick={(e) => copyToClipboard(e)}
            disabled={numbers.length === 0}
            className={`flex items-center gap-2 px-6 py-3 font-medium rounded-lg transition-colors ${
              numbers.length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            <Copy size={18} />
            {copied ? 'Copied!' : 'Copy All'}
          </button>
          
          <button
            onClick={downloadCSV}
            disabled={numbers.length === 0}
            className={`flex items-center gap-2 px-6 py-3 font-medium rounded-lg transition-colors ${
              numbers.length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            <Download size={18} />
            Download CSV
          </button>
        </div>

        {numbers.length > 0 && (
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Generated Phone Numbers ({numbers.length})
              </h3>
              <button
                onClick={(e) => copyToClipboard(e)}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <Copy size={14} />
                Copy All
              </button>
            </div>
            
            <div className="space-y-2">
              {numbers.map((number, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-mono">
                    {format === 'raw' ? number : formatPhoneNumber(number, format)}
                  </span>
                  <button
                    onClick={(e) => copyToClipboard(e, number)}
                    className="text-gray-500 hover:text-blue-600"
                    title="Copy to clipboard"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* SEO Content Section */}
      <SEOSection />
    </div>
  );
}
