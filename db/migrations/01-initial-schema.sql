-- Migration: Initial Schema
-- Creates the articles table and sets up basic structure

CREATE TABLE IF NOT EXISTS public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  content TEXT,
  thumbnail_path TEXT,
  category TEXT NOT NULL,
  author TEXT NOT NULL,
  views INTEGER DEFAULT 0,
  status TEXT NOT NULL,
  is_breaking BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  user_id UUID REFERENCES auth.users(id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_user_id ON public.articles(user_id);
