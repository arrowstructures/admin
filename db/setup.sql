-- Newsletter Database Setup Script
-- This script sets up the complete database schema for the newsletter application
-- Run this script in the Supabase SQL Editor to initialize your database

-- Create articles table with proper schema
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
CREATE INDEX IF NOT EXISTS idx_articles_category ON public.articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_status ON public.articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON public.articles(created_at);

-- Enable Row Level Security
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Policy: Users can view all published articles
CREATE POLICY "Anyone can view published articles" 
ON public.articles 
FOR SELECT 
USING (status = 'published' OR auth.uid() = user_id);

-- Policy: Users can only insert their own articles
CREATE POLICY "Users can insert their own articles" 
ON public.articles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only update their own articles
CREATE POLICY "Users can update their own articles" 
ON public.articles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Policy: Users can only delete their own articles
CREATE POLICY "Users can delete their own articles" 
ON public.articles 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create a function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- You can add code here to create default data for new users
  -- For example, creating a default profile or welcome article
  
  -- Insert a welcome article for new users
  INSERT INTO public.articles (
    title, 
    slug, 
    content, 
    category, 
    author, 
    status, 
    user_id
  ) VALUES (
    'Welcome to your Newsletter Dashboard', 
    'welcome-to-your-newsletter-dashboard', 
    '<p>This is your first article. You can edit or delete it, or create new articles from the dashboard.</p>', 
    'top-news', 
    'System', 
    'draft', 
    NEW.id
  );
  
  RETURN NEW;
END;
$$;

-- Create a trigger to call the function when a new user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create storage bucket for article thumbnails (must be run by admin)
-- Note: This needs to be executed by a Supabase admin or through the dashboard
-- INSERT INTO storage.buckets (id, name, public) VALUES ('articles', 'articles', true);

-- Create a policy to allow authenticated users to upload files to the articles bucket
-- Note: This needs to be executed by a Supabase admin or through the dashboard
-- CREATE POLICY "Allow authenticated users to upload files"
-- ON storage.objects
-- FOR INSERT
-- TO authenticated
-- WITH CHECK (bucket_id = 'articles');

-- Create a policy to allow users to update their own files
-- Note: This needs to be executed by a Supabase admin or through the dashboard
-- CREATE POLICY "Allow users to update their own files"
-- ON storage.objects
-- FOR UPDATE
-- TO authenticated
-- USING (bucket_id = 'articles' AND owner = auth.uid());

-- Create a policy to allow users to delete their own files
-- Note: This needs to be executed by a Supabase admin or through the dashboard
-- CREATE POLICY "Allow users to delete their own files"
-- ON storage.objects
-- FOR DELETE
-- TO authenticated
-- USING (bucket_id = 'articles' AND owner = auth.uid());

-- Create a policy to allow public access to read files
-- Note: This needs to be executed by a Supabase admin or through the dashboard
-- CREATE POLICY "Allow public access to files"
-- ON storage.objects
-- FOR SELECT
-- TO public
-- USING (bucket_id = 'articles');

-- Sample data (optional) - uncomment to add sample articles
/*
INSERT INTO public.articles (
  title,
  slug,
  content,
  category,
  author,
  status,
  is_breaking,
  user_id
) VALUES 
(
  'முக்கிய செய்திகள் - Breaking News',
  'breaking-news',
  '<p>This is a sample breaking news article.</p>',
  'top-news',
  'Admin',
  'published',
  true,
  '00000000-0000-0000-0000-000000000000'  -- Replace with an actual user ID
),
(
  'அரசியல் செய்திகள் - Politics News',
  'politics-news',
  '<p>This is a sample politics article.</p>',
  'politics',
  'Admin',
  'published',
  false,
  '00000000-0000-0000-0000-000000000000'  -- Replace with an actual user ID
),
(
  'தொழில்நுட்ப செய்திகள் - Technology News',
  'technology-news',
  '<p>This is a sample technology article.</p>',
  'technology',
  'Admin',
  'draft',
  false,
  '00000000-0000-0000-0000-000000000000'  -- Replace with an actual user ID
);
*/

-- Note: To insert the sample data, replace the user_id with an actual user ID from your auth.users table
-- You can get a user ID by running: SELECT id FROM auth.users LIMIT 1;
