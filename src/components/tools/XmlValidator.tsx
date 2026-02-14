'use client';

import { useState } from 'react';
import { Copy, Trash2, CheckCircle, AlertCircle, FileCode, Minimize, Maximize } from 'lucide-react';

export default function XmlValidator() {
    const [input, setInput] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isValid, setIsValid] = useState<boolean | null>(null);
    const [copied, setCopied] = useState(false);

    // Helper to format XML
    const formatXml = (xml: string) => {
        let result = '';
        const output = xml.replace(/>\s*</g, '><'); // remove whitespace between tags
        let pad = 0;

        output.split(/(<[^>]+>)/).forEach(token => {
            if (token.trim() === '') return;

            const modifiedToken = token;
            let indentLevel = 0;

            if (modifiedToken.match(/^<\//)) {
                pad -= 1;
            } else if (modifiedToken.match(/^<[^/].*\/>$/) || modifiedToken.match(/^<\?/)) {
                // self closing or declaration
            } else if (modifiedToken.match(/^<[^/]/)) {
                indentLevel = 1;
            }

            const padding = new Array(Math.max(0, pad)).fill('  ').join('');
            result += padding + modifiedToken + '\n';
            pad += indentLevel;
        });

        return result.trim();
    };

    const validate = () => {
        if (!input.trim()) {
            setError('Please enter XML to validate');
            setIsValid(false);
            return;
        }

        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(input, 'application/xml');
            const parseError = doc.querySelector('parsererror');

            if (parseError) {
                setIsValid(false);
                setError(parseError.textContent || 'Invalid XML format');
            } else {
                setIsValid(true);
                setError(null);
            }
        } catch {
            setIsValid(false);
            setError('An error occurred during parsing');
        }
    };

    const handleFormat = () => {
        if (!input) return;
        try {
            const formatted = formatXml(input);
            setInput(formatted);
            validate();
        } catch {
            setError("Could not format. XML might be invalid.");
        }
    };

    const handleMinify = () => {
        if (!input) return;
        const minified = input.replace(/>\s+</g, '><').trim();
        setInput(minified);
        validate();
    };

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(input);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-8">
            {/* Tool Card */}
            <div className="bg-white rounded-2xl p-6 md:p-8 border-2 border-gray-100 shadow-xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <FileCode className="text-orange-500" /> XML Validator
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={validate}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                        >
                            Validate
                        </button>
                        <button
                            onClick={handleFormat}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            <Maximize size={16} /> Beautify
                        </button>
                        <button
                            onClick={handleMinify}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            <Minimize size={16} /> Minify
                        </button>
                        <button
                            onClick={() => setInput('')}
                            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                        >
                            <Trash2 size={16} /> Clear
                        </button>
                    </div>
                </div>

                <div className="relative">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Paste your XML code here..."
                        className={`w-full h-96 p-4 font-mono text-sm bg-gray-50 border-2 rounded-xl focus:ring-0 transition-colors resize-y ${isValid === true ? 'border-green-500 focus:border-green-600' :
                            isValid === false ? 'border-red-500 focus:border-red-600' :
                                'border-gray-200 focus:border-blue-500'
                            }`}
                    />
                    {input && (
                        <button
                            onClick={copyToClipboard}
                            className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors"
                            title="Copy to clipboard"
                        >
                            {copied ? <CheckCircle size={18} className="text-green-500" /> : <Copy size={18} />}
                        </button>
                    )}
                </div>

                {/* Status Bar */}
                <div className="mt-4 flex items-start gap-3">
                    {isValid === true && (
                        <div className="flex items-center gap-2 text-green-600 font-medium bg-green-50 px-4 py-2 rounded-lg w-full">
                            <CheckCircle size={20} />
                            Valid XML Format
                        </div>
                    )}
                    {isValid === false && (
                        <div className="flex items-center gap-2 text-red-600 font-medium bg-red-50 px-4 py-2 rounded-lg w-full">
                            <AlertCircle size={20} />
                            {error}
                        </div>
                    )}
                    {isValid === null && (
                        <div className="text-gray-500 text-sm px-2">
                            Enter XML to validate syntax and structure.
                        </div>
                    )}
                </div>
            </div>

            {/* SEO Content */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-8 border border-orange-100 prose prose-lg max-w-none">
                <h2 className="text-orange-900">Free Online XML Validator & Formatter</h2>
                <p>
                    Need to check your XML files for syntax errors? Our free XML Validator instantly checks for well-formedness and potential issues.
                    It also works as an XML Beautifier (Prettifier) to make ugly, minified XML code readable again.
                </p>

                <h3>What is XML?</h3>
                <p>
                    XML (eXtensible Markup Language) is a markup language similar to HTML but designed to store and transport data.
                    It&apos;s self-descriptive and valid XML must follow strict syntax rules, such as properly nested tags and a single root element.
                </p>

                <h3>Features</h3>
                <ul>
                    <li><strong>Validate:</strong> Checks for syntax errors like unclosed tags or improper nesting.</li>
                    <li><strong>Beautify:</strong> Indents your code to make it human-readable.</li>
                    <li><strong>Minify:</strong> Removes whitespace to reduce file size for transport.</li>
                </ul>
            </div>
        </div>
    );
}
