"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { UploadCloud, X, Loader2, AlertCircle } from "lucide-react"
import Image from "next/image"
import { uploadImage, deleteImage, UploadError } from "@/lib/upload"
import { toast } from "sonner"

interface ImageUploadProps {
  value: string | null
  onChange: (value: string | null) => void
  onPathChange?: (path: string | null) => void
  className?: string
}

export function ImageUpload({ value, onChange, onPathChange, className = "" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [imagePath, setImagePath] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  // Initialize imagePath from value if it's a path
  useEffect(() => {
    if (value && value.includes("thumbnails/")) {
      setImagePath(value)
    }
  }, [value])

  const handleFileChange = useCallback(
    async (file: File) => {
      setIsUploading(true)
      setError(null)
      try {
        const result = await uploadImage(file)
        // We now only store the path, not the URL
        if (onPathChange) {
          onPathChange(result.path)
        }
        // But we still use the URL for display
        onChange(result.url)
        setImagePath(result.path)
        toast.success("Image uploaded successfully")
      } catch (error) {
        console.error("Upload error:", error)
        if (error instanceof UploadError) {
          setError(error.message)
          toast.error("Upload failed", { description: error.message })
        } else {
          setError("An unexpected error occurred")
          toast.error("Upload failed", { description: "An unexpected error occurred" })
        }
      } finally {
        setIsUploading(false)
      }
    },
    [onChange, onPathChange],
  )

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        handleFileChange(file)
      }
    },
    [handleFileChange],
  )

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      const file = e.dataTransfer.files?.[0]
      if (file) {
        handleFileChange(file)
      }
    },
    [handleFileChange],
  )

  const handleRemove = useCallback(async () => {
    if (imagePath) {
      try {
        await deleteImage(imagePath)
        toast.success("Image removed successfully")
      } catch (error) {
        console.error("Error removing image:", error)
        toast.error("Failed to remove image", {
          description: "The image was removed from the form but could not be deleted from storage",
        })
      }
    }
    onChange(null)
    setImagePath(null)
    setError(null)
    if (onPathChange) {
      onPathChange(null)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }, [imagePath, onChange, onPathChange])

  const handleButtonClick = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }, [])

  return (
    <div className={`space-y-4 ${className}`}>
      <div
        className={`border-2 border-dashed rounded-lg p-4 text-center ${
          isDragging ? "border-blue-500 bg-blue-50" : error ? "border-red-300 bg-red-50" : "border-gray-300"
        } transition-colors duration-200 cursor-pointer relative`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        {isUploading ? (
          <div className="py-8 flex flex-col items-center justify-center">
            <Loader2 className="h-10 w-10 text-gray-400 animate-spin mb-2" />
            <p className="text-sm text-gray-500">Uploading image...</p>
          </div>
        ) : value ? (
          <div className="relative aspect-video w-full overflow-hidden rounded-md">
            <Image
              src={value || "/placeholder.svg?height=200&width=400&query=article"}
              alt="Thumbnail"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 600px"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 rounded-full"
              onClick={(e) => {
                e.stopPropagation()
                handleRemove()
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : error ? (
          <div className="py-8 flex flex-col items-center justify-center text-red-500">
            <AlertCircle className="h-10 w-10 mb-2" />
            <p className="text-sm font-medium">{error}</p>
            <p className="text-xs mt-1">Click to try again</p>
          </div>
        ) : (
          <div className="py-8 flex flex-col items-center justify-center">
            <UploadCloud className="h-10 w-10 text-gray-400 mb-2" />
            <p className="text-sm font-medium text-gray-900">Click to upload or drag and drop</p>
            <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG or GIF (max. 5MB)</p>
          </div>
        )}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleInputChange}
          accept="image/*"
          className="hidden"
          disabled={isUploading}
        />
      </div>
    </div>
  )
}
