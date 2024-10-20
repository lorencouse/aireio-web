'use server';

import { getUserProfile } from '@/utils/supabase/queries';
import { Menu, Home, User, LogIn, SquareMenu } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList
} from '@/components/ui/navigation-menu';
import ModeToggle from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger
} from '@/components/ui/drawer';
import Link from 'next/link';
import Image from 'next/image';
import { UserProfile } from '@/components/user-profile';
import FullLogo from '@/components/icons/FullLogo';

export default async function Navbar() {
  const user = await getUserProfile();

  const menuItems = [
    {
      title: 'Home',
      href: '/',
      icon: Home
    }
  ];

  return (
    <>
      {/* Mobile Navbar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t z-10 ">
        <div className="flex justify-around items-center p-2 ">
          <Link href="/" className="flex flex-col items-center">
            <Home className="h-6 w-6" />
            <span className="text-xs">Home</span>
          </Link>

          <Drawer>
            <DrawerTrigger asChild>
              <div className="flex flex-col items-center">
                <Menu className="h-6 w-6" />
                <span className="text-xs">Menu</span>
              </div>
            </DrawerTrigger>
            <DrawerContent className="bg-background text-foreground">
              <DrawerHeader className="w-full justify-center">
                <FullLogo width={100} height={50} />
              </DrawerHeader>
              <div className="flex flex-col space-y-3 p-4">
                {menuItems.map((item) => (
                  <DrawerClose asChild key={item.title}>
                    <Link href={item.href} className="w-full">
                      <Button variant="ghost" className="w-full justify-start">
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.title}
                      </Button>
                    </Link>
                  </DrawerClose>
                ))}
                {user ? (
                  <DrawerClose asChild>
                    <Link href="/profile" className="w-full">
                      <Button variant="ghost" className="w-full justify-start">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Button>
                    </Link>
                  </DrawerClose>
                ) : (
                  <DrawerClose asChild>
                    <Link href="/signin" className="w-full">
                      <Button variant="ghost" className="w-full justify-start">
                        <LogIn className="mr-2 h-4 w-4" />
                        Sign In
                      </Button>
                    </Link>
                  </DrawerClose>
                )}
                <ModeToggle />
              </div>
            </DrawerContent>
          </Drawer>

          {user ? (
            <UserProfile user={user} />
          ) : (
            <Link href="/signin" className="flex flex-col items-center">
              <LogIn className="h-6 w-6" />
              <span className="text-xs">Sign In</span>
            </Link>
          )}
        </div>
      </div>

      {/* Desktop Navbar */}
      <div className="hidden md:flex min-w-full fixed top-0 justify-between p-2 border-b z-10 dark:bg-opacity-50 bg-background">
        <NavigationMenu>
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
                <Link href={item.href}>
                  <Button variant="ghost">{item.title}</Button>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-2">
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
    </>
  );
}
