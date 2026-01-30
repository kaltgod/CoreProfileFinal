import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/contexts/ThemeContext";
import { LanguageProvider } from "@/lib/contexts/LanguageContext";
import SmoothScroll from "@/components/providers/SmoothScroll";

const roboto = Roboto({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "Кирсанов Егор Дмитриевич",
  description: "Гений, плейбой, хирург, стоматолог, полномочный представитель администрации президента, хакер, пилот гражданской авиации, заслуженный актер РФ, депутат государственной думы федерального собрания РФ и просто хороший человек",
  icons: {
    icon: [
      { url: '/icons/favicon.ico' },
      { url: '/icons/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/icons/apple-touch-icon.png',
  },
  manifest: '/icons/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        {/* Font Awesome */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"
          crossOrigin="anonymous"
        />
        {/* Prevent FOUC for theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('selectedTheme') || 'default';
                document.documentElement.classList.add('theme-' + theme);
                document.body.classList.add('theme-' + theme);
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className={`${roboto.variable} antialiased theme-default`} style={{ fontFamily: 'var(--font-roboto), Roboto, sans-serif' }}>
        <ThemeProvider>
          <LanguageProvider>
            <SmoothScroll>
              {children}
            </SmoothScroll>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
