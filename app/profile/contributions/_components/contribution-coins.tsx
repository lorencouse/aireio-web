import { Card } from '@/components/ui/card';
import { CircleDollarSign } from 'lucide-react';

export default async function ContributionCoins({
  contributionLength
}: {
  contributionLength: number;
}) {
  return (
    <Card className="py-2 px-4 mb-4 flex items-center gap-2 bg-gradient-to-r from-yellow-50 to-yellow-100">
      <span className="font-medium">Your Contributions:</span>

      <CircleDollarSign className="text-yellow-500 w-5 h-5" />
      <span className="font-medium ">{`(${contributionLength})`}</span>
    </Card>
  );
}
