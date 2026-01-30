'use client';

import { useState } from 'react';
import { TerminalPreloader } from '@/components/preloader/TerminalPreloader';
import { CustomCursor } from '@/components/cursor/CustomCursor';
import { MatrixBackground } from '@/components/backgrounds/MatrixBackground';
import { CosmosBackground } from '@/components/backgrounds/CosmosBackground';
import { OceanBackground } from '@/components/backgrounds/OceanBackground';
import { Header } from '@/components/header/Header';
import { HeroSection } from '@/components/main/HeroSection';
import { SocialButtons } from '@/components/main/SocialButtons';
import { HintText } from '@/components/main/HintText';
import { PhotosSection } from '@/components/gallery/PhotosSection';
import { Footer } from '@/components/Footer';
import { ScrollToTop } from '@/components/ui/ScrollToTop';

export default function Home() {
  const [showContent, setShowContent] = useState(false);

  return (
    <>
      {/* Preloader */}
      {!showContent && (
        <TerminalPreloader onComplete={() => setShowContent(true)} />
      )}

      {/* Custom Cursor */}
      <CustomCursor />

      {/* Background Effects */}
      <MatrixBackground />
      <CosmosBackground />
      <OceanBackground />

      {/* Header */}
      <Header visible={showContent} />

      {/* Main Content */}
      <main
        className="main-container transition-all duration-700"
        style={{
          minHeight: '100vh',
          paddingTop: '120px',
          paddingBottom: '60px',
          opacity: showContent ? 1 : 0,
        }}
      >
        <div
          className="container text-center"
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 20px',
          }}
        >
          <HeroSection />
          <SocialButtons />
          <HintText />
        </div>

        <PhotosSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Scroll to Top */}
      <ScrollToTop />
    </>
  );
}
