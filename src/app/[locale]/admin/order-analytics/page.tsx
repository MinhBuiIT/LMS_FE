import OrderAnalyticView from '@/src/views/OrderAnalytic';
import { Metadata, NextPage } from 'next';

type TProps = {};

export const metadata: Metadata = {
  title: 'Order Analytic',
  description: 'Elearning is a platform for learning online.',
  keywords: 'elearning, online learning, education, courses'
};

const OrderAnalyticPage: NextPage<TProps> = () => {
  return (
    <>
      <OrderAnalyticView />
    </>
  );
};

export default OrderAnalyticPage;
