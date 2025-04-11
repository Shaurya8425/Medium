import React from "react";

function Quote() {
  return (
    <div className='bg-slate-200 h-96 md:h-screen flex justify-center items-center flex-col'>
      <div className='pl-2'>
        <div className='max-w-md text-left text-2xl font-bold '>
          "Talk is cheap, show me the code"
        </div>
        <p className='font-semibold text-xl mt-1'>Linus Torwalds</p>
        <p className='font-semibold text-sm text-slate-500'>
          Finnish software engineer
        </p>
      </div>
    </div>
  );
}

export default Quote;
