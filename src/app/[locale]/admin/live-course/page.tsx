import LiveCourseView from '@/src/views/LiveCourse';
import { Metadata, NextPage } from 'next';

type TProps = {};

export const metadata: Metadata = {
  title: 'Live Course',
  description: 'Elearning is a platform for learning online.',
  keywords: 'elearning, online learning, education, courses'
};

const LiveCoursePage: NextPage<TProps> = () => {
  return (
    <>
      <LiveCourseView />
    </>
  );
};

export default LiveCoursePage;
