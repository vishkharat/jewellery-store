import Skeleton from "./Skeleton";

function PageHeaderSkeleton() {
  return (
    <div className="mb-10 text-center">
      <div className="mx-auto mb-3 w-fit">
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="mx-auto w-fit">
        <Skeleton className="h-10 w-56" />
      </div>
    </div>
  );
}

export default PageHeaderSkeleton;