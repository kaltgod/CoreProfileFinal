'use client';

import { useTheme } from '@/lib/contexts/ThemeContext';
import { useLanguage } from '@/lib/contexts/LanguageContext';

export function HeroSection() {
    const { theme } = useTheme();
    const { t } = useLanguage();

    const getNameStyle = () => {
        switch (theme) {
            case 'cosmos':
                return {
                    color: '#eaf6ff',
                    textShadow: '0 0 15px rgba(176, 224, 230, 0.4)',
                };
            case 'underwater':
                return {
                    color: '#e0f7fa',
                    textShadow: '0 0 15px rgba(127, 181, 181, 0.4)',
                };
            default:
                return {
                    color: '#ffffff',
                    textShadow: '0 0 15px rgba(255, 255, 255, 0.4)',
                };
        }
    };

    const getSubtitleStyle = () => {
        switch (theme) {
            case 'cosmos':
                return { color: 'rgba(176, 224, 230, 0.8)' };
            case 'underwater':
                return { color: 'rgba(127, 181, 181, 0.6)' };
            default:
                return { color: '#cccccc' };
        }
    };

    const nameStyle = getNameStyle();
    const subtitleStyle = getSubtitleStyle();

    return (
        <div className="hero-section text-center" style={{ marginBottom: '60px' }}>
            <h1
                className="name transition-colors duration-500"
                style={{
                    fontFamily: 'Roboto, sans-serif',
                    fontSize: '60.8px',
                    fontWeight: 700,
                    lineHeight: '72.96px',
                    letterSpacing: '1px',
                    marginBottom: '20px',
                    color: nameStyle.color,
                    textShadow: nameStyle.textShadow,
                }}
            >
                {t('name')}
            </h1>
            <p
                className="subtitle transition-colors duration-500"
                style={{
                    fontFamily: 'Roboto, sans-serif',
                    fontSize: '20.8px',
                    fontWeight: 300,
                    lineHeight: '33.28px',
                    maxWidth: '800px',
                    margin: '0 auto',
                    color: subtitleStyle.color,
                }}
            >
                {t('subtitle')}
            </p>
        </div>
    );
}
