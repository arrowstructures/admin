-- Migration: User Trigger
-- Creates a trigger to add a welcome article when a new user signs up

-- Create a function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
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
