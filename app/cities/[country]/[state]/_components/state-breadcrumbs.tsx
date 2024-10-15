import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';

import { City } from '@/utils/types';

export default function StateBreadcrumbs({ city }: { city: City }) {
  return (
    <Breadcrumb className="mb-8 capitalize">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href={`/cities/${city.country_code}`}>
            {city.country || city.country_code || 'Country'}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbItem>
          {city.state || city.state_code || 'state'}
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
