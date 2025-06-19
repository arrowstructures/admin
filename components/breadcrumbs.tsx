"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const pathLinks = segments.map(
    (_, i) => "/" + segments.slice(0, i + 1).join("/")
  );

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.length === 0 ? (
          <BreadcrumbItem>
            <BreadcrumbPage>Home</BreadcrumbPage>
          </BreadcrumbItem>
        ) : (
          segments.map((segment, index) => {
            const href = pathLinks[index];
            const isLast = index === segments.length - 1;
            const label = segment
              .replace(/-/g, " ")
              .replace(/\b\w/g, (c) => c.toUpperCase());

            return (
              <div key={href} className="flex items-center">
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>{label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={href}>{label}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator />}
              </div>
            );
          })
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
