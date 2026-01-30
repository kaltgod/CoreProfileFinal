'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from '@/lib/contexts/ThemeContext';

interface Star {
    id: number;
    x: number; // World X
    y: number; // World Y
    z: number; // World Z
    size: number;
    color: string;
}

export function CosmosBackground() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { theme, isChangingTheme } = useTheme();

    const starsRef = useRef<Star[]>([]);
    const starElementsRef = useRef<(HTMLDivElement | null)[]>([]);

    const mouseRef = useRef({ x: 0, y: 0 });
    const scrollPosRef = useRef(0);
    const animationFrameRef = useRef<number | null>(null);

    const [mounted, setMounted] = useState(false);

    // Initialize Data - STATIC 3D UNIVERSE
    useEffect(() => {
        if (theme !== 'cosmos') return;

        const newStars: Star[] = [];
        const count = 400; // Total stars
        // Estimate max scroll travel. 
        // Typical page is maybe 3000-5000px. let's assume a deep universe.
        // Camera moves 1px per 1px scroll? Maybe scaler.
        const universeDepth = 4000;
        const spread = 2000; // Width/Height of the tunnel

        for (let i = 0; i < count; i++) {
            newStars.push({
                id: i,
                x: (Math.random() - 0.5) * spread * 2,
                y: (Math.random() - 0.5) * spread * 2,
                z: Math.random() * universeDepth, // Placed randomly along the tunnel
                size: Math.random() * 2 + 1,
                color: 'white'
            });
        }

        // Sort by Z for painter's algorithm (though irrelevant for div z-index usually, good for debug)
        newStars.sort((a, b) => b.z - a.z);

        starsRef.current = newStars;
        starElementsRef.current = new Array(newStars.length).fill(null);

        setMounted(true);
        return () => setMounted(false);
    }, [theme]);

    // Animation Loop - 3D Projection
    useEffect(() => {
        if (theme !== 'cosmos' || !mounted) return;

        const update = () => {
            const scrollY = window.scrollY;
            // Camera moves forward as we scroll down
            const cameraZ = scrollY * 0.5; // Controls how fast we fly through space relative to scroll

            const width = window.innerWidth;
            const height = window.innerHeight;
            const cx = width / 2;
            const cy = height / 2;

            // Mouse Parallax (shifts the camera X/Y)
            const mouseX = (mouseRef.current.x - cx) * 0.5;
            const mouseY = (mouseRef.current.y - cy) * 0.5;

            starsRef.current.forEach((star, i) => {
                const el = starElementsRef.current[i];
                if (!el) return;

                // Relative position to camera
                let dz = star.z - cameraZ;

                // Endless loop math: if star passes behind camera, move it to far front?
                // User said: "starting scroll they go off screen and disappear ONLY THERE".
                // "When scrolling back they come out".
                // This implies NO LOOPING. They are static.
                // But if we run out of stars, it will be empty.
                // Option: Make the universe repeat modulo `universeDepth`.
                // User said "appear from nowhere" is bad.
                // Modulo wrapping CAUSES "appearing from nowhere" (at the far plane).
                // But appearing at far plane (small dot) is acceptable? 
                // The complaint "disappear and appear from nowhere" usually refers to stars popping in full size.
                // Let's implement modulo for infinite scroll but fade in/out at distance?
                // OR just generate ENOUGH stars for the specific page height.
                // Since page height is dynamic, modulo with wrapping at Far Plane is safest.

                const universeDepth = 4000;
                const fov = 800;

                // Wrap stars to keep tunnel populated
                // If star is behind camera (dz < 0), add universeDepth to put it in front
                while (dz < 10) { // 10 is near clipping plane
                    dz += universeDepth;
                }
                // If star is too far (dz > universeDepth), bring it closer
                while (dz > universeDepth) {
                    dz -= universeDepth;
                }

                // Projection
                const scale = fov / dz;

                const x2d = cx + (star.x - mouseX) * scale;
                const y2d = cy + (star.y - mouseY) * scale;

                // Visibility check
                // Only render if within screen bounds (plus margin) to avoid rendering glitches
                // And scale shouldn't be too massive (crossing near plane)
                if (
                    scale > 20 || // Too close
                    x2d < -50 || x2d > width + 50 ||
                    y2d < -50 || y2d > height + 50
                ) {
                    el.style.display = 'none';
                } else {
                    el.style.display = 'block';
                    el.style.transform = `translate(${x2d}px, ${y2d}px) scale(${scale})`;
                    el.style.opacity = Math.min(1, (universeDepth - dz) / 1000).toString(); // Fog/Fade at distance
                }
            });

            animationFrameRef.current = requestAnimationFrame(update);
        };

        animationFrameRef.current = requestAnimationFrame(update);

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };
        window.addEventListener('mousemove', handleMouseMove, { passive: true });

        return () => {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [theme, mounted]);

    if (theme !== 'cosmos') return null;

    return (
        <div
            ref={containerRef}
            className="cosmos-background fixed inset-0 -z-10 overflow-hidden"
            style={{
                opacity: isChangingTheme ? 0 : 1,
                transition: 'opacity 1s ease',
                background: `radial-gradient(ellipse at center, #000000 0%, #050510 25%, #0a0a20 50%, #0b0b25 75%, #0c0c30 100%)`,
            }}
        >
            <div className="stars-container absolute inset-0">
                {starsRef.current.map((star, i) => (
                    <div
                        key={star.id}
                        ref={el => { starElementsRef.current[i] = el; }}
                        className="star absolute rounded-full bg-white"
                        style={{
                            left: 0,
                            top: 0,
                            width: `${star.size}px`,
                            height: `${star.size}px`,
                            willChange: 'transform',
                            boxShadow: `0 0 ${star.size}px rgba(255, 255, 255, 0.8)`,
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
