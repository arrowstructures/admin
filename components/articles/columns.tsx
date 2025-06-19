"use client";

import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import type { ArticleClient } from "@/types/article";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  MoreHorizontal,
  Pencil,
  Eye,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { formatTimeAgo } from "@/lib/utils";
import Link from "next/link";
import { DeleteArticleDialog } from "./delete-article-dialog";

interface ColumnOptions {
  onRefresh: () => void;
}

export const createColumns = ({
  onRefresh,
}: ColumnOptions): ColumnDef<ArticleClient>[] => [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      const article = row.original;
      return (
        <div className="flex items-center space-x-3">
          <div className="h-12 w-12 relative overflow-hidden rounded-md flex-shrink-0">
            <Image
              src={
                article.thumbnail ||
                "/placeholder.svg?height=48&width=48&query=article"
              }
              alt="Article thumbnail"
              width={48}
              height={48}
              className="object-cover"
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              {article.isBreaking && (
                <Badge className="bg-red-500 hover:bg-red-600">Breaking</Badge>
              )}
            </div>
            <div className="font-medium truncate">{article.title}</div>
            <div className="text-xs text-muted-foreground">
              {formatTimeAgo(article.createdAt)}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "slug",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Slug
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="truncate max-w-[150px] text-muted-foreground">
        {row.original.slug}
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="truncate max-w-[200px]">{row.original.categoryLabel}</div>
    ),
    filterFn: (row, id, value) => {
      return value === row.original.category;
    },
  },
  {
    accessorKey: "author",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Author
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-gray-200 flex-shrink-0"></div>
          <span className="truncate">{row.original.author}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "views",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Views
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-right font-medium">{row.original.views}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge
          className={
            status === "published"
              ? "bg-green-600 hover:bg-green-700"
              : status === "draft"
              ? "bg-gray-600 hover:bg-gray-700"
              : "bg-amber-600 hover:bg-amber-700"
          }
        >
          {status === "published"
            ? "Published"
            : status === "draft"
            ? "Draft"
            : "Scheduled"}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value === row.original.status;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const article = row.original;
      const [showDeleteDialog, setShowDeleteDialog] = useState(false);

      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <Link href={`/admin/articles/${article.slug}/edit`}>
                <DropdownMenuItem>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
              </Link>
              <Link href={`/admin/articles/view/${article.slug}`}>
                <DropdownMenuItem>
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem
                className="text-red-600"
                onSelect={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DeleteArticleDialog
            article={article}
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
            onDeleted={onRefresh}
          />
        </div>
      );
    },
  },
];
