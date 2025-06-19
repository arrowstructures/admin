-- Storage setup for Supabase
-- Note: These commands need to be run by a Supabase admin or through the dashboard UI

-- Create storage bucket for article thumbnails
INSERT INTO storage.buckets (id, name, public) VALUES ('articles', 'articles', true);

-- Create a policy to allow authenticated users to upload files to the articles bucket
CREATE POLICY "Allow authenticated users to upload files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'articles');

-- Create a policy to allow users to update their own files
CREATE POLICY "Allow users to update their own files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'articles' AND owner = auth.uid());

-- Create a policy to allow users to delete their own files
CREATE POLICY "Allow users to delete their own files"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'articles' AND owner = auth.uid());

-- Create a policy to allow public access to read files
CREATE POLICY "Allow public access to files"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'articles');
