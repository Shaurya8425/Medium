import BlogCard from "../components/BlogCard";
import BlogSkeleton from "../components/BlogSkeleton";
import useBlogs from "../hooks/useBlogs";

function Blogs() {
  const { loading, blogs, error } = useBlogs();

  if (loading) {
    return (
      <div className=' flex flex-col gap-8 justify-center items-center p-4'>
        <BlogSkeleton />
        <BlogSkeleton />
        <BlogSkeleton />
      </div>
    );
  }

  if (error) {
    return <div className='text-red-500 text-center p-4'>{error}</div>;
  }

  return (
    <div className='flex flex-col w-1/2 m-auto'>
      {blogs.map((blog) => (
        <BlogCard
          id={blog.id}
          key={blog.id}
          authorName={blog.author.name || "Anonymous"}
          title={blog.title}
          content={blog.content}
          publishedDate={"2nd feb 2024"}
        />
      ))}
    </div>
  );
}

export default Blogs;
