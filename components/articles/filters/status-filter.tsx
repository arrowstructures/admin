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
import { STATUSES } from "@/lib/constants"

interface StatusFilterProps {
  table: Table<Article>
}

export function StatusFilter({ table }: StatusFilterProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full md:w-[180px] justify-between">
          {table.getColumn("status")?.getFilterValue()
            ? STATUSES.find((status) => status.value === table.getColumn("status")?.getFilterValue())?.label
            : "All Statuses"}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]">
        <DropdownMenuCheckboxItem
          checked={!table.getColumn("status")?.getFilterValue()}
          onCheckedChange={() => table.getColumn("status")?.setFilterValue(undefined)}
        >
          All Statuses
        </DropdownMenuCheckboxItem>
        {STATUSES.map((status) => (
          <DropdownMenuCheckboxItem
            key={status.value}
            checked={table.getColumn("status")?.getFilterValue() === status.value}
            onCheckedChange={() => table.getColumn("status")?.setFilterValue(status.value)}
          >
            {status.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
