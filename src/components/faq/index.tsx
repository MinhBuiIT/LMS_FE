'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaMinus, FaPlus } from 'react-icons/fa';
import GradientText from '../gradient-text';

const FAQ = () => {
  const [isDropDown, setIsDropDown] = useState<Boolean[]>(Array(4).fill(false));
  const [arr, setArr] = useState([1, 2, 3, 4]);
  const { t } = useTranslation();

  const handleDropDown = (index: number) => {
    setIsDropDown((prev) => {
      if (!prev) return [];
      const newDropDown = [...prev];
      newDropDown[index] = !newDropDown[index];
      return newDropDown;
    });
  };

  return (
    <div className="pt-[150px]  mb-[80px] bg-[rgb(231,241,250)]  dark:bg-black  h-full relative min-h-[80vh]">
      <div className="text-5xl leading-[65px] text-center capitalize gap-4 justify-center  dark:text-white text-black flex items-center">
        <div>{t('FAQTitle1')}</div>
        <GradientText>{t('FAQTitle2')}</GradientText>
      </div>
      <div style={{ paddingLeft: '100px', paddingRight: '150px' }} className="relative">
        {arr.map((i, index) => (
          <div className="mt-10 pb-8 border-b border-gray-400 dark:border-gray-700 w-full" key={index}>
            <div
              className="flex items-center justify-between text-black dark:text-white font-Poppins text-base"
              onClick={() => handleDropDown(index)}
            >
              <input
                type="text"
                placeholder="Question..."
                className="w-full border-none outline-none bg-transparent text-[20px] text-black dark:text-white"
                value={t(`FAQQ${index + 1}`)}
                disabled
              />
              {isDropDown[index] ? (
                <FaMinus className="text-black dark:text-white" />
              ) : (
                <FaPlus size={16} className="text-black dark:text-white" />
              )}
            </div>
            {isDropDown !== null && isDropDown[index] && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: isDropDown ? 'auto' : 0, opacity: isDropDown ? 1 : 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden mt-8"
              >
                <textarea
                  className="w-full border-none outline-none bg-transparent h-auto resize-none text-black dark:text-white"
                  value={t(`FAQA${index + 1}`)}
                  placeholder="Answer..."
                  rows={2}
                  disabled
                />
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
export default FAQ;
