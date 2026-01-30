'use client';

import { useLanguage } from '@/lib/contexts/LanguageContext';
import { useTheme } from '@/lib/contexts/ThemeContext';

export function LanguageToggle() {
    const { language, setLanguage } = useLanguage();
    const { theme } = useTheme();

    const handleToggle = () => {
        setLanguage(language === 'ru' ? 'en' : 'ru');
    };

    const getStyles = () => {
        switch (theme) {
            case 'cosmos':
                return {
                    borderColor: 'rgba(176, 224, 230, 0.3)',
                    thumbBg: 'rgba(176, 224, 230, 0.2)',
                    thumbShadow: '0 0 10px rgba(176, 224, 230, 0.4), inset 0 0 10px rgba(176, 224, 230, 0.2)',
                    trackBg: 'rgba(176, 224, 230, 0.05)',
                    activeColor: '#b0e0e6',
                    inactiveColor: 'rgba(176, 224, 230, 0.4)',
                    textShadow: '0 0 6px rgba(176, 224, 230, 0.6)',
                };
            case 'underwater':
                return {
                    borderColor: 'rgba(127, 181, 181, 0.3)',
                    thumbBg: 'rgba(127, 181, 181, 0.2)',
                    thumbShadow: '0 0 10px rgba(127, 181, 181, 0.4), inset 0 0 10px rgba(127, 181, 181, 0.2)',
                    trackBg: 'rgba(127, 181, 181, 0.05)',
                    activeColor: '#7fb5b5',
                    inactiveColor: 'rgba(127, 181, 181, 0.4)',
                    textShadow: '0 0 6px rgba(127, 181, 181, 0.6)',
                };
            default:
                return {
                    borderColor: 'rgba(0, 255, 0, 0.3)',
                    thumbBg: 'rgba(0, 255, 0, 0.1)',
                    thumbShadow: '0 0 10px rgba(0, 255, 0, 0.4), inset 0 0 10px rgba(0, 255, 0, 0.2)',
                    trackBg: 'rgba(0, 255, 0, 0.05)',
                    activeColor: '#00ff00',
                    inactiveColor: 'rgba(0, 255, 0, 0.4)',
                    textShadow: '0 0 6px rgba(0, 255, 0, 0.6)',
                };
        }
    };

    const styles = getStyles();
    const isRu = language === 'ru';

    return (
        <button
            onClick={handleToggle}
            className="language-toggle relative transition-all duration-300"
            style={{
                width: '85px',
                height: '42px',
                borderRadius: '21px',
                background: styles.trackBg,
                border: `1px solid ${styles.borderColor}`,
                cursor: 'none',
                padding: 0,
                backdropFilter: 'blur(10px)',
            }}
        >
            {/* RU label - left position */}
            <span
                style={{
                    position: 'absolute',
                    left: '3px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '34px',
                    height: '34px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'Roboto, Arial, sans-serif',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: isRu ? styles.activeColor : styles.inactiveColor,
                    textShadow: isRu ? styles.textShadow : 'none',
                    transition: 'all 0.3s ease',
                    zIndex: 1,
                    pointerEvents: 'none',
                }}
            >
                РУ
            </span>

            {/* EN label - right position */}
            <span
                style={{
                    position: 'absolute',
                    right: '3px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '34px',
                    height: '34px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'Roboto, Arial, sans-serif',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: !isRu ? styles.activeColor : styles.inactiveColor,
                    textShadow: !isRu ? styles.textShadow : 'none',
                    transition: 'all 0.3s ease',
                    zIndex: 1,
                    pointerEvents: 'none',
                }}
            >
                EN
            </span>

            {/* Toggle thumb */}
            <div
                className="toggle-thumb absolute transition-all duration-300"
                style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    background: styles.thumbBg,
                    border: `1.6px solid ${styles.borderColor}`,
                    boxShadow: styles.thumbShadow,
                    top: '2.4px',
                    left: isRu ? '3px' : 'calc(100% - 37px)',
                    zIndex: 2,
                }}
            />
        </button>
    );
}
