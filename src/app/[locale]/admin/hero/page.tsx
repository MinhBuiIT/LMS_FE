import HeroAdminView from '@/src/views/Hero';
import { Metadata, NextPage } from 'next';

type TProps = {};

export const metadata: Metadata = {
  title: 'Edit Hero Page',
  description: 'Elearning is a platform for learning online.',
  keywords: 'elearning, online learning, education, courses'
};

const HeroAdminPage: NextPage<TProps> = () => {
  return (
    <>
      <HeroAdminView />
    </>
  );
};

export default HeroAdminPage;
