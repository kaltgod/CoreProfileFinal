'use client';

import { useTheme } from '@/lib/contexts/ThemeContext';
import { useLanguage } from '@/lib/contexts/LanguageContext';

export function HintText() {
    const { theme } = useTheme();
    const { t } = useLanguage();

    const getTextStyle = () => {
        switch (theme) {
            case 'cosmos':
                return { color: 'rgba(176, 224, 230, 0.6)' };
            case 'underwater':
                return { color: 'rgba(127, 181, 181, 0.5)' };
            default:
                return { color: '#aaaaaa' };
        }
    };

    const textStyle = getTextStyle();

    return (
        <p
            className="hint text-center transition-colors duration-500"
            style={{
                fontFamily: 'Roboto, sans-serif',
                fontSize: '16px',
                fontWeight: 300,
                lineHeight: 1.6,
                marginTop: '30px',
                color: textStyle.color,
            }}
            dangerouslySetInnerHTML={{ __html: t('hint') }}
        />
    );
}
