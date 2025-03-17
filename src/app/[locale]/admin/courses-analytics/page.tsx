import CourseAnalyticView from '@/src/views/CourseAnalytic';
import { Metadata, NextPage } from 'next';

type TProps = {};

export const metadata: Metadata = {
  title: 'Course Analytic',
  description: 'Elearning is a platform for learning online.',
  keywords: 'elearning, online learning, education, courses'
};

const CourseAnalyticPage: NextPage<TProps> = () => {
  return (
    <>
      <CourseAnalyticView />
    </>
  );
};

export default CourseAnalyticPage;
