import { Blog } from "../hooks/useBlogs";
import { Avatar } from "./BlogCard";

function BlogDetail({ blog }: { blog: Blog }) {
  if (!blog) {
    return <div>No blog data available</div>;
  }

  return (
    <div className='grid grid-cols-12 px-20'>
      <div className='col-span-8 flex flex-col gap-2'>
        <p className='text-5xl font-extrabold'>{blog.title}</p>
        <p className='font-semibold text-slate-600'>
          Post on {new Date().toLocaleDateString()}
        </p>
        <p className='text-2xl font-thin'>{blog.content}</p>
      </div>
      <div className='col-span-4 pl-2 flex flex-col gap-2'>
        <p className='text-xl font-bold'>Author</p>
        <div className='flex gap-1 items-center'>
          <div>
            <Avatar name={blog.author.name || "Anonymous"} size={10} />
          </div>
          <div>
            <p className='font-semibold text-xl'>
              {blog.author.name || "Anonymous"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogDetail;
