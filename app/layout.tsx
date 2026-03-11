import { Suspense } from 'react';
import type { Metadata } from 'next';
import Providers from './providers';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Toast from '../components/common/toast';
import '../styles/global.css';

export const metadata: Metadata = {
  title: {
    default: 'Conduit',
    template: '%s | Conduit',
  },
  description: 'A fullstack implementation of the RealWorld App using Next.js, Prisma ORM and Apollo GraphQL stack',
  openGraph: {
    type: 'website',
    title: 'Conduit',
    description: 'A fullstack implementation of the RealWorld App using Next.js, Prisma ORM and Apollo GraphQL stack',
    siteName: 'next-real-world',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body>
        <Suspense>
          <Providers>
            <div className='flex flex-col h-screen'>
              <Header />
              {children}
              <Footer />
              <Toast />
            </div>
          </Providers>
        </Suspense>
      </body>
    </html>
  );
}
