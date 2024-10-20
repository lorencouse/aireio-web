'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';

interface DynamicBreadcrumbProps {
  placeName?: string;
}

export default function DynamicBreadcrumb({
  placeName
}: DynamicBreadcrumbProps) {
  const pathname = usePathname();
  const pathSegments = pathname
    .split('/')
    .filter((segment) => segment !== '' && segment !== 'cities');

  const breadcrumbItems = [
    { href: '/', label: 'Home' },
    ...pathSegments.map((segment, index) => ({
      href: `/${['cities', ...pathSegments.slice(0, index + 1)].join('/')}`,
      label:
        segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')
    }))
  ];

  // Replace the last item's label with placeName if it's provided and we're on an [id] page
  if (
    placeName &&
    breadcrumbItems.length > 1 &&
    /^[0-9a-fA-F-]{36}$/.test(pathSegments[pathSegments.length - 1])
  ) {
    breadcrumbItems[breadcrumbItems.length - 1].label = placeName;
  }

  return (
    <Breadcrumb className="p-4 capitalize">
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => (
          <BreadcrumbItem key={item.href}>
            {index === breadcrumbItems.length - 1 ? (
              <BreadcrumbPage>{item.label}</BreadcrumbPage>
            ) : (
              <Link href={item.href} passHref legacyBehavior>
                <BreadcrumbLink>{item.label}</BreadcrumbLink>
              </Link>
            )}
            {index < breadcrumbItems.length - 1 && (
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
            )}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
