import { Link } from "react-router-dom";

interface BlogCardProps {
  authorName: string;
  title: string;
  content: string;
  publishedDate: string;
  id: number;
}

function BlogCard({
  id,
  authorName,
  title,
  content,
  publishedDate,
}: BlogCardProps) {
  return (
    <Link to={`/blog/${id}`}>
      <div className='cursor-pointer'>
        <div className='flex items-center space-x-1 text-sm'>
          <Avatar name={authorName} />
          <span>{authorName}</span>
          <span>·</span>
          <span className='text-xs text-gray-500'>{publishedDate}</span>
        </div>
        <div className='text-3xl font-semibold mt-2'>{title}</div>
        <div className='text-xl text-slate-600 mb-2'>
          {content.length > 100 ? content.slice(0, 100) + "..." : content}
        </div>
        <div className='text-xs text-slate-400'>{`${Math.ceil(
          content.length / 100
        )} minutes`}</div>
        <hr className='border-t-slate-200 my-2' />
      </div>
    </Link>
  );
}

/* function Circle() {
  return <div className='h-1 w-1 rounded-full bg-slate-400'></div>;
}
 */
export function Avatar({ name, size = 7 }: { name: string; size?: number }) {
  const initials = name
    .split(" ")
    .map((word, index) => (index < 2 ? word[0] : ""))
    .join("");

  const sizeClasses = {
    7: "w-7 h-7",
    8: "w-8 h-8",
    10: "w-10 h-10",
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center ${
        sizeClasses[size as keyof typeof sizeClasses] || "w-7 h-7"
      } overflow-hidden bg-gray-100 rounded-full dark:bg-gray-500`}
    >
      <span className='font-medium text-xs text-gray-600 dark:text-gray-100'>
        {initials}
      </span>
    </div>
  );
}

export default BlogCard;
