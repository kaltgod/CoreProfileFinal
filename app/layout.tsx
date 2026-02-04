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
  description: "Гений, плейбой, хирург, стоматолог, полномочный представитель администрации президента, хакер, пилот гражданской авиации, заслуженный актер РФ, депутат государственной думы федерального собрания РФ, гроссмейстер по егерьмейстеру и просто хороший человек",
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
        {/* Yandex.Metrika counter */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(m,e,t,r,i,k,a){
                m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                m[i].l=1*new Date();
                for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
                k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
              })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=106418960', 'ym');

              ym(106418960, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});
            `,
          }}
        />
        <noscript>
          <div>
            <img src="https://mc.yandex.ru/watch/106418960" style={{ position: 'absolute', left: '-9999px' }} alt="" />
          </div>
        </noscript>
        {/* /Yandex.Metrika counter */}

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
