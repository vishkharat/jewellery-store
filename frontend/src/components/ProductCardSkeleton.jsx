import Skeleton from "./Skeleton";

function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
      <Skeleton className="h-56 w-full sm:h-64 lg:h-72" />

      <div className="p-4 sm:p-5">
        <Skeleton className="mb-3 h-5 w-3/4" />
        <Skeleton className="mb-4 h-4 w-1/3" />

        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
    </div>
  );
}

export default ProductCardSkeleton;