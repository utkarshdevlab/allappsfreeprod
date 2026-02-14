'use client';

import { useState } from 'react';

const LOREM_TEXT = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?`;

export default function LoremIpsumGenerator() {
    const [count, setCount] = useState(5);
    const [type, setType] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
    const [startWithLorem, setStartWithLorem] = useState(true);
    const [generatedText, setGeneratedText] = useState('');
    const [copied, setCopied] = useState(false);

    const generateLorem = () => {
        let result = '';
        const cleanLorem = LOREM_TEXT.replace(/\n/g, ' ');

        if (type === 'paragraphs') {
            const paragraphs = LOREM_TEXT.split('\n');
            const loopedParagraphs = [];
            for (let i = 0; i < count; i++) {
                loopedParagraphs.push(paragraphs[i % paragraphs.length]);
            }
            result = loopedParagraphs.join('\n\n');
        } else if (type === 'sentences') {
            const sentences = cleanLorem.match(/[^.!?]+[.!?]+/g) || [];
            const loopedSentences = [];
            for (let i = 0; i < count; i++) {
                loopedSentences.push(sentences[i % sentences.length].trim());
            }
            result = loopedSentences.join(' ');
        } else {
            const words = cleanLorem.replace(/[.,]/g, '').split(' ');
            const loopedWords = [];
            for (let i = 0; i < count; i++) {
                loopedWords.push(words[i % words.length]);
            }
            result = loopedWords.join(' ');
        }

        if (startWithLorem && !result.startsWith('Lorem ipsum') && type !== 'words') {
            // Ideally we just ensure the first chunk is the standard start if requested
            // For simplicity, we assume the first paragraph starts with it.
        }

        // Simple logic override to ensure "Lorem ipsum" start if requested
        if (startWithLorem && !result.startsWith("Lorem ipsum")) {
            const standardStart = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ";
            if (type === 'words') {
                // Replace first few words
                const words = result.split(' ');
                words.splice(0, 8, ...standardStart.replace(/[.,]/g, '').split(' '));
                result = words.slice(0, count).join(' ');
            } else {
                result = standardStart + result;
            }
        }

        setGeneratedText(result);
        setCopied(false);
    };

    const handleCopy = () => {
        if (!generatedText) return;
        navigator.clipboard.writeText(generatedText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Initial generation
    useState(() => {
        generateLorem();
    });

    return (
        <div className="space-y-6">
            {/* Main Tool Card */}
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 shadow-xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Lorem Ipsum Generator</h2>
                <div className="space-y-8">
                    {/* Controls */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Generate By</label>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value as 'paragraphs' | 'sentences' | 'words')}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            >
                                <option value="paragraphs">Paragraphs</option>
                                <option value="sentences">Sentences</option>
                                <option value="words">Words</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Count</label>
                            <input
                                type="number"
                                min="1"
                                max="100"
                                value={count}
                                onChange={(e) => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>
                        <div className="flex items-end pb-3">
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={startWithLorem}
                                    onChange={(e) => setStartWithLorem(e.target.checked)}
                                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 transition-all"
                                />
                                <span className="text-gray-700 font-medium">Start with &quot;Lorem ipsum...&quot;</span>
                            </label>
                        </div>
                    </div>

                    {/* Output Area */}
                    <div className="relative">
                        <div className="bg-gray-50 rounded-xl border-2 border-gray-200 p-6 min-h-[200px] max-h-[500px] overflow-y-auto text-gray-700 leading-relaxed text-lg">
                            {generatedText ? (
                                type === 'paragraphs' ? (
                                    generatedText.split('\n\n').map((para, i) => (
                                        <p key={i} className="mb-4 last:mb-0">{para}</p>
                                    ))
                                ) : (
                                    <p>{generatedText}</p>
                                )
                            ) : (
                                <span className="text-gray-400 italic">Generated text will appear here...</span>
                            )}
                        </div>
                        <button
                            onClick={handleCopy}
                            className={`absolute top-4 right-4 px-4 py-2 rounded-lg text-sm font-bold text-white shadow-sm transition-all transform hover:-translate-y-0.5 ${copied
                                ? 'bg-green-600 hover:bg-green-700'
                                : 'bg-gray-800 hover:bg-gray-900 opacity-80 hover:opacity-100'}`}
                        >
                            {copied ? 'Copied!' : 'Copy Text'}
                        </button>
                    </div>

                    {/* Generate Button (Optional as it auto-updates, but good for UX) */}
                    <button
                        onClick={generateLorem}
                        className="w-full py-4 rounded-xl font-bold text-white text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 transition-all shadow-md transform hover:-translate-y-0.5"
                    >
                        Regenerate Text
                    </button>
                </div>
            </div>

            {/* Standardized SEO Content */}
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 border border-gray-200 prose prose-lg max-w-none">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">The Ultimate Lorem Ipsum Guide</h2>

                <h3 className="text-2xl font-bold text-gray-900 mb-4">What is Lorem Ipsum?</h3>
                <p className="text-gray-700 mb-6">
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. It has been the industry&apos;s standard filler text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries but also the leap into electronic typesetting, remaining essentially unchanged.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mb-4">Why Do We Use It?</h3>
                <p className="text-gray-700 mb-6">
                    It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using &apos;Content here, content here&apos;, making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mb-4">Where Does It Come From?</h3>
                <p className="text-gray-700 mb-6">
                    Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.
                </p>

                <div className="grid md:grid-cols-2 gap-6 my-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h4 className="font-semibold text-gray-900 mb-2">🎨 For Designers</h4>
                        <p className="text-gray-600 text-sm">Fill your mockups with realistic-looking text to showcase layout and typography without distractions.</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h4 className="font-semibold text-gray-900 mb-2">💻 For Developers</h4>
                        <p className="text-gray-600 text-sm">Quickly populate your databases or UI components with variable-length content for testing.</p>
                    </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h3>
                <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Is Lorem Ipsum readable?</h4>
                        <p className="text-gray-700">No, it is intentionally designed to be nonsensical so that viewers focus on the design rather than the meaning of the content.</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Does it mean anything?</h4>
                        <p className="text-gray-700">It is derived from Cicero&apos;s &quot;De Finibus Bonorum et Malorum&quot; (The Extremes of Good and Evil), but the words have been scrambled and altered to lose their original meaning.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
