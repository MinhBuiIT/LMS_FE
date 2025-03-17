'use client';
import LineChartCom from '@/src/components/line-chart';
import Loading from '@/src/components/loading';
import { useGetUserAnalyticApiQuery } from '@/src/redux/api/analyticsApi';

const UserAnalyticView = () => {
  const { data, isLoading } = useGetUserAnalyticApiQuery();

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="w-full h-full px-[100px]" style={{ paddingTop: '80px' }}>
          <div className="text-black dark:text-white">
            <h3 className="text-2xl font-semibold">User Analytics</h3>
            <p className="text-base">Last 12 months</p>
          </div>
          <div className="w-full mt-[50px] h-[400px]">
            <LineChartCom data={data?.data as any[]} key1="month" key2="count" />
          </div>
        </div>
      )}
    </>
  );
};

export default UserAnalyticView;
