import type { Metadata, Viewport } from 'next';
import { Cinzel, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import { BottomNav } from '@/components/ceremony';

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-cinzel',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Yellow Dzambhala',
  description: 'A living shrine to the Lord of Wealth and Generosity.',
};

export const viewport: Viewport = {
  themeColor: '#0B0B0D',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cinzel.variable} ${cormorant.variable}`}>
      <body className="font-body">
        {/* Motion preference is applied to <html data-motion> on the client. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var s=JSON.parse(localStorage.getItem('dz.settings.v1')||'{}');if(s.motion==='off'){document.documentElement.dataset.motion='off'}}catch(e){}`,
          }}
        />
        <main className="mx-auto min-h-dvh max-w-md pb-24">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
