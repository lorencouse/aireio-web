// app/layout.tsx

import { Metadata } from 'next';
import Footer from '@/components/ui/Footer';
import Navbar from '@/components/ui/Navbar';
import { PropsWithChildren } from 'react';
import { getURL } from '@/utils/helpers';
import 'styles/main.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Comfortaa } from 'next/font/google';

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
  // const user = await getUser();
  // const profile = await getUserProfile(user);

  return (
    <html lang="en" className={comfortaa.className}>
      <body className="bg-backgroud">
        {/* <UserProvider user={user} profile={profile}> */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main
            id="skip"
            className="min-h-[calc(100dvh-4rem)] md:min-h[calc(100dvh-5rem)] md:mt-16 mb-16 max-w-7xl mx-auto"
          >
            {children}
          </main>
          <Footer />
        </ThemeProvider>
        {/* </UserProvider> */}
      </body>
    </html>
  );
}
