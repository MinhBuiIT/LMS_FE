import UsersView from '@/src/views/UsersView';
import { Metadata, NextPage } from 'next';

type TProps = {};

export const metadata: Metadata = {
  title: 'Manage Users',
  description: 'Elearning is a platform for learning online.',
  keywords: 'elearning, online learning, education, courses'
};

const UsersPage: NextPage<TProps> = () => {
  return (
    <>
      <UsersView />
    </>
  );
};

export default UsersPage;
