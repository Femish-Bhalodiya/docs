import { Inter as FontSans } from 'next/font/google';

import './globals.css';
import { cn } from '@/lib/utils';
import { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from 'react-hot-toast';
import { dark } from '@clerk/themes';
import Provider from './Provider';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Docs',
  description: 'Best collaborative editor',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: '#3371FF',
          fontSize: '16px',
        },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <head />
        <body className={cn('min-h-screen font-sans antialiased', fontSans.variable)}>
          <Provider>
            {children}
            <Toaster position="top-right" reverseOrder={false} />
          </Provider>
        </body>
      </html>
    </ClerkProvider>
  );
}
