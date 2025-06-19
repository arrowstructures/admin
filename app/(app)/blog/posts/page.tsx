"use client";

import Link from "next/link";
import Image from "next/image";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { supabase } from "@/lib/supabase";
import { formatTimeAgo } from "@/lib/utils";
import { CATEGORIES } from "@/lib/constants";

import type { ArticleClient } from "@/types/article";

// Helper function to convert snake_case to camelCase
const snakeToCamel = (article: any): ArticleClient => {
  // Find the category label from the category value
  const categoryObj = CATEGORIES.find((c) => c.value === article.category);
  const categoryLabel = categoryObj ? categoryObj.label : article.category;

  // Generate thumbnail URL from thumbnail_path
  const thumbnail = article.thumbnail_path
    ? supabase.storage.from("articles").getPublicUrl(article.thumbnail_path)
        .data.publicUrl
    : null;

  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    content: article.content,
    thumbnailPath: article.thumbnail_path,
    thumbnail: thumbnail,
    category: article.category,
    categoryLabel: categoryLabel,
    author: article.author,
    views: article.views,
    status: article.status,
    isBreaking: article.is_breaking,
    createdAt: new Date(article.created_at),
    userId: article.user_id,
  };
};

export default function PublicPostsPage() {
  const [articles, setArticles] = useState<ArticleClient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPublishedArticles = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("articles")
          .select("*")
          .eq("status", "published")
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        // Convert snake_case to camelCase
        const formattedData = data.map(snakeToCamel);
        setArticles(formattedData);
      } catch (err) {
        console.error("Error fetching published articles:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublishedArticles();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Latest Blogs</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Latest Blogs</h1>
      {articles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No published blogs found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Link key={article.id} href={`/blog/view/${article.slug}`}>
              <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
                <div className="relative h-48 w-full">
                  <Image
                    src={
                      article.thumbnail ||
                      "/placeholder.svg?height=192&width=384&query=article"
                    }
                    alt={article.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {/* {article.isBreaking && (
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-red-500 hover:bg-red-600">
                        Breaking
                      </Badge>
                    </div>
                  )} */}
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-2">
                    {article.title}
                  </CardTitle>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span>{formatTimeAgo(article.createdAt)}</span>
                    <span className="mx-1">•</span>
                    <span>{article.categoryLabel}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div
                    className="line-clamp-3 text-muted-foreground text-sm"
                    dangerouslySetInnerHTML={{
                      __html:
                        article.content
                          ?.replace(/<[^>]*>/g, " ")
                          .substring(0, 150) + "..." || "No content available",
                    }}
                  />
                </CardContent>
                <CardFooter className="text-sm text-muted-foreground">
                  By {article.author} • {article.views} views
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
