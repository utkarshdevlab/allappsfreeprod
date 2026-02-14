'use client';

import { useState } from 'react';





// wait, I can write the full MD5 implementation, it's about 200 lines. I will do that in a separate utils file if practical.
// For this single file component, I'll include a compact one.
// Re-writing the component to use a compact md5 function.

export default function Md5Generator() {
    const [input, setInput] = useState('');
    const [hash, setHash] = useState('');
    const [copied, setCopied] = useState(false);

    const calculateMD5 = (s: string) => {
        const k: number[] = [];
        let i = 0;

        for (i = 0; i < 64;) {
            k[i] = 0 | (Math.abs(Math.sin(++i)) * 4294967296);
        }

        const b: number[] = [];
        const h = [0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476];

        const str = unescape(encodeURIComponent(s));

        for (i = 0; i < str.length; i++) {
            b[i >> 2] |= str.charCodeAt(i) << (8 * (i % 4));
        }

        b[((str.length + 8) >> 6) * 16 + 14] = str.length * 8;

        const md5_cmn = (q: number, a: number, b: number, x: number, s: number, t: number) => {
            return ((a + q + x + t) & 0xffffffff) + b;
        };

        const md5_ff = (a: number, b: number, c: number, d: number, x: number, s: number, t: number) => {
            return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
        };

        const md5_gg = (a: number, b: number, c: number, d: number, x: number, s: number, t: number) => {
            return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
        };

        const md5_hh = (a: number, b: number, c: number, d: number, x: number, s: number, t: number) => {
            return md5_cmn(b ^ c ^ d, a, b, x, s, t);
        };

        const md5_ii = (a: number, b: number, c: number, d: number, x: number, s: number, t: number) => {
            return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
        };

        for (i = 0; i < b.length; i += 16) {
            let a = h[0];
            let bVal = h[1];
            let c = h[2];
            let d = h[3];

            a = md5_ff(a, bVal, c, d, b[i + 0] || 0, 7, -680876936);
            d = md5_ff(d, a, bVal, c, b[i + 1] || 0, 12, -389564586);
            c = md5_ff(c, d, a, bVal, b[i + 2] || 0, 17, 606105819);
            bVal = md5_ff(bVal, c, d, a, b[i + 3] || 0, 22, -1044525330);
            a = md5_ff(a, bVal, c, d, b[i + 4] || 0, 7, -176418897);
            d = md5_ff(d, a, bVal, c, b[i + 5] || 0, 12, 1200080426);
            c = md5_ff(c, d, a, bVal, b[i + 6] || 0, 17, -1473231341);
            bVal = md5_ff(bVal, c, d, a, b[i + 7] || 0, 22, -45705983);
            a = md5_ff(a, bVal, c, d, b[i + 8] || 0, 7, 1770035416);
            d = md5_ff(d, a, bVal, c, b[i + 9] || 0, 12, -1958414417);
            c = md5_ff(c, d, a, bVal, b[i + 10] || 0, 17, -42063);
            bVal = md5_ff(bVal, c, d, a, b[i + 11] || 0, 22, -1990404162);
            a = md5_ff(a, bVal, c, d, b[i + 12] || 0, 7, 1804603682);
            d = md5_ff(d, a, bVal, c, b[i + 13] || 0, 12, -40341101);
            c = md5_ff(c, d, a, bVal, b[i + 14] || 0, 17, -1502002290);
            bVal = md5_ff(bVal, c, d, a, b[i + 15] || 0, 22, 1236535329);

            a = md5_gg(a, bVal, c, d, b[i + 1] || 0, 5, -165796510);
            d = md5_gg(d, a, bVal, c, b[i + 6] || 0, 9, -1069501632);
            c = md5_gg(c, d, a, bVal, b[i + 11] || 0, 14, 643717713);
            bVal = md5_gg(bVal, c, d, a, b[i + 0] || 0, 20, -373897302);
            a = md5_gg(a, bVal, c, d, b[i + 5] || 0, 5, -701558691);
            d = md5_gg(d, a, bVal, c, b[i + 10] || 0, 9, 38016083);
            c = md5_gg(c, d, a, bVal, b[i + 15] || 0, 14, -660478335);
            bVal = md5_gg(bVal, c, d, a, b[i + 4] || 0, 20, -405537848);
            a = md5_gg(a, bVal, c, d, b[i + 9] || 0, 5, 568446438);
            d = md5_gg(d, a, bVal, c, b[i + 14] || 0, 9, -1019803690);
            c = md5_gg(c, d, a, bVal, b[i + 3] || 0, 14, -187363961);
            bVal = md5_gg(bVal, c, d, a, b[i + 8] || 0, 20, 1163531501);
            a = md5_gg(a, bVal, c, d, b[i + 13] || 0, 5, -1444681467);
            d = md5_gg(d, a, bVal, c, b[i + 2] || 0, 9, -51403784);
            c = md5_gg(c, d, a, bVal, b[i + 7] || 0, 14, 1735328473);
            bVal = md5_gg(bVal, c, d, a, b[i + 12] || 0, 20, -1926607734);

            a = md5_hh(a, bVal, c, d, b[i + 5] || 0, 4, -378558);
            d = md5_hh(d, a, bVal, c, b[i + 8] || 0, 11, -2022574463);
            c = md5_hh(c, d, a, bVal, b[i + 11] || 0, 16, 1839030562);
            bVal = md5_hh(bVal, c, d, a, b[i + 14] || 0, 23, -35309556);
            a = md5_hh(a, bVal, c, d, b[i + 1] || 0, 4, -1530992060);
            d = md5_hh(d, a, bVal, c, b[i + 4] || 0, 11, 1272893353);
            c = md5_hh(c, d, a, bVal, b[i + 7] || 0, 16, -155497632);
            bVal = md5_hh(bVal, c, d, a, b[i + 10] || 0, 23, -1094730640);
            a = md5_hh(a, bVal, c, d, b[i + 13] || 0, 4, 681279174);
            d = md5_hh(d, a, bVal, c, b[i + 0] || 0, 11, -358537222);
            c = md5_hh(c, d, a, bVal, b[i + 3] || 0, 16, -722521979);
            bVal = md5_hh(bVal, c, d, a, b[i + 6] || 0, 23, 76029189);
            a = md5_hh(a, bVal, c, d, b[i + 9] || 0, 4, -640364487);
            d = md5_hh(d, a, bVal, c, b[i + 12] || 0, 11, -421815835);
            c = md5_hh(c, d, a, bVal, b[i + 15] || 0, 16, 530742520);
            bVal = md5_hh(bVal, c, d, a, b[i + 2] || 0, 23, -995338651);

            a = md5_ii(a, bVal, c, d, b[i + 0] || 0, 6, -198630844);
            d = md5_ii(d, a, bVal, c, b[i + 7] || 0, 10, 1126891415);
            c = md5_ii(c, d, a, bVal, b[i + 14] || 0, 15, -1416354905);
            bVal = md5_ii(bVal, c, d, a, b[i + 5] || 0, 21, -57434055);
            a = md5_ii(a, bVal, c, d, b[i + 12] || 0, 6, 1700485571);
            d = md5_ii(d, a, bVal, c, b[i + 3] || 0, 10, -1894986606);
            c = md5_ii(c, d, a, bVal, b[i + 10] || 0, 15, -1051523);
            bVal = md5_ii(bVal, c, d, a, b[i + 1] || 0, 21, -2054922799);
            a = md5_ii(a, bVal, c, d, b[i + 8] || 0, 6, 1873313359);
            d = md5_ii(d, a, bVal, c, b[i + 15] || 0, 10, -30611744);
            c = md5_ii(c, d, a, bVal, b[i + 6] || 0, 15, -1560198380);
            bVal = md5_ii(bVal, c, d, a, b[i + 13] || 0, 21, 1309151649);
            a = md5_ii(a, bVal, c, d, b[i + 4] || 0, 6, -145523070);
            d = md5_ii(d, a, bVal, c, b[i + 11] || 0, 10, -1120210379);
            c = md5_ii(c, d, a, bVal, b[i + 2] || 0, 15, 718787259);
            bVal = md5_ii(bVal, c, d, a, b[i + 9] || 0, 21, -343485551);

            h[0] = (h[0] + a) | 0;
            h[1] = (h[1] + bVal) | 0;
            h[2] = (h[2] + c) | 0;
            h[3] = (h[3] + d) | 0;
        }

        return h.map(function (v) {
            return (("00000000" + (v >>> 0).toString(16)).slice(-8).match(/../g) || []).reverse().join("");
        }).join("");
    };

    const handleGenerate = (value: string) => {
        setInput(value);
        if (!value) {
            setHash('');
            return;
        }
        try {
            const calculatedInfo = calculateMD5(value);
            setHash(calculatedInfo);
            setCopied(false);
        } catch (e) {
            console.error(e);
            setHash('Error generating hash');
        }
    };

    const handleCopy = () => {
        if (hash) {
            navigator.clipboard.writeText(hash);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="space-y-6">
            {/* Main Tool Card */}
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">MD5 Hash Generator</h2>
                <div className="space-y-6">
                    <div>
                        <label htmlFor="input" className="block text-sm font-medium text-gray-700 mb-2">
                            Enter Text to Hash
                        </label>
                        <textarea
                            id="input"
                            rows={4}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Type or paste your content here..."
                            value={input}
                            onChange={(e) => handleGenerate(e.target.value)}
                        />
                    </div>

                    {hash && (
                        <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                MD5 Hash Result
                            </label>
                            <div className="flex flex-col md:flex-row gap-4 items-center">
                                <code className="flex-1 w-full bg-white px-4 py-3 rounded-lg border border-gray-300 font-mono text-gray-800 break-all shadow-sm">
                                    {hash}
                                </code>
                                <button
                                    onClick={handleCopy}
                                    className={`w-full md:w-auto px-6 py-3 rounded-xl font-bold text-white transition-all shadow-md transform hover:-translate-y-0.5 ${copied
                                        ? 'bg-green-600 hover:bg-green-700'
                                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90'
                                        }`}
                                >
                                    {copied ? 'Copied!' : 'Copy Hash'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Extensive SEO Content Section */}
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 border border-gray-200 prose prose-lg max-w-none">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Complete Guide to MD5 Hashing</h2>

                <h3 className="text-2xl font-bold text-gray-900 mb-4">What is an MD5 Hash?</h3>
                <p className="text-gray-700 mb-6">
                    MD5 (Message-Digest Algorithm 5) is a widely used cryptographic hash function that produces a 128-bit hash value. Typically expressed as a 32-digit hexadecimal number, MD5 is primarily used to verify data integrity. Steps to assist in ensuring that a file has remained unaltered during transfer (e.g., downloading a file from a server) often involve comparing the MD5 hash of the source file with that of the downloaded file.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mb-4">How to Use This Tool</h3>
                <ol className="list-decimal pl-6 text-gray-700 mb-6 space-y-2">
                    <li><strong>Enter Text</strong>: Type or paste your string into the input box above.</li>
                    <li><strong>Automatic Generation</strong>: The tool instantly calculates the hash as you type.</li>
                    <li><strong>Copy Result</strong>: Click the &quot;Copy Hash&quot; button to save the 32-character string to your clipboard.</li>
                </ol>

                <h3 className="text-2xl font-bold text-gray-900 mb-4">Key Features</h3>
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h4 className="font-semibold text-gray-900 mb-2">⚡ Instant Calculation</h4>
                        <p className="text-sm text-gray-600">Hashes are generated in real-time within your browser using optimized JavaScript.</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h4 className="font-semibold text-gray-900 mb-2">🔒 100% Secure</h4>
                        <p className="text-sm text-gray-600">Client-side processing means your sensitive data never leaves your device.</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h4 className="font-semibold text-gray-900 mb-2">📱 Fully Responsive</h4>
                        <p className="text-sm text-gray-600">Works perfectly on desktops, tablets, and mobile phones.</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h4 className="font-semibold text-gray-900 mb-2">📋 Easy Copy</h4>
                        <p className="text-sm text-gray-600">One-click copy functionality for improved workflow efficiency.</p>
                    </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h3>
                <div className="space-y-4 mb-8">
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Is MD5 reversible?</h4>
                        <p className="text-gray-700">No, MD5 is a one-way hash function. You cannot theoretically decrypt an MD5 hash to get the original text. However, &quot;rainbow tables&quot; can be used to look up hashes of common strings.</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Is MD5 secure for passwords?</h4>
                        <p className="text-gray-700">No. MD5 is considered cryptographically broken and vulnerable to collision attacks. For passwords, use stronger algorithms like bcrypt, Argon2, or SHA-256 with salt.</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Is there a limit to the text length?</h4>
                        <p className="text-gray-700">This tool runs in your browser, so it depends on your device&apos;s memory. Used reasonably, it can handle very large blocks of text effortlessly.</p>
                    </div>
                </div>

                <div className="mt-8 p-6 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-xl">
                    <h4 className="text-lg font-bold text-yellow-800 mb-2">⚠️ Security Notice</h4>
                    <p className="text-yellow-700">
                        While useful for checksums and data integrity, MD5 should <strong>not</strong> be used for hashing passwords or sensitive security tokens in modern applications due to collision vulnerabilities.
                    </p>
                </div>
            </div>
        </div>
    );
}
