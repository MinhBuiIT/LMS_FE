import CategoryView from '@/src/views/CategoryView';
import { Metadata, NextPage } from 'next';

type TProps = {};

export const metadata: Metadata = {
  title: 'Edit Category Page',
  description: 'Elearning is a platform for learning online.',
  keywords: 'elearning, online learning, education, courses'
};

const CategoryPage: NextPage<TProps> = () => {
  return (
    <>
      <CategoryView />
    </>
  );
};

export default CategoryPage;
