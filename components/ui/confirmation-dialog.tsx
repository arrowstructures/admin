"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AlertTriangle } from "lucide-react"

interface ConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  onConfirm: () => void
  onCancel?: () => void
  confirmText?: string
  cancelText?: string
  variant?: "danger" | "warning" | "info"
  isLoading?: boolean
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  isLoading = false,
}: ConfirmationDialogProps) {
  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    }
    onOpenChange(false)
  }

  const handleConfirm = () => {
    onConfirm()
  }

  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return {
          icon: <AlertTriangle className="h-6 w-6 text-red-500" />,
          confirmButton: "bg-red-600 hover:bg-red-700 text-white",
        }
      case "warning":
        return {
          icon: <AlertTriangle className="h-6 w-6 text-amber-500" />,
          confirmButton: "bg-amber-600 hover:bg-amber-700 text-white",
        }
      case "info":
        return {
          icon: <AlertTriangle className="h-6 w-6 text-blue-500" />,
          confirmButton: "bg-blue-600 hover:bg-blue-700 text-white",
        }
      default:
        return {
          icon: <AlertTriangle className="h-6 w-6 text-red-500" />,
          confirmButton: "bg-red-600 hover:bg-red-700 text-white",
        }
    }
  }

  const variantStyles = getVariantStyles()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex flex-row items-center gap-4">
          {variantStyles.icon}
          <div>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription className="pt-1">{description}</DialogDescription>
          </div>
        </DialogHeader>
        <DialogFooter className="mt-4 flex justify-end space-x-2">
          <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button className={variantStyles.confirmButton} onClick={handleConfirm} disabled={isLoading}>
            {isLoading ? "Processing..." : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
