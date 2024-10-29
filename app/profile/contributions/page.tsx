import { getUserContributions } from '@/app/actions/fetch';
import ContributionsLayout from './contributions-layout';

import { Separator } from '@/components/ui/separator';

export default async function ContributionsPage() {
  const contributions = await getUserContributions();

  if (!contributions) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Contributions</h3>
          <p className="text-sm text-muted-foreground">
            You have not made any contributions yet.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Contributions</h3>
        <p className="text-sm text-muted-foreground">
          Here are your latest contributions.
        </p>
      </div>
      <Separator />
      <ContributionsLayout contributions={contributions} />
    </div>
  );
}
