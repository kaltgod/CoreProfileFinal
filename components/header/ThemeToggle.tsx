'use client';

import { useState, useRef, useEffect } from 'react';
import { useTheme, Theme } from '@/lib/contexts/ThemeContext';
import { useLanguage } from '@/lib/contexts/LanguageContext';

const THEMES: { id: Theme; icon: string; ruName: string; enName: string }[] = [
    { id: 'default', icon: '🔢', ruName: 'Матрица', enName: 'Matrix' },
    { id: 'cosmos', icon: '🌌', ruName: 'Космос', enName: 'Cosmos' },
    { id: 'underwater', icon: '🌊', ruName: 'Океан', enName: 'Ocean' },
];

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const { language } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const currentTheme = THEMES.find(t => t.id === theme) || THEMES[0];
    const otherThemes = THEMES.filter(t => t.id !== theme);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false);
        };
        if (isOpen) document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    const handleThemeChange = (newTheme: Theme) => {
        setTheme(newTheme);
        setIsOpen(false);
    };

    const getButtonStyle = () => {
        switch (theme) {
            case 'cosmos':
                return {
                    background: 'rgba(176, 224, 230, 0.1)', // More transparent
                    border: '1px solid rgba(176, 224, 230, 0.3)', // Thinner, subtler border
                    color: '#b0e0e6',
                    textShadow: '0 0 6px rgba(176, 224, 230, 0.6)',
                };
            case 'underwater':
                return {
                    background: 'rgba(127, 181, 181, 0.1)',
                    border: '1px solid rgba(127, 181, 181, 0.3)',
                    color: '#7fb5b5',
                    textShadow: '0 0 6px rgba(127, 181, 181, 0.6)',
                };
            default:
                return {
                    background: 'rgba(0, 255, 0, 0.05)',
                    border: '1px solid rgba(0, 255, 0, 0.3)',
                    color: '#00ff00',
                    textShadow: '0 0 6px rgba(0, 255, 0, 0.6)',
                };
        }
    };

    const getDropdownStyle = () => {
        switch (theme) {
            case 'cosmos':
                return {
                    background: 'rgba(10, 10, 20, 0.95)',
                    border: '1.6px solid rgba(176, 224, 230, 0.3)',
                };
            case 'underwater':
                return {
                    background: 'rgba(10, 20, 30, 0.95)',
                    border: '1.6px solid rgba(127, 181, 181, 0.3)',
                };
            default:
                return {
                    background: 'rgba(10, 10, 20, 0.95)',
                    border: '1.6px solid rgba(0, 255, 0, 0.3)',
                };
        }
    };

    const buttonStyle = getButtonStyle();
    const dropdownStyle = getDropdownStyle();

    return (
        <div ref={dropdownRef} className="theme-toggle-container relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="theme-toggle-btn flex items-center justify-center gap-2 transition-all duration-300"
                style={{
                    width: '130px',
                    height: '42px',
                    borderRadius: '12px',
                    background: buttonStyle.background,
                    border: buttonStyle.border,
                    color: buttonStyle.color,
                    textShadow: buttonStyle.textShadow,
                    fontFamily: 'Roboto, Arial, sans-serif',
                    fontSize: '13.6px',
                    fontWeight: 500,
                    cursor: 'none',
                    backdropFilter: 'blur(10px)',
                }}
            >
                <span style={{ fontSize: '16px' }}>{currentTheme.icon}</span>
                <span>{language === 'en' ? currentTheme.enName : currentTheme.ruName}</span>
                <svg
                    className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    style={{ width: '12px', height: '12px', marginLeft: '4px' }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            <div
                className={`theme-dropdown absolute top-full left-0 mt-2 overflow-hidden z-50 transition-all duration-300 origin-top ease-in-out`}
                style={{
                    minWidth: '130px',
                    borderRadius: '12px',
                    background: dropdownStyle.background,
                    border: dropdownStyle.border,
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(10px)',
                    opacity: isOpen ? 1 : 0,
                    transform: isOpen ? 'scaleY(1)' : 'scaleY(0.8) translateY(-10px)',
                    pointerEvents: isOpen ? 'auto' : 'none',
                    visibility: isOpen ? 'visible' : 'hidden', // Ensure it's hidden from screen readers when closed
                }}
            >
                {otherThemes.map(t => (
                    <button
                        key={t.id}
                        onClick={() => handleThemeChange(t.id)}
                        className="w-full flex items-center gap-2 transition-colors duration-200"
                        style={{
                            padding: '12px 16px',
                            color: buttonStyle.color,
                            textShadow: buttonStyle.textShadow,
                            fontFamily: 'Roboto, Arial, sans-serif',
                            fontSize: '13.6px',
                            fontWeight: 500,
                            background: 'transparent',
                            border: 'none',
                            cursor: 'none',
                            textAlign: 'left',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = theme === 'cosmos'
                                ? 'rgba(176, 224, 230, 0.15)'
                                : theme === 'underwater'
                                    ? 'rgba(127, 181, 181, 0.15)'
                                    : 'rgba(0, 255, 0, 0.15)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                        }}
                    >
                        <span style={{ fontSize: '16px' }}>{t.icon}</span>
                        <span>{language === 'en' ? t.enName : t.ruName}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
