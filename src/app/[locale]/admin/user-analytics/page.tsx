import UserAnalyticView from '@/src/views/UserAnalytic';
import { Metadata, NextPage } from 'next';

type TProps = {};

export const metadata: Metadata = {
  title: 'User Analytic',
  description: 'Elearning is a platform for learning online.',
  keywords: 'elearning, online learning, education, courses'
};

const UserAnalyticPage: NextPage<TProps> = () => {
  return (
    <>
      <UserAnalyticView />
    </>
  );
};

export default UserAnalyticPage;
