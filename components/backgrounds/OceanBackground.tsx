'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from '@/lib/contexts/ThemeContext';
import { useIsMobile } from '@/lib/hooks/useMediaQuery';

interface Fish {
    depth: number;
    x: number;
    speed: number;
    dir: number;
    size: number;
    color: string;
}

interface Bird {
    x: number;
    yOffset: number;
    speed: number;
    size: number;
    wingFreq: number;
}

interface Coral {
    x: number;
    type: 'branch' | 'seaweed' | 'soft';
    size: number;
    color: string;
    branches: number;
    blades: number;
    petals: number;
}

interface SandGrain {
    x: number;
    y: number;
    size: number;
    opacity: number;
}

interface SandPatch {
    x: number;
    y: number;
    radius: number;
    opacity: number;
}

const FISH_COLORS = ['#7FB5B5', '#FF9BAA', '#fffadd', '#A2A2D0'];
const BRANCH_PALETTE = ['#FF7F50', '#FFB07C', '#F28C6B'];
const COLORS = {
    surface: { r: 116, g: 204, b: 244 },
    mid: { r: 43, g: 103, b: 119 },
    abyss: { r: 1, g: 22, b: 39 },
};

function clamp(v: number, a: number, b: number): number {
    return Math.max(a, Math.min(b, v));
}

function lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
}

function smoothstep(edge0: number, edge1: number, x: number): number {
    const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
}

function lerpColor(c1: typeof COLORS.surface, c2: typeof COLORS.surface, t: number): string {
    const r = Math.round(c1.r + (c2.r - c1.r) * t);
    const g = Math.round(c1.g + (c2.g - c1.g) * t);
    const b = Math.round(c1.b + (c2.b - c1.b) * t);
    return `rgb(${r}, ${g}, ${b})`;
}

export function OceanBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { theme, isChangingTheme } = useTheme();
    const isMobile = useIsMobile();
    const timeRef = useRef(0);
    const fishesRef = useRef<Fish[]>([]);
    const birdsRef = useRef<Bird[]>([]);
    const coralsRef = useRef<Coral[]>([]);
    const sandGrainsRef = useRef<SandGrain[]>([]);
    const sandPatchesRef = useRef<SandPatch[]>([]);
    const scrollProgressRef = useRef(0);

    // Only run when underwater theme is active
    useEffect(() => {
        if (theme !== 'underwater') return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationId: number;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            // Fish
            const fishCount = isMobile ? 8 : 12;
            fishesRef.current = [];
            for (let i = 0; i < fishCount; i++) {
                fishesRef.current.push({
                    depth: Math.random() * 1.2 + 0.2,
                    x: Math.random() * canvas.width,
                    speed: Math.random() * 0.8 + 0.4,
                    dir: Math.random() < 0.5 ? 1 : -1,
                    size: isMobile ? Math.random() * 20 + 12 : Math.random() * 25 + 15,
                    color: FISH_COLORS[Math.floor(Math.random() * FISH_COLORS.length)],
                });
            }

            // Birds
            const birdCount = isMobile ? 2 : 4;
            birdsRef.current = [];
            for (let i = 0; i < birdCount; i++) {
                birdsRef.current.push({
                    x: Math.random() * canvas.width,
                    yOffset: Math.random() * 120 + 60,
                    speed: Math.random() * 1.5 + 0.5,
                    size: isMobile ? Math.random() * 6 + 6 : Math.random() * 8 + 8,
                    wingFreq: Math.random() * 0.15 + 0.08,
                });
            }

            // Corals
            const coralCount = isMobile ? Math.max(8, Math.floor(canvas.width / 140)) : Math.max(16, Math.floor(canvas.width / 70));
            const coralTypes: ('branch' | 'seaweed' | 'soft')[] = ['branch', 'branch', 'seaweed', 'soft'];
            coralsRef.current = [];
            for (let i = 0; i < coralCount; i++) {
                const type = coralTypes[i % coralTypes.length];
                let color = '#FF7F50';
                if (type === 'branch') color = BRANCH_PALETTE[Math.floor(Math.random() * BRANCH_PALETTE.length)];
                else if (type === 'seaweed') color = '#2ECC71';
                else if (type === 'soft') color = '#F4B6C2';

                coralsRef.current.push({
                    x: (canvas.width / coralCount) * i + Math.random() * 30 - 15,
                    type,
                    size: isMobile ? Math.random() * 15 + 12 : Math.random() * 18 + 16,
                    color,
                    branches: type === 'branch' ? (isMobile ? Math.floor(Math.random() * 2) + 2 : Math.floor(Math.random() * 2) + 3) : 0,
                    blades: type === 'seaweed' ? (isMobile ? Math.floor(Math.random() * 2) + 1 : Math.floor(Math.random() * 2) + 2) : 0,
                    petals: type === 'soft' ? (isMobile ? Math.floor(Math.random() * 2) + 3 : Math.floor(Math.random() * 3) + 5) : 0,
                });
            }

            // Sand grains
            const sandGrainCount = isMobile ? 45 : 90;
            sandGrainsRef.current = [];
            for (let i = 0; i < sandGrainCount; i++) {
                sandGrainsRef.current.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * 90 + 6,
                    size: isMobile ? Math.random() * 1.2 + 0.6 : Math.random() * 1.6 + 0.8,
                    opacity: isMobile ? Math.random() * 0.25 + 0.05 : Math.random() * 0.35 + 0.08,
                });
            }

            // Sand patches
            const sandPatchCount = isMobile ? 5 : 10;
            sandPatchesRef.current = [];
            for (let i = 0; i < sandPatchCount; i++) {
                sandPatchesRef.current.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * 70 + 20,
                    radius: isMobile ? Math.random() * 25 + 15 : Math.random() * 35 + 25,
                    opacity: isMobile ? Math.random() * 0.06 + 0.03 : Math.random() * 0.08 + 0.05,
                });
            }
        };

        const updateScrollProgress = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.body.scrollHeight - window.innerHeight;
            scrollProgressRef.current = docHeight > 0 ? scrollTop / docHeight : 0;
        };

        const getCurrentBgColor = (progress: number): string => {
            if (progress < 0.5) return lerpColor(COLORS.surface, COLORS.mid, progress * 2);
            return lerpColor(COLORS.mid, COLORS.abyss, (progress - 0.5) * 2);
        };

        const drawFish = (x: number, y: number, size: number, color: string, dir: number) => {
            ctx.save();
            ctx.translate(x, y);
            if (dir < 0) ctx.scale(-1, 1);
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.ellipse(0, 0, size * 0.7, size * 0.35, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(-size * 0.6, 0);
            ctx.quadraticCurveTo(-size * 1.1, -size * 0.5, -size * 1.2, -size * 0.4);
            ctx.lineTo(-size * 0.9, 0);
            ctx.lineTo(-size * 1.2, size * 0.4);
            ctx.quadraticCurveTo(-size * 1.1, size * 0.5, -size * 0.6, 0);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(size * 0.4, -size * 0.1, size * 0.06, 0, Math.PI * 2);
            ctx.fillStyle = '#000';
            ctx.fill();
            ctx.restore();
        };

        const drawBird = (x: number, y: number, size: number, time: number, freq: number) => {
            ctx.save();
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 1.5;
            ctx.lineCap = 'round';
            ctx.globalAlpha = 0.5;
            const wingMelt = Math.sin(time * 8 * freq) * size;
            ctx.beginPath();
            ctx.moveTo(x - size, y - wingMelt);
            ctx.quadraticCurveTo(x - size / 2, y, x, y);
            ctx.quadraticCurveTo(x + size / 2, y, x + size, y - wingMelt);
            ctx.stroke();
            ctx.restore();
        };

        const drawClouds = () => {
            ctx.fillStyle = 'white';
            const cloudCount = isMobile ? 3 : 10;
            for (let i = 0; i < cloudCount; i++) {
                const x = canvas.width * (0.08 + i * (0.9 / cloudCount));
                const y = 50 + (i % 3) * 20;
                const size = 18 + (i % 5);
                ctx.beginPath(); ctx.arc(x - 22, y, size, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(x, y - 5, size + 4, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(x + 22, y, size, 0, Math.PI * 2); ctx.fill();
            }
        };

        // Branch coral drawing
        const drawBranchCoral = (x: number, y: number, size: number, color: string, branches: number) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.strokeStyle = color;
            ctx.lineCap = 'round';
            ctx.lineWidth = 3;

            for (let i = 0; i < branches; i++) {
                const angle = -Math.PI / 2 + (i - (branches - 1) / 2) * 0.35;
                const len = size * (0.8 + (i % 2) * 0.25);

                const endX = Math.cos(angle) * len;
                const endY = Math.sin(angle) * len;

                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(endX, endY);
                ctx.stroke();

                // Small branches
                ctx.lineWidth = 2;
                const subLen = len * 0.35;

                ctx.beginPath();
                ctx.moveTo(endX * 0.65, endY * 0.65);
                ctx.lineTo(endX * 0.65 + Math.cos(angle - 0.5) * subLen, endY * 0.65 + Math.sin(angle - 0.5) * subLen);
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(endX * 0.65, endY * 0.65);
                ctx.lineTo(endX * 0.65 + Math.cos(angle + 0.5) * subLen, endY * 0.65 + Math.sin(angle + 0.5) * subLen);
                ctx.stroke();

                ctx.lineWidth = 3;
            }
            ctx.restore();
        };

        // Soft coral drawing
        const drawSoftCoral = (x: number, y: number, size: number, color: string, petals: number) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.strokeStyle = color;
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';

            for (let i = 0; i < petals; i++) {
                const angle = -Math.PI / 2 + (i - (petals - 1) / 2) * 0.28;
                const len = size * (0.75 + (i % 2) * 0.2);
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(Math.cos(angle) * len, Math.sin(angle) * len);
                ctx.stroke();
            }

            ctx.restore();
        };

        // Seaweed drawing
        const drawSeaweed = (x: number, y: number, size: number, color: string, blades: number) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.fillStyle = color;

            for (let i = 0; i < blades; i++) {
                const offsetX = (i - (blades - 1) / 2) * 10;
                const bladeHeight = size * (0.85 + (i % 2) * 0.35);

                ctx.beginPath();
                ctx.moveTo(offsetX - 2, 0);
                ctx.quadraticCurveTo(offsetX - 4, -bladeHeight * 0.5, offsetX, -bladeHeight);
                ctx.quadraticCurveTo(offsetX + 4, -bladeHeight * 0.5, offsetX + 2, 0);
                ctx.closePath();
                ctx.fill();
            }

            ctx.restore();
        };

        // Draw coral based on type
        const drawCoral = (coral: Coral, bottomY: number) => {
            switch (coral.type) {
                case 'branch':
                    drawBranchCoral(coral.x, bottomY, coral.size, coral.color, coral.branches);
                    break;
                case 'seaweed':
                    drawSeaweed(coral.x, bottomY, coral.size, coral.color, coral.blades);
                    break;
                case 'soft':
                    drawSoftCoral(coral.x, bottomY, coral.size, coral.color, coral.petals);
                    break;
            }
        };

        // Sandy bottom drawing
        const drawSandyBottom = (bottomY: number) => {
            if (bottomY > canvas.height + 50) return;

            ctx.save();

            // Main sand gradient
            const sandGradient = ctx.createLinearGradient(0, bottomY, 0, canvas.height);
            sandGradient.addColorStop(0, '#D4A574');
            sandGradient.addColorStop(0.4, '#C9986A');
            sandGradient.addColorStop(1, '#A07850');

            // Flat bottom
            ctx.beginPath();
            ctx.rect(0, bottomY, canvas.width, canvas.height - bottomY);
            ctx.fillStyle = sandGradient;
            ctx.fill();

            // Soft sand patches
            sandPatchesRef.current.forEach(patch => {
                const patchY = bottomY + patch.y;
                if (patchY < canvas.height) {
                    ctx.fillStyle = `rgba(160, 120, 80, ${patch.opacity})`;
                    ctx.beginPath();
                    ctx.ellipse(patch.x, patchY, patch.radius * 1.2, patch.radius * 0.6, 0, 0, Math.PI * 2);
                    ctx.fill();
                }
            });

            // Sand grains
            sandGrainsRef.current.forEach(grain => {
                const grainY = bottomY + grain.y;
                if (grainY >= bottomY && grainY < canvas.height) {
                    ctx.globalAlpha = grain.opacity;
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                    ctx.beginPath();
                    ctx.arc(grain.x, grainY, grain.size, 0, Math.PI * 2);
                    ctx.fill();
                }
            });

            ctx.restore();
        };

        const draw = () => {
            if (isChangingTheme) {
                animationId = requestAnimationFrame(draw);
                return;
            }

            updateScrollProgress();
            const scrollProgress = scrollProgressRef.current;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const baseY = canvas.height * 0.45;
            const parallax = canvas.height * 1.6;
            const surfaceY = baseY - scrollProgress * parallax;

            // Sky
            const skyOffsetY = -scrollProgress * parallax;
            ctx.save();
            ctx.translate(0, skyOffsetY);
            ctx.fillStyle = '#87CEEB';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            drawClouds();
            ctx.restore();

            // Bottom position
            const tBottom = smoothstep(0.75, 1.0, scrollProgress);
            const bottomY = lerp(canvas.height + 200, canvas.height - 100, tBottom);

            // Water
            const bgColor = getCurrentBgColor(scrollProgress);
            ctx.beginPath();
            ctx.moveTo(0, canvas.height);
            ctx.lineTo(0, surfaceY);

            for (let x = 0; x <= canvas.width; x += 10) {
                const y = surfaceY + Math.sin(x * 0.006 + timeRef.current) * 12;
                ctx.lineTo(x, y);
            }

            ctx.lineTo(canvas.width, canvas.height);
            ctx.closePath();
            ctx.fillStyle = bgColor;
            ctx.fill();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.lineWidth = 3;
            ctx.stroke();

            // Birds
            if (surfaceY > -200) {
                birdsRef.current.forEach(bird => {
                    bird.x += bird.speed;
                    if (bird.x > canvas.width + 50) bird.x = -50;
                    drawBird(bird.x, surfaceY - bird.yOffset, bird.size, timeRef.current, bird.wingFreq);
                });
            }

            // Draw sandy bottom and corals
            if (tBottom > 0.01 && bottomY < canvas.height + 50) {
                drawSandyBottom(bottomY);
                coralsRef.current.forEach(coral => drawCoral(coral, bottomY));
            }

            // Fish
            const fishBottomLimit = bottomY - 30;
            fishesRef.current.forEach(fish => {
                let screenY = surfaceY + fish.depth * parallax;
                if (screenY > fishBottomLimit) screenY = fishBottomLimit;

                if (screenY > -50 && screenY < fishBottomLimit + 50) {
                    fish.x += fish.speed * fish.dir;
                    if (fish.dir > 0 && fish.x > canvas.width + fish.size * 2) fish.x = -fish.size * 2;
                    else if (fish.dir < 0 && fish.x < -fish.size * 2) fish.x = canvas.width + fish.size * 2;
                    const wobble = Math.sin(timeRef.current * 2 + fish.x * 0.01) * 8;
                    drawFish(fish.x, screenY + wobble, fish.size, fish.color, fish.dir);
                }
            });

            timeRef.current += 0.02;
            animationId = requestAnimationFrame(draw);
        };

        resize();
        window.addEventListener('resize', resize);
        animationId = requestAnimationFrame(draw);

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', resize);
        };
    }, [theme, isChangingTheme, isMobile]);

    if (theme !== 'underwater') return null;

    return (
        <canvas
            ref={canvasRef}
            id="ocean-canvas"
            className="fixed inset-0 -z-20 pointer-events-none"
        />
    );
}
