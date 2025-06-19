import { supabase } from "@/lib/supabase"
import { v4 as uuidv4 } from "uuid"
import { toast } from "sonner"

// Define allowed file types
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"]
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export interface UploadResult {
  url: string
  path: string
}

export class UploadError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "UploadError"
  }
}

export async function uploadImage(file: File): Promise<UploadResult> {
  // Validate file type
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    throw new UploadError("Invalid file type. Only JPEG, PNG, WebP, and GIF images are allowed.")
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new UploadError("File size exceeds the 5MB limit.")
  }

  try {
    // Generate a unique filename
    const fileExt = file.name.split(".").pop()
    const fileName = `${uuidv4()}.${fileExt}`
    const filePath = `thumbnails/${fileName}`

    // Upload file to Supabase Storage
    // We assume the bucket already exists (should be created in Supabase dashboard)
    const { error: uploadError } = await supabase.storage.from("articles").upload(filePath, file)

    if (uploadError) {
      console.error("Upload error:", uploadError)

      // Check for specific error types
      if (uploadError.message.includes("permission") || uploadError.message.includes("policy")) {
        throw new UploadError("Permission denied. You don't have access to upload files.")
      } else if (uploadError.message.includes("bucket") || uploadError.message.includes("not found")) {
        throw new UploadError("Storage bucket 'articles' not found. Please contact an administrator to create it.")
      } else {
        throw new UploadError(`Error uploading file: ${uploadError.message}`)
      }
    }

    // Get public URL
    const { data } = supabase.storage.from("articles").getPublicUrl(filePath)

    return {
      url: data.publicUrl,
      path: filePath,
    }
  } catch (error) {
    if (error instanceof UploadError) {
      throw error
    }
    throw new UploadError(`Failed to upload image: ${(error as Error).message}`)
  }
}

export async function deleteImage(path: string): Promise<void> {
  try {
    const { error } = await supabase.storage.from("articles").remove([path])

    if (error) {
      console.error("Error deleting file:", error)
      // We'll log the error but not throw, to avoid blocking the UI
      toast.error("Failed to delete image from storage", {
        description: "The image reference was removed, but the file may still exist in storage.",
      })
    }
  } catch (error) {
    console.error("Failed to delete image:", error)
    // We'll log the error but not throw, to avoid blocking the UI
    toast.error("Failed to delete image from storage", {
      description: "The image reference was removed, but the file may still exist in storage.",
    })
  }
}
