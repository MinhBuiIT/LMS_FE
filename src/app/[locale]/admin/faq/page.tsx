import FaqView from '@/src/views/FaqView';
import { Metadata, NextPage } from 'next';

type TProps = {};

export const metadata: Metadata = {
  title: 'Edit FAQ Page',
  description: 'Elearning is a platform for learning online.',
  keywords: 'elearning, online learning, education, courses'
};

const FAQPage: NextPage<TProps> = () => {
  return (
    <>
      <FaqView />
    </>
  );
};

export default FAQPage;
