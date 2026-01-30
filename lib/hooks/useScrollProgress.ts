import { useState, useEffect } from 'react';

export function useScrollProgress(): number {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const updateProgress = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollProgress = docHeight > 0 ? scrollTop / docHeight : 0;
            setProgress(Math.max(0, Math.min(1, scrollProgress)));
        };

        updateProgress();
        window.addEventListener('scroll', updateProgress);
        window.addEventListener('resize', updateProgress);

        return () => {
            window.removeEventListener('scroll', updateProgress);
            window.removeEventListener('resize', updateProgress);
        };
    }, []);

    return progress;
}
