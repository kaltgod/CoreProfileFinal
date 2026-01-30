'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/lib/contexts/ThemeContext';

export function ScrollToTop() {
    const { theme } = useTheme();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => setIsVisible(window.scrollY > 300);
        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const getStyle = () => {
        switch (theme) {
            case 'cosmos':
                return {
                    background: 'rgba(0, 0, 0, 0.6)',
                    border: '1.6px solid rgba(176, 224, 230, 0.5)',
                    color: '#b0e0e6',
                    boxShadow: '0 0 15px rgba(176, 224, 230, 0.3)',
                };
            case 'underwater':
                return {
                    background: 'rgba(0, 0, 0, 0.6)',
                    border: '1.6px solid rgba(127, 181, 181, 0.5)',
                    color: '#7fb5b5',
                    boxShadow: '0 0 15px rgba(127, 181, 181, 0.3)',
                };
            default:
                return {
                    background: 'rgba(0, 0, 0, 0.6)',
                    border: '1.6px solid rgba(0, 255, 0, 0.5)',
                    color: '#00ff00',
                    boxShadow: '0 0 15px rgba(0, 255, 0, 0.3)',
                };
        }
    };

    const style = getStyle();

    return (
        <button
            onClick={scrollToTop}
            className="scroll-to-top fixed flex items-center justify-center transition-all duration-300 z-50"
            style={{
                bottom: isVisible ? '30px' : '-60px',
                right: '30px',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: style.background,
                border: style.border,
                color: style.color,
                boxShadow: style.boxShadow,
                opacity: isVisible ? 1 : 0,
                cursor: 'none',
            }}
        >
            <i className="fas fa-arrow-up" style={{ fontSize: '20px' }} />
        </button>
    );
}
