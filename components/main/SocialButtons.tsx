'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/lib/contexts/ThemeContext';
import { useLanguage } from '@/lib/contexts/LanguageContext';

const CONTACT_INFO = {
    phone: '+7 910 876 76 75',
    email: 'kirsanoff.egor2017@yandex.ru',
};

const LINKS = {
    telegram: 'https://t.me/kaltgod',
    vk: 'https://vk.com/kaltdoto',
};

export function SocialButtons() {
    const { theme } = useTheme();
    const { t } = useLanguage();
    const [showPhone, setShowPhone] = useState(false);
    const [showEmail, setShowEmail] = useState(false);
    const [copyHint, setCopyHint] = useState<{ type: 'phone' | 'email'; visible: boolean }>({ type: 'phone', visible: false });
    const [isMobile, setIsMobile] = useState(false);

    // Detect mobile device
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 640);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleCopy = async (text: string, type: 'phone' | 'email') => {
        try {
            const cleanText = type === 'phone' ? text.replace(/[^\d+]/g, '') : text;
            await navigator.clipboard.writeText(cleanText);
            setCopyHint({ type, visible: true });

            setTimeout(() => {
                setCopyHint({ type: 'phone', visible: false });
                if (type === 'phone') setShowPhone(false);
                if (type === 'email') setShowEmail(false);
            }, 1000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const getContactBoxStyle = () => {
        switch (theme) {
            case 'cosmos':
                return {
                    background: 'rgba(0, 50, 80, 0.6)',
                    border: '0.8px solid rgba(176, 224, 230, 0.3)',
                    color: '#b0e0e6',
                    textShadow: '0 0 8px rgba(176, 224, 230, 0.6)',
                };
            case 'underwater':
                return {
                    background: 'rgba(0, 60, 60, 0.6)',
                    border: '0.8px solid rgba(127, 181, 181, 0.3)',
                    color: '#7fb5b5',
                    textShadow: '0 0 8px rgba(127, 181, 181, 0.6)',
                };
            default:
                return {
                    background: 'rgba(0, 80, 0, 0.6)',
                    border: '0.8px solid rgba(0, 255, 0, 0.3)',
                    color: '#00ff00',
                    textShadow: '0 0 8px rgba(0, 255, 0, 0.6)',
                };
        }
    };

    const contactStyle = getContactBoxStyle();

    // Button size based on device
    const buttonSize = isMobile ? 110 : 160;
    const iconFontSize = isMobile ? 44 : 67;
    const buttonMargin = isMobile ? 10 : 20;

    // Common button styles
    const getButtonStyle = (gradient: string) => ({
        width: `${buttonSize}px`,
        height: `${buttonSize}px`,
        background: gradient,
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
    });

    // Render a single button
    const renderButton = (
        type: 'telegram' | 'vk' | 'phone' | 'email',
        icon: string,
        gradient: string,
        onClick?: () => void,
        href?: string
    ) => {
        const isActive = (type === 'phone' && showPhone) || (type === 'email' && showEmail);
        // Only collapse on desktop, not on mobile
        const shouldCollapse = !isMobile && isActive;

        const buttonContent = (
            <>
                <i className={icon} style={{ fontSize: `${iconFontSize}px`, color: 'white', marginBottom: '8px' }} />
                <span className="text-xs sm:text-sm md:text-base font-medium text-white">{t(type)}</span>
            </>
        );

        // For phone and email - with collapse animation on desktop only
        if (type === 'phone' || type === 'email') {
            return (
                <div
                    key={type}
                    className={`${type}-wrapper`}
                    style={{
                        // On mobile: always visible. On desktop: collapse when active
                        width: shouldCollapse ? '0px' : `${buttonSize}px`,
                        height: shouldCollapse ? '0px' : `${buttonSize}px`,
                        margin: shouldCollapse ? '0px' : `${buttonMargin}px`,
                        opacity: shouldCollapse ? 0 : 1,
                        transform: shouldCollapse ? 'scale(0)' : 'scale(1)',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        overflow: 'visible', // Allow hover scale to show
                        pointerEvents: shouldCollapse ? 'none' : 'auto',
                    }}
                >
                    <button
                        onClick={onClick}
                        className={`btn ${type} flex flex-col items-center justify-center rounded-full transition-transform duration-300 hover:scale-110`}
                        style={{
                            ...getButtonStyle(gradient),
                            border: 'none',
                            cursor: 'none',
                            // Active ring on mobile when selected
                            ...(isMobile && isActive ? {
                                boxShadow: '0 0 0 4px rgba(255, 255, 255, 0.6), 0 10px 30px rgba(0, 0, 0, 0.4)'
                            } : {}),
                        }}
                    >
                        {buttonContent}
                    </button>
                </div>
            );
        }

        // For telegram and vk - simple links
        return (
            <div
                key={type}
                style={{
                    margin: `${buttonMargin}px`,
                    overflow: 'visible', // Allow hover scale to show
                }}
            >
                <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`btn ${type} flex flex-col items-center justify-center rounded-full transition-transform duration-300 hover:scale-110`}
                    style={getButtonStyle(gradient)}
                >
                    {buttonContent}
                </a>
            </div>
        );
    };

    return (
        <div className="buttons-section w-full flex flex-col items-center px-2 sm:px-4">
            {/* Social Buttons Container */}
            <div
                className="buttons-container"
                style={{
                    display: 'grid',
                    // Mobile: fixed 2x2 grid, Desktop: single row
                    gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, auto)',
                    justifyContent: 'center',
                    justifyItems: 'center',
                    alignItems: 'center',
                    gap: isMobile ? '10px' : '0px',
                    position: 'relative',
                }}
            >
                {/* Row 1: Telegram, VK */}
                {renderButton('telegram', 'fab fa-telegram', 'linear-gradient(135deg, rgba(0, 136, 204, 0.8), rgba(52, 183, 241, 0.8))', undefined, LINKS.telegram)}
                {renderButton('vk', 'fab fa-vk', 'linear-gradient(135deg, rgba(76, 117, 163, 0.8), rgba(91, 136, 189, 0.8))', undefined, LINKS.vk)}

                {/* Row 2: Phone, Email */}
                {renderButton('phone', 'fas fa-phone', 'linear-gradient(135deg, rgba(48, 209, 88, 0.8), rgba(52, 199, 89, 0.8))', () => {
                    setShowPhone(true);
                    setShowEmail(false);
                })}
                {renderButton('email', 'fas fa-envelope', 'linear-gradient(135deg, rgba(220, 53, 69, 0.8), rgba(248, 108, 107, 0.8))', () => {
                    setShowEmail(true);
                    setShowPhone(false);
                })}
            </div>

            {/* Phone Info */}
            <div
                className="contact-info transition-all duration-500 ease-out"
                style={{
                    maxHeight: showPhone ? '200px' : '0',
                    opacity: showPhone ? 1 : 0,
                    transform: showPhone ? 'translateY(0) scale(1)' : 'translateY(-20px) scale(0.95)',
                    overflow: 'visible', // Allow hover scale
                    marginTop: showPhone ? '30px' : '0',
                }}
            >
                <div
                    onClick={() => handleCopy(CONTACT_INFO.phone, 'phone')}
                    className="flex items-center gap-3 cursor-pointer transition-transform duration-300 hover:scale-105"
                    style={{
                        background: contactStyle.background,
                        border: contactStyle.border,
                        borderRadius: '12px',
                        padding: isMobile ? '15px 20px' : '20px 35px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                    }}
                >
                    <i className="fas fa-copy" style={{ color: contactStyle.color }} />
                    <span
                        style={{
                            fontFamily: 'monospace',
                            fontSize: isMobile ? '18px' : '27px',
                            letterSpacing: '1.5px',
                            color: contactStyle.color,
                            textShadow: contactStyle.textShadow,
                        }}
                    >
                        {CONTACT_INFO.phone}
                    </span>
                </div>
            </div>

            {/* Email Info */}
            <div
                className="contact-info transition-all duration-500 ease-out"
                style={{
                    maxHeight: showEmail ? '200px' : '0',
                    opacity: showEmail ? 1 : 0,
                    transform: showEmail ? 'translateY(0) scale(1)' : 'translateY(-20px) scale(0.95)',
                    overflow: 'visible', // Allow hover scale
                    marginTop: showEmail ? '30px' : '0',
                }}
            >
                <div
                    onClick={() => handleCopy(CONTACT_INFO.email, 'email')}
                    className="flex items-center gap-3 cursor-pointer transition-transform duration-300 hover:scale-105"
                    style={{
                        background: contactStyle.background,
                        border: contactStyle.border,
                        borderRadius: '12px',
                        padding: isMobile ? '15px 15px' : '20px 35px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                    }}
                >
                    <i className="fas fa-copy" style={{ color: contactStyle.color }} />
                    <span
                        className="break-all"
                        style={{
                            fontFamily: 'monospace',
                            fontSize: isMobile ? '14px' : '27px',
                            letterSpacing: '0.5px',
                            color: contactStyle.color,
                            textShadow: contactStyle.textShadow,
                        }}
                    >
                        {CONTACT_INFO.email}
                    </span>
                </div>
            </div>

            {/* Copy Hint */}
            <div
                className="fixed left-1/2 -translate-x-1/2 transition-all duration-300 z-50"
                style={{
                    bottom: copyHint.visible ? '30px' : '0px',
                    opacity: copyHint.visible ? 1 : 0,
                    pointerEvents: 'none',
                    background: contactStyle.background,
                    border: contactStyle.border,
                    borderRadius: '12px',
                    padding: '15px 25px',
                    color: contactStyle.color,
                    textShadow: contactStyle.textShadow,
                }}
            >
                {t('copiedHint')}
            </div>
        </div>
    );
}
