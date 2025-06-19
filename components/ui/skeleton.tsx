// import { cn } from "@/lib/utils"

// function Skeleton({
//   className,
//   ...props
// }: React.HTMLAttributes<HTMLDivElement>) {
//   return (
//     <div
//       className={cn("animate-pulse rounded-md bg-primary/10", className)}
//       {...props}
//     />
//   )
// }

// export { Skeleton }

// components/ui/skeleton.tsx
import { cn } from "@/lib/utils"

export function Skeleton({ className }: { className: string }) {
  return <div className={cn("animate-pulse bg-muted rounded-md", className)} />
}
