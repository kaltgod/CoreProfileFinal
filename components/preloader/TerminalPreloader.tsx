'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface TerminalPreloaderProps {
    onComplete: () => void;
}

interface ScatterChar {
    char: string;
    x: number;
    y: number;
    targetY: number;
    xOffset: number;
    rotation: number;
    delay: number;
    duration: number;
}

export function TerminalPreloader({ onComplete }: TerminalPreloaderProps) {
    const [lines, setLines] = useState<Array<{ text: string; isTyping: boolean }>>([]);
    const [showCursor, setShowCursor] = useState(true);
    const [phase, setPhase] = useState<'typing' | 'scattering' | 'done'>('typing');
    const containerRef = useRef<HTMLDivElement>(null);
    const scatterContainerRef = useRef<HTMLDivElement>(null);
    const animationStarted = useRef(false);
    const scatterCharsRef = useRef<ScatterChar[]>([]);

    const SCRIPT = [
        { text: 'CoreProfile [Version 1.0.3]', instant: true },
        { text: '(c) Кирсанов Егор Дмитриевич (Kirsanov Egor Dmitrievich). Все права защищены.', instant: true },
        { text: '', instant: true },
        { text: 'C:\\browser\\websites> open CoreProfile', instant: false, speed: 70 },
        { text: 'C:\\browser\\websites\\CoreProfile> login ******* password *****************', instant: false, speed: 50 },
        { text: '', instant: true, delay: 280 },
        { text: 'Идентификация...', instant: true, delay: 280 },
        { text: 'Проверка окружения...', instant: true, delay: 280 },
        { text: 'Доступ подтвержден.', instant: true, delay: 280 },
        { text: 'Сайт загружен.', instant: true, delay: 280 },
    ];

    // Cursor blink
    useEffect(() => {
        if (phase !== 'typing') return;
        const interval = setInterval(() => setShowCursor((prev) => !prev), 530);
        return () => clearInterval(interval);
    }, [phase]);

    // Start scatter - using DOM manipulation for performance
    const startScatter = useCallback(() => {
        if (!containerRef.current || !scatterContainerRef.current) {
            onComplete();
            return;
        }

        const charElements = containerRef.current.querySelectorAll('.char');
        const scatterContainer = scatterContainerRef.current;

        // Clear any existing scatter chars
        scatterContainer.innerHTML = '';

        const chars: Array<{ el: HTMLDivElement; data: ScatterChar }> = [];

        charElements.forEach((el, index) => {
            const rect = el.getBoundingClientRect();
            const char = el.textContent || '';
            if (!char.trim() && char !== ' ') return; // Skip empty

            const scatterEl = document.createElement('div');
            scatterEl.className = 'scattering-char';
            scatterEl.textContent = char;
            scatterEl.style.cssText = `
        position: absolute;
        left: ${rect.left}px;
        top: ${rect.top}px;
        font-family: 'Courier New', monospace;
        color: #0f0;
        font-size: 20px;
        text-shadow: 0 0 5px #0f0;
        pointer-events: none;
        will-change: transform, opacity;
      `;

            scatterContainer.appendChild(scatterEl);

            chars.push({
                el: scatterEl,
                data: {
                    char,
                    x: rect.left,
                    y: rect.top,
                    targetY: window.innerHeight + 260,
                    xOffset: (Math.random() - 0.5) * 120,
                    rotation: (Math.random() - 0.5) * 220,
                    delay: Math.random() * 220 + index * 4,
                    duration: 1800 + Math.random() * 400,
                },
            });
        });

        // Shuffle for random order
        chars.sort(() => Math.random() - 0.5);

        // Hide original content
        setPhase('scattering');

        // Animate using requestAnimationFrame with direct DOM updates
        const startTime = performance.now();
        const totalDuration = 2600;

        const animate = (timestamp: number) => {
            const elapsed = timestamp - startTime;
            let allDone = true;

            chars.forEach(({ el, data }) => {
                const charElapsed = Math.max(0, elapsed - data.delay);
                const progress = Math.min(charElapsed / data.duration, 1);

                if (progress < 1) allDone = false;

                // Cubic ease out
                const eased = 1 - Math.pow(1 - progress, 3);

                const currentY = data.y + (data.targetY - data.y) * eased;
                const currentX = data.xOffset * eased;
                const currentRotation = data.rotation * eased;
                const opacity = 1 - eased;

                el.style.transform = `translate(${currentX}px, ${currentY - data.y}px) rotate(${currentRotation}deg)`;
                el.style.opacity = String(opacity);
            });

            if (elapsed < totalDuration && !allDone) {
                requestAnimationFrame(animate);
            } else {
                // Fade out and complete
                const preloader = document.getElementById('terminal-preloader');
                if (preloader) {
                    preloader.style.opacity = '0';
                }
                setTimeout(() => {
                    setPhase('done');
                    onComplete();
                }, 550);
            }
        };

        requestAnimationFrame(animate);
    }, [onComplete]);

    // Animation sequence
    useEffect(() => {
        if (animationStarted.current) return;
        animationStarted.current = true;

        let currentIndex = 0;

        const processNextLine = () => {
            if (currentIndex >= SCRIPT.length) {
                setTimeout(startScatter, 1100);
                return;
            }

            const line = SCRIPT[currentIndex];
            const delay = line.delay || 0;

            setTimeout(() => {
                if (line.instant) {
                    setLines((prev) => [...prev, { text: line.text, isTyping: false }]);
                    currentIndex++;
                    processNextLine();
                } else {
                    setLines((prev) => [...prev, { text: '', isTyping: true }]);

                    const promptEnd = line.text.indexOf('> ') + 2;
                    const prompt = line.text.substring(0, promptEnd);
                    const command = line.text.substring(promptEnd);

                    setLines((prev) => {
                        const newLines = [...prev];
                        newLines[newLines.length - 1] = { text: prompt, isTyping: true };
                        return newLines;
                    });

                    let charIndex = 0;
                    const speed = line.speed || 50;

                    const typeChar = () => {
                        if (charIndex < command.length) {
                            setLines((prev) => {
                                const newLines = [...prev];
                                newLines[newLines.length - 1] = {
                                    text: prompt + command.substring(0, charIndex + 1),
                                    isTyping: charIndex < command.length - 1,
                                };
                                return newLines;
                            });
                            charIndex++;
                            setTimeout(typeChar, speed);
                        } else {
                            setLines((prev) => {
                                const newLines = [...prev];
                                newLines[newLines.length - 1].isTyping = false;
                                return newLines;
                            });
                            currentIndex++;
                            processNextLine();
                        }
                    };

                    setTimeout(typeChar, 100);
                }
            }, delay);
        };

        setTimeout(processNextLine, 200);
    }, [startScatter]);

    if (phase === 'done') return null;

    return (
        <>
            {/* Main preloader */}
            <div
                id="terminal-preloader"
                className="fixed inset-0 z-[99999] flex flex-col"
                style={{
                    backgroundColor: '#000',
                    color: '#0f0',
                    fontFamily: "'Courier New', monospace",
                    fontSize: '20px',
                    lineHeight: 1.4,
                    padding: '40px',
                    transition: 'opacity 0.55s ease',
                }}
            >
                <div
                    ref={containerRef}
                    id="terminal-content"
                    className="flex-1 whitespace-pre-wrap break-words overflow-hidden"
                    style={{
                        textShadow: '0 0 5px #0f0',
                        visibility: phase === 'scattering' ? 'hidden' : 'visible',
                    }}
                >
                    {lines.map((line, lineIndex) => (
                        <div key={lineIndex} className="terminal-line" style={{ marginBottom: '5px' }}>
                            {[...line.text].map((char, charIndex) => (
                                <span key={charIndex} className="char">{char}</span>
                            ))}
                            {line.isTyping && (
                                <span
                                    className="terminal-cursor"
                                    style={{
                                        display: 'inline-block',
                                        width: '8px',
                                        height: '20px',
                                        backgroundColor: '#0f0',
                                        marginLeft: '2px',
                                        verticalAlign: 'middle',
                                        opacity: showCursor ? 1 : 0,
                                    }}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Scatter container - managed by DOM for performance */}
            <div
                ref={scatterContainerRef}
                id="scattering-container"
                className="fixed inset-0 z-[100001] pointer-events-none"
                style={{
                    backgroundColor: phase === 'scattering' ? '#000' : 'transparent',
                }}
            />
        </>
    );
}
