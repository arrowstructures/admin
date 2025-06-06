"use client";

import type React from "react";

import { useEffect, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save, Eye, ImageIcon, Upload } from "lucide-react";
import Link from "next/link";
import { LoadingSpinner } from "@/components/loading-spinner";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { useRouter } from "next/navigation";


export default function AddMemberPage() {
    const router = useRouter();
      const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile_number: "",
    designation: "",
    profile_image: "",
  });

//   useEffect(() => {
//     const fetchCategories = async () => {
//       const { data, error } = await supabase
//         .from("project_category")
//         .select("id, project_category_name");
//       console.log("Fetched categories:", data);
//       if (error) {
//         console.error("Error fetching categories:", error);
//         toast.error("Failed to fetch categories");
//       } else {
//         setCategories(data);
//       }
//     };

//     fetchCategories();
//   }, []);
  const handleImageChange = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); // 👈 Show preview
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    let imageUrl = "";

    // Upload image to Supabase Storage
    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `member-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("member-images")
        .upload(filePath, imageFile);

      if (uploadError) {
        console.error("Image upload failed:", uploadError);
        toast.error("Failed to upload image.");
        setIsLoading(false);
        return;
      }

      const { data: publicURLData } = supabase.storage
        .from("member-images")
        .getPublicUrl(filePath);

      imageUrl = publicURLData?.publicUrl || "";
    }

    // Insert project data into the database
    const { data, error } = await supabase.from("team_members").insert([
      {
        name: formData.name,
        email: formData.email,
        designation: formData.designation,
        mobile_number: formData.mobile_number,
        profile_image: imageUrl,
      },
    ]);

    if (error) {
      console.error("Error inserting project:", error);
      toast.error("Failed to add member.");
    } else {
      router.push("/team");
      toast.success("Member added successfully!");
      setFormData({
        name: "",
        email: "",
        designation: "",
        mobile_number: "",
        profile_image: "",
      });
      setImageFile(null);
    }

    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/team">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Member</h1>
          <p className="text-muted-foreground">
            Create a new Member
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Member Details</CardTitle>
                <CardDescription>
                  Enter the main information for the member
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Member Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          name: e.target.value,
                        })
                      }
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      placeholder="emp@gmail.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="mobile_number">Mobile Number</Label>
                    <Input
                      id="mobile_number"
                      placeholder="e.g. Metro Corp"
                      value={formData.mobile_number}
                      onChange={(e) => setFormData({ ...formData, mobile_number: e.target.value })}
                      disabled={isLoading}
                    />
                  </div>
                <div className="space-y-2">
                    <Label htmlFor="designation">Designation</Label>
                    <Input
                      id="designation"
                      placeholder="Senior Software Engg"
                      value={formData.designation}
                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="relative flex flex-col items-center border border-dashed border-gray-400 p-4 rounded-md cursor-pointer">
  <label
    htmlFor="profile_image"
    className="cursor-pointer flex flex-col items-center"
  >
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
            e.stopPropagation(); // Prevent label click
            setImagePreview(null);
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
          Drag and drop an image, or click to browse
        </p>
      </>
    )}
    <Input
      id="profile_image"
      type="file"
      accept="image/*"
      className="hidden"
      onChange={handleImageChange}
    />
  </label>
</div>

              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  type="submit"
                  onClick={handleSubmit}
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Member
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  disabled={isLoading}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
