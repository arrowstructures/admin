"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
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
import { Textarea } from "@/components/ui/textarea";

export default function EditSliderPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    slider_image: "",
  });

  // Fetch slider data by id
  useEffect(() => {
    const fetchSlider = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("slider")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        toast.error("Failed to fetch slider data.");
        setIsLoading(false);
        return;
      }
      setFormData({
        title: data.title || "",
        description: data.description || "",
        slider_image: data.slider_image || "",
      });
      setImagePreview(data.slider_image || null);
      setIsLoading(false);
    };

    if (id) fetchSlider();
  }, [id]);

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
    let slider_image = formData.slider_image;

    // If new image selected, upload it
    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `slider-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("slider-images")
        .upload(filePath, imageFile);

      if (uploadError) {
        toast.error("Image upload failed.");
        setIsLoading(false);
        return;
      }

      const { data: publicURLData } = supabase.storage
        .from("slider-images")
        .getPublicUrl(filePath);

      slider_image = publicURLData?.publicUrl || "";
    }

    console.log("image url", slider_image);

    // Update slider row
    const { error } = await supabase
      .from("slider")
      .update({
        title: formData.title,
        description: formData.description,
        slider_image,
      })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update Slider.");
    } else {
      toast.success("Slider updated successfully!");
      router.push("/slider");
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit Slider</CardTitle>
          <CardDescription>Update the details of the Slider</CardDescription>
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
              <Label htmlFor="description">Description</Label>
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
                <div className="space-y-2">
                  <Label htmlFor="slider_image">Slider Image</Label>
                  <input
                  id="slider_image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={isLoading}
                  />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Project Image Preview"
                      className="mt-2 max-h-48 object-contain rounded border"
                      loading="lazy"
                          style={{ maxWidth: "100%" }}

                    />
                  )}
                </div>
            </div>
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Slider"}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
