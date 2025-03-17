'use client';
import CourseItemCard from '@/src/components/course-item-card';
import GradientText from '@/src/components/gradient-text';
import { useGetListCoursesQuery } from '@/src/redux/api/courseApi';
import { useGetLayoutQuery } from '@/src/redux/api/layoutApi';
import { Pagination, Stack } from '@mui/material';
import { useTheme } from 'next-themes';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import { useTranslation } from 'react-i18next';

type TProps = {};
const LIMIT = 8;
const CoursesView: React.FC<TProps> = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams?.get('search') || '';
  const category = searchParams?.get('category') || '';
  const [page, setPage] = React.useState(1);
  const [searchValue, setSearchValue] = React.useState('');
  const { resolvedTheme } = useTheme();
  const { data: categories } = useGetLayoutQuery({ type: 'category' });
  const { data } = useGetListCoursesQuery(
    { page, limit: LIMIT, search, category },
    { refetchOnMountOrArgChange: true }
  );
  const dataCourse = data?.data;

  const courses = dataCourse?.courses || [];

  const handleSubmitSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let url = `/courses?search=${searchValue}`;
    if (category) url += `&category=${category}`;
    router.push(url);
  };
  return (
    <div className=" bg-[rgb(231,241,250)] pb-[150px]  dark:bg-black  h-full relative min-h-[100vh] pt-[150px] px-[100px]">
      <div className="text-5xl leading-[65px] text-center capitalize gap-4 justify-center  dark:text-white text-black flex items-center">
        <GradientText>{t('CourseSectionTitle1')}</GradientText>
        <GradientText>{t('CourseSectionTitle2')}</GradientText>
      </div>
      <form className="max-w-md mx-auto my-[20px]" onSubmit={handleSubmitSearch}>
        <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
          {t('Search')}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            id="default-search"
            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search name..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <button
            type="submit"
            className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            {t('Search')}
          </button>
        </div>
      </form>

      <div className="flex w-full items-center gap-4 flex-nowrap overflow-x-auto mt-8">
        <button
          type="button"
          className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
          onClick={() => {
            let url = `/courses`;
            if (search) url += `?search=${search}`;

            router.push(url);
          }}
        >
          All
        </button>
        {categories?.data?.categories.map((category) => (
          <button
            key={category._id}
            type="button"
            className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
            onClick={() => {
              let url = `/courses?category=${category.name}`;
              if (search) url += `&search=${search}`;

              router.push(url);
            }}
          >
            {category.name}
          </button>
        ))}
      </div>

      {courses.length > 0 ? (
        <div className="grid md:grid-cols-4  sm:grid-cols-2 grid-cols-1 gap-4 max-w-[80%] mx-auto w-full mt-[30px]">
          {courses.map((course) => (
            <CourseItemCard courseItem={course} key={course._id} isEnroll={false} t={t} />
          ))}
        </div>
      ) : (
        <div className="flex justify-center mt-10 text-gray-600 dark:text-gray-400">No course found!</div>
      )}
      {dataCourse && (
        <Stack
          spacing={2}
          sx={{
            justifyContent: 'center',
            marginTop: '60px',
            width: '100%',
            '& .MuiPagination-root': {
              display: 'flex',
              justifyContent: 'center'
            }
          }}
        >
          <Pagination
            count={Math.ceil(dataCourse?.total / LIMIT)}
            onChange={(_, page) => setPage(page)}
            size="large"
            sx={{
              '& .MuiPaginationItem-root': {
                color: resolvedTheme === 'dark' ? '#fff' : '#000',
                backgroundColor: resolvedTheme === 'dark' ? '#2d2d2d' : '#f5f5f5',
                '&.Mui-selected': {
                  backgroundColor: '#9333ea',
                  color: '#fff'
                }
              }
            }}
          />
        </Stack>
      )}
    </div>
  );
};

export default CoursesView;
