'use client';

import { useState } from 'react';
import { SEOContent, UseCasesSection, FeaturesSection, FAQSection } from './SEOContent';

type CaseType = 'uppercase' | 'lowercase' | 'titleCase' | 'sentenceCase' | 'camelCase' | 'pascalCase' | 'kebabCase' | 'snakeCase' | 'alternatingCase';

export default function CaseConverter() {
    const [text, setText] = useState('');
    const [copied, setCopied] = useState(false);

    const convertCase = (type: CaseType) => {
        let result = '';
        const words = text.split(/[\s-_]+/);

        switch (type) {
            case 'uppercase':
                result = text.toUpperCase();
                break;
            case 'lowercase':
                result = text.toLowerCase();
                break;
            case 'titleCase':
                result = text.toLowerCase().replace(/(?:^|\s)\w/g, match => match.toUpperCase());
                break;
            case 'sentenceCase':
                result = text.toLowerCase().replace(/(^\w|\.\s+\w)/gm, match => match.toUpperCase());
                break;
            case 'camelCase':
                result = words
                    .map((word, index) => {
                        if (index === 0) return word.toLowerCase();
                        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
                    })
                    .join('');
                break;
            case 'pascalCase':
                result = words
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                    .join('');
                break;
            case 'kebabCase':
                result = words.join('-').toLowerCase();
                break;
            case 'snakeCase':
                result = words.join('_').toLowerCase();
                break;
            case 'alternatingCase':
                result = text.split('').map((char, i) => i % 2 === 0 ? char.toLowerCase() : char.toUpperCase()).join('');
                break;
        }
        setText(result);
    };

    const handleCopy = () => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };



    return (
        <div className="space-y-6">
            {/* Main Tool Card */}
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Case Converter</h2>
                <div className="p-6 md:p-8">
                    <textarea
                        className="w-full h-48 p-4 mb-6 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-y text-gray-800 placeholder-gray-400 text-lg"
                        placeholder="Type or paste your text here..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />

                    <div className="flex flex-wrap gap-3 mb-6">
                        {[
                            { id: 'uppercase', label: 'UPPERCASE' },
                            { id: 'lowercase', label: 'lowercase' },
                            { id: 'titleCase', label: 'Title Case' },
                            { id: 'sentenceCase', label: 'Sentence case' },
                            { id: 'camelCase', label: 'camelCase' },
                            { id: 'pascalCase', label: 'PascalCase' },
                            { id: 'kebabCase', label: 'kebab-case' },
                            { id: 'snakeCase', label: 'snake_case' },
                            { id: 'alternatingCase', label: 'aLtErNaTiNg' },
                        ].map((btn) => (
                            <button
                                key={btn.id}
                                onClick={() => convertCase(btn.id as CaseType)}
                                className="px-4 py-2 rounded-lg text-sm font-medium bg-white border border-gray-200 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-all shadow-sm"
                            >
                                {btn.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <button onClick={() => convertCase('uppercase')} className="px-4 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl font-medium text-gray-700 transition-all hover:shadow-md">
                        UPPERCASE
                    </button>
                    <button onClick={() => convertCase('lowercase')} className="px-4 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl font-medium text-gray-700 transition-all hover:shadow-md">
                        lowercase
                    </button>
                    <button onClick={() => convertCase('titleCase')} className="px-4 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl font-medium text-gray-700 transition-all hover:shadow-md">
                        Title Case
                    </button>
                    <button onClick={() => convertCase('sentenceCase')} className="px-4 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl font-medium text-gray-700 transition-all hover:shadow-md">
                        Sentence case
                    </button>
                    <button onClick={() => convertCase('camelCase')} className="px-4 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl font-medium text-gray-700 transition-all hover:shadow-md">
                        camelCase
                    </button>
                    <button onClick={() => convertCase('pascalCase')} className="px-4 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl font-medium text-gray-700 transition-all hover:shadow-md">
                        PascalCase
                    </button>
                    <button onClick={() => convertCase('kebabCase')} className="px-4 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl font-medium text-gray-700 transition-all hover:shadow-md">
                        kebab-case
                    </button>
                    <button onClick={() => convertCase('snakeCase')} className="px-4 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl font-medium text-gray-700 transition-all hover:shadow-md">
                        snake_case
                    </button>
                    <button onClick={() => convertCase('alternatingCase')} className="px-4 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl font-medium text-gray-700 transition-all hover:shadow-md">
                        aLtErNaTiNg
                    </button>
                </div>

                {/* Copy Button */}
                <button
                    onClick={handleCopy}
                    className={`w-full py-4 rounded-xl font-bold text-white text-lg transition-all shadow-md transform hover:-translate-y-0.5 ${copied
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90'
                        }`}
                >
                    {copied ? 'Copied to Clipboard!' : 'Copy to Clipboard'}
                </button>
            </div>

            {/* SEO Content Section */}
            <SEOContent title="Master Text Formats with Case Converter">
                <p>
                    In the digital world, specific case formats are often required for different purposes—programming variables need camelCase or snake_case, headlines need Title Case, and social media sometimes calls for UPPERCASE shouting. Manually converting text is tedious and error-prone. Our Case Converter tool automates this process instantly.
                </p>

                <UseCasesSection
                    title="Available Formats"
                    cases={[
                        { title: "Sentence case", description: "Capitalizes only the first letter of the first word. Ideal for standard sentences." },
                        { title: "lower case", description: "Converts all letters to lowercase. Useful for email addresses or tags." },
                        { title: "UPPER CASE", description: "CONVERTS ALL LETTERS TO UPPERCASE. GOOD FOR EMPHASIS OR ACRONYMS." },
                        { title: "Title Case", description: "Capitalizes the first letter of every major word. Perfect for blog titles and headers." },
                        { title: "camelCase", description: "Removes spaces and capitalizes words except the first. Standard in Java and JavaScript." },
                        { title: "snake_case", description: "Replaces spaces with underscores. Common in Python and database field names." }
                    ]}
                />

                <FeaturesSection
                    title="How to Use"
                    features={[
                        "Paste your text into the main text area.",
                        "Click one of the clearly labeled buttons to apply a format.",
                        "The text transforms instantly. Change your mind? Click another button!",
                        "Hit \"Copy to Clipboard\" to grab your formatted text."
                    ]}
                />

                <FAQSection
                    faqs={[
                        { question: "Will this preserve my original text?", answer: "The tool modifies the text in the box directly. We recommend keeping a backup if you are experimenting with large documents." },
                        { question: "Can I convert code snippets?", answer: "Yes, it works effectively for variable names and comments, making it a handy utility for programmers refactoring code styles." }
                    ]}
                />
            </SEOContent>
        </div>
    );
}
