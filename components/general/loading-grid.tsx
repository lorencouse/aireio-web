import { Skeleton } from '@/components/ui/skeleton';

export default function LoadingGrid() {
  return (
    <div className="grid xl:grid-cols-3 lg:grid-cols-2 gap-4">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  );
}

const SkeletonCard = () => {
  return (
    <div className="m-6">
      <Skeleton className="h-[200px] w-96 rounded-xl mb-4 " />
      <div className="space-y-2">
        <Skeleton className="h-4 w-96" />
        <Skeleton className="h-4 w-72" />
        <Skeleton className="h-4 w-64" />
      </div>
    </div>
  );
};
