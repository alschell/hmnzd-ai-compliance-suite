import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';
import { Providers } from '@/components/providers';
import { Toaster } from '@/components/ui/toaster';
import { Analytics } from '@/components/analytics';
import { TelemetryProvider } from '@/lib/telemetry';
import '@/styles/globals.css';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: {
    default: 'HMNZD AI Compliance Suite',
    template: '%s | HMNZD AI Compliance Suite',
  },
  description: 'Advanced AI-powered compliance management platform',
  keywords: ['compliance', 'GDPR', 'CCPA', 'HIPAA', 'ISO27001', 'AI', 'automation', 'risk management'],
  authors: [
    {
      name: 'HMNZD Team',
      url: 'https://hmnzd.ai',
    },
  ],
  creator: 'HMNZD Technologies Inc.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://compliance.hmnzd.ai',
    title: 'HMNZD AI Compliance Suite',
    description: 'Advanced AI-powered compliance management platform',
    siteName: 'HMNZD AI Compliance Suite',
    images: [
      {
        url: 'https://compliance.hmnzd.ai/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'HMNZD AI Compliance Suite',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HMNZD AI Compliance Suite',
    description: 'Advanced AI-powered compliance management platform',
    creator: '@hmnzd_ai',
    images: ['https://compliance.hmnzd.ai/twitter-image.jpg'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: 'https://compliance.hmnzd.ai/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`font-sans ${fontSans.variable}`}>
        <TelemetryProvider>
          <Providers>
            {children}
            <Toaster />
            <Analytics />
          </Providers>
        </TelemetryProvider>
      </body>
    </html>
  );
}
