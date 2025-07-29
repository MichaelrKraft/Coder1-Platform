import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Website Customization Studio - Transform Any Website with Your Voice',
  description:
    'Speak your design changes and watch them happen in real-time. The revolutionary AI-powered CSS customization platform.',
  keywords: 'website customization, CSS generator, AI design, voice control, website editor',
  authors: [{ name: 'Website Studio' }],
  openGraph: {
    title: 'Website Customization Studio',
    description: 'Transform any website with your voice',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <div className="fixed inset-0 -z-10 overflow-hidden">
          {/* Animated gradient background */}
          <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] gradient-bg opacity-20" />

          {/* Glass overlay */}
          <div className="absolute inset-0" style={{ backgroundColor: 'rgba(10, 10, 10, 0.9)' }} />
        </div>

        {children}
        <Toaster />
      </body>
    </html>
  );
}
