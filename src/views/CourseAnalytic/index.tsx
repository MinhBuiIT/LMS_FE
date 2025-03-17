'use client';
import BarChartCom from '@/src/components/bar-chart';
import Loading from '@/src/components/loading';
import { useGetCourseAnalyticApiQuery } from '@/src/redux/api/analyticsApi';
import { FC } from 'react';

type TProps = {};

const CourseAnalyticView: FC<TProps> = () => {
  const { data, isLoading } = useGetCourseAnalyticApiQuery();

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="w-full h-full px-[100px]" style={{ paddingTop: '80px' }}>
          <div className="text-black dark:text-white">
            <h3 className="text-2xl font-semibold">Courses Analytics</h3>
            <p className="text-base">Last 12 months</p>
          </div>
          <div className="w-full mt-[50px] h-screen">
            <BarChartCom data={data?.data as any[]} key1="month" key2="count" />
          </div>
        </div>
      )}
    </>
  );
};

export default CourseAnalyticView;
