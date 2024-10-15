import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';

import { City } from '@/utils/types';

export default function CityBreadCrumb({ city }: { city: City }) {
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
          <BreadcrumbLink href={`/cities/${city.country_code}/${city.state}`}>
            {city.state || city.state_code || 'city'}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage>{city.name}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
