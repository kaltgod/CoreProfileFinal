import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const media = window.matchMedia(query);

        // Устанавливаем начальное значение
        setMatches(media.matches);

        // Создаем обработчик изменений
        const listener = (event: MediaQueryListEvent) => {
            setMatches(event.matches);
        };

        // Добавляем слушатель
        media.addEventListener('change', listener);

        // Очистка
        return () => media.removeEventListener('change', listener);
    }, [query]);

    return matches;
}

export function useIsMobile(): boolean {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            const userAgent = navigator.userAgent;
            const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
            const isTouchDevice = 'ontouchstart' in window;
            const isSmallScreen = window.innerWidth <= 768;

            setIsMobile(mobileRegex.test(userAgent) || (isSmallScreen && isTouchDevice));
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return isMobile;
}
