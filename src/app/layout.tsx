import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Pellos — AI Visibility Report',
  description: 'Understand how AI sees your company and improve your recommendation visibility.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
