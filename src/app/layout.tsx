import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CinemaGen - Cinematic AI Video Generation',
  description: 'Generate cinematic video clips with professional film grammar, color grading, and script-to-video pipeline.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
