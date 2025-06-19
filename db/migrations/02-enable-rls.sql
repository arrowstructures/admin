-- Migration: Enable Row Level Security
-- Sets up RLS policies for the articles table

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
