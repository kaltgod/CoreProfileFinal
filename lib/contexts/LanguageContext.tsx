'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export type Language = 'ru' | 'en';

// Переводы
const translations = {
    ru: {
        name: 'Кирсанов Егор Дмитриевич',
        subtitle: 'Гений, плейбой, хирург, стоматолог, полномочный представитель администрации президента, хакер, пилот гражданской авиации, заслуженный актер РФ, депутат государственной думы федерального собрания РФ, гроссмейстер по егерьмейстеру и просто хороший человек',
        telegram: 'Telegram',
        vk: 'ВКонтакте',
        phone: 'Телефон',
        email: 'Email',
        hint: 'Нажмите на кнопку, чтобы перейти в соответствующий профиль<br/>Нажмите на номер телефона или email, чтобы скопировать<br/>Нажмите на фотографии, чтобы открыть галерею',
        photosTitle: 'Фотографии',
        photo1: 'Официальный портрет',
        photo2: 'Гуляю по Питеру',
        photo3: 'На природе',
        photo4: 'На природе',
        footerLine1: '© 2026 Kalt, inc. Все права защищены.',
        footerLine2: 'Юридический адрес: 537 Paper Street, Bradford, 19808',
        footerGithub: 'Мой',
        copiedHint: 'Скопировано в буфер обмена!',
        // Темы
        themeMatrix: 'Матрица',
        themeCosmos: 'Космос',
        themeOcean: 'Океан',
    },
    en: {
        name: 'Egor Dmitrievich Kirsanov',
        subtitle: 'Genius, playboy, surgeon, dentist, authorized representative of the presidential administration, hacker, civil aviation pilot, honored actor of the Russian Federation, deputy of the State Duma of the Federal Assembly of the Russian Federation, grandmaster of Jagermeister, and just a good person',
        telegram: 'Telegram',
        vk: 'VKontakte',
        phone: 'Phone',
        email: 'Email',
        hint: 'Click the button to go to the corresponding profile<br/>Click on the phone number or email to copy<br/>Click on the photos to open the gallery',
        photosTitle: 'Photos',
        photo1: 'Official portrait',
        photo2: 'Walking around St. Petersburg',
        photo3: 'In nature',
        photo4: 'In nature',
        footerLine1: '© 2026 Kalt, inc. All rights reserved.',
        footerLine2: 'Legal address: 537 Paper Street, Bradford, 19808',
        footerGithub: 'My',
        copiedHint: 'Copied to clipboard!',
        // Темы
        themeMatrix: 'Matrix',
        themeCosmos: 'Cosmos',
        themeOcean: 'Ocean',
    },
} as const;

type TranslationKey = keyof typeof translations.ru;

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
    children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
    const [language, setLanguageState] = useState<Language>('ru');
    const [mounted, setMounted] = useState(false);

    // Загружаем язык из localStorage при первом рендере
    useEffect(() => {
        const savedLang = localStorage.getItem('selectedLanguage') as Language;
        if (savedLang && ['ru', 'en'].includes(savedLang)) {
            setLanguageState(savedLang);
        }
        setMounted(true);
    }, []);

    // Обновляем атрибут lang и title при смене языка
    useEffect(() => {
        if (!mounted) return;

        document.documentElement.lang = language;
        document.title = language === 'en'
            ? 'Egor Dmitrievich Kirsanov'
            : 'Кирсанов Егор Дмитриевич';
    }, [language, mounted]);

    const setLanguage = useCallback((newLang: Language) => {
        setLanguageState(newLang);
        localStorage.setItem('selectedLanguage', newLang);
    }, []);

    const t = useCallback((key: TranslationKey): string => {
        return translations[language][key] || translations.ru[key] || key;
    }, [language]);

    // Предотвращаем SSR мигание
    if (!mounted) {
        return null;
    }

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
