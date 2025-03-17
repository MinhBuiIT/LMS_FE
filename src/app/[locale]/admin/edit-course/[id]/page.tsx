import EditCourseView from '@/src/views/EditCourse';
import { Metadata, NextPage } from 'next';

type TProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: 'Edit Course',
  description: 'Elearning is a platform for learning online.',
  keywords: 'elearning, online learning, education, courses'
};

const EditCourse: NextPage<TProps> = async ({ params }) => {
  const id = (await params).id;

  return (
    <>
      <EditCourseView courseId={id} />
    </>
  );
};

export default EditCourse;
