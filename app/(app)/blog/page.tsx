import { redirect } from "next/navigation";

const BlogPage = () => {
  return redirect("/blog/posts");
};

export default BlogPage;
