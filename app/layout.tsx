import './globals.css';
import type { Metadata } from 'next';
import { Poppins, Inter, Montserrat } from 'next/font/google';
import React from 'react';

// Load fonts and expose as CSS variables for Tailwind
const poppins = Poppins({ subsets: ['latin'], weight: ['400','600','700'], variable: '--font-poppins', display: 'swap' });
const inter = Inter({ subsets: ['latin'], weight: ['400','600','700'], variable: '--font-inter', display: 'swap' });
const montserrat = Montserrat({ subsets: ['latin'], weight: ['400','600','700'], variable: '--font-montserrat', display: 'swap' });

export const metadata: Metadata = {
  title: 'Blink.ai — Am I the Problem?',
  description: 'Type your messy situation. Blink tells you the truth—brutally honest, zero sugarcoating.',
  openGraph: {
    title: 'Blink.ai — Am I the Problem?',
    description: 'Type your messy situation. Blink tells you the truth—brutally honest, zero sugarcoating.',
    images: ['/logo.png']
  },
  icons: {
    icon: '/favicon.ico'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable} ${montserrat.variable}`}>
      <body className="min-h-screen flex flex-col font-sans">{children}</body>
    </html>
  );
}
