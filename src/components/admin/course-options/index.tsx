import { IconButton } from '@mui/material';
import React from 'react';
import toast from 'react-hot-toast';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { MdOutlineDelete } from 'react-icons/md';

type CourseOptionsProps = {
  setActive?: (index: number) => void;
  benefits: string[];
  setBenefits: (benefits: string[]) => void;
  prerequisites: string[];
  setPrerequisites: (prerequisites: string[]) => void;
  isEdit?: boolean;
};

const CourseOptions: React.FC<CourseOptionsProps> = ({
  setActive,
  benefits,
  setBenefits,
  prerequisites,
  setPrerequisites,
  isEdit = false
}) => {
  const handleChangeBenefit = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newBenefits = [...benefits];
    newBenefits[index] = e.target.value;
    setBenefits(newBenefits);
  };
  const handleAddBenefit = () => {
    setBenefits([...benefits, '']);
  };
  const handleRemoveBenefit = (index: number) => {
    setBenefits(benefits.filter((_, i) => i !== index));
  };

  const handleChangePrerequisite = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newPrerequisites = [...prerequisites];
    newPrerequisites[index] = e.target.value;
    setPrerequisites(newPrerequisites);
  };
  const handleAddPrerequisite = () => {
    setPrerequisites([...prerequisites, '']);
  };
  const handleRemovePrerequisite = (index: number) => {
    setPrerequisites(prerequisites.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    if (benefits.length === 0 || prerequisites.length === 0) {
      toast.error('Please fill all the fields');
      return;
    }
    if (
      !benefits.every((benefit) => benefit.trim() !== '') ||
      !prerequisites.every((prerequisite) => prerequisite.trim() !== '')
    ) {
      toast.error('Please fill all the fields');
      return;
    }
    setActive && setActive(2);
  };

  return (
    <div className="w-full">
      <div>
        <h4 className="text-base text-black dark:text-white">What are the benefits for students in this course?</h4>
        <div className="w-full mt-3">
          {benefits.map((benefit, index) => (
            <div key={index} className="relative w-full">
              <input
                type="text"
                className=" border border-gray-300 dark:border-gray-700 rounded-md px-4 py-2 mt-2 text-base text-black dark:text-white mb-3 w-[95%]"
                placeholder={'Benefit ' + (index + 1)}
                onChange={(e) => handleChangeBenefit(e, index)}
                value={benefit}
              />
              {index === benefits.length - 1 && index !== 0 && (
                <IconButton
                  sx={{ position: 'absolute', top: '50%', right: '0px', transform: 'translateY(-50%)' }}
                  onClick={() => handleRemoveBenefit(index)}
                >
                  <MdOutlineDelete size={22} className="text-black dark:text-white" />
                </IconButton>
              )}
            </div>
          ))}
        </div>
        <IconButton style={{ marginTop: '6px' }} onClick={handleAddBenefit}>
          <IoIosAddCircleOutline size={28} className="text-black dark:text-white" />
        </IconButton>
      </div>

      <div className="mt-6">
        <h4 className="text-base text-black dark:text-white">What are the prerequisites for starting this course?</h4>
        <div className="w-full mt-3">
          {prerequisites.map((prerequisite, index) => (
            <div key={index} className="relative w-full">
              <input
                type="text"
                className=" border border-gray-300 dark:border-gray-700 rounded-md px-4 py-2 mt-2 text-base text-black dark:text-white mb-3 w-[95%]"
                placeholder={'Prerequisite ' + (index + 1)}
                onChange={(e) => handleChangePrerequisite(e, index)}
                value={prerequisite}
              />
              {index === prerequisites.length - 1 && index !== 0 && (
                <IconButton
                  sx={{ position: 'absolute', top: '50%', right: '0px', transform: 'translateY(-50%)' }}
                  onClick={() => handleRemovePrerequisite(index)}
                >
                  <MdOutlineDelete size={22} className="text-black dark:text-white" />
                </IconButton>
              )}
            </div>
          ))}
        </div>
        <IconButton style={{ marginTop: '6px' }} onClick={handleAddPrerequisite}>
          <IoIosAddCircleOutline size={28} className="text-black dark:text-white" />
        </IconButton>
      </div>
      <br />
      <br />

      {!isEdit && (
        <div className="w-full flex justify-between items-center">
          <button className="px-6 py-2 bg-blue-600 rounded-md text-white" onClick={() => setActive && setActive(0)}>
            Back
          </button>
          <button className="px-6 py-2 bg-blue-600 rounded-md text-white" onClick={handleNext}>
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default CourseOptions;
