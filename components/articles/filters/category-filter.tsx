import type { Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"
import type { Article } from "@/types/article"
import { CATEGORIES } from "@/lib/constants"

interface CategoryFilterProps {
  table: Table<Article>
}

export function CategoryFilter({ table }: CategoryFilterProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full md:w-[180px] justify-between">
          {table.getColumn("category")?.getFilterValue()
            ? CATEGORIES.find((category) => category.value === table.getColumn("category")?.getFilterValue())?.label
            : "All Categories"}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]">
        <DropdownMenuCheckboxItem
          checked={!table.getColumn("category")?.getFilterValue()}
          onCheckedChange={() => table.getColumn("category")?.setFilterValue(undefined)}
        >
          All Categories
        </DropdownMenuCheckboxItem>
        {CATEGORIES.map((category) => (
          <DropdownMenuCheckboxItem
            key={category.value}
            checked={table.getColumn("category")?.getFilterValue() === category.value}
            onCheckedChange={() => table.getColumn("category")?.setFilterValue(category.value)}
          >
            {category.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
