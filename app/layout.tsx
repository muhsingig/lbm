import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Inter_Tight } from 'next/font/google';
import { ThresholdProvider } from '@/components/Threshold';
import SplashCursor from '@/components/SplashCursor';
import './globals.css';

/**
 * Two families, and the restraint is the point. A cultural institution's voice
 * is a high-contrast serif set large with air around it, and one quiet sans
 * doing everything else — including the wall labels, which are uppercase and
 * widely tracked the way a printed gallery label is.
 */
const display = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

const body = Inter_Tight({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-body',
  display: 'swap',
});

/* Absolute URLs for the share cards. Set NEXT_PUBLIC_SITE_URL at build time to
   the real domain; the fallback only keeps local builds valid. */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3100';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Second Nature — a walkthrough | Art House, NMACC',
  description:
    'Stand in Second Nature, presented by Superblue at the Art House, NMACC, Mumbai. An academic field study for Luxury Brand Management — one room at a time, hallway to Level 3.',
  openGraph: {
    title: 'Second Nature — a walkthrough',
    description:
      'One room at a time, from the hallway to Level 3. An academic field study of the Superblue exhibition at Art House, NMACC, Mumbai.',
    type: 'article',
    siteName: 'Second Nature — a walkthrough',
  },
  /* Each floor generates its own card from its own palette, so a shared link
     shows the room it points at rather than one card for the whole site. */
  twitter: {
    card: 'summary_large_image',
    title: 'Second Nature — a walkthrough',
    description:
      'One room at a time, from the hallway to Level 3. An academic field study of the Superblue exhibition at Art House, NMACC, Mumbai.',
  },
};

export const viewport: Viewport = {
  themeColor: '#0B0B0D',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    /* `data-room` is written by each room on mount, so the attribute the client
       has after a route change never matches what the server rendered. That is
       expected here, not a bug to chase. */
    <html
      lang="en"
      data-room="entrance"
      suppressHydrationWarning
      className={`${display.variable} ${body.variable}`}
    >
      {/* The provider lives in the root layout so the leaves survive the route
          change they are covering. */}
      <body>
        <ThresholdProvider>{children}</ThresholdProvider>
        {/* The cursor trail, on every page. It reads the room's own --accent,
            so the colour changes with the floor without being told. */}
        <SplashCursor />
      </body>
    </html>
  );
}
