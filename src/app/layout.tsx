import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Meemimylly — Tee meemi sekunneissa',
  description: 'Moderni suomalainen meemigeneraattori.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fi">
      <body>{children}</body>
    </html>
  );
}
