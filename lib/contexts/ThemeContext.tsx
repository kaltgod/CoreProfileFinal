'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export type Theme = 'default' | 'cosmos' | 'underwater';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    isChangingTheme: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
    children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
    const [theme, setThemeState] = useState<Theme>('default');
    const [isChangingTheme, setIsChangingTheme] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Загружаем тему из localStorage при первом рендере
    useEffect(() => {
        const savedTheme = localStorage.getItem('selectedTheme') as Theme;
        if (savedTheme && ['default', 'cosmos', 'underwater'].includes(savedTheme)) {
            setThemeState(savedTheme);
        }
        setMounted(true);
    }, []);

    // Применяем класс темы к body
    useEffect(() => {
        if (!mounted) return;

        document.body.classList.remove('theme-default', 'theme-cosmos', 'theme-underwater');
        document.body.classList.add(`theme-${theme}`);
    }, [theme, mounted]);

    const setTheme = useCallback((newTheme: Theme) => {
        setIsChangingTheme(true);
        document.body.classList.add('changing-theme');

        setThemeState(newTheme);
        localStorage.setItem('selectedTheme', newTheme);

        // Убираем класс changing-theme после анимации
        setTimeout(() => {
            setIsChangingTheme(false);
            document.body.classList.remove('changing-theme');
        }, 150);
    }, []);

    // Предотвращаем SSR мигание
    if (!mounted) {
        return null;
    }

    return (
        <ThemeContext.Provider value={{ theme, setTheme, isChangingTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
