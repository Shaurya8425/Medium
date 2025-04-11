function BlogSkeleton() {
  return (
    <div className='cursor-pointer'>
      <div className='flex items-center space-x-1 text-sm'>
        <div className='w-7 h-7 rounded-full bg-gray-200'></div>
        <div className='h-4 w-24 bg-gray-200 rounded'></div>
        <div className='w-1 h-1 rounded-full bg-gray-200'></div>
        <div className='h-3 w-20 bg-gray-200 rounded'></div>
      </div>
      <div className='text-3xl font-semibold mt-2'>
        <div className='h-8 w-3/4 bg-gray-200 rounded'></div>
      </div>
      <div className='text-xl text-slate-600 mb-2'>
        <div className='h-6 w-full bg-gray-200 rounded'></div>
      </div>
      <div className='text-xs text-slate-400'>
        <div className='h-3 w-16 bg-gray-200 rounded'></div>
      </div>
      <hr className='border-t-slate-200 my-2' />
    </div>
  );
}

export default BlogSkeleton;
