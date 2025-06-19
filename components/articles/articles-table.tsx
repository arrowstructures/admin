"use client";

import { useState, useCallback } from "react";
import {
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArticlesTableToolbar } from "./articles-table-toolbar";
import { ArticlesTablePagination } from "./articles-table-pagination";
import { useArticles } from "@/hooks/use-articles";
import { createColumns } from "./columns";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";

export function ArticlesTable() {
  const { articles, isLoading, refreshArticles } = useArticles();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5, // Show 5 items per page
  });

  const handleRefresh = useCallback(() => {
    refreshArticles();
  }, [refreshArticles]);

  // Add selection column
  const selectionColumn = {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  };

  // Create columns with refresh callback
  const columns = createColumns({ onRefresh: handleRefresh });

  // Combine selection column with other columns
  const allColumns = [selectionColumn, ...columns];

  const table = useReactTable({
    data: articles,
    columns: allColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
      pagination,
    },
  });

  if (isLoading) {
    return <ArticlesTableSkeleton />;
  }

  return (
    <div className="space-y-4">
      <ArticlesTableToolbar table={table} onRefresh={handleRefresh} />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="bg-muted/50">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={allColumns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <ArticlesTablePagination table={table} />
    </div>
  );
}

function ArticlesTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="bg-white py-4 rounded-md border mb-4">
        <div className="px-4 flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 md:items-center">
          <Skeleton className="h-10 w-full md:w-1/3" />
          <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
            <Skeleton className="h-10 w-full md:w-[180px]" />
            <Skeleton className="h-10 w-full md:w-[180px]" />
          </div>
        </div>
      </div>
      <div className="rounded-md border">
        <div className="p-2">
          <Skeleton className="h-10 w-full mb-4" />
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-20 w-full mb-2" />
            ))}
        </div>
      </div>
      <Skeleton className="h-10 w-full" />
    </div>
  );
}
