'use client';

import { LogOut, Settings, User, Heart, MenuIcon } from 'lucide-react';
import Link from 'next/link';
import { SignOut } from '@/utils/auth-helpers/server';

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
import { UserProfile as UserProfileType } from '@/utils/types';
import CoinCount from './ui/Navbar/_components/coin-count';

export async function UserProfile({
  user,
  coinCount
}: {
  user: UserProfileType;
  coinCount: number;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="border border-gray-300 py-2 px-4 rounded-full flex flex-row items-center align-middle gap-4 hover:drop-shadow-lg bg-background">
        <MenuIcon className="w-5 h-5 text-gray-400 hover:drop-shadow-lg" />
        <Avatar className="w-[2.25rem] h-[2.25rem]">
          <AvatarImage
            src={user?.avatar_url || '/images/logo.png'}
            alt="User Profile"
          />
          <AvatarFallback></AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>
          <CoinCount count={coinCount} />
          {/* Your Profile */}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/profile">
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>
          <Link href="/favorites">
            <DropdownMenuItem>
              <Heart className="mr-2 h-4 w-4" />
              <span>Favorites</span>
              <DropdownMenuShortcut>⇧⌘F</DropdownMenuShortcut>
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

        <DropdownMenuItem>
          <LogOut className="mr-2 h-4 w-4" />
          <span onClick={() => SignOut()}>Log out</span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
