'use client';

import CustomLink from '../components/common/CustomLink';

export default function NotFound() {
  return (
    <div className='flex-2 mt-14 md:mt-12'>
      <div className='container flex flex-col items-center mx-auto space-y-2 mt-24'>
        <h1 className='text-6xl font-light'>404</h1>
        <p>
          <CustomLink href='/' replace mode='primary' underlined>
            Go To Home Page
          </CustomLink>
        </p>
        <p className='text-center'>Sorry, the content you are looking for could not be found.</p>
      </div>
    </div>
  );
}
