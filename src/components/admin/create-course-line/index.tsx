import React from 'react';
import { FaCheck } from 'react-icons/fa';

type TProps = {
  active: number;
  setActive: (index: number) => void;
};

const CreateCourseLine: React.FC<TProps> = ({ active, setActive }) => {
  const courseLine = ['Course Infomation', 'Course Options', 'Course Content', 'Course Preview'];

  return (
    <div className="sticky top-[120px]">
      {courseLine.map((line, index) => {
        const isActive = active >= index;
        return (
          <div className={`flex items-center gap-[12px] relative mb-[46px] `} key={line}>
            <div
              className={`w-[36px] h-[36px]  ${
                isActive ? 'bg-blue-600' : 'bg-[#f0f0f0] dark:bg-[#2f3e5b]'
              } rounded-full flex items-center justify-center`}
            >
              <FaCheck size={14} className="text-black dark:text-white" />
            </div>
            <div className="text-base text-black dark:text-white">{line}</div>
            {index !== courseLine.length - 1 && (
              <div
                className={`h-[35px] w-1 ${
                  isActive ? 'bg-blue-600' : 'bg-[#f0f0f0] dark:bg-[#2f3e5b]'
                } absolute bottom-[-40px] left-[16px]`}
              ></div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CreateCourseLine;
