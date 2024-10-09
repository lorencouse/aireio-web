import s from './Navbar.module.css';
import Navlinks from './Navlinks';
import { getUser } from '@/utils/supabase/queries';
import { Dialog, DialogClose } from '@radix-ui/react-dialog';
import { Menu } from 'lucide-react';
import { cn } from '@/utils/cn';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from '@/components/ui/navigation-menu';

// import { UserProfile } from '../user-profile';
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
      <div className="flex justify-between w-full min-[825px]:hidden">
        <Dialog>
          <SheetTrigger className="p-2 transition">
            <Button
              size="icon"
              variant="ghost"
              className="w-4 h-4"
              aria-label="Open menu"
              asChild
            >
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>aireio™</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col space-y-3 mt-[1rem]">
              <DialogClose asChild>
                <Link href="/">
                  <Button variant="outline" className="w-full">
                    Home
                  </Button>
                </Link>
              </DialogClose>
              <DialogClose asChild>
                <Link
                  href="/profile"
                  legacyBehavior
                  passHref
                  className="cursor-pointer"
                >
                  <Button variant="outline">Profile</Button>
                </Link>
              </DialogClose>
            </div>
          </SheetContent>
        </Dialog>
        <ModeToggle />
      </div>
      <NavigationMenu>
        <NavigationMenuList className="max-[825px]:hidden flex gap-3 w-[100%] justify-between">
          <Link href="/" className="pl-2 flex items-center" aria-label="Home">
            <Image
              src="/images/logo.png"
              alt="Aireio logo"
              width={30}
              height={30}
            />
            <span className="sr-only">Home</span>
          </Link>
        </NavigationMenuList>
        <NavigationMenuList>
          {menuItems.map((item) => (
            <NavigationMenuItem
              className="max-[825px]:hidden mt-2 ml-4"
              key={item.title}
            >
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
          <Link href="/signin" className={s.link}>
            Sign In
          </Link>
        )}
        <ModeToggle />
      </div>
    </div>
  );
}

//   return (
//     <nav className={s.root}>
//       <a href="#skip" className="sr-only focus:not-sr-only">
//         Skip to content
//       </a>
//       <div className="max-w-6xl px-6 mx-auto">
//         <Navlinks user={user} />
//       </div>
//     </nav>
//   );
// }
