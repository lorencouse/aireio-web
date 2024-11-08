import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { UserContributionJoined } from '@/utils/types';
import formatPlaceName from '@/utils/functions/formatPlaceName';
import Link from 'next/link';
import { formatDateShort } from '@/utils/functions/formatTimestamp';
import ContributionRating from './contribution-rating';
import { CircleDollarSign } from 'lucide-react';

export function ContributionsTable({
  contributions
}: {
  contributions: UserContributionJoined[];
}) {
  return (
    <Table>
      <TableCaption>A list of your recent contributions.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Location</TableHead>
          <TableHead>Amenity</TableHead>
          <TableHead>Rating</TableHead>
          <TableHead className="text-right">Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {contributions.map((c) => (
          <TableRow key={c.id}>
            <TableCell className="font-medium">
              <Link
                href={
                  c.place_id
                    ? `/cities/${c.places.country_code}/${c.places.state}/${c.places.city}/${c.place_id}`
                    : '#'
                }
              >
                {c.places.name}
              </Link>
            </TableCell>
            <TableCell> {formatPlaceName(c.amenity_name)}</TableCell>
            <TableCell>
              <ContributionRating
                name={c.amenity_name ? c.amenity_name : ''}
                value={parseInt(c.value)}
                placeId={c.place_id ? c.place_id : ''}
                date={formatDateShort(c.timestamp)}
              />
            </TableCell>
            <TableCell className="text-right">
              {formatDateShort(c.timestamp)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell className="text-right" colSpan={4}>
            <div className="flex flex-row flex-wrap justify-end gap-2">
              <span className="font-extrabold">Total Contributions:</span>
              <CircleDollarSign className="text-yellow-500 w-5 h-5" />
              <span>{`(${contributions.length})`}</span>
            </div>
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
