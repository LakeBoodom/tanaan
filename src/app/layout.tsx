import type { Metadata } from 'next';
import { Lora, Work_Sans } from 'next/font/google';
import './globals.css';

// Editorial serif for headings and emphasis
const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-lora',
  display: 'swap',
});

// Clean sans-serif for body text
const workSans = Work_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-work-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Tänään — Digital Almanac',
  description: 'A calm, editorial almanac for today',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fi" className={`${lora.variable} ${workSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
