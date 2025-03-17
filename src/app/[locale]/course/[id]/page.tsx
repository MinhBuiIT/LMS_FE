import CourseDetailView from '@/src/views/CourseDetail';
import { Metadata, NextPage } from 'next';

type TProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: 'Course Detail',
  description: 'Elearning is a platform for learning online.',
  keywords: 'elearning, online learning, education, courses'
};

const CourseDetailPage: NextPage<TProps> = async ({ params }) => {
  const id = (await params).id;

  return (
    <>
      <CourseDetailView courseId={id} />
    </>
  );
};

export default CourseDetailPage;
