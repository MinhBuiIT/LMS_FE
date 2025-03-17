import AuthWrapper from '@/src/hoc/AuthWrapper';
import EntrollCourseView from '@/src/views/EnrollCourse';
import { Metadata, NextPage } from 'next';

type TProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: 'Enroll Course',
  description: 'Elearning is a platform for learning online.',
  keywords: 'elearning, online learning, education, courses'
};

const EntrollCoursePage: NextPage<TProps> = async ({ params }) => {
  const id = (await params).id;

  return (
    <AuthWrapper authGuard={true} guestGuard={false}>
      <EntrollCourseView courseId={id} />
    </AuthWrapper>
  );
};

export default EntrollCoursePage;
