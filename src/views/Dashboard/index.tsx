'use client';
import InvoiceCom from '@/src/components/admin/invoice';
import AreaChartCom from '@/src/components/area-chart';
import LineChartCom from '@/src/components/line-chart';
import Loading from '@/src/components/loading';
import { useGetOrderAnalyticApiQuery, useGetUserAnalyticApiQuery } from '@/src/redux/api/analyticsApi';
import { Grid2 } from '@mui/material';

const DashboardView = () => {
  const { data: dataUser, isLoading: loadingUser } = useGetUserAnalyticApiQuery();
  const { data: dataOrder, isLoading: loadingOrder } = useGetOrderAnalyticApiQuery();

  const isLoading = loadingUser || loadingOrder;
  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="w-full h-full px-[40px]" style={{ paddingTop: '80px' }}>
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12 }} className="dark:bg-[#121a3a] bg-[#f5f5f5] p-4 pb-12  h-[300px] rounded">
              <h3 className="text-2xl font-semibold mb-4 text-black dark:text-white">User Analytics</h3>
              <div className="  text-black dark:text-white h-full">
                <LineChartCom data={dataUser?.data as any} key1="month" key2="count" />
              </div>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 7 }} className="dark:bg-[#121a3a] bg-[#f5f5f5] p-4 pb-12  h-[300px] rounded">
              <h3 className="text-2xl font-semibold mb-4 text-black dark:text-white">Order Analytics</h3>
              <div className="  text-black dark:text-white h-full">
                <AreaChartCom data={dataOrder?.data as any} key1="month" key2="count" />
              </div>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 5 }} className=" h-[250px] rounded">
              <h3 className="text-2xl font-semibold mb-4 text-black dark:text-white">Invoices</h3>
              <InvoiceCom height="100%" isDashboard={true} />
            </Grid2>
          </Grid2>
        </div>
      )}
    </>
  );
};

export default DashboardView;
