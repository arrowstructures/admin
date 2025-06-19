"use client"

import { useState } from "react"
import type { Table } from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X, Trash2 } from "lucide-react"
import { CategoryFilter } from "./filters/category-filter"
import { StatusFilter } from "./filters/status-filter"
import type { ArticleClient } from "@/types/article"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import { useArticles } from "@/hooks/use-articles"
import { toast } from "sonner"

interface ArticlesTableToolbarProps {
  table: Table<ArticleClient>
  onRefresh: () => void
}

export function ArticlesTableToolbar({ table, onRefresh }: ArticlesTableToolbarProps) {
  const { deleteArticle } = useArticles()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const isFiltered = table.getState().columnFilters.length > 0 || table.getState().globalFilter !== ""
  const hasSelection = Object.keys(table.getState().rowSelection).length > 0

  const selectedArticles = table.getFilteredSelectedRowModel().rows.map((row) => row.original)

  const handleBulkDelete = async () => {
    setIsDeleting(true)
    try {
      // Delete each selected article
      const promises = selectedArticles.map((article) => deleteArticle(article.id))
      await Promise.all(promises)

      // Clear selection
      table.resetRowSelection()

      toast.success("Articles deleted", {
        description: `Successfully deleted ${selectedArticles.length} article(s).`,
      })

      setShowDeleteDialog(false)

      // Refresh the table
      onRefresh()
    } catch (error) {
      console.error("Error deleting articles:", error)
      toast.error("Failed to delete articles", {
        description: "Some articles could not be deleted. Please try again.",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="bg-white py-4 rounded-md border mb-4">
      <div className="px-4 flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search articles..."
            value={table.getState().globalFilter}
            onChange={(e) => table.setGlobalFilter(e.target.value)}
            className="pl-8 bg-background"
          />
        </div>
        <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
          <CategoryFilter table={table} />
          <StatusFilter table={table} />
          {isFiltered && (
            <Button
              variant="ghost"
              onClick={() => {
                table.resetColumnFilters()
                table.setGlobalFilter("")
              }}
              className="h-10"
            >
              <X className="mr-2 h-4 w-4" />
              Reset
            </Button>
          )}
          {hasSelection && (
            <Button
              variant="outline"
              className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Selected
            </Button>
          )}
        </div>
      </div>

      <ConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Selected Articles"
        description={`Are you sure you want to delete ${selectedArticles.length} selected article(s)? This action cannot be undone.`}
        onConfirm={handleBulkDelete}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  )
}
