import Link from 'next/link';
import Image from 'next/image';

import Logo from '@/components/icons/Logo';
import GitHub from '@/components/icons/GitHub';
import StyledTitle from '@/components/icons/styledTitle';

export default function Footer() {
  return (
    <footer className="mx-auto max-w-[1920px] px-6 bg-muted">
      <div className="grid grid-cols-1 gap-8 py-12 text-foreground transition-colors duration-150 border-b lg:grid-cols-12 border-zinc-600 bg-muted">
        <div className="col-span-1 lg:col-span-2">
          <Link
            href="/"
            className="flex items-center flex-initial font-bold md:mr-24"
          >
            <span className="mr-2 border rounded-full border-zinc-700">
              <Logo height={32} width={32} />
            </span>
            <StyledTitle />
          </Link>
        </div>
        <div className="col-span-1 lg:col-span-2">
          <ul className="flex flex-col flex-initial md:flex-1">
            <li className="py-3 md:py-0 md:pb-4">
              <Link
                href="/"
                className="text-fore transition duration-150 ease-in-out hover:text-zinc-200"
              >
                Home
              </Link>
            </li>
            <li className="py-3 md:py-0 md:pb-4">
              <Link
                href="/"
                className="text-fore transition duration-150 ease-in-out hover:text-zinc-200"
              >
                About
              </Link>
            </li>
            <li className="py-3 md:py-0 md:pb-4">
              <Link
                href="/"
                className="text-fore transition duration-150 ease-in-out hover:text-zinc-200"
              >
                Contact
              </Link>
            </li>
            <li className="py-3 md:py-0 md:pb-4">
              <Link
                href="/"
                className="text-fore transition duration-150 ease-in-out hover:text-zinc-200"
              >
                Blog
              </Link>
            </li>
          </ul>
        </div>
        <div className="col-span-1 lg:col-span-2">
          <ul className="flex flex-col flex-initial md:flex-1">
            <li className="py-3 md:py-0 md:pb-4">
              <p className="font-bold text-fore transition duration-150 ease-in-out hover:text-zinc-200">
                LEGAL
              </p>
            </li>
            <li className="py-3 md:py-0 md:pb-4">
              <Link
                href="/"
                className="text-fore transition duration-150 ease-in-out hover:text-zinc-200"
              >
                Privacy Policy
              </Link>
            </li>
            <li className="py-3 md:py-0 md:pb-4">
              <Link
                href="/"
                className="text-fore transition duration-150 ease-in-out hover:text-zinc-200"
              >
                Terms of Use
              </Link>
            </li>
          </ul>
        </div>
        <div className="flex items-start col-span-1 text-fore lg:col-span-6 lg:justify-end">
          <div className="flex items-center h-10 space-x-6">
            <a
              aria-label="Github Repository"
              href="https://github.com/vercel/nextjs-subscription-payments"
            >
              <GitHub />
            </a>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-between py-12 space-y-4 md:flex-row bg-muted-fore text-fore">
        <div>
          <span>
            &copy; {new Date().getFullYear()} <StyledTitle />, Inc. All rights
            reserved.
          </span>
        </div>
        <div className="flex items-center">
          <span className="text-fore">Created by</span>
          <a
            href="https://www.lorencouse.com"
            aria-label="www.lorencouse.com Link"
          >
            <Image
              src="/images/Loren-Couse-Logo.jpg"
              alt="Loren Couse Logo"
              className="inline-block rounded-sm ml-4 text-fore"
              width={30}
              height={30}
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
