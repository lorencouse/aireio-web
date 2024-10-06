'use client';

import { LogOut, Settings, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SignOut } from '@/utils/auth-helpers/server';
import { handleRequest } from '@/utils/auth-helpers/client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

export function UserProfile({ user }: any) {
  const router = useRouter();

  // if (!config?.auth?.enabled) {
  //   router.back();
  // }
  // const { user } = useUser();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="w-[2.25rem] h-[2.25rem]">
        <Avatar>
          <AvatarImage src={user?.imageUrl} alt="User Profile" />
          <AvatarFallback></AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/profile">
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>
          <Link href="/profile/appearance">
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Appearance</span>
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        {/* <SignOutButton> */}
        <DropdownMenuItem>
          <LogOut className="mr-2 h-4 w-4" />
          <span onClick={() => SignOut()}>Log out</span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
        {/* </SignOutButton> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
