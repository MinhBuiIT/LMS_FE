'use client';
import { useGetListCoursesQuery } from '@/src/redux/api/courseApi';
import { useRouter } from 'next/navigation';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import CourseItemCard from '../course-item-card';
import GradientText from '../gradient-text';

type TProps = {};

const CoursesSection: FC<TProps> = () => {
  const { data } = useGetListCoursesQuery({ page: 1, limit: 8 });
  const { t } = useTranslation();
  const router = useRouter();

  const courses = data?.data?.courses || [];

  return (
    <div className="pt-[150px]  mb-[80px] bg-[rgb(231,241,250)]  dark:bg-black  h-full relative min-h-[80vh]">
      <div className="text-5xl leading-[65px] text-center capitalize gap-4 justify-center  dark:text-white text-black flex items-center">
        <div>{t('CourseSectionTitle1')}</div>
        <GradientText>{t('CourseSectionTitle2')}</GradientText>
      </div>
      {courses.length > 0 && (
        <div className="grid md:grid-cols-4  sm:grid-cols-2 grid-cols-1 gap-4 max-w-[80%] mx-auto w-full mt-[60px]">
          {courses.map((course) => (
            <CourseItemCard courseItem={course} key={course._id} isEnroll={false} t={t} />
          ))}
        </div>
      )}
      <div className="flex items-center justify-center mt-10">
        <button
          onClick={() => router.push('/courses')}
          className=" relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-base font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 "
        >
          <span className="w-[150px] relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
            {t('SeeMore')}
          </span>
        </button>
      </div>
    </div>
  );
};

export default CoursesSection;
