import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { AuthProvider } from '@/components/auth/auth-provider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: 'SeeVoca - Learn English Through Stories',
  description: 'Interactive English vocabulary learning platform for kids. Watch stories, play games, and learn!',
  metadataBase: new URL('https://seevoca.com'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(
        inter.variable,
        outfit.variable,
        "min-h-screen font-sans antialiased bg-slate-50 text-slate-900 selection:bg-brand-200 selection:text-brand-900"
      )}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
