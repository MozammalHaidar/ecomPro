const Skeleton = ({ className }) => {
  return (
    <div className={`animate-pulse bg-gray-200 rounded-xl ${className}`} />
  );
};

export const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <Skeleton className="w-full h-52 rounded-none" />
      <div className="p-4 flex flex-col gap-3">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/4" />
        <div className="flex justify-between items-center mt-1">
          <Skeleton className="h-5 w-1/4" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export const ProductDetailSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <Skeleton className="h-4 w-32 mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <Skeleton className="w-full h-96" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export const OrderCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <div className="flex justify-between mb-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="w-12 h-12 rounded-lg" />
        <Skeleton className="w-12 h-12 rounded-lg" />
        <Skeleton className="w-12 h-12 rounded-lg" />
      </div>
      <div className="flex justify-between mt-4 pt-4 border-t">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  );
};

export default Skeleton;