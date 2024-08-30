import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import updateUrlQuery  from '@/utils/updateUrlQuery';

interface SortMethodProps {
  // sortMethod: string;
  searchParams: { [key: string]: string | string[] | undefined };
}

const SortMethod: React.FC<SortMethodProps> = ({
  // sortMethod,
  searchParams
}) => {
  const sortMethods = ['distance', 'rating', 'rating-count', 'price'];
  const sortMethod = searchParams.sort_method || 'distance';



  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="capitalize">
          {`Sort by: ${sortMethod}`}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Sort By</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={sortMethod}>
          {sortMethods.map((option) => (
            <Link
              key={option}
              href={`?${updateUrlQuery('sort_method', option, searchParams)}`}
              passHref
              replace
              scroll={false}
            >
              <DropdownMenuRadioItem value={option} className="capitalize">
                {option}
              </DropdownMenuRadioItem>
            </Link>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SortMethod;
