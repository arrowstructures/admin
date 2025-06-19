"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Edit } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { formatTimeAgo } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/lib/supabase";
import type { ArticleClient } from "@/types/article";
import { useAuth } from "@/providers/supabase-auth-provider";
import { CATEGORIES } from "@/lib/constants";

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

export default function ArticleViewPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [article, setArticle] = useState<ArticleClient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchArticle = async () => {
      setIsLoading(true);
      try {
        // Fetch the article directly using Supabase
        const { data, error } = await supabase
          .from("articles")
          .select("*")
          .eq("slug", slug)
          .single();

        if (error) {
          throw error;
        }

        const articleData = snakeToCamel(data);

        // If article is not published and user is not authenticated or not the owner
        if (
          articleData.status !== "published" &&
          (!user || user.id !== articleData.userId)
        ) {
          router.push("/blog");
          return;
        }

        setArticle(articleData);
      } catch (err) {
        console.error("Error loading article:", err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [slug, user, router]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 max-w-4xl">
        <div className="mb-6">
          <Skeleton className="h-8 w-24 mb-4" />
          <Skeleton className="h-12 w-3/4 mb-2" />
          <Skeleton className="h-5 w-1/2" />
        </div>
        <Skeleton className="h-[300px] w-full mb-6" />
        <div className="space-y-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-6 w-5/6" />
          <Skeleton className="h-6 w-full" />
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="container mx-auto py-8 max-w-4xl">
        <div className="mb-6">
          <Link href="/blog">
            <Button variant="ghost" className="pl-0">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Blogs
            </Button>
          </Link>
        </div>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-red-500 mb-2">
            Article Not Found
          </h1>
          <p className="text-muted-foreground mb-6">
            The article you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => router.push("/blog")}>Return to Blogs</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-6 flex justify-between items-center">
        <Link href="/blog">
          <Button variant="ghost">
            <ChevronLeft className="h-4 w-4" />
            Back to Blogs
          </Button>
        </Link>
        {user && user.id === article.userId && (
          <Link href={`/admin/blog/${slug}/edit`}>
            <Button variant="outline" size="sm" className="gap-2">
              <Edit className="h-4 w-4" /> Edit Article
            </Button>
          </Link>
        )}
      </div>

      <article className="bg-white rounded-lg  p-6 md:p-8">
        {/* Article Header */}
        <header className="mb-6">
          {article.isBreaking && (
            <Badge className="bg-red-500 hover:bg-red-600 mb-3">
              Breaking News
            </Badge>
          )}
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            {article.title}
          </h1>
          <div className="flex flex-wrap items-center text-sm text-muted-foreground">
            <span>By {article.author}</span>
            <span className="mx-2">•</span>
            <span>{formatTimeAgo(article.createdAt)}</span>
            {article.category && (
              <>
                <span className="mx-2">•</span>
                <span>{article.categoryLabel}</span>
              </>
            )}
          </div>
        </header>

        {/* Featured Image */}
        {article.thumbnail && (
          <div className="relative w-full h-[300px] md:h-[400px] mb-8 rounded-lg overflow-hidden">
            <Image
              src={article.thumbnail || "/placeholder.svg"}
              alt={article.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
              priority
            />
          </div>
        )}

        {/* Article Content */}
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{
            __html: article.content || "<p>No content</p>",
          }}
        />

        {/* Article Footer */}
        <footer className="mt-8 pt-4 border-t">
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Views: {article.views}
            </div>
            <div className="text-sm text-muted-foreground">
              Last updated: {formatTimeAgo(article.createdAt)}
            </div>
          </div>
        </footer>
      </article>
    </div>
  );
}
