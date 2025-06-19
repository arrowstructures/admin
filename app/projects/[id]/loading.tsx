export default function Loading() {
    return (
      <div className="container py-12 md:py-24">
        <div className="space-y-8">
          <div className="h-8 w-48 animate-pulse rounded-md bg-muted" />
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="h-10 w-3/4 animate-pulse rounded-md bg-muted" />
                <div className="h-6 w-1/2 animate-pulse rounded-md bg-muted" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-6 animate-pulse rounded-md bg-muted" />
                ))}
              </div>
              <div className="space-y-4">
                <div className="h-8 w-1/3 animate-pulse rounded-md bg-muted" />
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-4 animate-pulse rounded-md bg-muted" />
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="aspect-[4/3] animate-pulse rounded-lg bg-muted" />
              <div className="grid gap-4 sm:grid-cols-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="aspect-square animate-pulse rounded-lg bg-muted" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
