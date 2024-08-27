import type React from 'react';
import { useState } from 'react';

import { Button, buttonVariants } from '@/components/ui/button';

import { cn } from '@/utils';

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    title: string;
    component: React.ReactNode;
  }[];
  setActiveComponent: (component: React.ReactNode) => void;
}

function SidebarNav({
  className,
  items,
  setActiveComponent,
  ...props
}: SidebarNavProps) {
  const [activeTitle, setActiveTitle] = useState<string>(items[0].title);

  const handleButtonClick = (title: string, component: React.ReactNode) => {
    setActiveTitle(title);
    setActiveComponent(component);
  };

  return (
    <nav
      className={cn(
        'flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1',
        className,
      )}
      {...props}
    >
      {items.map((item) => (
        <Button
          variant='ghost'
          key={item.title}
          onClick={() => handleButtonClick(item.title, item.component)}
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'justify-start',
            activeTitle === item.title
              ? 'bg-border'
              : 'hover:bg-border hover:underline hover:no-underline',
          )}
        >
          {item.title}
        </Button>
      ))}
    </nav>
  );
}

export default SidebarNav;
