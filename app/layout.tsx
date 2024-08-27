import { Metadata } from 'next';
import Footer from '@/components/ui/Footer';
import Navbar from '@/components/ui/Navbar';
import { Toaster } from '@/components/ui/Toasts/toaster';
import { PropsWithChildren, Suspense } from 'react';
import { getURL } from '@/utils/helpers';
import 'styles/main.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Comfortaa } from 'next/font/google';
import { AuthProvider } from '@/utils/context/auth-wrapper';

const title = 'aireio';
const description = 'Find your workspace for the day.';

const comfortaa = Comfortaa({
  subsets: ['latin'],
  variable: '--font-comfortaa'
});

export const metadata: Metadata = {
  metadataBase: new URL(getURL()),
  title: title,
  description: description,
  openGraph: {
    title: title,
    description: description
  }
};

export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" className={comfortaa.className}>
      <body className="bg-backgroud">
        {/* <AuthProvider> */}
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            <main
              id="skip"
              className="min-h-[calc(100dvh-4rem)] md:min-h[calc(100dvh-5rem)] mt-20"
            >
              {children}
            </main>
            <Footer />
            <Suspense>
              <Toaster />
            </Suspense>
          </ThemeProvider>
        {/* </AuthProvider> */}
      </body>
    </html>
  );
}
