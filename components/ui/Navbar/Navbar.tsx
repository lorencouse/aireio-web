import { getUser } from '@/utils/supabase/queries';
import { Dialog, DialogClose } from '@radix-ui/react-dialog';
import { Menu } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList
} from '@/components/ui/navigation-menu';

import ModeToggle from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import Link from 'next/link';
import Image from 'next/image';
import { UserProfile } from '@/components/user-profile';

export default async function Navbar() {
  const user = await getUser();

  const menuItems = [
    {
      title: 'Home',
      href: '/'
    }
  ];

  return (
    <div className="flex min-w-full fixed top-0 justify-between p-2 border-b z-10 dark:bg-opacity-50 bg-background">
      <div className="flex justify-between items-center w-full min-[825px]:hidden">
        <Dialog>
          <SheetTrigger className="p-2 transition">
            <Button
              size="icon"
              variant="ghost"
              className="w-8 h-8"
              aria-label="Open menu"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>aireio™</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col space-y-3 mt-[1rem]">
              {menuItems.map((item) => (
                <DialogClose asChild key={item.title}>
                  <Link href={item.href} legacyBehavior passHref>
                    <Button variant="outline" className="w-full">
                      {item.title}
                    </Button>
                  </Link>
                </DialogClose>
              ))}
              {user ? (
                <DialogClose asChild>
                  <Link href="/profile" legacyBehavior passHref>
                    <Button variant="outline" className="w-full">
                      Profile
                    </Button>
                  </Link>
                </DialogClose>
              ) : (
                <DialogClose asChild>
                  <Link href="/signin" legacyBehavior passHref>
                    <Button variant="outline" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                </DialogClose>
              )}
            </div>
          </SheetContent>
        </Dialog>

        <Link href="/" className="flex items-center" aria-label="Home">
          <Image
            src="/images/aireio-logo-full.jpg"
            alt="Aireio logo"
            width={100}
            height={30}
            className="rounded-sm"
          />
          <span className="sr-only">Home</span>
        </Link>

        <ModeToggle />
      </div>

      <NavigationMenu className="max-[825px]:hidden">
        <NavigationMenuList className="flex gap-3 w-full justify-between items-center">
          <Link href="/" className="pl-2 flex items-center" aria-label="Home">
            <Image
              src="/images/aireio-logo-full.jpg"
              alt="Aireio logo"
              width={100}
              height={30}
              className="rounded-sm"
            />
            <span className="sr-only">Home</span>
          </Link>
          {menuItems.map((item) => (
            <NavigationMenuItem key={item.title}>
              <Link href={item.href} legacyBehavior passHref>
                <Button variant="ghost">{item.title}</Button>
              </Link>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>

      <div className="flex items-center gap-2 max-[825px]:hidden">
        {user ? (
          <UserProfile user={user} />
        ) : (
          <Link href="/signin" className="text-foreground hover:underline">
            Sign In
          </Link>
        )}
        <ModeToggle />
      </div>
    </div>
  );
}
