import { TCourseInfo } from '@/src/@types/course';
import React from 'react';
import { BsDot } from 'react-icons/bs';
import { IoCheckmarkDoneOutline } from 'react-icons/io5';
import ReactPlayer from 'react-player';

type TProps = {
  setActive: (index: number) => void;
  courseInfo: TCourseInfo;
  benefits: string[];
  prerequisites: string[];
  handleConfirmCourse: () => void;
};

const CoursePreview: React.FC<TProps> = ({ setActive, courseInfo, benefits, prerequisites, handleConfirmCourse }) => {
  return (
    <div className="w-[90%] mx-auto pb-[60px]">
      {/* <CoursePlayer videoId={courseInfo.demoUrl} /> */}

      <div className="w-full h-[400px]">
        <ReactPlayer
          url={courseInfo.demoUrl.url}
          controls
          width="100%"
          height="100%"
          style={{ borderRadius: '8px', objectFit: 'cover' }}
          light={true}
        />
      </div>
      <div className="font-Poppins mt-10">
        <div className="flex items-center gap-4 text-black dark:text-white">
          <div className="text-xl font-bold">{courseInfo.estimatedPrice.toString() + '$'}</div>
          <div className="text-base mb-4 line-through">{courseInfo.price.toString() + '$'}</div>
          <div className="text-lg ">
            {Math.round(((courseInfo.price - courseInfo.estimatedPrice) / courseInfo.price) * 100)}% Off
          </div>
        </div>
        <ul className="ml-5 mt-8 text-black dark:text-white text-base">
          <li className="flex items-center gap-3">
            <BsDot size={16} />
            <span>Source included</span>
          </li>
          <li className="flex items-center gap-3">
            <BsDot size={16} />
            <span>Full lifetime access</span>
          </li>
          <li className="flex items-center gap-3">
            <BsDot size={16} />
            <span>Support at all times</span>
          </li>
        </ul>
        <div className="mt-8 text-black dark:text-white text-2xl">{courseInfo.name}</div>
        <div className="mt-8 text-black dark:text-white">
          <div className="text-lg">What you will learn from this course ?</div>
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-3 mt-2">
              <IoCheckmarkDoneOutline size={16} />
              <div className="text-lg">{benefit}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-black dark:text-white">
          <div className="text-lg">Prerequisites</div>
          {prerequisites.map((prerequisite, index) => (
            <div key={index} className="flex items-center gap-3 mt-2">
              <IoCheckmarkDoneOutline size={16} />
              <div className="text-lg">{prerequisite}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-black dark:text-white">
          <div className="text-lg">Course Detail</div>
          <div className="text-base mt-2">{courseInfo.description}</div>
        </div>

        <div className="w-full flex justify-between items-center mt-16">
          <button className="px-6 py-2 bg-blue-600 rounded-md text-white" onClick={() => setActive(2)}>
            Back
          </button>
          <button className="px-6 py-2 bg-blue-600 rounded-md text-white" onClick={handleConfirmCourse}>
            Create Course
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoursePreview;
