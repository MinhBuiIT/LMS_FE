import CreateCourseView from '@/src/views/CreateCourse';
import { Metadata, NextPage } from 'next';

type TProps = {};

export const metadata: Metadata = {
  title: 'Create Course',
  description: 'Elearning is a platform for learning online.',
  keywords: 'elearning, online learning, education, courses'
};

const CreateCoursePage: NextPage<TProps> = () => {
  return (
    <>
      <CreateCourseView />
    </>
  );
};

export default CreateCoursePage;
