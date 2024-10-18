import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';

import { City } from '@/utils/types';
import formatPlaceName from '@/utils/functions/formatePlaceName';

export default function StateBreadcrumbs({ city }: { city: City }) {
  const formattedCountry =
    formatPlaceName(city.country) ||
    formatPlaceName(city.country_code) ||
    'Country';
  const formattedState =
    formatPlaceName(city.state) || formatPlaceName(city.state_code) || 'State';
  return (
    <Breadcrumb className="mb-8 capitalize">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href={`/cities/${city.country_code}`}>
            {formattedCountry}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbItem>{formattedState}</BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
