import { Card, CardContent, CardHeader, Skeleton } from "@/shared/ui";

function SkeletonCard({
  titleWidth = "w-40",
  subtitleWidth = "w-64",
  contentHeight = "h-[280px]",
}: {
  titleWidth?: string;
  subtitleWidth?: string;
  contentHeight?: string;
}) {
  return (
    <Card className="border-purple-500/10 bg-zinc-900/80">
      <CardHeader>
        <Skeleton className={`h-6 ${titleWidth}`} />
        <Skeleton className={`mt-2 h-4 ${subtitleWidth}`} />
      </CardHeader>
      <CardContent>
        <Skeleton className={`w-full ${contentHeight}`} />
      </CardContent>
    </Card>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <Card key={index} className="border-purple-500/10 bg-zinc-900/80">
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-28" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-9 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>

      <SkeletonCard
        titleWidth="w-32"
        subtitleWidth="w-96"
        contentHeight="h-[280px]"
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <SkeletonCard contentHeight="h-[320px]" />
        <SkeletonCard contentHeight="h-[320px]" />
      </div>

      <div className="space-y-6">
        <SkeletonCard
          titleWidth="w-48"
          subtitleWidth="w-[28rem]"
          contentHeight="h-[280px]"
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="border-purple-500/10 bg-zinc-900/70">
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-44" />
                </div>
                <Skeleton className="h-20 w-full rounded-lg" />
                <Skeleton className="h-20 w-full rounded-lg" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
