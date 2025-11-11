import { Skeleton } from "../skeleton";

const MessageItemSkeleton = () => {
  return (
    <div className="bg-background text-primary mt-3 flex w-full gap-2 rounded-lg border">
      <div className="m-auto ml-2 h-max w-max shrink-0">
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>

      <div className="flex h-max w-full flex-1 flex-col gap-2 py-2">
        <div className="flex items-baseline gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-12" />
        </div>

        <div className="flex flex-col gap-1">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    </div>
  );
};

export default MessageItemSkeleton;
