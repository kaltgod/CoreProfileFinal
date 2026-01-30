'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useTheme } from '@/lib/contexts/ThemeContext';
import { useIsMobile } from '@/lib/hooks/useMediaQuery';

interface TrailPoint {
    x: number;
    y: number;
    age: number;
    distToPrev: number;
}

interface Wave {
    x: number;
    y: number;
    r: number;
    a: number;
    growth: number;
    click: boolean;
}

export function CustomCursor() {
    const { theme, isChangingTheme } = useTheme();
    const isMobile = useIsMobile();
    const cursorRef = useRef<HTMLDivElement>(null);
    const flashRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Global mouse state
    const mousePos = useRef({ x: 0, y: 0 });
    const lastMousePos = useRef({ x: 0, y: 0 });

    // Inertia cursor position
    const cursorPos = useRef({ x: 0, y: 0 });

    // Cosmos Trail State
    const trailRef = useRef<TrailPoint[]>([]);
    const totalDistanceRef = useRef(0);
    const isMovingRef = useRef(false);
    const moveStartTimeRef = useRef(0);

    // Underwater Waves State
    const wavesRef = useRef<Wave[]>([]);

    // Scroll state for Water Line
    const scrollRef = useRef(0);

    const [isVisible, setIsVisible] = useState(false);

    // Constants from original
    const TRAIL_FADE_SPEED = 0.01;
    const MAX_TRAIL_LENGTH = 100;
    const MAX_TRAIL_DISTANCE = 150;
    const WATER_SURFACE_BASE_Y = 0.45; // 45% of height

    // --- Helpers ---
    const getWaterSurfaceY = useCallback(() => {
        if (typeof window === 'undefined') return 0;
        const windowHeight = window.innerHeight;
        // Parallax logic from cursor.js: windowHeight * 1.6
        // scrollProgress logic: scrollTop / (docHeight - winHeight)

        const docHeight = document.documentElement.scrollHeight - windowHeight;
        const scrollProgress = docHeight > 0 ? scrollRef.current / docHeight : 0;
        const parallax = windowHeight * 1.6;

        return windowHeight * WATER_SURFACE_BASE_Y - scrollProgress * parallax;
    }, []);

    // --- Event Listeners ---
    useEffect(() => {
        if (isMobile) return;

        const handleMouseMove = (e: MouseEvent) => {
            mousePos.current = { x: e.clientX, y: e.clientY };
            if (!isVisible) setIsVisible(true);
        };

        const handleMouseLeave = () => setIsVisible(false);
        const handleMouseEnter = () => {
            setIsVisible(true);
            cursorPos.current = { x: mousePos.current.x, y: mousePos.current.y };
        };

        const handleScroll = () => {
            scrollRef.current = window.scrollY;
        };

        const handleClick = (e: MouseEvent) => {
            if (isChangingTheme) return;

            // Flash effect (Cosmos/Default)
            if (flashRef.current) {
                flashRef.current.style.left = `${e.clientX}px`;
                flashRef.current.style.top = `${e.clientY}px`;
                flashRef.current.classList.remove('flash-active');
                void flashRef.current.offsetWidth;
                flashRef.current.classList.add('flash-active');
            }

            // Underwater Ripple on Click (Only if below water surface)
            if (theme === 'underwater') {
                const waterSurfaceY = getWaterSurfaceY();
                if (e.clientY > waterSurfaceY) {
                    wavesRef.current.push({
                        x: e.clientX,
                        y: e.clientY,
                        r: 6,
                        a: 0.45,
                        growth: 3.2,
                        click: true
                    });
                }
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);
        window.addEventListener('mouseenter', handleMouseEnter);
        window.addEventListener('mousedown', handleClick);
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
            window.removeEventListener('mouseenter', handleMouseEnter);
            window.removeEventListener('mousedown', handleClick);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [isMobile, isVisible, theme, isChangingTheme, getWaterSurfaceY]);

    // --- Main Animation Loop ---
    useEffect(() => {
        if (isMobile) return;

        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        let animationFrame: number;

        const handleResize = () => {
            if (canvas) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize();

        const animate = () => {
            // 1. Inertia Movement
            // Always active except for Cosmos (which hides cursor)
            // But we track cursorPos for everyone to keep state consistent
            cursorPos.current.x += (mousePos.current.x - cursorPos.current.x) * 0.15;
            cursorPos.current.y += (mousePos.current.y - cursorPos.current.y) * 0.15;

            if (cursorRef.current) {
                // Rounding pixels can help with "shaking" but subpixels are smoother
                cursorRef.current.style.left = `${cursorPos.current.x}px`;
                cursorRef.current.style.top = `${cursorPos.current.y}px`;
            }

            // 2. Canvas Effects
            if (canvas && ctx && !isChangingTheme) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // Check movement status
                const isCurrentlyMoving = (mousePos.current.x !== lastMousePos.current.x || mousePos.current.y !== lastMousePos.current.y);

                if (isCurrentlyMoving) {
                    isMovingRef.current = true;
                    moveStartTimeRef.current = Date.now();
                } else {
                    isMovingRef.current = false;
                }

                if (theme === 'cosmos') {
                    updateAndDrawCosmos(ctx);
                } else if (theme === 'underwater') {
                    updateAndDrawUnderwater(ctx, isCurrentlyMoving);
                }

                lastMousePos.current = { ...mousePos.current };
            }

            animationFrame = requestAnimationFrame(animate);
        };

        animationFrame = requestAnimationFrame(animate);
        return () => {
            cancelAnimationFrame(animationFrame);
            window.removeEventListener('resize', handleResize);
        };
    }, [isMobile, theme, isChangingTheme, getWaterSurfaceY]);

    // --- Cosmos Logic ---
    const updateAndDrawCosmos = (ctx: CanvasRenderingContext2D) => {
        const trail = trailRef.current;

        // Add point at MOUSE position (no inertia for trail head, ensures strict following)
        if (trail.length > 0) {
            const prev = trail[trail.length - 1];
            const dist = Math.hypot(mousePos.current.x - prev.x, mousePos.current.y - prev.y);
            if (dist > 0 || trail.length === 0) {
                trail.push({ x: mousePos.current.x, y: mousePos.current.y, age: 1, distToPrev: dist });
                totalDistanceRef.current += dist;
            }
        } else {
            trail.push({ x: mousePos.current.x, y: mousePos.current.y, age: 1, distToPrev: 0 });
        }

        // Pruning
        while (totalDistanceRef.current > MAX_TRAIL_DISTANCE && trail.length > 1) {
            totalDistanceRef.current -= trail[1].distToPrev;
            trail.shift();
        }
        while (trail.length > MAX_TRAIL_LENGTH && trail.length > 1) {
            totalDistanceRef.current -= trail[1].distToPrev;
            trail.shift();
        }

        // Aging
        // If stopped, accelerate fading logic
        for (let i = 0; i < trail.length; i++) {
            if (!isMovingRef.current) {
                const fadeMultiplier = 1 + (i / trail.length) * 1.5;
                trail[i].age -= TRAIL_FADE_SPEED * fadeMultiplier;
            } else {
                trail[i].age -= TRAIL_FADE_SPEED;
            }
        }

        // Retraction ("Sucking") on stop - Remove from HEAD (Start of array)
        if (!isMovingRef.current && trail.length > 1) {
            const timeSinceStop = Date.now() - moveStartTimeRef.current;
            // Original logic: min(floor(time / 300), floor(length / 5))
            // This slowly sucks elements from the tail
            const pointsToRemove = Math.min(Math.floor(timeSinceStop / 300), Math.floor(trail.length / 5));

            if (pointsToRemove > 0) {
                for (let k = 0; k < pointsToRemove; k++) {
                    if (trail.length > 1) {
                        totalDistanceRef.current -= trail[1].distToPrev;
                        trail.shift();
                    }
                }
            }
        }

        // Remove dead points
        while (trail.length > 0 && trail[0].age <= 0) {
            totalDistanceRef.current -= (trail.length > 1 ? trail[1].distToPrev : 0);
            trail.shift();
        }

        // Force head freshness
        if (trail.length > 0) {
            const last = trail[trail.length - 1];
            if (mousePos.current.x === last.x && mousePos.current.y === last.y) {
                last.age = 1;
            }
        }

        // Draw
        if (trail.length > 1) {
            ctx.shadowColor = 'white';
            ctx.shadowBlur = 10;
            ctx.lineCap = 'round';
            for (let i = trail.length - 1; i > 0; i--) {
                const age1 = trail[i].age;
                const age2 = trail[i - 1].age;
                const avgAge = (age1 + age2) / 2;
                if (avgAge > 0) {
                    ctx.strokeStyle = `rgba(255, 255, 255, ${avgAge})`;
                    ctx.lineWidth = 8 * avgAge;
                    ctx.beginPath();
                    ctx.moveTo(trail[i].x, trail[i].y);
                    ctx.lineTo(trail[i - 1].x, trail[i - 1].y);
                    ctx.stroke();
                }
            }
        }

        // Main Cursor
        ctx.shadowColor = 'white';
        ctx.shadowBlur = 20;
        ctx.fillStyle = 'white';
        ctx.beginPath();
        // Draw at MOUSE pos (no inertia for cosmos main dot)
        ctx.arc(mousePos.current.x, mousePos.current.y, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    };

    // --- Underwater Logic ---
    const updateAndDrawUnderwater = (ctx: CanvasRenderingContext2D, isMoving: boolean) => {
        const waves = wavesRef.current;
        const waterSurfaceY = getWaterSurfaceY();

        // Add wave on fast movement
        // SYNC FIX: Use cursorPos (inertia) for waves so they trail perfectly with the visual cursor

        if (isMoving) {
            // Logic using cursorPos for calculation to match visual
            const dx = mousePos.current.x - lastMousePos.current.x;
            const dy = mousePos.current.y - lastMousePos.current.y;
            const speed = Math.hypot(dx, dy);

            // Only spawn if below water surface
            if (speed > 0.5 && cursorPos.current.y > waterSurfaceY) {
                const intensity = Math.min(0.35, Math.max(0.05, speed / 15));
                waves.push({
                    x: cursorPos.current.x, // Sync with visual cursor
                    y: cursorPos.current.y,
                    r: 2 + intensity * 4,
                    a: intensity,
                    growth: 0.6 + intensity,
                    click: false
                });
            }
        }

        // Draw Waves
        for (let i = waves.length - 1; i >= 0; i--) {
            const w = waves[i];

            w.r += w.growth;
            w.a *= w.click ? 0.94 : 0.96;

            if (w.a > 0.01 && w.r < 120) {
                if (w.y > waterSurfaceY) {
                    ctx.strokeStyle = `rgba(180, 230, 255, ${w.a})`;
                    ctx.lineWidth = w.click ? 1.2 : 0.8;
                    ctx.beginPath();
                    ctx.arc(w.x, w.y, w.r, 0, Math.PI * 2);
                    ctx.stroke();
                }
            } else {
                waves.splice(i, 1);
            }
        }
    }

    if (isMobile) return null;

    // --- Styles ---
    const getCursorStyle = () => {
        switch (theme) {
            case 'underwater':
                return {
                    background: '#7fb5b5',
                    boxShadow: '0 0 20px rgba(127, 181, 181, 0.7), 0 0 40px rgba(127, 181, 181, 0.5)',
                    display: 'block'
                };
            case 'cosmos':
                return { display: 'none' };
            default:
                // Exact Match from CSS:
                // background-color: #006400; box-shadow: 0 0 10px #006400, 0 0 20px #00ff00;
                return {
                    background: '#006400',
                    boxShadow: '0 0 10px #006400, 0 0 20px #00ff00',
                    display: 'block'
                };
        }
    };

    const getFlashStyle = () => {
        switch (theme) {
            case 'cosmos': return { background: 'rgba(173, 216, 230, 0.6)' };
            case 'underwater': return { background: 'rgba(127, 181, 181, 0.6)' };
            default: return { background: 'rgba(0, 255, 0, 0.6)' };
        }
    };

    const cursorStyle = getCursorStyle();
    const flashStyle = getFlashStyle();

    return (
        <>
            {/* Canvas for Cosmos Trail / Underwater Ripples */}
            {(theme === 'cosmos' || theme === 'underwater') && (
                <canvas
                    ref={canvasRef}
                    className="fixed inset-0 pointer-events-none z-[9998]"
                    style={{ opacity: isChangingTheme ? 0 : 1, mixBlendMode: 'screen' }}
                />
            )}

            {/* Main HTML Cursor (Inertia) */}
            <div
                ref={cursorRef}
                className={`cursor fixed pointer-events-none z-[9999] transition-opacity duration-300 ${isChangingTheme ? 'opacity-0' : ''}`}
                style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    transform: 'translate(-50%, -50%)',
                    opacity: isVisible && !isChangingTheme && cursorStyle.display !== 'none' ? 1 : 0,
                    background: cursorStyle.background,
                    boxShadow: cursorStyle.boxShadow,
                    display: cursorStyle.display
                }}
            />

            {/* Click Flash Effect */}
            <div
                ref={flashRef}
                className="cursor-flash fixed pointer-events-none z-[9997]"
                style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: flashStyle.background,
                    opacity: 0,
                }}
            />
        </>
    );
}
