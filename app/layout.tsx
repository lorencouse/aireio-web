// app/layout.tsx

import { Metadata } from 'next';
import Footer from '@/components/ui/Footer';
import Navbar from '@/components/ui/Navbar';
// import { Toaster } from '@/components/ui/Toasts/toaster';
import LoadingGrid from '@/components/general/loading-grid';
import { PropsWithChildren, Suspense } from 'react';
import { getURL } from '@/utils/helpers';
import 'styles/main.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Comfortaa } from 'next/font/google';
import { getUser } from '@/utils/supabase/queries';

export const runtime = 'edge';

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
  const user = await getUser();
  return (
    <html lang="en" className={comfortaa.className}>
      <body className="bg-backgroud">
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
          {/* <Suspense>
            <LoadingGrid />
          </Suspense> */}
        </ThemeProvider>
      </body>
    </html>
  );
}
