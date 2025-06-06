"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
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

export default function EditClientPage() {
  const { id } = useParams();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    client_name: "",
    email: "",
    mobile_number: "",
    company_name: "",
    location: "",
    client_logo_url: "",
  });

  // 🔄 Fetch existing client details
  useEffect(() => {
    const fetchClient = async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        toast.error("Failed to load client data.");
        return;
      }

      setFormData(data);
      setImagePreview(data.client_logo_url);
    };

    if (id) fetchClient();
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

    let logoUrl = formData.client_logo_url;

    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `client-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("client-images")
        .upload(filePath, imageFile);

      if (uploadError) {
        toast.error("Logo upload failed.");
        setIsLoading(false);
        return;
      }

      const { data: publicURLData } = supabase.storage
        .from("client-images")
        .getPublicUrl(filePath);

      logoUrl = publicURLData?.publicUrl || "";
    }

    const { error } = await supabase
      .from("clients")
      .update({
        client_name: formData.client_name,
        email: formData.email,
        mobile_number: formData.mobile_number,
        company_name: formData.company_name,
        location: formData.location,
        client_logo_url: logoUrl,
      })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update client.");
    } else {
      toast.success("Client updated successfully!");
      router.push("/clients");
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit Client</CardTitle>
          <CardDescription>Update client details below.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="client_name">Client Name</Label>
              <Input
                id="client_name"
                value={formData.client_name}
                onChange={(e) =>
                  setFormData({ ...formData, client_name: e.target.value })
                }
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="mobile_number">Mobile Number</Label>
              <Input
                id="mobile_number"
                value={formData.mobile_number}
                onChange={(e) =>
                  setFormData({ ...formData, mobile_number: e.target.value })
                }
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company_name">Company Name</Label>
              <Input
                id="company_name"
                value={formData.company_name}
                onChange={(e) =>
                  setFormData({ ...formData, company_name: e.target.value })
                }
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              disabled={isLoading}
            />
          </div>

          <div className="relative flex flex-col items-center border border-dashed border-gray-400 p-4 rounded-md cursor-pointer">
            <label htmlFor="image" className="cursor-pointer flex flex-col items-center">
              Update Logo
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
                      setFormData((prev) => ({ ...prev, client_logo_url: "" }));
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
                id="image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Client"}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
