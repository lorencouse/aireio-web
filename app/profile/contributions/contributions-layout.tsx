import { UserContribution } from '@/utils/types';
import ContributionCoins from './_components/contribution-coins';
import { ContributionsTable } from './_components/contribution-table';

export default function ContributionsLayout({
  contributions
}: {
  contributions: UserContribution[];
}) {
  const contributionLength = contributions.length;
  return (
    <div>
      <ContributionCoins contributionLength={contributionLength} />
      <ContributionsTable contributions={contributions} />
    </div>
  );
}
