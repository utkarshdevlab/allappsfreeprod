'use client';

import { useState } from 'react';
import { Copy, Trash2, CheckCircle, AlertCircle, FileJson, Minimize, Maximize } from 'lucide-react';

export default function JsonBeautifier() {
    const [input, setInput] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isValid, setIsValid] = useState<boolean | null>(null);
    const [copied, setCopied] = useState(false);

    const validate = (jsonString: string): boolean => {
        try {
            JSON.parse(jsonString);
            setIsValid(true);
            setError(null);
            return true;
        } catch (err: unknown) {
            setIsValid(false);
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Invalid JSON');
            }
            return false;
        }
    };

    const handleFormat = (spaces: number) => {
        if (!input.trim()) return;
        try {
            const parsed = JSON.parse(input);
            setInput(JSON.stringify(parsed, null, spaces));
            setIsValid(true);
            setError(null);
        } catch (err: unknown) {
            setIsValid(false);
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Invalid JSON');
            }
        }
    };

    const handleMinify = () => {
        if (!input.trim()) return;
        try {
            const parsed = JSON.parse(input);
            setInput(JSON.stringify(parsed));
            setIsValid(true);
            setError(null);
        } catch (err: unknown) {
            setIsValid(false);
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Invalid JSON');
            }
        }
    };

    const handleChange = (val: string) => {
        setInput(val);
        if (val.trim()) validate(val);
        else {
            setIsValid(null);
            setError(null);
        }
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
                        <FileJson className="text-blue-500" /> JSON Beautifier
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => handleFormat(2)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                        >
                            <Maximize size={16} /> 2 Spaces
                        </button>
                        <button
                            onClick={() => handleFormat(4)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 font-medium transition-colors"
                        >
                            <Maximize size={16} /> 4 Spaces
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
                        onChange={(e) => handleChange(e.target.value)}
                        placeholder="Paste your JSON here..."
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
                            Valid JSON Format
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
                            Enter JSON to validate syntax and structure.
                        </div>
                    )}
                </div>
            </div>

            {/* SEO Content */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-100 prose prose-lg max-w-none">
                <h2 className="text-blue-900">Online JSON Formatter & Validator</h2>
                <p>
                    JSON (JavaScript Object Notation) is a lightweight data-interchange format.
                    It&apos;s easy for humans to read and write, and easy for machines to parse and generate.
                </p>

                <h3>Features</h3>
                <ul>
                    <li><strong>Beautify:</strong> Proper indentation (2 or 4 spaces) makes complex JSON structures readable.</li>
                    <li><strong>Minify:</strong> Remove all spaces and line breaks to compress the JSON for transmission.</li>
                    <li><strong>Validate:</strong> Instantly check if your JSON is valid and see exactly where the syntax error is.</li>
                </ul>

                <h3>Common JSON Errors</h3>
                <p>
                    Unlike JavaScript objects, JSON keys must be double-quoted. Trailing commas are also not allowed in standard JSON.
                    Our validator will catch these issues for you.
                </p>
            </div>
        </div>
    );
}
