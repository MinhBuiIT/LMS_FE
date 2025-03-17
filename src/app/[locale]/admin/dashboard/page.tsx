import DashboardView from '@/src/views/Dashboard';
import { Metadata, NextPage } from 'next';

type TProps = {};

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Elearning is a platform for learning online.',
  keywords: 'elearning, online learning, education, courses'
};

const DashboardPage: NextPage<TProps> = () => {
  return (
    <>
      <DashboardView />
    </>
  );
};

export default DashboardPage;
