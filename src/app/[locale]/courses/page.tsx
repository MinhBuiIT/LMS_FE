import Header from '@/src/components/header';
import AuthWrapper from '@/src/hoc/AuthWrapper';
import CoursesView from '@/src/views/CoursesView';
import { Metadata, NextPage } from 'next';

type TProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: 'Courses List',
  description: 'Elearning is a platform for learning online.',
  keywords: 'elearning, online learning, education, courses'
};

const CoursesPage: NextPage<TProps> = async () => {
  return (
    <AuthWrapper authGuard={false} guestGuard={false}>
      <Header />
      <CoursesView />
    </AuthWrapper>
  );
};

export default CoursesPage;
