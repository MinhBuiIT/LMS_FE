'use client';
import { FC } from 'react';
import ReviewList from '../review-list';

type TProps = {
  courseId: string;
};

const ReviewCourse: FC<TProps> = ({ courseId }) => {
  return (
    <div className="mt-[40px] text-black dark:text-white font-Poppins pb-[64px] px-6">
      <ReviewList courseId={courseId} isEnrolled={true} />
    </div>
  );
};

export default ReviewCourse;
