'use client';

import { useState, useEffect, useRef } from 'react';
import { useTheme } from '@/lib/contexts/ThemeContext';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const variants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 1000 : -1000,
        opacity: 0,
        scale: 0.8,
    }),
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1,
        scale: 1,
    },
    exit: (direction: number) => ({
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0,
        scale: 0.8,
    })
};

interface Photo {
    src: string;
    captionKey: string;
}

const PHOTOS: Photo[] = [
    { src: '/photos/1.jpg', captionKey: 'photo1' },
    { src: '/photos/2.jpg', captionKey: 'photo2' },
    { src: '/photos/3.jpg', captionKey: 'photo3' },
    { src: '/photos/4.jpg', captionKey: 'photo4' },
];

export function PhotosSection() {
    const { theme } = useTheme();
    const { t } = useLanguage();
    // We keep track of [page, direction] to determine animation direction
    // page is just an absolute counter, direction is 1 or -1
    const [[page, direction], setPage] = useState([0, 0]);
    const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
    const [visiblePhotos, setVisiblePhotos] = useState<Set<number>>(new Set());
    const photoRefs = useRef<(HTMLDivElement | null)[]>([]);
    const touchStartX = useRef(0);



    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const index = Number(entry.target.getAttribute('data-index'));
                    if (entry.isIntersecting) {
                        setVisiblePhotos((prev) => new Set([...prev, index]));
                    }
                });
            },
            { threshold: 0.2 }
        );

        photoRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => observer.disconnect();
    }, []);

    const paginate = (newDirection: number) => {
        setPage([page + newDirection, newDirection]);
        setSelectedPhoto((prev) => {
            if (prev === null) return null;
            let nextIndex = prev + newDirection;
            if (nextIndex < 0) nextIndex = PHOTOS.length - 1;
            if (nextIndex >= PHOTOS.length) nextIndex = 0;
            return nextIndex;
        });
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedPhoto === null) return;
            if (e.key === 'Escape') setSelectedPhoto(null);
            else if (e.key === 'ArrowLeft') paginate(-1);
            else if (e.key === 'ArrowRight') paginate(1);
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [selectedPhoto, page]); // Update deps

    useEffect(() => {
        document.body.style.overflow = selectedPhoto !== null ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [selectedPhoto]);

    const handleNext = (e: React.SyntheticEvent) => {
        e.stopPropagation();
        paginate(1);
    };

    const handlePrev = (e: React.SyntheticEvent) => {
        e.stopPropagation();
        paginate(-1);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        const diff = touchStartX.current - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) paginate(1);
            else paginate(-1);
        }
    };

    // ... (rest of methods)



    const getTitleStyle = () => {
        switch (theme) {
            case 'cosmos':
                return { color: '#eaf6ff', textShadow: '0 0 10px rgba(176, 224, 230, 0.3)' };
            case 'underwater':
                return { color: '#e0f7fa', textShadow: '0 0 10px rgba(127, 181, 181, 0.3)' };
            default:
                return { color: '#ffffff', textShadow: '0 0 10px rgba(255, 255, 255, 0.3)' };
        }
    };

    const getModalBg = () => {
        switch (theme) {
            case 'cosmos': return 'rgba(2, 11, 26, 0.95)';
            case 'underwater': return 'rgba(1, 22, 39, 0.95)';
            default: return 'rgba(0, 0, 0, 0.95)';
        }
    };

    const getButtonColor = () => {
        switch (theme) {
            case 'cosmos': return '#b0e0e6';
            case 'underwater': return '#7fb5b5';
            default: return '#00ff00';
        }
    };

    const titleStyle = getTitleStyle();

    return (
        <>
            <section
                className="photos-section"
                style={{
                    padding: '60px 20px',
                    marginTop: '40px',
                }}
            >
                <h2
                    className="section-title text-center"
                    style={{
                        fontFamily: 'Roboto, sans-serif',
                        fontSize: '40px',
                        fontWeight: 700,
                        marginBottom: '40px',
                        color: titleStyle.color,
                        textShadow: titleStyle.textShadow,
                    }}
                >
                    {t('photosTitle')}
                </h2>

                <div
                    className="photos-container flex flex-wrap justify-center"
                    style={{ gap: '30px', maxWidth: '1200px', margin: '0 auto' }}
                >
                    {PHOTOS.map((photo, index) => (
                        <div
                            key={index}
                            ref={(el) => { photoRefs.current[index] = el; }}
                            data-index={index}
                            onClick={() => { setSelectedPhoto(index); setPage([index, 0]); }}
                            className="photo-item relative overflow-hidden transition-all duration-500 group"
                            style={{
                                width: '280px',
                                height: '280px',
                                borderRadius: '20px',
                                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
                                cursor: 'none',
                                opacity: visiblePhotos.has(index) ? 1 : 0,
                                transform: visiblePhotos.has(index)
                                    ? 'translateX(0)'
                                    : index % 2 === 0
                                        ? 'translateX(-50px)'
                                        : 'translateX(50px)',
                                transitionDelay: `${index * 100}ms`,
                            }}
                        >
                            <div className="absolute inset-0 bg-gray-800">
                                <Image
                                    src={photo.src}
                                    alt={t(photo.captionKey as 'photo1' | 'photo2' | 'photo3' | 'photo4')}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    sizes="280px"
                                />
                            </div>
                            {/* Hover caption */}
                            <div
                                className="photo-caption absolute bottom-0 left-0 right-0 transition-all duration-300 opacity-0 translate-y-full group-hover:opacity-100 group-hover:translate-y-0"
                                style={{
                                    padding: '20px 15px',
                                    background: 'linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent)',
                                }}
                            >
                                <p style={{ color: 'white', fontSize: '16px', fontWeight: 500 }}>
                                    {t(photo.captionKey as 'photo1' | 'photo2' | 'photo3' | 'photo4')}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Photo Gallery Modal */}
            {selectedPhoto !== null && (
                <div
                    className="photo-gallery-modal fixed inset-0 z-[200] flex items-center justify-center"
                    style={{ background: getModalBg() }}
                    onClick={() => setSelectedPhoto(null)}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >
                    <button
                        className="absolute flex items-center justify-center transition-colors"
                        style={{ top: '20px', right: '20px', width: '50px', height: '50px', color: getButtonColor(), background: 'transparent', border: 'none', cursor: 'none', zIndex: 10 }}
                        onClick={() => setSelectedPhoto(null)}
                    >
                        <i className="fas fa-times" style={{ fontSize: '28px' }} />
                    </button>

                    <button
                        className="absolute flex items-center justify-center transition-opacity hover:opacity-70"
                        style={{ left: '10px', top: '50%', transform: 'translateY(-50%)', width: '50px', height: '50px', color: getButtonColor(), background: 'rgba(0,0,0,0.3)', borderRadius: '50%', border: 'none', cursor: 'none', zIndex: 10 }}
                        onClick={handlePrev}
                    >
                        <i className="fas fa-chevron-left" style={{ fontSize: '24px' }} />
                    </button>

                    <div className="relative overflow-hidden flex items-center justify-center" style={{ width: '90vw', height: '80vh' }} onClick={(e) => e.stopPropagation()}>
                        <AnimatePresence initial={false} custom={direction}>
                            <motion.div
                                key={page}
                                custom={direction}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    x: { type: "spring", stiffness: 300, damping: 30 },
                                    opacity: { duration: 0.2 }
                                }}
                                className="absolute flex flex-col items-center justify-center w-full h-full"
                            >
                                <div className="relative w-full h-full">
                                    <Image
                                        src={PHOTOS[selectedPhoto!].src}
                                        alt={t(PHOTOS[selectedPhoto!].captionKey as any)}
                                        fill
                                        className="object-contain rounded-lg"
                                        priority
                                    />
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <button
                        className="absolute flex items-center justify-center transition-opacity hover:opacity-70"
                        style={{ right: '10px', top: '50%', transform: 'translateY(-50%)', width: '50px', height: '50px', color: getButtonColor(), background: 'rgba(0,0,0,0.3)', borderRadius: '50%', border: 'none', cursor: 'none', zIndex: 10 }}
                        onClick={handleNext}
                    >
                        <i className="fas fa-chevron-right" style={{ fontSize: '24px' }} />
                    </button>

                    <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', color: 'rgba(255,255,255,0.6)', fontSize: '14px', zIndex: 10 }}>
                        {selectedPhoto + 1} / {PHOTOS.length}
                    </div>
                </div>
            )}
        </>
    );
}
