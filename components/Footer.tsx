'use client';

import { useTheme } from '@/lib/contexts/ThemeContext';
import { useLanguage } from '@/lib/contexts/LanguageContext';

export function Footer() {
    const { theme } = useTheme();
    const { t } = useLanguage();

    const getFooterStyle = () => {
        switch (theme) {
            case 'cosmos':
                return { borderColor: 'rgba(176, 224, 230, 0.2)', color: '#aaaaaa' };
            case 'underwater':
                return { borderColor: 'rgba(127, 181, 181, 0.2)', color: '#aaaaaa' };
            default:
                return { borderColor: 'rgba(0, 255, 0, 0.2)', color: '#aaaaaa' };
        }
    };

    const style = getFooterStyle();

    return (
        <footer
            className="site-footer text-center"
            style={{
                padding: '25px 20px',
                marginTop: '40px',
            }}
        >
            <p
                className="footer-text"
                style={{
                    fontFamily: 'Roboto, sans-serif',
                    fontSize: '13.6px',
                    color: style.color,
                    letterSpacing: '0.3px',
                    lineHeight: 1.5,
                    marginBottom: '8px',
                }}
            >
                {t('footerLine1')}
            </p>
            <p
                className="footer-text"
                style={{
                    fontFamily: 'Roboto, sans-serif',
                    fontSize: '13.6px',
                    color: style.color,
                    letterSpacing: '0.3px',
                    lineHeight: 1.5,
                }}>
                {t('footerLine2')}
            </p>
            <p
                className="footer-text"
                style={{
                    fontFamily: 'Roboto, sans-serif',
                    fontSize: '13.6px',
                    color: style.color,
                    letterSpacing: '0.3px',
                    lineHeight: 1.5,
                    marginTop: '8px',
                }}>
                {t('footerGithub')}{' '}
                <a
                    href="https://github.com/kaltgod"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        color: style.color,
                        textDecoration: 'underline',
                    }}
                >
                    GitHub
                </a>
            </p>
        </footer>
    );
}
