'use client';

import Link from 'next/link';
import { SignOut } from '@/utils/auth-helpers/server';
import { handleRequest } from '@/utils/auth-helpers/client';
import Logo from '@/components/icons/Logo';
import { usePathname, useRouter } from 'next/navigation';
import { getRedirectMethod } from '@/utils/auth-helpers/settings';
import s from './Navbar.module.css';
import ModeToggle from '@/components/mode-toggle';
import Image from 'next/image';
import { UserProfile } from '@/components/user-profile';

interface NavlinksProps {
  user?: any;
}

export default function Navlinks({ user }: NavlinksProps) {
  const router = getRedirectMethod() === 'client' ? useRouter() : null;
  const links = [
    { name: 'Pricing', href: '/pricing' },
    { name: 'Account', href: '/account' },
    { name: 'Profile', href: '/profile' }
  ];

  return (
    <div className="relative flex flex-row justify-between py-4 align-center md:py-6">
      <div className="flex items-center flex-1">
        <Link href="/" className={s.logo} aria-label="Logo">
          <Image src="/images/logo.png" alt="Logo" width={32} height={32} />
        </Link>
        <nav className="ml-6 space-x-2 lg:block">
          <Link href="/profile" className={s.link}>
            Profile
          </Link>
          {user && (
            <Link href="/account" className={s.link}>
              Account
            </Link>
          )}
        </nav>
      </div>
      <div className="flex justify-end space-x-8">
        {user ? (
          <>
            <form onSubmit={(e) => handleRequest(e, SignOut, router)}>
              {/* <input type="hidden" name="pathName" value={usePathname()} /> */}
              <button type="submit" className={s.link}>
                Sign out
              </button>
            </form>
            <UserProfile user={user} />
          </>
        ) : (
          <Link href="/signin" className={s.link}>
            Sign In
          </Link>
        )}
        <ModeToggle />
      </div>
    </div>
  );
}
