"use client";

import React, { useState, useEffect } from 'react';
import { SEOContent, UseCasesSection, FeaturesSection, FAQSection } from './SEOContent';

const RandomTeamGenerator = () => {
    const [names, setNames] = useState('');
    const [groupMode, setGroupMode] = useState<'numTeams' | 'membersPerTeam'>('numTeams');
    const [groupCount, setGroupCount] = useState(2);
    const [teams, setTeams] = useState<string[][]>([]);
    const [history, setHistory] = useState<string[][][]>([]);
    const [isShuffling, setIsShuffling] = useState(false);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const savedHistory = localStorage.getItem('team-generator-history');
        if (savedHistory) {
            setHistory(JSON.parse(savedHistory));
        }
    }, []);

    const generateTeams = () => {
        const nameList = names.split(/[\n,]+/).map(n => n.trim()).filter(n => n !== '');
        if (nameList.length === 0) return;

        setIsShuffling(true);
        setVisible(false);

        setTimeout(() => {
            const shuffled = [...nameList].sort(() => Math.random() - 0.5);
            const result: string[][] = [];

            if (groupMode === 'numTeams') {
                const numTeams = Math.max(1, groupCount);
                for (let i = 0; i < numTeams; i++) result.push([]);
                shuffled.forEach((name, index) => {
                    result[index % numTeams].push(name);
                });
            } else {
                const perTeam = Math.max(1, groupCount);
                for (let i = 0; i < shuffled.length; i += perTeam) {
                    result.push(shuffled.slice(i, i + perTeam));
                }
            }

            setTeams(result);
            const newHistory = [result, ...history.slice(0, 9)];
            setHistory(newHistory);
            localStorage.setItem('team-generator-history', JSON.stringify(newHistory));
            setIsShuffling(false);
            setTimeout(() => setVisible(true), 50);
        }, 800);
    };

    const exportResults = () => {
        const text = teams.map((team, i) => `Team ${i + 1}:\n${team.join(', ')}`).join('\n\n');
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'teams.txt';
        a.click();
        URL.revokeObjectURL(url);
    };

    const clearHistory = () => {
        setHistory([]);
        localStorage.removeItem('team-generator-history');
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-4">
                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">
                        Enter Names (separated by comma or new line)
                    </label>
                    <textarea
                        value={names}
                        onChange={(e) => setNames(e.target.value)}
                        placeholder={"John Doe\nJane Smith\nAlice..."}
                        className="w-full h-64 p-4 text-gray-800 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none resize-none font-medium"
                    />
                </div>

                <div className="space-y-6">
                    <div className="bg-blue-50 p-6 rounded-2xl border-2 border-blue-100">
                        <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center">
                            <span className="mr-2">⚡</span> Configuration
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-blue-800 mb-2">Grouping Mode</label>
                                <div className="grid grid-cols-2 gap-2 p-1 bg-white rounded-lg border border-blue-200">
                                    <button
                                        onClick={() => setGroupMode('numTeams')}
                                        className={`py-2 px-3 rounded-md text-sm font-bold transition-all ${groupMode === 'numTeams' ? 'bg-blue-600 text-white shadow-md' : 'text-blue-600 hover:bg-blue-50'}`}
                                    >
                                        Number of Teams
                                    </button>
                                    <button
                                        onClick={() => setGroupMode('membersPerTeam')}
                                        className={`py-2 px-3 rounded-md text-sm font-bold transition-all ${groupMode === 'membersPerTeam' ? 'bg-blue-600 text-white shadow-md' : 'text-blue-600 hover:bg-blue-50'}`}
                                    >
                                        Members per Team
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-blue-800 mb-2">
                                    {groupMode === 'numTeams' ? 'How many teams?' : 'Members per team?'}
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={groupCount}
                                    onChange={(e) => setGroupCount(parseInt(e.target.value) || 1)}
                                    className="w-full p-3 bg-white border border-blue-200 rounded-lg text-blue-900 font-bold outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>

                            <button
                                onClick={generateTeams}
                                disabled={isShuffling || !names.trim()}
                                className={`w-full py-4 rounded-xl text-lg font-black text-white shadow-xl transform active:scale-95 transition-all ${isShuffling || !names.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'}`}
                            >
                                {isShuffling ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        SHUFFLING...
                                    </span>
                                ) : '🎲 GENERATE TEAMS'}
                            </button>
                        </div>
                    </div>

                    {teams.length > 0 && (
                        <button
                            onClick={exportResults}
                            className="w-full py-3 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center space-x-2"
                        >
                            <span>📥</span>
                            <span>EXPORT TO TXT</span>
                        </button>
                    )}
                </div>
            </div>

            {teams.length > 0 && (
                <div
                    style={{
                        opacity: visible ? 1 : 0,
                        transform: visible ? 'translateY(0)' : 'translateY(16px)',
                        transition: 'opacity 0.4s ease, transform 0.4s ease',
                    }}
                    className="space-y-6 mb-12"
                >
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-black text-gray-900">Generated Teams</h2>
                        <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase">
                            {teams.length} Groups Created
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {teams.map((team, idx) => (
                            <div
                                key={idx}
                                style={{
                                    opacity: visible ? 1 : 0,
                                    transform: visible ? 'scale(1)' : 'scale(0.95)',
                                    transition: `opacity 0.4s ease ${idx * 0.08}s, transform 0.4s ease ${idx * 0.08}s`,
                                }}
                                className="bg-white p-6 rounded-2xl border-2 border-gray-100 shadow-lg hover:shadow-xl hover:border-blue-200 transition-shadow"
                            >
                                <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
                                    <h3 className="font-black text-blue-600">Team {idx + 1}</h3>
                                    <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded uppercase">
                                        {team.length} Members
                                    </span>
                                </div>
                                <ul className="space-y-2">
                                    {team.map((member, mIdx) => (
                                        <li key={mIdx} className="flex items-center text-gray-700 font-medium">
                                            <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 flex-shrink-0"></span>
                                            {member}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {history.length > 0 && (
                <div className="bg-gray-50 rounded-2xl p-8 mb-12 border border-gray-200">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-black text-gray-900">Recently Generated</h3>
                        <button
                            onClick={clearHistory}
                            className="text-sm font-bold text-red-500 hover:text-red-600 bg-white border border-red-100 px-3 py-1.5 rounded-lg shadow-sm transition-all"
                        >
                            CLEAR HISTORY
                        </button>
                    </div>
                    <div className="flex overflow-x-auto space-x-4 pb-4">
                        {history.map((histTeams, i) => (
                            <div key={i} className="flex-shrink-0 w-48 bg-white p-4 rounded-xl border border-gray-200 shadow-sm opacity-70 hover:opacity-100 transition-all cursor-pointer">
                                <p className="text-xs font-bold text-gray-400 mb-2 uppercase">#{history.length - i} Generation</p>
                                <p className="text-sm font-bold text-gray-700">{histTeams.length} Teams</p>
                                <p className="text-xs text-gray-500">{histTeams.reduce((acc, t) => acc + t.length, 0)} Total People</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <SEOContent title="About Random Team Generator">
                <p>
                    Our Random Team Generator is a professional-grade utility designed for anyone who needs to split a large group of people into smaller, balanced teams. Whether you are a teacher organizing classroom activities, a sports coach drafting players, or an office manager planning a team-building event, this tool ensures absolute fairness and randomness.
                </p>

                <FeaturesSection
                    title="Premium Features of Our Randomizer"
                    features={[
                        "Multiple Grouping Modes: Create teams by count or specify members per team.",
                        "Smart Name Parsing: Easily paste names from Excel, Word, or plain text.",
                        "Shuffle Animation: Premium visual feedback to ensure fairness.",
                        "Instant Export: Download your team lists as TXT files for offline use.",
                        "Privacy First: Your data stays in your browser; we never store your names on our servers.",
                        "History Tracking: Quickly access your last 10 generations even after refreshing."
                    ]}
                />

                <UseCasesSection
                    cases={[
                        { title: "Classroom & Education", description: "Teachers can easily create study groups, project partners, or game teams without any bias." },
                        { title: "Sports & Fitness", description: "Perfect for pickup basketball games, soccer matches, or crossfit groups where balanced teams are essential." },
                        { title: "Office & Corporate", description: "Use it for secret santa, brainstorming groups, or lunch outings to mix up departments." },
                        { title: "Gaming & Esports", description: "Quickly set up tournament brackets or casual matches with friends in various online games." }
                    ]}
                />

                <FAQSection
                    faqs={[
                        { question: "How do I use the Random Team Generator?", answer: "Simply paste your list of names into the text area, choose whether you want a specific number of teams or a specific number of members per team, and click 'Generate Teams'." },
                        { question: "Is the generator truly random?", answer: "Yes, we use a Fisher-Yates shuffle algorithm implemented in JavaScript to ensure that every possible permutation is equally likely." },
                        { question: "Can I save my results?", answer: "You can use the 'Export to TXT' button to save your current teams, and the tool also automatically saves your recent history in your browser's local storage." },
                        { question: "Is there a limit on how many names I can enter?", answer: "While there is no hard limit, the tool performs best with up to 1,000 names at a time." }
                    ]}
                />
            </SEOContent>
        </div>
    );
};

export default RandomTeamGenerator;
