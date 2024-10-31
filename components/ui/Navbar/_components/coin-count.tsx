import { CircleDollarSign } from 'lucide-react';
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent
} from '@/components/ui/tooltip';
import Link from 'next/link';

interface CoinCountProps {
  count: number;
}

export default function CoinCount({ count }: CoinCountProps) {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <div className="flex justify-between items-center gap-1 text-sm font-medium">
          <span>Your Account</span>
          <TooltipTrigger>
            <Link
              href="/profile/contributions"
              className="flex items-center gap-1 hover:underline"
            >
              <span className="font-medium">{count ?? 0}</span>
              <CircleDollarSign className="text-yellow-500 w-5 h-5" />
            </Link>
          </TooltipTrigger>

          <TooltipContent>Your Contributions</TooltipContent>
        </div>
      </Tooltip>
    </TooltipProvider>
  );
}
