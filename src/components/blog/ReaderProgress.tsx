'use client';

import { useEffect, useState } from 'react';

export default function ReaderProgress() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const updateProgress = () => {
            const currentScrollY = window.scrollY;
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (totalHeight > 0) {
                const percentage = (currentScrollY / totalHeight) * 100;
                setProgress(percentage);
            }
        };

        window.addEventListener('scroll', updateProgress);
        return () => window.removeEventListener('scroll', updateProgress);
    }, []);

    return (
        <div className="fixed top-0 left-0 w-full h-1.5 z-[100] bg-gray-100/50 backdrop-blur-sm pointer-events-none">
            <div
                className="h-full bg-blue-600 transition-all duration-150 ease-out"
                style={{ width: `${progress}%` }}
            ></div>
        </div>
    );
}
