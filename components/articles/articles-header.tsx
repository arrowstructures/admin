"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export function ArticlesHeader() {
  return (
    <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Articles</h1>
        <p className="text-muted-foreground mt-1">
          Manage your newsletter articles
        </p>
      </div>
      <Link href="/admin/articles/new">
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" /> Add New Article
        </Button>
      </Link>
    </div>
  );
}
