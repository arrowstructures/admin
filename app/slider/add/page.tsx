"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageIcon } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";

export default function AddSliderPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    slider_image: "",
  });

  const handleImageChange = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    let slider_image = "";

    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `slider-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("slider-images")
        .upload(filePath, imageFile);

      if (uploadError) {
        toast.error("Logo upload failed.");
        setIsLoading(false);
        return;
      }

      const { data: publicURLData } = supabase.storage
        .from("slider-images")
        .getPublicUrl(filePath);

      slider_image = publicURLData?.publicUrl || "";
    }

    const { error } = await supabase.from("slider").insert([
      {
        title: formData.title,
        description: formData.description,
        slider_image: slider_image,
      },
    ]);

    if (error) {
      toast.error("Failed to add Slider.");
    } else {
        router.push("/slider");
      toast.success("Slider added successfully!");
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Slider</CardTitle>
          <CardDescription>Fill out the details of the Slider</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
          <div className="relative flex flex-col items-center border border-dashed border-gray-400 p-4 rounded-md cursor-pointer">
            <label htmlFor="slider_image" className="cursor-pointer flex flex-col items-center">
                Add Image
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded mb-2"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImagePreview(null);
                      setImageFile(null);
                    }}
                    className="absolute top-0 right-0 bg-white border border-gray-300 rounded-full p-1 hover:bg-red-500 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <>
                  <ImageIcon className="h-12 w-12 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Upload client logo (optional)
                  </p>
                </>
              )}
              <Input
                id="slider_image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Adding..." : "Add Slider"}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
