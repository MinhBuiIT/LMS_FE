'use client';
import AreaChartCom from '@/src/components/area-chart';
import Loading from '@/src/components/loading';
import { useGetOrderAnalyticApiQuery } from '@/src/redux/api/analyticsApi';

const OrderAnalyticView = () => {
  const { data, isLoading } = useGetOrderAnalyticApiQuery();

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="w-full h-full px-[100px]" style={{ paddingTop: '80px' }}>
          <div className="text-black dark:text-white">
            <h3 className="text-2xl font-semibold">Order Analytics</h3>
            <p className="text-base">Last 12 months</p>
          </div>
          <div className="w-full mt-[50px] h-[400px]">
            <AreaChartCom data={data?.data as any[]} key1="month" key2="count" />
          </div>
        </div>
      )}
    </>
  );
};

export default OrderAnalyticView;
