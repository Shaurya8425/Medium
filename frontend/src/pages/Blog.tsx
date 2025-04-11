// selector, atom

import { useParams } from "react-router-dom";
import BlogSkeleton from "../components/BlogSkeleton";
import { useBlog } from "../hooks/useBlogs";
import BlogDetail from "../components/BlogDetail";

function Blog() {
  const { id } = useParams();
  const { loading, blog } = useBlog({
    id: id || "",
  });
  if (loading) {
    return (
      <div className=' flex flex-col gap-8 justify-center items-center p-4'>
        <BlogSkeleton />
        <BlogSkeleton />
        <BlogSkeleton />
      </div>
    );
  }
  return (
    <div>
      {blog && <BlogDetail blog={blog} />}
    </div>
  );
}

export default Blog;
