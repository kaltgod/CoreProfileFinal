'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from '@/lib/contexts/ThemeContext';

export function MatrixBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { theme, isChangingTheme } = useTheme();
    const dropsRef = useRef<number[]>([]);
    const lastTimeRef = useRef(0);
    const prevThemeRef = useRef<string | null>(null);
    const needsFullClearRef = useRef(false);

    // Track theme changes to detect when switching TO matrix from another theme
    useEffect(() => {
        if (prevThemeRef.current !== null && prevThemeRef.current !== 'default' && theme === 'default') {
            needsFullClearRef.current = true;
        }
        prevThemeRef.current = theme;
    }, [theme]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Only run when this theme is active
        if (theme !== 'default') return;

        const matrixChars = '01';
        const matrixCharsArray = matrixChars.split('');
        const fontSize = 20;
        const lineHeight = fontSize * 1.2;
        const frameInterval = 45; // ms between frames

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            const columns = Math.floor(canvas.width / fontSize);

            if (dropsRef.current.length < columns) {
                for (let i = dropsRef.current.length; i < columns; i++) {
                    dropsRef.current[i] = Math.floor(Math.random() * canvas.height / lineHeight);
                }
            } else {
                dropsRef.current.length = columns;
            }
        };

        resize();
        window.addEventListener('resize', resize);

        // Clear canvas with solid black initially to prevent blue tint from previous theme
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        let animationId: number;

        const draw = (timestamp: number) => {
            // Throttle to ~22 FPS (45ms interval)
            if (timestamp - lastTimeRef.current < frameInterval) {
                animationId = requestAnimationFrame(draw);
                return;
            }
            lastTimeRef.current = timestamp;

            if (isChangingTheme) {
                animationId = requestAnimationFrame(draw);
                return;
            }

            // Force full black clear when switching TO matrix theme from another theme
            if (needsFullClearRef.current) {
                ctx.fillStyle = '#000000';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                needsFullClearRef.current = false;
            } else {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            ctx.fillStyle = '#0f0';
            ctx.font = `${fontSize}px 'Courier New', monospace`;
            ctx.textAlign = 'center';
            ctx.shadowColor = '#0f0';
            ctx.shadowBlur = 8;

            for (let i = 0; i < dropsRef.current.length; i++) {
                const text = matrixCharsArray[Math.floor(Math.random() * matrixCharsArray.length)];
                const xPos = i * fontSize + fontSize / 2;
                const yPos = dropsRef.current[i] * lineHeight;

                ctx.fillText(text, xPos, yPos);

                if (dropsRef.current[i] * lineHeight > canvas.height && Math.random() > 0.975) {
                    dropsRef.current[i] = 0;
                }

                dropsRef.current[i]++;
            }

            ctx.shadowBlur = 0;
            animationId = requestAnimationFrame(draw);
        };

        animationId = requestAnimationFrame(draw);

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', resize);
        };
    }, [theme, isChangingTheme]);

    if (theme !== 'default') return null;

    return (
        <canvas
            ref={canvasRef}
            id="matrix-bg"
            className="fixed inset-0 -z-30"
            style={{ opacity: isChangingTheme ? 0 : 0.4, transition: 'opacity 1.5s ease' }}
        />
    );
}
