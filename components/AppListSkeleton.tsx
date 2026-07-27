interface AppListSkeletonProps {
  count?: number
  compact?: boolean
}

export default function AppListSkeleton({ count = 3, compact = false }: AppListSkeletonProps) {
  return (
    <div className={`grid grid-cols-1 gap-4 ${compact ? '' : 'md:grid-cols-2 lg:grid-cols-3 md:gap-6'}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-[22px] border border-[var(--app-ios-line)] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,20,0.04)]"
        >
          <div className="mb-4 flex animate-pulse flex-wrap gap-2">
            <div className="h-7 w-28 rounded-full bg-[rgba(31,77,67,0.08)]" />
            <div className="h-7 w-20 rounded-full bg-[rgba(31,77,67,0.06)]" />
          </div>
          <div className="space-y-3 animate-pulse">
            <div className="h-6 w-4/5 rounded-full bg-[rgba(31,77,67,0.08)]" />
            <div className="h-4 w-full rounded-full bg-[rgba(31,77,67,0.06)]" />
            <div className="h-4 w-5/6 rounded-full bg-[rgba(31,77,67,0.06)]" />
          </div>
          <div className="mt-6 animate-pulse border-t border-[var(--app-ios-line)] pt-4">
            <div className="h-4 w-1/2 rounded-full bg-[rgba(31,77,67,0.06)]" />
            <div className="mt-2 h-4 w-2/3 rounded-full bg-[rgba(31,77,67,0.05)]" />
          </div>
        </div>
      ))}
    </div>
  )
}
