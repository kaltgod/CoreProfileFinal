'use client';

import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';

interface HeaderProps {
    visible: boolean;
}

export function Header({ visible }: HeaderProps) {
    return (
        <header
            className={`site-header absolute top-0 left-0 right-0 z-[100] transition-all duration-500 ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
            style={{
                padding: '30px',
            }}
        >
            <div
                className="header-container flex items-start justify-between"
                style={{
                    maxWidth: '1476px',
                    margin: '0 auto',
                }}
            >
                <ThemeToggle />
                <LanguageToggle />
            </div>
        </header>
    );
}
