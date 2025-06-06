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

type Category = {
  id: string;
  project_category_name: string;
};

export default function AddProjectPage() {
    const router = useRouter();
      const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    project_name: "",
    client: "",
    category: "",
    description: "",
    location: "",
    status: "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("project_category")
        .select("id, project_category_name");
      console.log("Fetched categories:", data);
      if (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to fetch categories");
      } else {
        setCategories(data);
      }
    };

    fetchCategories();
  }, []);
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
      const filePath = `project-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("project-images")
        .upload(filePath, imageFile);

      if (uploadError) {
        console.error("Image upload failed:", uploadError);
        toast.error("Failed to upload image.");
        setIsLoading(false);
        return;
      }

      const { data: publicURLData } = supabase.storage
        .from("project-images")
        .getPublicUrl(filePath);

      imageUrl = publicURLData?.publicUrl || "";
    }

    // Insert project data into the database
    const { data, error } = await supabase.from("projects").insert([
      {
        project_name: formData.project_name,
        client: formData.client,
        category: formData.category,
        description: formData.description,
        location: formData.location,
        status: formData.status,
        image: imageUrl, // save image URL
      },
    ]);

    if (error) {
      console.error("Error inserting project:", error);
      toast.error("Failed to add project.");
    } else {
      router.push("/projects");
      toast.success("Project added successfully!");
      setFormData({
        project_name: "",
        client: "",
        category: "",
        description: "",
        location: "",
        status: "",
      });
      setImageFile(null);
    }

    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/projects">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Project</h1>
          <p className="text-muted-foreground">
            Create a new construction project
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
                <CardDescription>
                  Enter the main information for the project
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="project_name">Project Name</Label>
                    <Input
                      id="project_name"
                      placeholder="e.g. Downtown Office Complex"
                      value={formData.project_name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          project_name: e.target.value,
                        })
                      }
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client">Client</Label>
                    <Input
                      id="client"
                      placeholder="e.g. Metro Corp"
                      value={formData.client}
                      onChange={(e) =>
                        setFormData({ ...formData, client: e.target.value })
                      }
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        setFormData({ ...formData, category: value })
                      }
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder="Select category"
                          id="category"
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem
                            key={cat.id}
                            value={cat.project_category_name}
                          >
                            {cat.project_category_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="e.g. New York, NY"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      disabled={isLoading}
                    />
                  </div>
                </div>
                {/* <div className="space-y-2">
                    <Label htmlFor="category">category</Label>
                    <Input
                      id="category"
                      placeholder="e.g. Metro Corp"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      disabled={isLoading}
                    />
                  </div> */}

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the project scope and objectives..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={4}
                    disabled={isLoading}
                  />
                </div>
                  <div className="relative flex flex-col items-center border border-dashed border-gray-400 p-4 rounded-md cursor-pointer">
  <label
    htmlFor="image"
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
      id="image"
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
                <CardTitle>Timeline & Budget</CardTitle>
                <CardDescription>
                  Set project timeline and budget
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget">Budget</Label>
                  <Input
                    id="budget"
                    placeholder="e.g. $2,500,000"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    disabled={isLoading}
                  />
                </div> */}

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData({ ...formData, status: value })
                    }
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" id="status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Planning">Planning</SelectItem>
                      <SelectItem value="inprogress">In Progress</SelectItem>
                      <SelectItem value="on hold">On Hold</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

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
                      Save Project
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
